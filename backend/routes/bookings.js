const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create new booking
router.post('/', authenticateToken, [
  body('scheduleId').isInt(),
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

    const { scheduleId, passengerCount, seatNumbers, totalAmount, passengers, paymentMethod } = req.body;
    const userId = req.user.userId;
    const bookingUuid = uuidv4();
    const db = getDB();

    // Start transaction
    db.serialize(() => {
      db.run('BEGIN TRANSACTION');

      // Check seat availability
      db.get(`
        SELECT bs.available_seats, bs.bus_id, bs.departure_date, bs.departure_time,
               b.bus_number, bo.name as operator_name, bt.name as bus_type,
               c1.name as from_city, c2.name as to_city
        FROM bus_schedules bs
        JOIN buses b ON bs.bus_id = b.id
        JOIN bus_operators bo ON b.operator_id = bo.id
        JOIN bus_types bt ON b.bus_type_id = bt.id
        JOIN routes r ON b.route_id = r.id
        JOIN cities c1 ON r.from_city_id = c1.id
        JOIN cities c2 ON r.to_city_id = c2.id
        WHERE bs.id = ?
      `, [scheduleId], (err, schedule) => {
        if (err) {
          db.run('ROLLBACK');
          db.close();
          return res.status(500).json({
            success: false,
            message: 'Database error',
            error: err.message
          });
        }

        if (!schedule) {
          db.run('ROLLBACK');
          db.close();
          return res.status(404).json({
            success: false,
            message: 'Schedule not found'
          });
        }

        if (schedule.available_seats < passengerCount) {
          db.run('ROLLBACK');
          db.close();
          return res.status(400).json({
            success: false,
            message: 'Not enough seats available'
          });
        }

        // Create booking
        const insertBooking = `
          INSERT INTO bookings (
            uuid, user_id, schedule_id, passenger_count, seat_numbers, 
            total_amount, payment_method, booking_status, payment_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'paid')
        `;

        db.run(insertBooking, [
          bookingUuid, userId, scheduleId, passengerCount, 
          JSON.stringify(seatNumbers), totalAmount, paymentMethod || 'online'
        ], function(err) {
          if (err) {
            db.run('ROLLBACK');
            db.close();
            return res.status(500).json({
              success: false,
              message: 'Failed to create booking',
              error: err.message
            });
          }

          const bookingId = this.lastID;

          // Insert passengers
          const insertPassenger = `
            INSERT INTO passengers (booking_id, name, age, gender, seat_number, id_type, id_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;

          let passengersInserted = 0;
          passengers.forEach((passenger, index) => {
            db.run(insertPassenger, [
              bookingId, passenger.name, passenger.age, passenger.gender,
              seatNumbers[index], passenger.idType, passenger.idNumber
            ], (err) => {
              if (err) {
                db.run('ROLLBACK');
                db.close();
                return res.status(500).json({
                  success: false,
                  message: 'Failed to add passenger',
                  error: err.message
                });
              }

              passengersInserted++;
              if (passengersInserted === passengers.length) {
                // Update available seats
                db.run(`
                  UPDATE bus_schedules 
                  SET available_seats = available_seats - ? 
                  WHERE id = ?
                `, [passengerCount, scheduleId], (err) => {
                  if (err) {
                    db.run('ROLLBACK');
                    db.close();
                    return res.status(500).json({
                      success: false,
                      message: 'Failed to update seat availability',
                      error: err.message
                    });
                  }

                  db.run('COMMIT');

                  // Emit real-time update
                  const io = req.app.get('io');
                  io.to(`bus-${schedule.bus_id}`).emit('seat-update', {
                    scheduleId,
                    availableSeats: schedule.available_seats - passengerCount,
                    bookedSeats: seatNumbers
                  });

                  db.close();
                  res.status(201).json({
                    success: true,
                    message: 'Booking created successfully',
                    data: {
                      booking: {
                        id: bookingId,
                        uuid: bookingUuid,
                        scheduleId,
                        busNumber: schedule.bus_number,
                        operatorName: schedule.operator_name,
                        busType: schedule.bus_type,
                        fromCity: schedule.from_city,
                        toCity: schedule.to_city,
                        departureDate: schedule.departure_date,
                        departureTime: schedule.departure_time,
                        passengerCount,
                        seatNumbers,
                        totalAmount,
                        status: 'confirmed',
                        paymentStatus: 'paid'
                      }
                    }
                  });
                });
              }
            });
          });
        });
      });
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
router.get('/history', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status; // 'all', 'upcoming', 'completed', 'cancelled'

  const db = getDB();

  let statusCondition = '';
  if (status && status !== 'all') {
    switch (status) {
      case 'upcoming':
        statusCondition = "AND bs.departure_date >= date('now') AND b.booking_status = 'confirmed'";
        break;
      case 'completed':
        statusCondition = "AND bs.departure_date < date('now') AND b.booking_status = 'confirmed'";
        break;
      case 'cancelled':
        statusCondition = "AND b.booking_status = 'cancelled'";
        break;
    }
  }

  const query = `
    SELECT 
      b.id, b.uuid, b.booking_date, b.passenger_count, b.seat_numbers,
      b.total_amount, b.booking_status, b.payment_status, b.payment_method,
      bs.departure_date, bs.departure_time, bs.arrival_time,
      bus.bus_number, bo.name as operator_name, bt.name as bus_type,
      c1.name as from_city, c2.name as to_city, r.distance_km,
      GROUP_CONCAT(p.name || ' (' || p.seat_number || ')') as passenger_details
    FROM bookings b
    JOIN bus_schedules bs ON b.schedule_id = bs.id
    JOIN buses bus ON bs.bus_id = bus.id
    JOIN bus_operators bo ON bus.operator_id = bo.id
    JOIN bus_types bt ON bus.bus_type_id = bt.id
    JOIN routes r ON bus.route_id = r.id
    JOIN cities c1 ON r.from_city_id = c1.id
    JOIN cities c2 ON r.to_city_id = c2.id
    LEFT JOIN passengers p ON b.id = p.booking_id
    WHERE b.user_id = ? ${statusCondition}
    GROUP BY b.id
    ORDER BY b.booking_date DESC
    LIMIT ? OFFSET ?
  `;

  db.all(query, [userId, limit, offset], (err, bookings) => {
    if (err) {
      db.close();
      return res.status(500).json({
        success: false,
        message: 'Database error',
        error: err.message
      });
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      JOIN bus_schedules bs ON b.schedule_id = bs.id
      WHERE b.user_id = ? ${statusCondition}
    `;

    db.get(countQuery, [userId], (err, countResult) => {
      db.close();

      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error',
          error: err.message
        });
      }

      const formattedBookings = bookings.map(booking => ({
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
          type: booking.bus_type
        },
        passengers: {
          count: booking.passenger_count,
          details: booking.passenger_details,
          seats: JSON.parse(booking.seat_numbers)
        },
        payment: {
          amount: booking.total_amount,
          method: booking.payment_method,
          status: booking.payment_status
        },
        status: booking.booking_status
      }));

      res.json({
        success: true,
        message: 'Booking history retrieved successfully',
        data: {
          bookings: formattedBookings,
          pagination: {
            page,
            limit,
            total: countResult.total,
            totalPages: Math.ceil(countResult.total / limit)
          }
        }
      });
    });
  });
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
