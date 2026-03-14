import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { decodeChart } from '../api';

const ChartDeck = ({ onChartDecoded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('chart', file);

    try {
      const rawData = await decodeChart(formData);
      onChartDecoded(rawData); // We pass it back to App.js

    } catch (err) {
      console.error(err);
      setError('FAILED TO DECODE CHART. CHECK IMAGE CLARITY.');
    } finally {
      setLoading(false);
    }
  }, [onChartDecoded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  return (
    <div className="hud-card flex flex-col items-center justify-center p-6 border-dashed border-aviation-emerald/50 h-full min-h-[300px]">
      <h2 className="w-full text-left text-xs tracking-[0.2em] opacity-70 uppercase mb-4">Module B // Chart Deck</h2>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
           <div className="w-16 h-16 border-4 border-t-aviation-emerald border-r-aviation-emerald border-b-transparent border-l-transparent rounded-full animate-spin shadow-hud-glow"></div>
           <p className="text-xl font-bold tracking-widest text-aviation-emerald crt-glow">SCANNING FREQUENCIES...</p>
        </div>
      ) : (
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center w-full h-full cursor-pointer p-8 rounded border-2 border-transparent transition-all duration-300 ${
            isDragActive ? 'bg-aviation-emerald/20 border-aviation-emerald shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]' : 'hover:bg-aviation-emerald/5'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className={`w-12 h-12 mb-4 transition-colors ${isDragActive ? 'text-aviation-emerald crt-glow' : 'text-aviation-emerald/50'}`} />
          {isDragActive ? (
            <p className="text-lg font-bold tracking-widest text-aviation-emerald crt-glow">INITIALIZING UPLOAD SEQUENCE...</p>
          ) : (
            <div className="text-center">
              <p className="text-sm tracking-widest uppercase mb-2">DRAG & DROP CHART FILE</p>
              <p className="text-[10px] opacity-50 uppercase tracking-widest">or click to select (JPG, PNG, PDF)</p>
            </div>
          )}
        </div>
      )}

      {error && (
         <div className="mt-4 w-full bg-ifr-red/10 border border-ifr-red text-ifr-red p-3 rounded text-sm text-center font-bold flex items-center justify-center gap-2">
            <AlertCircle size={16} /> 
            [ERROR] {error}
         </div>
      )}
    </div>
  );
};

export default ChartDeck;
