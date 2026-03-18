# SkyLens Intelligence

**Advanced Flight Systems / HUD v2.0.0**

SkyLens Intelligence is a modern web application designed to act as a comprehensive aviation dashboard for pilots and flight dispatchers. It provides real-time weather analysis, AI-generated pilot briefings, and automated aviation chart decoding through the power of Google's Gemini Vision AI.

## 🚀 Features

### Module A: Weather Deck
- **Airport Search:** Fast, fuzzy search for global airports using ICAO, IATA, airport name, or city.
- **Flight Category Decoding:** Automatically determines if conditions are VFR, MVFR, IFR, or LIFR.
- **METAR Analysis:** Fetches live METAR data and translates it into a human-readable professional pilot briefing generated dynamically by Gemini AI.

### Module B: Chart Deck
- **Vision AI Chart Decoding:** Upload aviation charts (e.g., approach plates, SIDs, STARs).
- **Automated Extraction:** Extracts critical data such as Airport Identity, Communication Frequencies, Critical Altitudes (MSA/Decision Height), and Special Notes directly from the image using the `gemini-3-flash-preview` model.

### Module C: Insight Panel
- Displays the structured JSON output from the Chart Deck in an organized, easy-to-read format.

## 🛠️ Tech Stack

**Frontend (Client)**
- **React.js** (v18)
- **Vite** for fast bundling
- **Tailwind CSS** for responsive, modern HUD styling
- **Axios** for API communication
- **Lucide React** for iconography
- **React Dropzone** for drag-and-drop file uploads

**Backend (Server)**
- **Node.js & Express.js**
- **@google/generative-ai** (Gemini API SDK for AI briefings & Vision)
- **Multer** for in-memory multipart/form-data upload handling
- **Axios / Node-fetch** for fetching raw weather data from CheckWX

## ⚙️ Prerequisites

To run this application, you will need:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- **Gemini API Key:** Get one from [Google AI Studio](https://aistudio.google.com/)
- **CheckWX API Key:** Get one from [CheckWX](https://www.checkwxapi.com/)

## 🏗️ Installation & Setup

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd Aerolens
\`\`\`

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and configure environment variables.
\`\`\`bash
cd server
npm install
\`\`\`

Create a `.env` file in the `server` folder (you can copy `.env.example` if it exists):
\`\`\`env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CHECKWX_API_KEY=your_checkwx_api_key_here
\`\`\`

Start the server:
\`\`\`bash
node server.js
\`\`\`
*(The server will run on `http://localhost:5000`)*

### 3. Frontend Setup
Open a new terminal window, navigate to the `client` directory, and install dependencies.
\`\`\`bash
cd ../client
npm install
\`\`\`

Start the development server:
\`\`\`bash
npm run dev
\`\`\`
*(The client will typically run on `http://localhost:5173`)*

## 📂 Project Structure

\`\`\`
Aerolens/
│
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components (AviationCard, ChartDeck, InsightPanel)
│   │   ├── App.jsx         # Main application component
│   │   ├── index.css       # Global styles & Tailwind config
│   │   └── api.js          # API service calls
│   └── package.json        
│
└── server/                 # Express Backend
    ├── server.js           # Main Express server, API endpoints, Gemini logic
    ├── airports.json       # Local database for airport search
    ├── .env                # API Keys & Configuration (Create this)
    └── package.json
\`\`\`

## 🔌 API Endpoints
- \`GET /api/airports/search?q={query}\` - Searches local `airports.json` for matches.
- \`GET /api/weather/:icao\` - Fetches METAR from CheckWX and uses Gemini to generate a pilot briefing.
- \`POST /api/decode-chart\` - Accepts a multipart form data with a `chart` image; returns extracted data as JSON using Gemini Vision.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
This project is for educational and demonstrative purposes in aviation tech.
