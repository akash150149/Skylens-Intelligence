require('dotenv').config({ path: '../server/.env' });
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  console.log('Testing CheckWX...');
  try {
    const res = await axios.get('https://api.checkwx.com/metar/KJFK/decoded', {
      headers: { 'X-API-Key': process.env.CHECKWX_API_KEY }
    });
    console.log('CheckWX OK:', res.data.data[0].raw_text);
  } catch (err) {
    console.error('CheckWX Failed:', err.message);
  }

  console.log('Testing Gemini...');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent('Hi');
    console.log('Gemini OK:', result.response.text());
  } catch (err) {
    console.error('Gemini Failed:', err.message);
  }
}

test();
