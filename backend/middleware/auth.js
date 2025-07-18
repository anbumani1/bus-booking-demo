const jwt = require('jsonwebtoken');
const { getDB } = require('../database/init');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Verify user exists and is active
    const db = getDB();
    db.get('SELECT id, uuid, email, is_active FROM users WHERE id = ?', [decoded.userId], (dbErr, user) => {
      db.close();
      
      if (dbErr) {
        return res.status(500).json({
          success: false,
          message: 'Database error during authentication'
        });
      }

      if (!user || !user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      // Add user info to request
      req.user = {
        userId: user.id,
        uuid: user.uuid,
        email: user.email
      };

      next();
    });
  });
};

// Optional authentication - doesn't fail if no token
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
      return next();
    }

    const db = getDB();
    db.get('SELECT id, uuid, email, is_active FROM users WHERE id = ?', [decoded.userId], (dbErr, user) => {
      db.close();
      
      if (dbErr || !user || !user.is_active) {
        req.user = null;
        return next();
      }

      req.user = {
        userId: user.id,
        uuid: user.uuid,
        email: user.email
      };

      next();
    });
  });
};

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    const db = getDB();
    db.get('SELECT is_admin FROM users WHERE id = ?', [req.user.userId], (err, user) => {
      db.close();
      
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error during admin verification'
        });
      }

      if (!user || !user.is_admin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      next();
    });
  });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  authenticateAdmin
};
