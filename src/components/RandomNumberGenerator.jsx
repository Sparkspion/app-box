import { useState, useEffect } from 'react';
import { Hash, RefreshCw, Sliders } from 'lucide-react';
import PokemonWidget from './PokemonWidget';
import HUDContainer from './HUDContainer';

const usePersistedState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const RandomNumberGenerator = () => {
  const [min, setMin] = usePersistedState('random-min', 1);
  const [max, setMax] = usePersistedState('random-max', 100);
  const [result, setResult] = useState(null);

  const handleInputChange = (setter, value) => {
    const num = Math.max(0, Math.min(9999, Number(value)));
    setter(num);
  };

  const generateRandom = () => {
    const minVal = Math.ceil(min);
    const maxVal = Math.floor(max);
    if (minVal > maxVal) {
      alert("Min cannot be greater than Max");
      return;
    }
    const random = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    setResult(random);
  };

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto min-h-screen">
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
      
      <HUDContainer title="Controls" icon={Sliders} color="bg-nintendo-blue">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Min (0-9999)</label>
              <input
                type="number"
                min="0"
                max="9999"
                value={min}
                onChange={(e) => handleInputChange(setMin, e.target.value)}
                className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:outline-none focus:border-nintendo-blue text-text-main font-bold transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Max (0-9999)</label>
              <input
                type="number"
                min="0"
                max="9999"
                value={max}
                onChange={(e) => handleInputChange(setMax, e.target.value)}
                className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:outline-none focus:border-nintendo-blue text-text-main font-bold transition-colors"
              />
            </div>
          </div>
          <button
            onClick={generateRandom}
            className="switch-btn switch-btn-blue w-full py-3 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            <RefreshCw size={16} />
            Generate
          </button>
        </div>
      </HUDContainer>

      <header className="mb-12">
        <h1 className="text-3xl font-pixel text-nintendo-blue mb-2 uppercase">Randomizer</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50">Entropy Engine Online</p>
      </header>

      {result === null ? (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
          <Hash size={80} className="mb-6" />
          <p className="font-pixel text-xs">Ready to Randomize</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Result Widget */}
          <div className="material-card flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-8 font-pixel opacity-50">Generator Output</p>
            <div className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-nintendo-blue to-cyan-500 drop-shadow-2xl leading-none">
              {result.toString().padStart(4, '0')}
            </div>
            <div className="mt-8 flex items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-tighter bg-bg-app px-4 py-2 rounded-full border border-border-main">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Verified Integer
            </div>
          </div>

          {/* Pokemon Widget */}
          <div className="material-card !p-0 overflow-hidden flex flex-col min-h-[400px]">
            <div className="bg-bg-app px-6 py-3 border-b-2 border-border-main flex justify-between items-center">
               <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Pokemon Data</span>
               <div className="w-2 h-2 rounded-full bg-nintendo-red" />
            </div>
            <div className="flex-1 p-6">
               <PokemonWidget dexNumber={result} />
            </div>
          </div>

          {/* Placeholder for future widgets */}
          <div className="material-card border-dashed border-4 border-border-main/50 bg-transparent flex flex-col items-center justify-center p-12 text-center min-h-[400px] opacity-30 hover:opacity-100 transition-opacity group cursor-help">
             <div className="w-16 h-16 rounded-full border-4 border-dashed border-border-main flex items-center justify-center mb-4 group-hover:rotate-180 transition-transform duration-700">
                <Sliders className="text-text-muted" size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Empty Slot</p>
             <p className="text-[8px] font-bold text-text-muted mt-2">Future Widget Data</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RandomNumberGenerator;
