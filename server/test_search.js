require('dotenv').config({ path: '../server/.env' });
const axios = require('axios');

async function testCheckWX() {
  const CHECKWX_API_KEY = process.env.CHECKWX_API_KEY;
  const queries = ['KJFK', 'JFK', 'Heathrow']; // ICAO, IATA, Name

  for (const query of queries) {
    try {
      console.log(`\n--- Searching for: ${query} ---`);
      // Test the station/search endpoint (if it exists) or just the standard station endpoint
      const response = await axios.get(`https://api.checkwx.com/v2/station/${query}`, {
        headers: { 'X-API-Key': CHECKWX_API_KEY }
      });
      console.log(`Results for ${query}:`, response.data.data.slice(0, 2).map(s => `${s.icao} / ${s.iata} - ${s.name}`));
    } catch (e) {
      console.error(`Error for ${query}:`, e.response ? e.response.data : e.message);
    }
  }
}
testCheckWX();
