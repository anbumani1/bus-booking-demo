const { getDB } = require('./database/init');

const checkDatabase = async () => {
  try {
    console.log('🔍 Checking database contents...');
    
    const db = getDB();
    
    // Check cities
    const cities = await new Promise((resolve, reject) => {
      db.all('SELECT name FROM cities', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('🏙️ Available cities:', cities.map(c => c.name).join(', '));
    
    // Check bus operators
    const operators = await new Promise((resolve, reject) => {
      db.all('SELECT name FROM bus_operators', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('🚌 Available operators:', operators.map(o => o.name).join(', '));
    
    // Check users
    const users = await new Promise((resolve, reject) => {
      db.all('SELECT email, first_name, last_name FROM users', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    console.log('👥 Users:', users.map(u => `${u.first_name} ${u.last_name} (${u.email})`).join(', '));
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
};

// Initialize database first
const { initializeDatabase } = require('./database/init');
initializeDatabase().then(() => {
  checkDatabase();
});
