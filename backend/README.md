# 🚌 Bus Booking Backend API

A complete Node.js/Express backend with SQLite database for the Bus Booking application, featuring user authentication, booking history, and real-time features.

## 🚀 Features

### 🔐 Authentication System
- **JWT-based authentication** with secure token management
- **User registration and login** with password hashing (bcrypt)
- **Session management** with token expiration
- **Protected routes** with middleware authentication

### 📊 Database & Data Management
- **SQLite database** with comprehensive schema
- **Real Indian cities** with coordinates and population data
- **Actual bus operators** (RedBus, VRL Travels, SRS Travels, etc.)
- **Distance matrix** between major Indian cities
- **Dynamic pricing** based on multiple factors

### 📋 Booking Management
- **Complete booking system** with passenger details
- **Booking history** with filtering and pagination
- **Real-time seat availability** updates
- **Booking status tracking** (confirmed, cancelled, completed)
- **Payment status management**

### 🔄 Real-time Features
- **Socket.IO integration** for live updates
- **Real-time seat updates** during booking
- **Live bus tracking** notifications
- **Booking notifications** and alerts

### 🛡️ Security & Performance
- **Rate limiting** to prevent abuse
- **CORS configuration** for frontend integration
- **Input validation** with express-validator
- **Error handling** middleware
- **Compression** and security headers

## 📁 Project Structure

```
backend/
├── database/
│   ├── init.js              # Database initialization and schema
│   └── bus_booking.db       # SQLite database file
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   └── bookings.js          # Booking management routes
├── scripts/
│   └── seedData.js          # Database seeding script
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json             # Dependencies and scripts
├── server.js                # Main server file
└── README.md                # This file
```

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with authentication
- **cities** - Indian cities with coordinates
- **bus_operators** - Real bus companies
- **bus_types** - Different bus categories
- **routes** - City-to-city routes with distances
- **buses** - Individual bus instances
- **bus_schedules** - Departure/arrival times
- **bookings** - User bookings with details
- **passengers** - Passenger information
- **reviews** - User reviews and ratings

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Initialize database:**
```bash
npm run init-db
```

5. **Seed database with sample data:**
```bash
npm run seed
```

6. **Start development server:**
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify JWT token

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/history` - Get user booking history
- `GET /api/bookings/:uuid` - Get booking details
- `PATCH /api/bookings/:uuid/cancel` - Cancel booking

### Health Check
- `GET /health` - Server health status

## 🔧 Environment Variables

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

## 📊 Real-World Data

### Indian Cities (10 Major Cities)
- Mumbai, Delhi, Bangalore, Chennai, Pune
- Hyderabad, Kolkata, Ahmedabad, Jaipur, Goa
- **Real coordinates** and population data
- **Actual distances** between cities

### Bus Operators (6 Major Companies)
- RedBus, VRL Travels, SRS Travels
- Orange Tours, Patel Travels, Kallada Travels
- **Real company details** and fleet information

### Pricing Factors
- **Distance-based pricing** (₹0.8-2.8 per km)
- **Bus type multipliers** (AC, Sleeper, Volvo, etc.)
- **Time-based pricing** (rush hours, night travel)
- **Seasonal adjustments** (festivals, holidays)
- **Demand-based pricing** (high/low demand)

## 🔄 Real-time Features

### Socket.IO Events
- `join-bus-tracking` - Join bus tracking room
- `leave-bus-tracking` - Leave bus tracking room
- `booking-update` - Booking status updates
- `seat-update` - Real-time seat availability

### Usage Example
```javascript
// Frontend Socket.IO connection
const socket = io('http://localhost:5000');

// Join bus tracking
socket.emit('join-bus-tracking', busId);

// Listen for seat updates
socket.on('seat-update', (data) => {
  console.log('Seats updated:', data);
});
```

## 🧪 Testing

### Manual Testing
```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

### Database Queries
```bash
# Access SQLite database
sqlite3 database/bus_booking.db

# View tables
.tables

# Check users
SELECT * FROM users;

# Check bookings
SELECT * FROM bookings;
```

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production` in environment
2. Use strong JWT secret
3. Configure proper CORS origins
4. Set up process manager (PM2)
5. Use reverse proxy (nginx)

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Performance

### Optimizations
- **Database indexing** on frequently queried columns
- **Connection pooling** for database connections
- **Compression middleware** for response optimization
- **Rate limiting** to prevent abuse
- **Caching strategies** for static data

### Monitoring
- Health check endpoint for uptime monitoring
- Error logging and tracking
- Performance metrics collection
- Database query optimization

## 🔒 Security

### Implemented Security Measures
- **JWT token authentication** with expiration
- **Password hashing** with bcrypt (12 rounds)
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **CORS configuration** for cross-origin requests
- **Security headers** with Helmet.js
- **SQL injection prevention** with parameterized queries

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Express.js** for the web framework
- **SQLite** for the lightweight database
- **Socket.IO** for real-time features
- **JWT** for secure authentication
- **bcrypt** for password hashing

---

**Built with ❤️ for the Bus Booking Demo Application**
