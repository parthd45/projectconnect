const axios = require('axios');

// Test backend endpoints
const API_URL = 'https://project-connect-amfi3c0j5-parthd4567-gmailcoms-projects.vercel.app/api';

async function testBackend() {
    console.log('Testing backend at:', API_URL);
    console.log('='.repeat(50));
    
    try {
        // Test health endpoint
        console.log('1. Testing /health endpoint...');
        const healthResponse = await axios.get(`${API_URL}/health`);
        console.log('✅ Health endpoint working:', healthResponse.data);
    } catch (error) {
        console.log('❌ Health endpoint error:', error.response?.status, error.response?.statusText);
        console.log('   This might be due to Vercel authentication protection');
    }
    
    try {
        // Test auth endpoints structure (should return CORS headers even if protected)
        console.log('\n2. Testing /auth/login endpoint structure...');
        const authResponse = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@test.com',
            password: 'test123'
        });
        console.log('✅ Auth endpoint accessible:', authResponse.status);
    } catch (error) {
        if (error.response?.status === 400 || error.response?.status === 401) {
            console.log('✅ Auth endpoint working (expected auth error):', error.response.status);
        } else if (error.response?.status === 403) {
            console.log('⚠️  Auth endpoint protected by Vercel auth:', error.response.status);
        } else {
            console.log('❌ Auth endpoint error:', error.response?.status, error.response?.statusText);
        }
    }
    
    console.log('\n='.repeat(50));
    console.log('Backend test completed!');
}

testBackend().catch(console.error);
