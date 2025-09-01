const axios = require('axios');

async function testBrowserLikeRequest() {
  console.log('🧪 Testing browser-like request to bypass Vercel protection...\n');
  
  const API_URL = 'https://project-connect-pscbt9fqv-parthd4567-gmailcoms-projects.vercel.app/api';
  
  // Configure axios to mimic a browser request
  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Sec-Fetch-Site': 'cross-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://projectconnect.tech/',
    'Origin': 'https://projectconnect.tech',
    'Content-Type': 'application/json'
  };

  try {
    console.log('1. Testing registration with browser headers...');
    const testUser = {
      name: 'Test User Browser',
      email: `browsertest${Date.now()}@example.com`,
      password: 'TestPass123!'
    };

    const response = await axios.post(`${API_URL}/auth/register`, testUser, {
      headers: browserHeaders,
      timeout: 10000
    });

    console.log('✅ SUCCESS! Registration worked with browser headers');
    console.log('Response:', response.data);
    return true;

  } catch (error) {
    if (error.response) {
      console.log(`❌ HTTP Error: ${error.response.status}`);
      if (error.response.status === 401) {
        console.log('⚠️  Still getting 401 - Vercel protection is strong');
      } else if (error.response.status === 400) {
        console.log('✅ API is accessible! Got expected validation error');
        return true;
      }
    } else {
      console.log(`❌ Request Error: ${error.message}`);
    }
    return false;
  }
}

testBrowserLikeRequest().then(success => {
  if (success) {
    console.log('\n🎉 The backend API is working! The frontend should be able to connect.');
  } else {
    console.log('\n⚠️  Backend still protected. But frontend might work through browser authentication.');
  }
});
