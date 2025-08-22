const axios = require('axios');

async function testStats() {
  try {
    const response = await axios.get('http://localhost:3001/api/dashboard/public-stats');
    console.log('✅ Public Stats Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('❌ Error fetching stats:');
    console.log(error.response?.data || error.message);
  }
}

testStats();
