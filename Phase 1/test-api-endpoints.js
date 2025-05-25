// This script tests the API endpoints with our refactored controllers
const axios = require('axios');
const baseURL = 'http://localhost:3000/api';

async function testEndpoints() {
  console.log('Testing API endpoints with refactored controllers...');
  try {
    // 1. Test book endpoints
    console.log('\n1. Testing book endpoints:');
    let response = await axios.get(`${baseURL}/books?query=gatsby`);
    console.log(`  GET /books?query=gatsby: ${response.status === 200 ? 'Success' : 'Failed'}`);
    console.log(`  Found ${response.data.length} books`);
    
    response = await axios.get(`${baseURL}/books/popular`);
    console.log(`  GET /books/popular: ${response.status === 200 ? 'Success' : 'Failed'}`);
    
    response = await axios.get(`${baseURL}/books/overview`);
    console.log(`  GET /books/overview: ${response.status === 200 ? 'Success' : 'Failed'}`);
    console.log(`  System overview:`, response.data);
    
    // 2. Test user endpoints
    console.log('\n2. Testing user endpoints:');
    response = await axios.get(`${baseURL}/users/1`);
    console.log(`  GET /users/1: ${response.status === 200 ? 'Success' : 'Failed'}`);
    console.log(`  User name: ${response.data.name}`);
    
    response = await axios.get(`${baseURL}/users/active`);
    console.log(`  GET /users/active: ${response.status === 200 ? 'Success' : 'Failed'}`);
    
    // 3. Test loan endpoints
    console.log('\n3. Testing loan endpoints:');
    response = await axios.get(`${baseURL}/loans/1`);
    console.log(`  GET /loans/1: ${response.status === 200 ? 'Success' : 'Failed'}`);
    
    response = await axios.get(`${baseURL}/loans/overdue`);
    console.log(`  GET /loans/overdue: ${response.status === 200 ? 'Success' : 'Failed'}`);
    
    console.log('\nAll API endpoints tested successfully!');
  } catch (error) {
    console.error('Error during API testing:');
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Message: ${error.response.data.message || 'No message'}`);
    } else {
      console.error(error.message);
    }
  }
}

// Make sure the server is running before running this test
console.log('Make sure the server is running on http://localhost:3000');
console.log('Run "node index.js" in a separate terminal if it\'s not already running');
setTimeout(() => {
  testEndpoints().catch(err => console.error('Testing failed:', err));
}, 2000); // Wait 2 seconds before starting tests
