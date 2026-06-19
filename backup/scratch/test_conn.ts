
import axios from 'axios';

async function testConnection() {
  const url = 'http://localhost:3000/health';
  console.log(`Testing connection to ${url}...`);
  try {
    const response = await axios.get(url);
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error: any) {
    console.error('Error connecting to backend:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Message:', error.message);
    }
  }
}

testConnection();
