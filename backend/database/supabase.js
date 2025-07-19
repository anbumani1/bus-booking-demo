const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize database tables
const initializeSupabaseTables = async () => {
  try {
    console.log('🚀 Initializing Supabase database tables...');

    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table');
    if (usersError && !usersError.message.includes('already exists')) {
      console.log('Creating users table via SQL...');
    }

    // Create cities table
    const { error: citiesError } = await supabase.rpc('create_cities_table');
    if (citiesError && !citiesError.message.includes('already exists')) {
      console.log('Creating cities table via SQL...');
    }

    // Create bus_operators table
    const { error: operatorsError } = await supabase.rpc('create_operators_table');
    if (operatorsError && !operatorsError.message.includes('already exists')) {
      console.log('Creating operators table via SQL...');
    }

    // Create bookings table
    const { error: bookingsError } = await supabase.rpc('create_bookings_table');
    if (bookingsError && !bookingsError.message.includes('already exists')) {
      console.log('Creating bookings table via SQL...');
    }

    // Create passengers table
    const { error: passengersError } = await supabase.rpc('create_passengers_table');
    if (passengersError && !passengersError.message.includes('already exists')) {
      console.log('Creating passengers table via SQL...');
    }

    console.log('✅ Supabase database tables initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing Supabase tables:', error);
    return false;
  }
};

// Seed database with initial data
const seedSupabaseData = async () => {
  try {
    console.log('🌱 Seeding Supabase database with initial data...');

    // Check if cities already exist
    const { data: existingCities, error: citiesCheckError } = await supabase
      .from('cities')
      .select('id')
      .limit(1);

    if (citiesCheckError) {
      console.log('Cities table not ready yet, will seed later');
      return false;
    }

    if (existingCities && existingCities.length > 0) {
      console.log('✅ Database already seeded');
      return true;
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

    const { error: citiesInsertError } = await supabase
      .from('cities')
      .insert(cities);

    if (citiesInsertError) {
      console.error('Error seeding cities:', citiesInsertError);
    } else {
      console.log('✅ Cities seeded successfully');
    }

    // Seed bus operators
    const operators = [
      { name: 'RedBus', logo: '🚌', rating: 4.2, total_reviews: 125847, primary_color: '#D84E55', founded_year: 2006 },
      { name: 'VRL Travels', logo: '🚍', rating: 4.1, total_reviews: 89234, primary_color: '#1E40AF', founded_year: 1976 },
      { name: 'SRS Travels', logo: '🚐', rating: 4.0, total_reviews: 67891, primary_color: '#059669', founded_year: 1995 },
      { name: 'Orange Tours', logo: '🚌', rating: 4.3, total_reviews: 94567, primary_color: '#EA580C', founded_year: 1999 },
      { name: 'Patel Travels', logo: '🚍', rating: 3.9, total_reviews: 45623, primary_color: '#7C3AED', founded_year: 1985 },
      { name: 'Kallada Travels', logo: '🚌', rating: 4.4, total_reviews: 78912, primary_color: '#DC2626', founded_year: 1962 }
    ];

    const { error: operatorsInsertError } = await supabase
      .from('bus_operators')
      .insert(operators);

    if (operatorsInsertError) {
      console.error('Error seeding operators:', operatorsInsertError);
    } else {
      console.log('✅ Bus operators seeded successfully');
    }

    console.log('✅ Supabase database seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error seeding Supabase database:', error);
    return false;
  }
};

// Helper functions for database operations
const supabaseHelpers = {
  // Get all cities
  getCities: async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Get all bus operators
  getBusOperators: async () => {
    const { data, error } = await supabase
      .from('bus_operators')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Create new booking
  createBooking: async (bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user bookings
  getUserBookings: async (userId, filters = {}) => {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        from_city:cities!bookings_from_city_id_fkey(name, state),
        to_city:cities!bookings_to_city_id_fkey(name, state),
        operator:bus_operators(name, logo, rating),
        passengers(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'upcoming') {
        query = query.gte('departure_date', new Date().toISOString().split('T')[0]);
      } else if (filters.status === 'completed') {
        query = query.lt('departure_date', new Date().toISOString().split('T')[0]);
      } else {
        query = query.eq('booking_status', filters.status);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get booking by ID
  getBookingById: async (bookingId, userId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        from_city:cities!bookings_from_city_id_fkey(name, state),
        to_city:cities!bookings_to_city_id_fkey(name, state),
        operator:bus_operators(name, logo, rating),
        passengers(*)
      `)
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create user
  createUser: async (userData) => {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user by email
  getUserByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
};

module.exports = {
  supabase,
  initializeSupabaseTables,
  seedSupabaseData,
  supabaseHelpers
};
