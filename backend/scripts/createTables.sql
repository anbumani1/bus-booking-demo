-- Create users table
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

-- Create cities table
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

-- Create bus_operators table
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

-- Create bookings table
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

-- Create passengers table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_passengers_booking_id ON passengers(booking_id);

-- Insert sample cities (only if they don't exist)
INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Mumbai', 'Maharashtra', 19.0760, 72.8777, 12442373, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Mumbai');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Delhi', 'Delhi', 28.6139, 77.2090, 16787941, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Delhi');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Bangalore', 'Karnataka', 12.9716, 77.5946, 8443675, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Bangalore');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Chennai', 'Tamil Nadu', 13.0827, 80.2707, 4646732, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Chennai');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Pune', 'Maharashtra', 18.5204, 73.8567, 3124458, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Pune');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Hyderabad', 'Telangana', 17.3850, 78.4867, 6809970, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Hyderabad');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Kolkata', 'West Bengal', 22.5726, 88.3639, 4496694, false
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Kolkata');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Ahmedabad', 'Gujarat', 23.0225, 72.5714, 5570585, false
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Ahmedabad');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Jaipur', 'Rajasthan', 26.9124, 75.7873, 3046163, false
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Jaipur');

INSERT INTO cities (name, state, latitude, longitude, population, is_popular)
SELECT 'Goa', 'Goa', 15.2993, 74.1240, 1457723, true
WHERE NOT EXISTS (SELECT 1 FROM cities WHERE name = 'Goa');

-- Insert sample bus operators (only if they don't exist)
INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes)
SELECT 'RedBus', '🚌', 4.2, 125847, '#D84E55', 2006, 'Bangalore', 2500, 100000
WHERE NOT EXISTS (SELECT 1 FROM bus_operators WHERE name = 'RedBus');

INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes)
SELECT 'VRL Travels', '🚍', 4.1, 89234, '#1E40AF', 1976, 'Hubli', 1800, 850
WHERE NOT EXISTS (SELECT 1 FROM bus_operators WHERE name = 'VRL Travels');

INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes)
SELECT 'SRS Travels', '🚐', 4.0, 67891, '#059669', 1995, 'Chennai', 1200, 650
WHERE NOT EXISTS (SELECT 1 FROM bus_operators WHERE name = 'SRS Travels');

INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes)
SELECT 'Orange Tours', '🚌', 4.3, 94567, '#EA580C', 1999, 'Mumbai', 2200, 1200
WHERE NOT EXISTS (SELECT 1 FROM bus_operators WHERE name = 'Orange Tours');

INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes)
SELECT 'Patel Travels', '🚍', 3.9, 45623, '#7C3AED', 1985, 'Ahmedabad', 800, 450
WHERE NOT EXISTS (SELECT 1 FROM bus_operators WHERE name = 'Patel Travels');

INSERT INTO bus_operators (name, logo, rating, total_reviews, primary_color, founded_year, headquarters, fleet_size, total_routes)
SELECT 'Kallada Travels', '🚌', 4.4, 78912, '#DC2626', 1962, 'Kerala', 1500, 800
WHERE NOT EXISTS (SELECT 1 FROM bus_operators WHERE name = 'Kallada Travels');
