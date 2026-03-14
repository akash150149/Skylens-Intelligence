require('dotenv').config({ path: '../server/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const result = await genAI.listModels();
    console.log('Available Models:');
    result.models.forEach(model => console.log(model.name));
  } catch (err) {
    console.error('ListModels Failed:', err.message);
  }
}

listModels();
