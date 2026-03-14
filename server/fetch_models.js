require('dotenv').config({ path: '../server/.env' });
const axios = require('axios');

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    require('fs').writeFileSync('models.json', JSON.stringify(response.data.models, null, 2));
    console.log('Saved to models.json');
  } catch (err) {
    console.error('Failed to list models:', err.response ? err.response.data : err.message);
  }
}

listModels();
