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
        password TEXT NOT NULL,
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
        schedule_id INTEGER NOT NULL,
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
        FOREIGN KEY (schedule_id) REFERENCES bus_schedules (id)
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

    db.exec(createTables, (err) => {
      if (err) {
        console.error('Error creating tables:', err.message);
        reject(err);
      } else {
        console.log('✅ All database tables created successfully');
        resolve();
      }
      db.close();
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
