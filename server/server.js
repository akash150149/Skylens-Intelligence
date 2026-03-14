require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Set up Multer for memory storage (we will pass buffer to Gemini)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize legacy Gemini SDK with API Version override for Gemini 3
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
genAI.apiKey = process.env.GEMINI_API_KEY; // Force key

// Weather dispatcher model
const model = genAI.getGenerativeModel(
  { 
    model: "gemini-3-flash-preview",
    systemInstruction: "You are a Senior Flight Dispatcher. You analyze METAR/TAF data and charts with absolute precision. Never hallucinate. If a chart is too blurry, admit it. Always return clear, technical explanations suitable for pilots."
  },
  { apiVersion: 'v1alpha' } // This is the fix for the 404 error
);

// Chart decoder model instance 
const chartDecoderModel = genAI.getGenerativeModel(
  {
    model: "gemini-3-flash-preview",
    systemInstruction: "You are a Senior Flight Dispatcher. Extract the following from this chart: 1. Airport Identity (Name/ICAO), 2. Communication Frequencies, 3. Critical Altitudes (MSA/Decision Height), 4. Any Special Notes (NOTAMs mentioned). Return this as a clean JSON object without any markdown wrapping (just the pure raw JSON object)."
  },
  { apiVersion: 'v1alpha' }
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

// POST Decode Chart Endpoint
app.post('/api/decode-chart', upload.single('chart'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No chart image uploaded. Provide an image in the "chart" field.' });
  }

  try {
    const mimeType = req.file.mimetype;
    const base64Data = req.file.buffer.toString('base64');
    
    console.log(`Decoding chart upload [Size: ${req.file.size} bytes, Type: ${mimeType}]`);

    const imageParts = [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      }
    ];

    const result = await chartDecoderModel.generateContent([
      "Analyze the uploaded chart and extract the requested fields into JSON format.", 
      ...imageParts
    ]);
    
    const responseText = result.response.text();
    
    // Attempt to parse out markdown formatting if somehow it ignores the system instruction
    let jsonString = responseText;
    if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7);
    if (jsonString.startsWith('```')) jsonString = jsonString.slice(3);
    if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3);
    
    const parsedData = JSON.parse(jsonString.trim());

    res.json(parsedData);
    
  } catch (error) {
    const errorDetails = {
      message: error.message,
      name: error.name,
      status: error.status,
      stack: error.stack,
      rawObject: error
    };
    require('fs').writeFileSync('./debug.json', JSON.stringify(errorDetails, null, 2));
    
    console.error('--- CHART DECODER ERROR CAUGHT ---');
    console.error(error.message);
    
    res.status(500).json({
      error: 'Failed to decode chart',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`SkyLens server running on port ${port}`);
});
