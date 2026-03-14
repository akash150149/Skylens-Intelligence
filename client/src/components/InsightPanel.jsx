import React from 'react';

const InsightPanel = ({ chartData }) => {
  if (!chartData) {
    return (
      <div className="hud-card flex flex-col items-center justify-center h-full min-h-[300px] opacity-40">
        <h2 className="w-full text-left text-xs tracking-[0.2em] uppercase absolute top-4 left-4">Module C // Insight Panel</h2>
        <div className="w-12 h-12 border-2 border-aviation-emerald/50 rounded flex items-center justify-center mb-4">
           <span className="text-[10px] uppercase">No Data</span>
        </div>
        <p className="text-xs uppercase tracking-widest">Awaiting Chart Scan</p>
      </div>
    );
  }

  // Help normalize dynamic JSON keys from Gemini
  const getValue = (keyName) => {
     // Find exactly matching key or similar key
     const keys = Object.keys(chartData);
     const matchingKey = keys.find(k => k.toLowerCase().includes(keyName.toLowerCase()));
     return matchingKey ? chartData[matchingKey] : 'UNAVAILABLE';
  };

  const identity = getValue('Identity') || getValue('Airport');
  const frequencies = getValue('Frequencies') || getValue('Communication');
  const altitudes = getValue('Altitudes') || getValue('Critical');
  const notes = getValue('Notes') || getValue('Special');

  return (
    <div className="hud-card flex flex-col h-full overflow-y-auto">
      <h2 className="w-full text-left text-xs tracking-[0.2em] opacity-70 uppercase mb-4 border-b border-aviation-emerald/30 pb-2">Module C // Insight Panel</h2>
      
      <div className="space-y-6">
        <div>
           <div className="text-[10px] text-aviation-emerald/60 uppercase tracking-widest mb-1">Target Identity</div>
           <div className="text-xl font-bold tracking-widest crt-glow">
              {typeof identity === 'object' ? JSON.stringify(identity) : identity}
           </div>
        </div>

        <div>
           <div className="text-[10px] text-aviation-emerald/60 uppercase tracking-widest mb-2 border-b border-aviation-emerald/10 pb-1">Communication Frequencies</div>
           <div className="bg-black/40 p-3 rounded border border-aviation-emerald/20">
             {typeof frequencies === 'object' ? (
                <ul className="space-y-1">
                   {Object.entries(frequencies).map(([k, v]) => (
                     <li key={k} className="flex justify-between text-xs tracking-wider gap-4">
                       <span className="opacity-70 uppercase truncate">{k}:</span>
                       <span className="font-bold text-right break-words">{typeof v === 'object' && v !== null ? JSON.stringify(v) : v}</span>
                     </li>
                   ))}
                </ul>
             ) : (
                <div className="text-sm font-mono tracking-wider">{frequencies}</div>
             )}
           </div>
        </div>

        <div>
           <div className="text-[10px] text-aviation-emerald/60 uppercase tracking-widest mb-2 border-b border-aviation-emerald/10 pb-1">Critical Altitudes</div>
           <div className="bg-black/40 p-3 rounded border border-aviation-emerald/20 text-sm tracking-wider font-mono">
             {typeof altitudes === 'object' ? (
                <ul className="space-y-1">
                   {Object.entries(altitudes).map(([k, v]) => (
                     <li key={k} className="flex justify-between text-xs tracking-wider gap-4">
                       <span className="opacity-70 uppercase truncate mr-2">{k}:</span>
                       <span className="font-bold text-right break-words">{typeof v === 'object' && v !== null ? JSON.stringify(v) : v}</span>
                     </li>
                   ))}
                </ul>
             ) : (
                <div className="text-sm font-mono tracking-wider">{altitudes}</div>
             )}
           </div>
        </div>

        <div>
           <div className="text-[10px] text-aviation-emerald/60 uppercase tracking-widest mb-1">Special Directives / NOTAMs</div>
           <div className="text-xs uppercase text-ifr-red leading-relaxed border-l-2 border-ifr-red pl-2 shadow-[inset_10px_0_10px_rgba(220,38,38,0.05)]">
              {typeof notes === 'object' ? JSON.stringify(notes) : notes}
           </div>
        </div>
      </div>
    </div>
  );
}

export default InsightPanel;
