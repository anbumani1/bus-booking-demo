const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const testRoutes = require('./routes/test');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

// Import database
const { initializeDatabase } = require('./database/jsonDB');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: NODE_ENV === 'production'
      ? [
          'https://bus-booking-demo-git-main-anbumanis-projects-b2c9e1a5.vercel.app',
          'https://bus-booking-demo-dlo7mex06-anbumanis-projects-b2c9e1a5.vercel.app',
          process.env.FRONTEND_URL
        ].filter(Boolean)
      : ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const allowedOrigins = NODE_ENV === 'production'
  ? [
      'https://bus-booking-demo-git-main-anbumanis-projects-b2c9e1a5.vercel.app',
      'https://bus-booking-demo-dlo7mex06-anbumanis-projects-b2c9e1a5.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : ['http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/test', testRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join bus tracking room
  socket.on('join-bus-tracking', (busId) => {
    socket.join(`bus-${busId}`);
    console.log(`User ${socket.id} joined bus tracking for bus ${busId}`);
  });

  // Leave bus tracking room
  socket.on('leave-bus-tracking', (busId) => {
    socket.leave(`bus-${busId}`);
    console.log(`User ${socket.id} left bus tracking for bus ${busId}`);
  });

  // Handle booking updates
  socket.on('booking-update', (data) => {
    socket.broadcast.emit('booking-notification', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting server with JSON database...');

    // Initialize JSON database
    await initializeDatabase();

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.IO enabled for real-time features`);
      console.log(`🗄️ Database: JSON files (persistent)`);
      console.log(`📁 Data stored in: backend/database/data/`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

startServer();

module.exports = { app, server, io };
