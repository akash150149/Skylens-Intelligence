import React, { useState, useEffect, useRef } from 'react';
import { fetchWeather, searchAirports } from './api';
import AviationCard from './components/AviationCard';
import ChartDeck from './components/ChartDeck';
import InsightPanel from './components/InsightPanel';

function App() {
  const [icao, setIcao] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chartData, setChartData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (icao.length >= 2 && showDropdown) {
        try {
          const results = await searchAirports(icao);
          setSearchResults(results);
        } catch (e) {
          console.error("Search failed", e);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [icao, showDropdown]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleSelectAirport = (selectedIcao) => {
    setIcao(selectedIcao);
    setShowDropdown(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!icao || icao.length < 3) return;
    
    setLoading(true);
    setError('');
    try {
      const weatherData = await fetchWeather(icao.toUpperCase());
      setData(weatherData);
    } catch (err) {
      setError('FAILED TO RETRIEVE TARGET DATA. VERIFY ICAO CODE.');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aviation-black p-4 md:p-6 flex flex-col items-center">
      <header className="w-full max-w-7xl mx-auto mb-6 flex flex-col md:flex-row items-center md:items-end justify-between border-b border-aviation-emerald/30 pb-4 text-center md:text-left gap-4 md:gap-0">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-aviation-emerald drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            SKYLENS <span className="text-white opacity-90">INTELLIGENCE</span>
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase opacity-50 mt-1 md:mt-0">Advanced Flight Systems / HUD v2.0.0</p>
        </div>
        <div className="text-center md:text-right hidden sm:block">
          <p className="text-[10px] md:text-xs font-mono opacity-80 crt-glow">{new Date().toISOString()}</p>
          <p className="text-[8px] md:text-[10px] uppercase opacity-40 mt-1 crt-glow">System Status: Nominal</p>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        
        {/* Left Column: Weather Deck (Module A) */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
           <div className="hud-card p-4 sm:p-6 mb-0">
             <h2 className="w-full text-left text-xs tracking-[0.2em] opacity-70 uppercase mb-4 border-b border-aviation-emerald/30 pb-2">Module A // Weather Deck</h2>
             <form onSubmit={handleSearch} className="flex flex-col gap-3 relative mb-4">
               <div className="relative flex-1" ref={dropdownRef}>
                 <input
                   type="text"
                   placeholder="ENTER ICAO / IATA"
                   value={icao}
                   onChange={(e) => {
                     setIcao(e.target.value);
                     setShowDropdown(true);
                   }}
                   onFocus={() => setShowDropdown(true)}
                   className="hud-input w-full uppercase tracking-widest text-sm"
                 />
                 {showDropdown && searchResults.length > 0 && (
                   <ul className="absolute z-20 w-full bg-aviation-slate/95 backdrop-blur-md border border-aviation-emerald mt-1 max-h-60 overflow-y-auto rounded shadow-[0_0_15px_rgba(16,185,129,0.2)] text-left">
                     {searchResults.map((airport) => (
                       <li
                         key={airport.icao}
                         onClick={() => handleSelectAirport(airport.icao)}
                         className="px-4 py-2 hover:bg-aviation-emerald/20 cursor-pointer border-b border-aviation-emerald/10 last:border-0 text-xs transition-colors"
                       >
                         <div className="font-bold text-aviation-emerald">{airport.icao} {airport.iata ? `/ ${airport.iata}` : ''}</div>
                         <div className="opacity-70 truncate mt-0.5">{airport.name} - {airport.city}</div>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
               <button type="submit" className="hud-button w-full py-2 text-xs" disabled={loading}>
                 {loading ? 'Scanning...' : 'Fetch'}
               </button>
             </form>

             {error && (
               <div className="bg-ifr-red/10 border border-ifr-red text-ifr-red p-2 rounded text-[10px] text-center animate-pulse crt-glow font-bold uppercase tracking-widest mb-4">
                 [ERROR] {error}
               </div>
             )}

             <AviationCard data={data} loading={loading} />

             {!data && !loading && !error && (
               <div className="flex flex-col items-center justify-center py-10 opacity-40 border-dashed border border-aviation-emerald/20 mt-4 h-[250px]">
                 <div className="w-8 h-8 border-2 border-aviation-emerald/50 rounded-full mb-3 animate-ping"></div>
                 <p className="text-[10px] tracking-widest uppercase text-center crt-glow">Awaiting Target Selection</p>
               </div>
             )}
           </div>
        </div>

        {/* Center Column: Chart Deck (Module B) */}
        <div className="lg:col-span-5 h-[400px] lg:h-auto">
           <ChartDeck onChartDecoded={setChartData} />
        </div>

        {/* Right Column: Insight Panel (Module C) */}
        <div className="lg:col-span-3 h-[500px] lg:h-auto">
           <InsightPanel chartData={chartData} />
        </div>

      </main>

      <footer className="w-full max-w-7xl mx-auto text-center opacity-30 text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] mt-8 pt-4 border-t border-aviation-emerald/10">
        Verified Flight Dispatch Control System • MERN Aviation HUD v2.0
      </footer>
    </div>
  );
}

export default App;
