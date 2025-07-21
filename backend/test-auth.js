const axios = require('axios');

const testAuth = async () => {
  try {
    console.log('🧪 Testing authentication...');
    
    // Skip registration test for now

    // Test login
    console.log('🔐 Testing login...');
    const loginData = {
      email: 'demo@busbook.com',
      password: 'demo123'
    };

    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', loginData);
    console.log('✅ Login successful:', loginResponse.data);

    // Test token verification
    console.log('🔍 Testing token verification...');
    const token = loginResponse.data.data.token;
    const verifyResponse = await axios.get('http://localhost:5000/api/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Token verification successful:', verifyResponse.data);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
};

testAuth();
