import { useState, useEffect } from 'react';
import { Hash, RefreshCw, Sliders, Zap, Power } from 'lucide-react';
import PokemonWidget from './PokemonWidget';
import HUDContainer from './HUDContainer';
import CoinFlipWidget from './CoinFlipWidget';

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

const DEFAULT_MIN = 1;
const DEFAULT_MAX = 100;

const RandomNumberGenerator = () => {
  const [min, setMin] = usePersistedState('random-min', DEFAULT_MIN);
  const [max, setMax] = usePersistedState('random-max', DEFAULT_MAX);
  const [result, setResult] = usePersistedState('random-last-result', null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync logic for persistence setting
  useEffect(() => {
    const shouldPersist = JSON.parse(localStorage.getItem('random-persist')) ?? true;
    if (!shouldPersist) {
      setResult(null);
    }
  }, [setResult]);

  const isDefault = min === DEFAULT_MIN && max === DEFAULT_MAX;

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
    
    setIsGenerating(true);
    setTimeout(() => {
      const random = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
      setResult(random);
      setIsGenerating(false);
    }, 300);
  };

  const WidgetHeader = ({ title, color }) => (
    <div className="bg-bg-app px-6 py-3 border-b-2 border-border-main flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{title}</span>
      <button 
        onClick={generateRandom}
        disabled={isGenerating}
        className={`p-1.5 rounded-lg hover:bg-bg-card transition-all ${color} ${isGenerating ? 'animate-spin opacity-50' : 'active:scale-90'}`}
      >
        <RefreshCw size={14} />
      </button>
    </div>
  );

  return (
    <div className="p-4 pb-40 max-w-6xl mx-auto min-h-screen relative">
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-x-720 { transform: rotateX(720deg); }
      `}</style>
      
      <HUDContainer title="Range" icon={Sliders} color="bg-nintendo-blue" defaultOpen={isDefault}>
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
          <p className="text-[8px] text-text-muted font-bold uppercase opacity-50 px-1 text-center">Adjust range parameters for the Entropy Engine</p>
        </div>
      </HUDContainer>

      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-pixel text-nintendo-blue mb-2 uppercase flex items-center gap-3">
            Randomizer
            {result !== null && <Zap size={20} className="text-yellow-400 animate-pulse" />}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50">Entropy Engine Online</p>
            <span className="text-[10px] font-black text-nintendo-blue bg-nintendo-blue/10 px-2 py-0.5 rounded-full border border-nintendo-blue/20 tabular-nums">
              {min} - {max}
            </span>
          </div>
        </div>

        {result !== null && (
          <button
            onClick={generateRandom}
            disabled={isGenerating}
            className={`switch-btn switch-btn-blue min-w-[200px] flex items-center justify-center gap-3 group transition-all hidden md:flex ${isGenerating ? 'scale-95 opacity-80' : 'hover:scale-105 active:scale-95'}`}
          >
            <RefreshCw size={18} className={`${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="uppercase tracking-[0.2em] text-sm">Resync</span>
          </button>
        )}
      </header>

      {result === null ? (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-700">
          <div className="material-card p-12 flex flex-col items-center text-center max-w-md w-full border-dashed">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-nintendo-blue/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative p-8 bg-bg-app rounded-full border-2 border-border-main">
                <Hash size={64} className="text-text-muted opacity-20" />
              </div>
            </div>
            <h2 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2">Entropy Engine Offline</h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-10 opacity-60">System requires manual initialization</p>
            
            <button
              onClick={generateRandom}
              disabled={isGenerating}
              className={`switch-btn switch-btn-blue w-full py-4 flex items-center justify-center gap-4 group ${isGenerating ? 'animate-pulse' : ''}`}
            >
              <Power size={20} className={isGenerating ? 'animate-spin' : ''} />
              <span className="uppercase tracking-[0.2em] font-black">Initialize Sync</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Result Widget */}
            <div className="material-card !p-0 overflow-hidden flex flex-col min-h-[400px]">
              <WidgetHeader title="Output Module" color="text-nintendo-blue" />
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity" 
                     style={{ backgroundImage: 'radial-gradient(#00A0E4 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                
                <div className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-nintendo-blue to-cyan-500 drop-shadow-2xl leading-none relative z-10 tabular-nums select-none transition-all duration-300 group-hover:scale-110">
                  {result.toString().padStart(4, '0')}
                </div>
                <div className="mt-8 flex items-center gap-2 text-text-muted text-[10px] font-bold uppercase tracking-tighter bg-bg-app px-4 py-2 rounded-full border border-border-main relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Integer
                </div>
              </div>
            </div>

            {/* Pokemon Widget */}
            <div className="material-card !p-0 overflow-hidden flex flex-col min-h-[400px]">
              <WidgetHeader title="Pokemon Data" color="text-nintendo-red" />
              <div className="flex-1 p-6">
                 <PokemonWidget dexNumber={result} />
              </div>
            </div>

            {/* Coin Flip Widget */}
            <div className="material-card !p-0 overflow-hidden flex flex-col min-h-[400px]">
               <WidgetHeader title="Coin Oracle" color="text-yellow-500" />
               <div className="flex-1 p-6">
                  <CoinFlipWidget seed={result} />
               </div>
            </div>
          </div>

          {/* Floating Action Button for Mobile Resync */}
          <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[60] md:hidden">
            <button
              onClick={generateRandom}
              disabled={isGenerating}
              className={`w-16 h-16 rounded-full bg-nintendo-blue text-white shadow-2xl flex items-center justify-center transition-all active:scale-90 border-4 border-white/20 backdrop-blur-xl ${isGenerating ? 'animate-pulse' : ''}`}
            >
              <RefreshCw size={24} className={isGenerating ? 'animate-spin' : ''} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RandomNumberGenerator;
