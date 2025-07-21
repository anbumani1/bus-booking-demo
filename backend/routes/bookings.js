const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { postgresHelpers } = require('../database/postgres');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create new booking
router.post('/', authenticateToken, [
  body('fromCity').isString(),
  body('toCity').isString(),
  body('busNumber').isString(),
  body('busType').isString(),
  body('operatorName').isString(),
  body('departureDate').isDate(),
  body('departureTime').isString(),
  body('arrivalTime').isString(),
  body('passengerCount').isInt({ min: 1, max: 6 }),
  body('seatNumbers').isArray(),
  body('totalAmount').isFloat({ min: 0 }),
  body('passengers').isArray(),
  body('paymentMethod').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      fromCity, toCity, busNumber, busType, operatorName,
      departureDate, departureTime, arrivalTime,
      passengerCount, seatNumbers, totalAmount, passengers, paymentMethod
    } = req.body;
    const userId = req.user.userId;

    // Get city data from PostgreSQL
    const fromCityResult = await postgresHelpers.query(
      'SELECT id, name FROM cities WHERE LOWER(name) = LOWER($1)',
      [fromCity]
    );
    const toCityResult = await postgresHelpers.query(
      'SELECT id, name FROM cities WHERE LOWER(name) = LOWER($1)',
      [toCity]
    );

    if (fromCityResult.rows.length === 0 || toCityResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid city names'
      });
    }

    const fromCityData = fromCityResult.rows[0];
    const toCityData = toCityResult.rows[0];

    // Get operator data from PostgreSQL
    const operatorResult = await postgresHelpers.query(
      'SELECT id, name FROM bus_operators WHERE LOWER(name) = LOWER($1)',
      [operatorName]
    );

    if (operatorResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid operator name'
      });
    }

    const operatorData = operatorResult.rows[0];

    // Create booking in PostgreSQL
    const bookingResult = await postgresHelpers.query(`
      INSERT INTO bookings (
        user_id, from_city_id, to_city_id, operator_id, bus_number, bus_type,
        departure_date, departure_time, arrival_time, passenger_count,
        seat_numbers, total_amount, payment_method, booking_status, payment_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      userId, fromCityData.id, toCityData.id, operatorData.id, busNumber, busType,
      departureDate, departureTime, arrivalTime, passengerCount,
      JSON.stringify(seatNumbers), totalAmount, paymentMethod || 'online', 'confirmed', 'paid'
    ]);

    const booking = bookingResult.rows[0];

    // Insert passengers into PostgreSQL
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];
      await postgresHelpers.query(`
        INSERT INTO passengers (booking_id, name, age, gender, seat_number, id_type, id_number)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        booking.id,
        passenger.name,
        passenger.age,
        passenger.gender,
        seatNumbers[i],
        passenger.idType,
        passenger.idNumber
      ]);
    }

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('booking-update', {
        type: 'new-booking',
        booking: booking.id,
        seats: seatNumbers
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking.id,
          busNumber: busNumber,
          operatorName: operatorName,
          busType: busType,
          fromCity: fromCity,
          toCity: toCity,
          departureDate: departureDate,
          departureTime: departureTime,
          passengerCount,
          seatNumbers,
          totalAmount,
          status: 'confirmed',
          paymentStatus: 'paid'
        }
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

// Get user's booking history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // 'all', 'upcoming', 'completed', 'cancelled'

    // Build query with filters
    let whereClause = 'WHERE b.user_id = $1';
    let queryParams = [userId];
    let paramCount = 1;

    if (status && status !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      switch (status) {
        case 'upcoming':
          whereClause += ` AND b.departure_date >= $${++paramCount} AND b.booking_status = $${++paramCount}`;
          queryParams.push(today, 'confirmed');
          break;
        case 'completed':
          whereClause += ` AND b.departure_date < $${++paramCount} AND b.booking_status = $${++paramCount}`;
          queryParams.push(today, 'confirmed');
          break;
        case 'cancelled':
          whereClause += ` AND b.booking_status = $${++paramCount}`;
          queryParams.push('cancelled');
          break;
      }
    }

    // Get total count for pagination
    const countResult = await postgresHelpers.query(`
      SELECT COUNT(*) FROM bookings b ${whereClause}
    `, queryParams);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get bookings with pagination
    const bookingsResult = await postgresHelpers.query(`
      SELECT
        b.*,
        fc.name as from_city_name, fc.state as from_city_state,
        tc.name as to_city_name, tc.state as to_city_state,
        bo.name as operator_name, bo.logo as operator_logo, bo.rating as operator_rating
      FROM bookings b
      LEFT JOIN cities fc ON b.from_city_id = fc.id
      LEFT JOIN cities tc ON b.to_city_id = tc.id
      LEFT JOIN bus_operators bo ON b.operator_id = bo.id
      ${whereClause}
      ORDER BY b.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `, [...queryParams, limit, (page - 1) * limit]);

    const bookings = bookingsResult.rows;

    // Get passengers for each booking
    const bookingIds = bookings.map(b => b.id);
    let passengersData = [];

    if (bookingIds.length > 0) {
      const passengersResult = await postgresHelpers.query(`
        SELECT * FROM passengers WHERE booking_id = ANY($1)
      `, [bookingIds]);
      passengersData = passengersResult.rows;
    }

    // Format bookings for response
    const formattedBookings = bookings.map(booking => {
      const bookingPassengers = passengersData.filter(p => p.booking_id === booking.id);

      return {
        id: booking.id,
        uuid: booking.id,
        bookingDate: booking.created_at,
        journey: {
          from: booking.from_city_name || 'Unknown',
          to: booking.to_city_name || 'Unknown',
          date: booking.departure_date,
          departureTime: booking.departure_time,
          arrivalTime: booking.arrival_time,
          distance: booking.distance_km || 0
        },
        bus: {
          number: booking.bus_number,
          operator: booking.operator_name || 'Unknown',
          type: booking.bus_type
        },
        passengers: {
          count: booking.passenger_count,
          details: bookingPassengers.map(p => `${p.name} (${p.seat_number})`).join(', '),
          seats: JSON.parse(booking.seat_numbers || '[]')
        },
        payment: {
          amount: parseFloat(booking.total_amount),
          method: booking.payment_method,
          status: booking.payment_status
        },
        status: booking.booking_status
      };
    });

    res.json({
      success: true,
      message: 'Booking history retrieved successfully',
      data: {
        bookings: formattedBookings,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
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

// Get booking details by UUID
router.get('/:uuid', authenticateToken, (req, res) => {
  const { uuid } = req.params;
  const userId = req.user.userId;
  const db = getDB();

  const query = `
    SELECT 
      b.*, bs.departure_date, bs.departure_time, bs.arrival_time,
      bus.bus_number, bus.current_location_lat, bus.current_location_lng,
      bo.name as operator_name, bo.phone as operator_phone,
      bt.name as bus_type, c1.name as from_city, c2.name as to_city,
      r.distance_km
    FROM bookings b
    JOIN bus_schedules bs ON b.schedule_id = bs.id
    JOIN buses bus ON bs.bus_id = bus.id
    JOIN bus_operators bo ON bus.operator_id = bo.id
    JOIN bus_types bt ON bus.bus_type_id = bt.id
    JOIN routes r ON bus.route_id = r.id
    JOIN cities c1 ON r.from_city_id = c1.id
    JOIN cities c2 ON r.to_city_id = c2.id
    WHERE b.uuid = ? AND b.user_id = ?
  `;

  db.get(query, [uuid, userId], (err, booking) => {
    if (err) {
      db.close();
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    if (!booking) {
      db.close();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Get passengers
    db.all('SELECT * FROM passengers WHERE booking_id = ?', [booking.id], (err, passengers) => {
      db.close();

      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      res.json({
        success: true,
        message: 'Booking details retrieved successfully',
        data: {
          booking: {
            id: booking.id,
            uuid: booking.uuid,
            bookingDate: booking.booking_date,
            journey: {
              from: booking.from_city,
              to: booking.to_city,
              date: booking.departure_date,
              departureTime: booking.departure_time,
              arrivalTime: booking.arrival_time,
              distance: booking.distance_km
            },
            bus: {
              number: booking.bus_number,
              operator: booking.operator_name,
              operatorPhone: booking.operator_phone,
              type: booking.bus_type,
              currentLocation: {
                lat: booking.current_location_lat,
                lng: booking.current_location_lng
              }
            },
            passengers: passengers.map(p => ({
              name: p.name,
              age: p.age,
              gender: p.gender,
              seatNumber: p.seat_number,
              idType: p.id_type,
              idNumber: p.id_number
            })),
            payment: {
              amount: booking.total_amount,
              method: booking.payment_method,
              status: booking.payment_status,
              transactionId: booking.transaction_id
            },
            status: booking.booking_status,
            seats: JSON.parse(booking.seat_numbers)
          }
        }
      });
    });
  });
});

module.exports = router;
