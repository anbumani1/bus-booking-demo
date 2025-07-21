const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'bus_booking.db');

// Create database connection
const createConnection = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to SQLite database');
    }
  });
};

// Initialize database with all required tables
const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

    // Create tables
    const createTables = `
      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT,
        date_of_birth DATE,
        gender TEXT CHECK(gender IN ('male', 'female', 'other')),
        profile_image TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Cities table
      CREATE TABLE IF NOT EXISTS cities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        country TEXT DEFAULT 'India',
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        population INTEGER,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Bus operators table
      CREATE TABLE IF NOT EXISTS bus_operators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        logo TEXT,
        rating REAL DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        primary_color TEXT,
        founded_year INTEGER,
        headquarters TEXT,
        fleet_size INTEGER,
        total_routes INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Bus types table
      CREATE TABLE IF NOT EXISTS bus_types (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        icon TEXT,
        base_price_per_km REAL NOT NULL,
        average_speed INTEGER DEFAULT 65,
        total_seats INTEGER DEFAULT 40,
        amenities TEXT, -- JSON string
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Routes table
      CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_city_id INTEGER NOT NULL,
        to_city_id INTEGER NOT NULL,
        distance_km INTEGER NOT NULL,
        estimated_duration_minutes INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (from_city_id) REFERENCES cities (id),
        FOREIGN KEY (to_city_id) REFERENCES cities (id),
        UNIQUE(from_city_id, to_city_id)
      );

      -- Buses table
      CREATE TABLE IF NOT EXISTS buses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        bus_number TEXT UNIQUE NOT NULL,
        operator_id INTEGER NOT NULL,
        bus_type_id INTEGER NOT NULL,
        route_id INTEGER NOT NULL,
        total_seats INTEGER NOT NULL,
        current_location_lat REAL,
        current_location_lng REAL,
        current_speed INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'maintenance', 'inactive')),
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (operator_id) REFERENCES bus_operators (id),
        FOREIGN KEY (bus_type_id) REFERENCES bus_types (id),
        FOREIGN KEY (route_id) REFERENCES routes (id)
      );

      -- Bus schedules table
      CREATE TABLE IF NOT EXISTS bus_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_id INTEGER NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        departure_date DATE NOT NULL,
        base_price REAL NOT NULL,
        dynamic_price REAL NOT NULL,
        available_seats INTEGER NOT NULL,
        status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'departed', 'arrived', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bus_id) REFERENCES buses (id)
      );

      -- Bookings table
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT UNIQUE NOT NULL,
        user_id INTEGER NOT NULL,
        from_city_id INTEGER NOT NULL,
        to_city_id INTEGER NOT NULL,
        operator_id INTEGER NOT NULL,
        bus_number TEXT NOT NULL,
        bus_type TEXT NOT NULL,
        departure_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        distance_km INTEGER,
        booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        passenger_count INTEGER NOT NULL,
        seat_numbers TEXT NOT NULL, -- JSON array
        total_amount REAL NOT NULL,
        booking_status TEXT DEFAULT 'confirmed' CHECK(booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded', 'failed')),
        payment_method TEXT,
        transaction_id TEXT,
        cancellation_reason TEXT,
        cancelled_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (from_city_id) REFERENCES cities (id),
        FOREIGN KEY (to_city_id) REFERENCES cities (id),
        FOREIGN KEY (operator_id) REFERENCES bus_operators (id)
      );

      -- Passengers table
      CREATE TABLE IF NOT EXISTS passengers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT CHECK(gender IN ('male', 'female', 'other')),
        seat_number TEXT NOT NULL,
        id_type TEXT,
        id_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES bookings (id)
      );

      -- Reviews table
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        booking_id INTEGER NOT NULL,
        bus_id INTEGER NOT NULL,
        rating INTEGER CHECK(rating >= 1 AND rating <= 5),
        review_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (booking_id) REFERENCES bookings (id),
        FOREIGN KEY (bus_id) REFERENCES buses (id)
      );

      -- User sessions table (for JWT token management)
      CREATE TABLE IF NOT EXISTS user_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token_hash TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_uuid ON users(uuid);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_uuid ON bookings(uuid);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
      CREATE INDEX IF NOT EXISTS idx_schedules_date ON bus_schedules(departure_date);
      CREATE INDEX IF NOT EXISTS idx_buses_route ON buses(route_id);
      CREATE INDEX IF NOT EXISTS idx_routes_cities ON routes(from_city_id, to_city_id);
    `;

    db.exec(createTables, async (err) => {
      if (err) {
        console.error('Error creating tables:', err.message);
        reject(err);
      } else {
        console.log('✅ All database tables created successfully');

        // Seed initial data
        try {
          await seedInitialData(db);
          resolve();
        } catch (seedError) {
          console.error('Error seeding data:', seedError);
          reject(seedError);
        }
      }
      db.close();
    });
  });
};

// Seed initial data
const seedInitialData = async (db) => {
  return new Promise((resolve, reject) => {
    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM cities', (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('✅ Data already seeded');
        resolve();
        return;
      }

      console.log('🌱 Seeding initial data...');

      // Insert cities
      const cities = [
        ['Mumbai', 'Maharashtra', 'India', 19.0760, 72.8777, 12442373, 1],
        ['Delhi', 'Delhi', 'India', 28.6139, 77.2090, 16787941, 1],
        ['Bangalore', 'Karnataka', 'India', 12.9716, 77.5946, 8443675, 1],
        ['Chennai', 'Tamil Nadu', 'India', 13.0827, 80.2707, 4646732, 1],
        ['Pune', 'Maharashtra', 'India', 18.5204, 73.8567, 3124458, 1],
        ['Hyderabad', 'Telangana', 'India', 17.3850, 78.4867, 6809970, 1],
        ['Kolkata', 'West Bengal', 'India', 22.5726, 88.3639, 4496694, 0],
        ['Ahmedabad', 'Gujarat', 'India', 23.0225, 72.5714, 5570585, 0],
        ['Jaipur', 'Rajasthan', 'India', 26.9124, 75.7873, 3046163, 0],
        ['Goa', 'Goa', 'India', 15.2993, 74.1240, 1457723, 1]
      ];

      const insertCity = db.prepare('INSERT INTO cities (name, state, country, latitude, longitude, population, is_popular) VALUES (?, ?, ?, ?, ?, ?, ?)');

      cities.forEach(city => {
        insertCity.run(city);
      });
      insertCity.finalize();

      // Insert bus operators
      const operators = [
        ['RedBus', '🚌', 4.2, 125847, '#D84E55', 2006, 'Bangalore', 2500, 100000, 1],
        ['VRL Travels', '🚍', 4.1, 89234, '#1E40AF', 1976, 'Hubli', 1800, 850, 1],
        ['SRS Travels', '🚐', 4.0, 67891, '#059669', 1995, 'Chennai', 1200, 650, 1],
        ['Orange Tours', '🚌', 4.3, 94567, '#EA580C', 1999, 'Mumbai', 2200, 1200, 1],
        ['Patel Travels', '🚍', 3.9, 45623, '#7C3AED', 1985, 'Ahmedabad', 800, 450, 1],
        ['Kallada Travels', '🚌', 4.4, 78912, '#DC2626', 1962, 'Kerala', 1500, 800, 1]
      ];

      const insertOperator = db.prepare('INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

      operators.forEach(operator => {
        insertOperator.run(operator);
      });
      insertOperator.finalize();

      console.log('✅ Initial data seeded successfully');
      resolve();
    });
  });
};

// Get database connection
const getDB = () => {
  return createConnection();
};

module.exports = {
  initializeDatabase,
  getDB,
  DB_PATH
};
