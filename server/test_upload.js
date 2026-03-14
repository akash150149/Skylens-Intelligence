const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');

async function testUpload() {
  try {
    const formData = new FormData();
    const filePath = path.join(__dirname, 'dummy.jpg');
    
    formData.append('chart', fs.createReadStream(filePath));

    console.log('Sending test request to http://localhost:5000/api/decode-chart...');
    const response = await axios.post('http://localhost:5000/api/decode-chart', formData, {
      headers: formData.getHeaders()
    });

    console.log('Success:', response.data);
  } catch (error) {
    console.error('Test Script Error!');
    if (error.response) {
      console.error('Backend returned status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testUpload();
