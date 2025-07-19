const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Database file paths
const DB_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const CITIES_FILE = path.join(DB_DIR, 'cities.json');
const OPERATORS_FILE = path.join(DB_DIR, 'operators.json');
const BOOKINGS_FILE = path.join(DB_DIR, 'bookings.json');
const PASSENGERS_FILE = path.join(DB_DIR, 'passengers.json');

// Ensure database directory exists
const ensureDBDir = async () => {
  try {
    await fs.access(DB_DIR);
  } catch {
    await fs.mkdir(DB_DIR, { recursive: true });
  }
};

// Read JSON file
const readJSONFile = async (filePath, defaultData = []) => {
  try {
    await ensureDBDir();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist, return default data
    await writeJSONFile(filePath, defaultData);
    return defaultData;
  }
};

// Write JSON file
const writeJSONFile = async (filePath, data) => {
  await ensureDBDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Initialize database with sample data
const initializeDatabase = async () => {
  console.log('🚀 Initializing JSON database...');

  // Initialize cities
  const cities = await readJSONFile(CITIES_FILE, []);
  if (cities.length === 0) {
    const sampleCities = [
      { id: 1, name: 'Mumbai', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, population: 12442373, is_popular: true, created_at: new Date().toISOString() },
      { id: 2, name: 'Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, population: 16787941, is_popular: true, created_at: new Date().toISOString() },
      { id: 3, name: 'Bangalore', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, population: 8443675, is_popular: true, created_at: new Date().toISOString() },
      { id: 4, name: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, population: 4646732, is_popular: true, created_at: new Date().toISOString() },
      { id: 5, name: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, population: 3124458, is_popular: true, created_at: new Date().toISOString() },
      { id: 6, name: 'Hyderabad', state: 'Telangana', latitude: 17.3850, longitude: 78.4867, population: 6809970, is_popular: true, created_at: new Date().toISOString() },
      { id: 7, name: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, population: 4496694, is_popular: false, created_at: new Date().toISOString() },
      { id: 8, name: 'Ahmedabad', state: 'Gujarat', latitude: 23.0225, longitude: 72.5714, population: 5570585, is_popular: false, created_at: new Date().toISOString() },
      { id: 9, name: 'Jaipur', state: 'Rajasthan', latitude: 26.9124, longitude: 75.7873, population: 3046163, is_popular: false, created_at: new Date().toISOString() },
      { id: 10, name: 'Goa', state: 'Goa', latitude: 15.2993, longitude: 74.1240, population: 1457723, is_popular: true, created_at: new Date().toISOString() }
    ];
    await writeJSONFile(CITIES_FILE, sampleCities);
    console.log('✅ Cities initialized');
  }

  // Initialize bus operators
  const operators = await readJSONFile(OPERATORS_FILE, []);
  if (operators.length === 0) {
    const sampleOperators = [
      { id: 1, name: 'RedBus', logo: '🚌', rating: 4.2, total_reviews: 125847, primary_color: '#D84E55', founded_year: 2006, headquarters: 'Bangalore', fleet_size: 2500, total_routes: 100000, is_active: true, created_at: new Date().toISOString() },
      { id: 2, name: 'VRL Travels', logo: '🚍', rating: 4.1, total_reviews: 89234, primary_color: '#1E40AF', founded_year: 1976, headquarters: 'Hubli', fleet_size: 1800, total_routes: 850, is_active: true, created_at: new Date().toISOString() },
      { id: 3, name: 'SRS Travels', logo: '🚐', rating: 4.0, total_reviews: 67891, primary_color: '#059669', founded_year: 1995, headquarters: 'Chennai', fleet_size: 1200, total_routes: 650, is_active: true, created_at: new Date().toISOString() },
      { id: 4, name: 'Orange Tours', logo: '🚌', rating: 4.3, total_reviews: 94567, primary_color: '#EA580C', founded_year: 1999, headquarters: 'Mumbai', fleet_size: 2200, total_routes: 1200, is_active: true, created_at: new Date().toISOString() },
      { id: 5, name: 'Patel Travels', logo: '🚍', rating: 3.9, total_reviews: 45623, primary_color: '#7C3AED', founded_year: 1985, headquarters: 'Ahmedabad', fleet_size: 800, total_routes: 450, is_active: true, created_at: new Date().toISOString() },
      { id: 6, name: 'Kallada Travels', logo: '🚌', rating: 4.4, total_reviews: 78912, primary_color: '#DC2626', founded_year: 1962, headquarters: 'Kerala', fleet_size: 1500, total_routes: 800, is_active: true, created_at: new Date().toISOString() }
    ];
    await writeJSONFile(OPERATORS_FILE, sampleOperators);
    console.log('✅ Bus operators initialized');
  }

  // Initialize empty arrays for users, bookings, and passengers
  await readJSONFile(USERS_FILE, []);
  await readJSONFile(BOOKINGS_FILE, []);
  await readJSONFile(PASSENGERS_FILE, []);

  console.log('✅ JSON database initialized successfully');
  return true;
};

// Database helper functions
const jsonDBHelpers = {
  // Users
  createUser: async (userData) => {
    const users = await readJSONFile(USERS_FILE, []);
    const newUser = {
      id: uuidv4(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    users.push(newUser);
    await writeJSONFile(USERS_FILE, users);
    return newUser;
  },

  getUserByEmail: async (email) => {
    const users = await readJSONFile(USERS_FILE, []);
    return users.find(user => user.email === email && user.is_active !== false);
  },

  getUserById: async (userId) => {
    const users = await readJSONFile(USERS_FILE, []);
    return users.find(user => user.id === userId);
  },

  // Cities
  getCities: async () => {
    return await readJSONFile(CITIES_FILE, []);
  },

  getCityById: async (cityId) => {
    const cities = await readJSONFile(CITIES_FILE, []);
    return cities.find(city => city.id === cityId);
  },

  getCityByName: async (cityName) => {
    const cities = await readJSONFile(CITIES_FILE, []);
    return cities.find(city => city.name.toLowerCase() === cityName.toLowerCase());
  },

  // Bus Operators
  getBusOperators: async () => {
    return await readJSONFile(OPERATORS_FILE, []);
  },

  getOperatorById: async (operatorId) => {
    const operators = await readJSONFile(OPERATORS_FILE, []);
    return operators.find(op => op.id === operatorId);
  },

  getOperatorByName: async (operatorName) => {
    const operators = await readJSONFile(OPERATORS_FILE, []);
    return operators.find(op => op.name.toLowerCase() === operatorName.toLowerCase());
  },

  // Bookings
  createBooking: async (bookingData) => {
    const bookings = await readJSONFile(BOOKINGS_FILE, []);
    const newBooking = {
      id: uuidv4(),
      ...bookingData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    bookings.push(newBooking);
    await writeJSONFile(BOOKINGS_FILE, bookings);
    return newBooking;
  },

  getUserBookings: async (userId, filters = {}) => {
    const bookings = await readJSONFile(BOOKINGS_FILE, []);
    const cities = await readJSONFile(CITIES_FILE, []);
    const operators = await readJSONFile(OPERATORS_FILE, []);
    const passengers = await readJSONFile(PASSENGERS_FILE, []);

    let userBookings = bookings.filter(booking => booking.user_id === userId);

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      switch (filters.status) {
        case 'upcoming':
          userBookings = userBookings.filter(booking => 
            booking.departure_date >= today && booking.booking_status === 'confirmed'
          );
          break;
        case 'completed':
          userBookings = userBookings.filter(booking => 
            booking.departure_date < today && booking.booking_status === 'confirmed'
          );
          break;
        case 'cancelled':
          userBookings = userBookings.filter(booking => booking.booking_status === 'cancelled');
          break;
      }
    }

    // Enrich bookings with related data
    const enrichedBookings = userBookings.map(booking => {
      const fromCity = cities.find(c => c.id === booking.from_city_id);
      const toCity = cities.find(c => c.id === booking.to_city_id);
      const operator = operators.find(o => o.id === booking.operator_id);
      const bookingPassengers = passengers.filter(p => p.booking_id === booking.id);

      return {
        ...booking,
        from_city: fromCity,
        to_city: toCity,
        operator: operator,
        passengers: bookingPassengers
      };
    });

    // Sort by creation date (newest first)
    return enrichedBookings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  getBookingById: async (bookingId, userId) => {
    const bookings = await readJSONFile(BOOKINGS_FILE, []);
    const booking = bookings.find(b => b.id === bookingId && b.user_id === userId);
    
    if (!booking) return null;

    const cities = await readJSONFile(CITIES_FILE, []);
    const operators = await readJSONFile(OPERATORS_FILE, []);
    const passengers = await readJSONFile(PASSENGERS_FILE, []);

    const fromCity = cities.find(c => c.id === booking.from_city_id);
    const toCity = cities.find(c => c.id === booking.to_city_id);
    const operator = operators.find(o => o.id === booking.operator_id);
    const bookingPassengers = passengers.filter(p => p.booking_id === booking.id);

    return {
      ...booking,
      from_city: fromCity,
      to_city: toCity,
      operator: operator,
      passengers: bookingPassengers
    };
  },

  // Passengers
  createPassengers: async (passengersData) => {
    const passengers = await readJSONFile(PASSENGERS_FILE, []);
    const newPassengers = passengersData.map(passenger => ({
      id: uuidv4(),
      ...passenger,
      created_at: new Date().toISOString()
    }));
    passengers.push(...newPassengers);
    await writeJSONFile(PASSENGERS_FILE, passengers);
    return newPassengers;
  },

  // Statistics
  getStats: async () => {
    const users = await readJSONFile(USERS_FILE, []);
    const cities = await readJSONFile(CITIES_FILE, []);
    const operators = await readJSONFile(OPERATORS_FILE, []);
    const bookings = await readJSONFile(BOOKINGS_FILE, []);
    const passengers = await readJSONFile(PASSENGERS_FILE, []);

    return {
      users: users.length,
      cities: cities.length,
      bus_operators: operators.length,
      bookings: bookings.length,
      passengers: passengers.length
    };
  }
};

module.exports = {
  initializeDatabase,
  jsonDBHelpers
};
