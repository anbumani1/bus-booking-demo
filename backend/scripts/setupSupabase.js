const { supabase } = require('../database/supabase');

const setupSupabaseTables = async () => {
  console.log('🚀 Setting up Supabase database tables...');

  try {
    // Create users table
    const usersTableSQL = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create cities table
    const citiesTableSQL = `
      CREATE TABLE IF NOT EXISTS cities (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        state TEXT NOT NULL,
        country TEXT DEFAULT 'India',
        latitude DECIMAL(10, 8) NOT NULL,
        longitude DECIMAL(11, 8) NOT NULL,
        population INTEGER,
        is_popular BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create bus_operators table
    const operatorsTableSQL = `
      CREATE TABLE IF NOT EXISTS bus_operators (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        logo TEXT,
        rating DECIMAL(3, 2) DEFAULT 0.0,
        total_reviews INTEGER DEFAULT 0,
        primary_color TEXT,
        founded_year INTEGER,
        headquarters TEXT,
        fleet_size INTEGER,
        total_routes INTEGER,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create bookings table
    const bookingsTableSQL = `
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        from_city_id INTEGER REFERENCES cities(id),
        to_city_id INTEGER REFERENCES cities(id),
        operator_id INTEGER REFERENCES bus_operators(id),
        bus_number TEXT NOT NULL,
        bus_type TEXT NOT NULL,
        departure_date DATE NOT NULL,
        departure_time TIME NOT NULL,
        arrival_time TIME NOT NULL,
        distance_km INTEGER,
        passenger_count INTEGER NOT NULL,
        seat_numbers JSONB NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        booking_status TEXT DEFAULT 'confirmed' CHECK(booking_status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status TEXT DEFAULT 'paid' CHECK(payment_status IN ('pending', 'paid', 'refunded', 'failed')),
        payment_method TEXT,
        transaction_id TEXT,
        cancellation_reason TEXT,
        cancelled_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create passengers table
    const passengersTableSQL = `
      CREATE TABLE IF NOT EXISTS passengers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT CHECK(gender IN ('male', 'female', 'other')),
        seat_number TEXT NOT NULL,
        id_type TEXT,
        id_number TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // Create indexes
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(departure_date);
      CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON passengers(booking_id);
    `;

    // Execute SQL commands
    console.log('Creating users table...');
    const { error: usersError } = await supabase.rpc('exec_sql', { sql: usersTableSQL });
    if (usersError) console.log('Users table may already exist');

    console.log('Creating cities table...');
    const { error: citiesError } = await supabase.rpc('exec_sql', { sql: citiesTableSQL });
    if (citiesError) console.log('Cities table may already exist');

    console.log('Creating bus_operators table...');
    const { error: operatorsError } = await supabase.rpc('exec_sql', { sql: operatorsTableSQL });
    if (operatorsError) console.log('Operators table may already exist');

    console.log('Creating bookings table...');
    const { error: bookingsError } = await supabase.rpc('exec_sql', { sql: bookingsTableSQL });
    if (bookingsError) console.log('Bookings table may already exist');

    console.log('Creating passengers table...');
    const { error: passengersError } = await supabase.rpc('exec_sql', { sql: passengersTableSQL });
    if (passengersError) console.log('Passengers table may already exist');

    console.log('Creating indexes...');
    const { error: indexesError } = await supabase.rpc('exec_sql', { sql: indexesSQL });
    if (indexesError) console.log('Indexes may already exist');

    console.log('✅ Supabase database setup completed!');
    
    // Now seed the data
    await seedInitialData();
    
  } catch (error) {
    console.error('❌ Error setting up Supabase tables:', error);
  }
};

const seedInitialData = async () => {
  console.log('🌱 Seeding initial data...');

  try {
    // Check if cities already exist
    const { data: existingCities } = await supabase
      .from('cities')
      .select('id')
      .limit(1);

    if (existingCities && existingCities.length > 0) {
      console.log('✅ Data already seeded');
      return;
    }

    // Seed cities
    const cities = [
      { name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, population: 12442373, is_popular: true },
      { name: 'Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, population: 16787941, is_popular: true },
      { name: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, population: 8443675, is_popular: true },
      { name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, population: 4646732, is_popular: true },
      { name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, population: 3124458, is_popular: true },
      { name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, population: 6809970, is_popular: true },
      { name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, population: 4496694, is_popular: false },
      { name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, population: 5570585, is_popular: false },
      { name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, population: 3046163, is_popular: false },
      { name: 'Goa', state: 'Goa', latitude: 15.2993, longitude: 74.1240, population: 1457723, is_popular: true }
    ];

    const { error: citiesError } = await supabase
      .from('cities')
      .insert(cities);

    if (citiesError) {
      console.error('Error seeding cities:', citiesError);
    } else {
      console.log('✅ Cities seeded successfully');
    }

    // Seed bus operators
    const operators = [
      { name: 'RedBus', logo: '🚌', rating: 4.2, total_reviews: 125847, primary_color: '#D84E55', founded_year: 2006, headquarters: 'Bangalore', fleet_size: 2500, total_routes: 100000 },
      { name: 'VRL Travels', logo: '🚍', rating: 4.1, total_reviews: 89234, primary_color: '#1E40AF', founded_year: 1976, headquarters: 'Hubli', fleet_size: 1800, total_routes: 850 },
      { name: 'SRS Travels', logo: '🚐', rating: 4.0, total_reviews: 67891, primary_color: '#059669', founded_year: 1995, headquarters: 'Chennai', fleet_size: 1200, total_routes: 650 },
      { name: 'Orange Tours', logo: '🚌', rating: 4.3, total_reviews: 94567, primary_color: '#EA580C', founded_year: 1999, headquarters: 'Mumbai', fleet_size: 2200, total_routes: 1200 },
      { name: 'Patel Travels', logo: '🚍', rating: 3.9, total_reviews: 45623, primary_color: '#7C3AED', founded_year: 1985, headquarters: 'Ahmedabad', fleet_size: 800, total_routes: 450 },
      { name: 'Kallada Travels', logo: '🚌', rating: 4.4, total_reviews: 78912, primary_color: '#DC2626', founded_year: 1962, headquarters: 'Kerala', fleet_size: 1500, total_routes: 800 }
    ];

    const { error: operatorsError } = await supabase
      .from('bus_operators')
      .insert(operators);

    if (operatorsError) {
      console.error('Error seeding operators:', operatorsError);
    } else {
      console.log('✅ Bus operators seeded successfully');
    }

    console.log('✅ Initial data seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupSupabaseTables().then(() => {
    console.log('🎉 Supabase setup completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}

module.exports = { setupSupabaseTables, seedInitialData };
