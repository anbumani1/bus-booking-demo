const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../database/init');

const createDemoUser = async () => {
  try {
    console.log('🔐 Creating demo user...');
    
    const db = getDB();
    
    // Check if demo user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', ['demo@busbook.com'], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingUser) {
      console.log('✅ Demo user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 12);
    const userUuid = uuidv4();

    // Create demo user
    await new Promise((resolve, reject) => {
      const insertUser = `
        INSERT INTO users (uuid, email, password_hash, first_name, last_name, phone, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(insertUser, [
        userUuid,
        'demo@busbook.com',
        hashedPassword,
        'Demo',
        'User',
        '+1234567890',
        1
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });

    console.log('✅ Demo user created successfully');
    console.log('📧 Email: demo@busbook.com');
    console.log('🔑 Password: demo123');
    
  } catch (error) {
    console.error('❌ Error creating demo user:', error);
  }
};

module.exports = { createDemoUser };

// Run if called directly
if (require.main === module) {
  const { initializeDatabase } = require('../database/init');
  
  initializeDatabase().then(() => {
    createDemoUser().then(() => {
      process.exit(0);
    });
  });
}
