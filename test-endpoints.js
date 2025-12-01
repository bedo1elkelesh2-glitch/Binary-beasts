/**
 * Test script for backend API endpoints
 * Run this with: node test-endpoints.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Helper function to make requests
async function testEndpoint(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers,
      ...(data && { data })
    };
    
    const response = await axios(config);
    console.log(`✅ ${method.toUpperCase()} ${url}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(response.data, null, 2));
    return response;
  } catch (error) {
    console.log(`❌ ${method.toUpperCase()} ${url}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response:`, error.response.data);
    } else {
      console.log(`   Error:`, error.message);
    }
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests\n');
  console.log('='.repeat(50));
  
  // Test 1: Register a new user
  console.log('\n📝 Test 1: Register a new user');
  console.log('-'.repeat(50));
  const registerData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'testpassword123',
    role: 'customer'
  };
  const registerResponse = await testEndpoint('POST', '/api/v1/user', registerData);
  
  // Test 2: Try to register duplicate user (should fail)
  console.log('\n📝 Test 2: Try to register duplicate user (should fail)');
  console.log('-'.repeat(50));
  await testEndpoint('POST', '/api/v1/user', registerData);
  
  // Test 3: Login with valid credentials
  console.log('\n🔐 Test 3: Login with valid credentials');
  console.log('-'.repeat(50));
  const loginData = {
    email: registerData.email,
    password: registerData.password
  };
  let loginResponse = await testEndpoint('POST', '/api/v1/user/login', loginData);
  
  // Extract session token from cookies if login was successful
  let sessionToken = null;
  if (loginResponse && loginResponse.headers['set-cookie']) {
    const cookies = loginResponse.headers['set-cookie'];
    const sessionCookie = cookies.find(c => c.startsWith('session_token='));
    if (sessionCookie) {
      sessionToken = sessionCookie.split('=')[1].split(';')[0];
    }
  }
  
  // Test 4: Login with invalid password (should fail)
  console.log('\n🔐 Test 4: Login with invalid password (should fail)');
  console.log('-'.repeat(50));
  await testEndpoint('POST', '/api/v1/user/login', {
    email: registerData.email,
    password: 'wrongpassword'
  });
  
  // Test 5: Access private endpoint without session (should fail)
  console.log('\n🔒 Test 5: Access private endpoint without session (should fail)');
  console.log('-'.repeat(50));
  await testEndpoint('GET', '/test');
  
  // Test 6: Access private endpoint with session token
  if (sessionToken) {
    console.log('\n🔒 Test 6: Access private endpoint with session token');
    console.log('-'.repeat(50));
    await testEndpoint('GET', '/test', null, {
      'Cookie': `session_token=${sessionToken}`
    });
  } else {
    console.log('\n⚠️  Skipping Test 6: No session token obtained from login');
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Testing complete!');
}

// Run tests
runTests().catch(console.error);

