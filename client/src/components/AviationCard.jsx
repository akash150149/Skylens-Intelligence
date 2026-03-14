import React from 'react';

const AviationCard = ({ data, loading }) => {
  if (loading) return (
    <div className="hud-card animate-pulse border-aviation-emerald/50">
      <div className="h-4 bg-aviation-emerald/20 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-aviation-emerald/20 rounded w-1/2"></div>
    </div>
  );

  if (!data) return null;

  const categoryColors = {
    VFR: 'border-vfr-green text-vfr-green shadow-[0_0_15px_rgba(5,150,105,0.4)]',
    MVFR: 'border-mvfr-blue text-mvfr-blue shadow-[0_0_15px_rgba(37,99,235,0.4)]',
    IFR: 'border-ifr-red text-ifr-red shadow-[0_0_15px_rgba(220,38,38,0.4)]',
    LIFR: 'border-lifr-purple text-lifr-purple shadow-[0_0_15px_rgba(147,51,234,0.4)]',
  };

  const statusColor = categoryColors[data.category] || 'border-aviation-emerald text-aviation-emerald';

  return (
    <div className={`hud-card border-2 mx-2 sm:mx-0 p-4 sm:p-6 ${statusColor}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">{data.icao}</h2>
          <p className="text-[10px] sm:text-xs opacity-70 uppercase">Weather Briefing</p>
        </div>
        <div className={`px-3 py-1 sm:py-1.5 rounded text-[10px] sm:text-xs font-bold bg-black/40 border border-current tracking-widest self-start sm:self-auto`}>
          {data.category}
        </div>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div>
          <label className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-50 block mb-1.5 sm:mb-2">Raw METAR</label>
          <p className="text-xs sm:text-sm font-mono bg-black/30 p-2 sm:p-3 rounded border border-aviation-emerald/10 break-words leading-relaxed">
            {data.raw}
          </p>
        </div>

        <div>
          <label className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-50 block mb-1.5 sm:mb-2">Dispatcher Analysis</label>
          <p className="text-[13px] sm:text-sm italic leading-relaxed opacity-90">
            "{data.brief}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-aviation-emerald/10">
          <div className="bg-black/20 p-2 sm:p-3 rounded">
            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-50 block mb-1">Wind</label>
            <span className="text-base sm:text-lg font-bold">{data.wind || '0'} <span className="text-xs font-normal opacity-70">KTS</span></span>
          </div>
          <div className="bg-black/20 p-2 sm:p-3 rounded">
            <label className="text-[9px] sm:text-[10px] uppercase tracking-widest opacity-50 block mb-1">Visibility</label>
            <span className="text-base sm:text-lg font-bold">{data.visibility || '10+'} <span className="text-xs font-normal opacity-70">SM</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviationCard;
