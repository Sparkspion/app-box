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
    <div className="p-4 pb-20 min-h-screen">
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
      
      <HUDContainer title="Controls" icon={Sliders} color="bg-nintendo-blue">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Min</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:outline-none focus:border-nintendo-blue text-text-main font-bold transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Max</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
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

      <div className="max-w-2xl mx-auto pt-12 flex flex-col items-center justify-center">
        {result === null ? (
          <div className="text-center py-20 opacity-20">
            <Hash size={120} className="mx-auto mb-4" />
            <p className="font-pixel text-xs">Ready to Randomize</p>
          </div>
        ) : (
          <>
            <div className="text-center animate-in fade-in zoom-in duration-500 bg-bg-card/50 backdrop-blur-sm p-12 rounded-[3rem] border-2 border-dashed border-border-main w-full max-w-sm">
              <p className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-6 font-pixel">Result</p>
              <div className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-nintendo-blue to-cyan-500 drop-shadow-xl leading-none">
                {result}
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 mt-12">
               <PokemonWidget dexNumber={result} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RandomNumberGenerator;
