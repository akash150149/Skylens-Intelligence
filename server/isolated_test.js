require('dotenv').config({ path: '../server/.env' });
const { GoogleGenAI } = require('@google/genai');

async function testGemini() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Decode this METAR: KJFK 140551Z',
      config: {
        systemInstruction: "You are a Senior Flight Dispatcher."
      }
    });
    console.log(result.text);
  } catch (error) {
    console.error('--- ISOLATED ERROR ---');
    console.error(error);
  }
}
testGemini();
