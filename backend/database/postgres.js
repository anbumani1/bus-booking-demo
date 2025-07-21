const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
};

// Initialize database tables
const initializePostgresTables = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Initializing PostgreSQL tables...');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        gender VARCHAR(10) CHECK(gender IN ('male', 'female', 'other')),
        profile_image TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create cities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        country VARCHAR(100) DEFAULT 'India',
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        population INTEGER,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create bus_operators table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bus_operators (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        logo TEXT,
        rating DECIMAL(3, 2) DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        primary_color VARCHAR(7),
        founded_year INTEGER,
        headquarters VARCHAR(100),
        fleet_size INTEGER,
        total_routes INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create bookings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        from_city_id INTEGER REFERENCES cities(id),
        to_city_id INTEGER REFERENCES cities(id),
        operator_id INTEGER REFERENCES bus_operators(id),
        bus_number VARCHAR(20) NOT NULL,
        bus_type VARCHAR(50) NOT NULL,
        departure_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        distance_km INTEGER,
        passenger_count INTEGER NOT NULL,
        seat_numbers JSONB NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK(booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status VARCHAR(20) DEFAULT 'paid' CHECK(payment_status IN ('pending', 'paid', 'refunded', 'failed')),
        payment_method VARCHAR(50),
        transaction_id VARCHAR(100),
        cancellation_reason TEXT,
        cancelled_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create passengers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS passengers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(10) CHECK(gender IN ('male', 'female', 'other')),
        seat_number VARCHAR(10) NOT NULL,
        id_type VARCHAR(20),
        id_number VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(departure_date);
      CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON passengers(booking_id);
    `);

    console.log('✅ PostgreSQL tables created successfully');
    
    // Seed initial data
    await seedInitialData(client);
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Seed initial data
const seedInitialData = async (client) => {
  try {
    // Check if cities already exist
    const { rows: existingCities } = await client.query('SELECT COUNT(*) FROM cities');
    if (parseInt(existingCities[0].count) > 0) {
      console.log('✅ Data already seeded');
      return;
    }

    console.log('🌱 Seeding initial data...');

    // Insert cities
    const cities = [
      ['Mumbai', 'Maharashtra', 19.0760, 72.8777, 12442373, true],
      ['Delhi', 'Delhi', 28.6139, 77.2090, 16787941, true],
      ['Bangalore', 'Karnataka', 12.9716, 77.5946, 8443675, true],
      ['Chennai', 'Tamil Nadu', 13.0827, 80.2707, 4646732, true],
      ['Pune', 'Maharashtra', 18.5204, 73.8567, 3124458, true],
      ['Hyderabad', 'Telangana', 17.3850, 78.4867, 6809970, true],
      ['Kolkata', 'West Bengal', 22.5726, 88.3639, 4496694, false],
      ['Ahmedabad', 'Gujarat', 23.0225, 72.5714, 5570585, false],
      ['Jaipur', 'Rajasthan', 26.9124, 75.7873, 3046163, false],
      ['Goa', 'Goa', 15.2993, 74.1240, 1457723, true]
    ];

    for (const city of cities) {
      await client.query(
        'INSERT INTO cities (name, state, latitude, longitude, population, is_popular) VALUES ($1, $2, $3, $4, $5, $6)',
        city
      );
    }

    // Insert bus operators
    const operators = [
      ['RedBus', '🚌', 4.2, 125847, '#D84E55', 2006, 'Bangalore', 2500, 100000],
      ['VRL Travels', '🚍', 4.1, 89234, '#1E40AF', 1976, 'Hubli', 1800, 850],
      ['SRS Travels', '🚐', 4.0, 67891, '#059669', 1995, 'Chennai', 1200, 650],
      ['Orange Tours', '🚌', 4.3, 94567, '#EA580C', 1999, 'Mumbai', 2200, 1200],
      ['Patel Travels', '🚍', 3.9, 45623, '#7C3AED', 1985, 'Ahmedabad', 800, 450],
      ['Kallada Travels', '🚌', 4.4, 78912, '#DC2626', 1962, 'Kerala', 1500, 800]
    ];

    for (const operator of operators) {
      await client.query(
        'INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        operator
      );
    }

    console.log('✅ Initial data seeded successfully');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// Database helper functions
const postgresHelpers = {
  // Execute query with error handling
  query: async (text, params) => {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Get database statistics
  getStats: async () => {
    const queries = [
      'SELECT COUNT(*) FROM users',
      'SELECT COUNT(*) FROM cities',
      'SELECT COUNT(*) FROM bus_operators',
      'SELECT COUNT(*) FROM bookings',
      'SELECT COUNT(*) FROM passengers'
    ];

    const results = await Promise.all(
      queries.map(query => postgresHelpers.query(query))
    );

    return {
      users: parseInt(results[0].rows[0].count),
      cities: parseInt(results[1].rows[0].count),
      bus_operators: parseInt(results[2].rows[0].count),
      bookings: parseInt(results[3].rows[0].count),
      passengers: parseInt(results[4].rows[0].count)
    };
  }
};

module.exports = {
  pool,
  testConnection,
  initializePostgresTables,
  postgresHelpers
};
