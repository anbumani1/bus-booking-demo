const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const testAPI = async () => {
  console.log('🧪 Testing JSON Database API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await axios.get('http://localhost:5000/health');
    console.log('✅ Health:', health.data.status);

    // Test 2: Database connection
    console.log('\n2. Testing database connection...');
    const connection = await axios.get(`${API_BASE}/test/connection`);
    console.log('✅ Database:', connection.data.message);
    console.log(`   Cities: ${connection.data.data.totalCities}`);
    console.log(`   Operators: ${connection.data.data.totalOperators}`);

    // Test 3: User registration
    console.log('\n3. Testing user registration...');
    const userData = {
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '9876543210'
    };

    const registerResponse = await axios.post(`${API_BASE}/auth/register`, userData);
    console.log('✅ User registered:', registerResponse.data.data.user.email);
    const authToken = registerResponse.data.data.token;

    // Test 4: User login
    console.log('\n4. Testing user login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    console.log('✅ User logged in:', loginResponse.data.data.user.email);

    // Test 5: Create booking
    console.log('\n5. Testing booking creation...');
    const bookingData = {
      fromCity: 'Mumbai',
      toCity: 'Pune',
      busNumber: 'MH12AB1234',
      busType: 'AC Sleeper',
      operatorName: 'VRL Travels',
      departureDate: '2024-02-15',
      departureTime: '14:30',
      arrivalTime: '17:45',
      passengerCount: 2,
      seatNumbers: ['A1', 'A2'],
      totalAmount: 1200,
      passengers: [
        { name: 'John Doe', age: 30, gender: 'male', idType: 'aadhar', idNumber: '1234567890' },
        { name: 'Jane Doe', age: 28, gender: 'female', idType: 'aadhar', idNumber: '0987654321' }
      ],
      paymentMethod: 'credit_card'
    };

    const bookingResponse = await axios.post(`${API_BASE}/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Booking created:', bookingResponse.data.data.booking.id);

    // Test 6: Get booking history
    console.log('\n6. Testing booking history...');
    const historyResponse = await axios.get(`${API_BASE}/bookings/history`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Booking history:', historyResponse.data.data.bookings.length, 'bookings');

    // Test 7: Database stats after operations
    console.log('\n7. Final database stats...');
    const finalStats = await axios.get(`${API_BASE}/test/stats`);
    console.log('✅ Final stats:', finalStats.data.data.tables);

    console.log('\n🎉 All tests passed! JSON Database is working perfectly!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testAPI();
