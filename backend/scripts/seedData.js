const { getDB } = require('../database/init');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  const db = getDB();

  console.log('🌱 Starting database seeding...');

  try {
    // Seed cities
    const cities = [
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, population: 12442373, popular: true },
      { name: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, population: 16787941, popular: true },
      { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, population: 8443675, popular: true },
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, population: 4646732, popular: true },
      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, population: 3124458, popular: true },
      { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, population: 6809970, popular: true },
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, population: 4496694, popular: false },
      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, population: 5570585, popular: false },
      { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, population: 3046163, popular: false },
      { name: 'Goa', state: 'Goa', lat: 15.2993, lng: 74.1240, population: 1457723, popular: true }
    ];

    console.log('Seeding cities...');
    for (const city of cities) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO cities (name, state, latitude, longitude, population, is_popular)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [city.name, city.state, city.lat, city.lng, city.population, city.popular], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Seed bus operators
    const operators = [
      { name: 'RedBus', logo: '🚌', rating: 4.2, reviews: 125847, color: '#D84E55', founded: 2006, hq: 'Bangalore', fleet: 2500, routes: 100000 },
      { name: 'VRL Travels', logo: '🚍', rating: 4.1, reviews: 89234, color: '#1E40AF', founded: 1976, hq: 'Hubli', fleet: 1800, routes: 850 },
      { name: 'SRS Travels', logo: '🚐', rating: 4.0, reviews: 67891, color: '#059669', founded: 1995, hq: 'Chennai', fleet: 1200, routes: 650 },
      { name: 'Orange Tours', logo: '🚌', rating: 4.3, reviews: 94567, color: '#EA580C', founded: 1999, hq: 'Mumbai', fleet: 2200, routes: 1200 },
      { name: 'Patel Travels', logo: '🚍', rating: 3.9, reviews: 45623, color: '#7C3AED', founded: 1985, hq: 'Ahmedabad', fleet: 800, routes: 450 },
      { name: 'Kallada Travels', logo: '🚌', rating: 4.4, reviews: 78912, color: '#DC2626', founded: 1962, hq: 'Kerala', fleet: 1500, routes: 800 }
    ];

    console.log('Seeding bus operators...');
    for (const operator of operators) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO bus_operators (
            name, logo, rating, total_reviews, primary_color, founded_year, 
            headquarters, fleet_size, total_routes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          operator.name, operator.logo, operator.rating, operator.reviews, 
          operator.color, operator.founded, operator.hq, operator.fleet, operator.routes
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Seed bus types
    const busTypes = [
      { name: 'AC Seater', icon: '❄️🪑', price: 1.2, speed: 65, seats: 45, amenities: ['AC', 'Charging Point', 'Reading Light'] },
      { name: 'Non-AC Seater', icon: '🪑', price: 0.8, speed: 55, seats: 50, amenities: ['Charging Point', 'Reading Light'] },
      { name: 'AC Sleeper', icon: '❄️🛏️', price: 1.8, speed: 70, seats: 40, amenities: ['AC', 'Blanket', 'Pillow', 'Charging Point'] },
      { name: 'Non-AC Sleeper', icon: '🛏️', price: 1.4, speed: 60, seats: 45, amenities: ['Blanket', 'Pillow', 'Charging Point'] },
      { name: 'Volvo AC', icon: '⭐❄️', price: 2.2, speed: 75, seats: 35, amenities: ['AC', 'Entertainment', 'WiFi', 'Snacks'] },
      { name: 'Mercedes', icon: '💎', price: 2.8, speed: 80, seats: 32, amenities: ['AC', 'Entertainment', 'WiFi', 'Meal Service'] }
    ];

    console.log('Seeding bus types...');
    for (const busType of busTypes) {
      await new Promise((resolve, reject) => {
        db.run(`
          INSERT OR IGNORE INTO bus_types (
            name, icon, base_price_per_km, average_speed, total_seats, amenities
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          busType.name, busType.icon, busType.price, busType.speed, 
          busType.seats, JSON.stringify(busType.amenities)
        ], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Seed routes (major city pairs)
    const routes = [
      { from: 'Mumbai', to: 'Pune', distance: 149, duration: 180 },
      { from: 'Mumbai', to: 'Delhi', distance: 1154, duration: 1200 },
      { from: 'Delhi', to: 'Jaipur', distance: 280, duration: 300 },
      { from: 'Bangalore', to: 'Chennai', distance: 347, duration: 360 },
      { from: 'Mumbai', to: 'Goa', distance: 464, duration: 480 },
      { from: 'Delhi', to: 'Ahmedabad', distance: 934, duration: 900 },
      { from: 'Pune', to: 'Hyderabad', distance: 559, duration: 600 },
      { from: 'Chennai', to: 'Hyderabad', distance: 629, duration: 660 }
    ];

    console.log('Seeding routes...');
    for (const route of routes) {
      // Get city IDs
      const fromCity = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM cities WHERE name = ?', [route.from], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      const toCity = await new Promise((resolve, reject) => {
        db.get('SELECT id FROM cities WHERE name = ?', [route.to], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (fromCity && toCity) {
        await new Promise((resolve, reject) => {
          db.run(`
            INSERT OR IGNORE INTO routes (from_city_id, to_city_id, distance_km, estimated_duration_minutes)
            VALUES (?, ?, ?, ?)
          `, [fromCity.id, toCity.id, route.distance, route.duration], (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      }
    }

    // Create some sample buses and schedules
    console.log('Creating sample buses and schedules...');
    
    // Get route IDs
    const routeIds = await new Promise((resolve, reject) => {
      db.all('SELECT id FROM routes LIMIT 5', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.id));
      });
    });

    const operatorIds = await new Promise((resolve, reject) => {
      db.all('SELECT id FROM bus_operators', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.id));
      });
    });

    const busTypeIds = await new Promise((resolve, reject) => {
      db.all('SELECT id FROM bus_types', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(r => r.id));
      });
    });

    // Create 20 sample buses
    for (let i = 0; i < 20; i++) {
      const busUuid = uuidv4();
      const busNumber = `BUS${1000 + i}`;
      const operatorId = operatorIds[Math.floor(Math.random() * operatorIds.length)];
      const busTypeId = busTypeIds[Math.floor(Math.random() * busTypeIds.length)];
      const routeId = routeIds[Math.floor(Math.random() * routeIds.length)];

      await new Promise((resolve, reject) => {
        db.run(`
          INSERT INTO buses (uuid, bus_number, operator_id, bus_type_id, route_id, total_seats)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [busUuid, busNumber, operatorId, busTypeId, routeId, 40], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    db.close();
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
