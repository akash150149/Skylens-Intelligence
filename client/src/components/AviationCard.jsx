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
    <div className={`hud-card border-2 ${statusColor}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter">{data.icao}</h2>
          <p className="text-xs opacity-70 uppercase">Weather Briefing</p>
        </div>
        <div className={`px-3 py-1 rounded text-xs font-bold bg-black/40 border border-current`}>
          {data.category}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Raw METAR</label>
          <p className="text-sm font-mono bg-black/30 p-2 rounded border border-aviation-emerald/10">
            {data.raw}
          </p>
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Dispatcher Analysis</label>
          <p className="text-sm italic leading-relaxed">
            "{data.brief}"
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-aviation-emerald/10">
          <div>
            <label className="text-[10px] uppercase opacity-50 block">Wind</label>
            <span className="text-lg">{data.wind || '0'} KTS</span>
          </div>
          <div>
            <label className="text-[10px] uppercase opacity-50 block">Visibility</label>
            <span className="text-lg">{data.visibility || '10+'} SM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AviationCard;
