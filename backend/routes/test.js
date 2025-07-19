const express = require('express');
const router = express.Router();
const { jsonDBHelpers } = require('../database/jsonDB');

// Test JSON database connection
router.get('/connection', async (req, res) => {
  try {
    // Test basic connection
    const cities = await jsonDBHelpers.getCities();
    const operators = await jsonDBHelpers.getBusOperators();

    res.json({
      success: true,
      message: 'JSON database connection successful',
      data: {
        cities: cities.slice(0, 5),
        operators: operators.slice(0, 3),
        totalCities: cities.length,
        totalOperators: operators.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await jsonDBHelpers.getCities();

    res.json({
      success: true,
      message: 'Cities retrieved successfully',
      data: {
        cities,
        count: cities.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cities',
      error: error.message
    });
  }
});

// Get all bus operators
router.get('/operators', async (req, res) => {
  try {
    const operators = await jsonDBHelpers.getBusOperators();

    res.json({
      success: true,
      message: 'Bus operators retrieved successfully',
      data: {
        operators,
        count: operators.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operators',
      error: error.message
    });
  }
});

// Test user creation
router.post('/create-test-user', async (req, res) => {
  try {
    const testUser = {
      email: `test${Date.now()}@example.com`,
      password_hash: 'hashed_password_here',
      first_name: 'Test',
      last_name: 'User',
      phone: '+91 9876543210'
    };

    const newUser = await jsonDBHelpers.createUser(testUser);

    res.json({
      success: true,
      message: 'Test user created successfully',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create test user',
      error: error.message
    });
  }
});

// Database stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await jsonDBHelpers.getStats();

    res.json({
      success: true,
      message: 'Database statistics retrieved',
      data: {
        tables: stats,
        total_records: Object.values(stats).reduce((sum, count) => sum + count, 0)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get database stats',
      error: error.message
    });
  }
});

module.exports = router;
