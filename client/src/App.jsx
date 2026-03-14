import React, { useState, useEffect, useRef } from 'react';
import { fetchWeather, searchAirports } from './api';
import AviationCard from './components/AviationCard';

function App() {
  const [icao, setIcao] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
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
    <div className="min-h-screen bg-aviation-black p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-12 flex items-center justify-between border-b border-aviation-emerald/30 pb-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tighter text-aviation-emerald drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            SKYLENS <span className="text-white opacity-90">INTELLIGENCE</span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase opacity-50">Advanced Flight Systems / HUD v1.0.4</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-xs font-mono">{new Date().toISOString()}</p>
          <p className="text-[10px] uppercase opacity-40">System Status: Nominal</p>
        </div>
      </header>

      <main className="max-w-xl mx-auto space-y-8">
        <form onSubmit={handleSearch} className="flex gap-2 relative">
          <div className="relative flex-1" ref={dropdownRef}>
            <input
              type="text"
              placeholder="ENTER ICAO, IATA OR CITY (e.g. Heathrow)"
              value={icao}
              onChange={(e) => {
                setIcao(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="hud-input w-full uppercase tracking-widest text-lg"
            />
            {showDropdown && searchResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-aviation-slate border border-aviation-emerald mt-1 max-h-60 overflow-y-auto rounded shadow-lg shadow-aviation-emerald/20 text-left">
                {searchResults.map((airport) => (
                  <li
                    key={airport.icao}
                    onClick={() => handleSelectAirport(airport.icao)}
                    className="px-4 py-2 hover:bg-aviation-emerald/20 cursor-pointer border-b border-aviation-emerald/10 last:border-0 text-sm"
                  >
                    <div className="font-bold text-aviation-emerald">{airport.icao} {airport.iata ? `/ ${airport.iata}` : ''}</div>
                    <div className="text-xs opacity-70 truncate">{airport.name} - {airport.city}, {airport.country}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="hud-button" disabled={loading}>
            {loading ? 'Scanning...' : 'Fetch'}
          </button>
        </form>

        {error && (
          <div className="bg-ifr-red/10 border border-ifr-red text-ifr-red p-3 rounded text-sm text-center animate-pulse">
            [ERROR] {error}
          </div>
        )}

        <AviationCard data={data} loading={loading} />

        {!data && !loading && !error && (
          <div className="hud-card flex flex-col items-center justify-center py-12 opacity-40 border-dashed">
            <div className="w-12 h-12 border-2 border-aviation-emerald/50 rounded-full mb-4 animate-ping"></div>
            <p className="text-sm tracking-widest uppercase">Awaiting Target Selection</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-4 left-0 right-0 text-center opacity-30 text-[10px] uppercase tracking-[0.5em]">
        Verified Flight Dispatch Control System
      </footer>
    </div>
  );
}

export default App;
