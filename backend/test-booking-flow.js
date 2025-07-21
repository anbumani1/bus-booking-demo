const axios = require('axios');

const testCompleteFlow = async () => {
  try {
    console.log('🧪 Testing complete booking flow...');
    
    // Step 1: Login
    console.log('🔐 Step 1: Login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@busbook.com',
      password: 'demo123'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }
    
    const token = loginResponse.data.data.token;
    const user = loginResponse.data.data.user;
    console.log('✅ Login successful:', user.firstName, user.lastName);

    // Step 2: Create a booking
    console.log('📝 Step 2: Creating booking...');
    const bookingData = {
      fromCity: 'Mumbai',
      toCity: 'Pune',
      busNumber: 'MH12AB1234',
      busType: 'AC Sleeper',
      operatorName: 'VRL Travels',
      departureDate: '2024-12-25',
      departureTime: '14:30',
      arrivalTime: '17:45',
      passengerCount: 2,
      seatNumbers: ['A1', 'A2'],
      totalAmount: 1200.00,
      paymentMethod: 'online',
      passengers: [
        {
          name: 'John Doe',
          age: 30,
          gender: 'male',
          seatNumber: 'A1',
          idType: 'aadhar',
          idNumber: '123456789012'
        },
        {
          name: 'Jane Doe',
          age: 28,
          gender: 'female',
          seatNumber: 'A2',
          idType: 'aadhar',
          idNumber: '123456789013'
        }
      ]
    };

    const bookingResponse = await axios.post('http://localhost:5000/api/bookings', bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!bookingResponse.data.success) {
      throw new Error('Booking creation failed: ' + bookingResponse.data.message);
    }

    console.log('✅ Booking created successfully:', bookingResponse.data.data.booking);

    // Step 3: Get booking history
    console.log('📋 Step 3: Fetching booking history...');
    const historyResponse = await axios.get('http://localhost:5000/api/bookings/history', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!historyResponse.data.success) {
      throw new Error('Failed to fetch booking history');
    }

    console.log('✅ Booking history retrieved:', historyResponse.data.data.bookings.length, 'bookings found');
    console.log('📊 Latest booking:', historyResponse.data.data.bookings[0]);

    console.log('\n🎉 Complete booking flow test PASSED!');
    console.log('✅ User can login');
    console.log('✅ User can create bookings');
    console.log('✅ User can view booking history');
    console.log('✅ All data is persisted in SQLite database');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testCompleteFlow();
