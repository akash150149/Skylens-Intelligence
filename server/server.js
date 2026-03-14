require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize legacy Gemini SDK with API Version override for Gemini 3
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
genAI.apiKey = process.env.GEMINI_API_KEY; // Force key
const model = genAI.getGenerativeModel(
  { 
    model: "gemini-3-flash-preview",
    systemInstruction: "You are a Senior Flight Dispatcher. You analyze METAR/TAF data and charts with absolute precision. Never hallucinate. If a chart is too blurry, admit it. Always return clear, technical explanations suitable for pilots."
  },
  { apiVersion: 'v1alpha' } // This is the fix for the 404 error
);

// CheckWX API key
const CHECKWX_API_KEY = process.env.CHECKWX_API_KEY;

// Load airports database for local search
let airportsList = [];
try {
  const airportsData = require('./airports.json');
  airportsList = Object.values(airportsData);
  console.log(`Loaded ${airportsList.length} airports for search.`);
} catch (e) {
  console.error('Failed to load airports.json. Search features will be limited.');
}

// Search Airports Endpoint
app.get('/api/airports/search', (req, res) => {
  const query = (req.query.q || '').toLowerCase();
  if (!query) return res.json([]);

  // Prioritize exact ICAO/IATA matches, then fuzzy matches in name or city
  const results = airportsList.filter(a => 
    (a.icao && a.icao.toLowerCase().includes(query)) ||
    (a.iata && a.iata.toLowerCase().includes(query)) ||
    (a.name && a.name.toLowerCase().includes(query)) ||
    (a.city && a.city.toLowerCase().includes(query))
  ).slice(0, 10); // Return top 10 matches to keep UI fast

  res.json(results);
});

// Decodes METAR category
const getFlightCategory = (metar) => {
  if (!metar) return 'UNKNOWN';
  if (metar.includes(' LIFR ')) return 'LIFR';
  if (metar.includes(' IFR ')) return 'IFR';
  if (metar.includes(' MVFR ')) return 'MVFR';
  if (metar.includes(' VFR ')) return 'VFR';
  // Fallback check if category not explicitly in text
  return 'VFR'; // Default for simple mockup
};

// GET METAR and Decode via Gemini
app.get('/api/weather/:icao', async (req, res) => {
  const { icao } = req.params;
  try {
    // 1. Fetch raw METAR from CheckWX
    const url = `https://api.checkwx.com/v2/metar/${icao}/decoded`;
    console.log(`Fetching from: ${url}`);
    const response = await axios.get(url, {
      headers: { 'X-API-Key': CHECKWX_API_KEY }
    });

    const metarData = response.data.data[0];
    if (!metarData) return res.status(404).json({ error: 'Airport not found' });

    // 2. Use Gemini to provide a "Pilot Brief"
    const prompt = `Decode this METAR and provide a professional pilot briefing in 3 sentences: ${metarData.raw_text}`;
    const result = await model.generateContent(prompt);
    const brief = result.response.text();

    res.json({
      icao: icao.toUpperCase(),
      raw: metarData.raw_text,
      brief: brief,
      category: metarData.flight_category || getFlightCategory(metarData.raw_text),
      temp: metarData.temperature?.celsius,
      wind: metarData.wind?.speed_kts,
      visibility: metarData.visibility?.miles,
      clouds: metarData.clouds?.[0]?.text
    });
  } catch (error) {
    console.error('--- ERROR CAUGHT ---');
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    if (error.status) console.error('Status:', error.status);
    
    res.status(500).json({ 
      error: 'Failed to fetch weather',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`SkyLens server running on port ${port}`);
});
