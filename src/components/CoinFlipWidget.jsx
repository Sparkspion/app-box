import { useState, useEffect, useMemo } from 'react';
import { Coins, Trophy, History, Settings2 } from 'lucide-react';

const CoinFlipWidget = ({ seed }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null); // 'Heads' or 'Tails'
  const [mode, setBestOfMode] = useState(1); // 1, 3, 5
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({ heads: 0, tails: 0 });

  // Use the seed from parent RNG to trigger a flip
  useEffect(() => {
    if (seed !== null && seed !== undefined) {
      handleFlip(seed);
    }
  }, [seed]);

  const handleFlip = (entropy) => {
    setIsFlipping(true);
    setResult(null);

    // Simulate physics delay
    setTimeout(() => {
      // Deterministic flip based on entropy seed
      // Even seed = Heads, Odd seed = Tails
      const flipResult = entropy % 2 === 0 ? 'Heads' : 'Tails';
      
      setResult(flipResult);
      setIsFlipping(false);
      
      const newHistory = [{ result: flipResult, time: Date.now() }, ...history].slice(0, 5);
      setHistory(newHistory);

      setScore(prev => ({
        ...prev,
        [flipResult.toLowerCase()]: prev[flipResult.toLowerCase()] + 1
      }));
    }, 600);
  };

  const resetStats = () => {
    setScore({ heads: 0, tails: 0 });
    setHistory([]);
    setResult(null);
  };

  const winner = useMemo(() => {
    if (mode === 1) return null;
    const threshold = Math.ceil(mode / 2);
    if (score.heads >= threshold) return 'Heads';
    if (score.tails >= threshold) return 'Tails';
    return null;
  }, [score, mode]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-nintendo-blue/10 rounded-lg text-nintendo-blue">
            <Coins size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Coin Oracle</span>
        </div>
        
        <select 
          value={mode} 
          onChange={(e) => { setBestOfMode(Number(e.target.value)); resetStats(); }}
          className="bg-bg-app border border-border-main rounded-lg text-[9px] font-black uppercase px-2 py-1 outline-none focus:border-nintendo-blue"
        >
          <option value={1}>Single</option>
          <option value={3}>Best of 3</option>
          <option value={5}>Best of 5</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Coin Visual */}
        <div className={`
          w-24 h-24 rounded-full border-4 border-yellow-500 bg-yellow-400 
          shadow-[inset_0_-4px_0_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.1)]
          flex items-center justify-center transition-all duration-500 relative preserve-3d
          ${isFlipping ? 'animate-bounce scale-110 rotate-x-[720deg]' : ''}
          ${!isFlipping && result === 'Tails' ? 'rotate-y-180' : ''}
        `}>
          <div className="backface-hidden absolute inset-0 flex items-center justify-center font-black text-yellow-800 text-3xl">H</div>
          <div className="backface-hidden absolute inset-0 flex items-center justify-center font-black text-yellow-800 text-3xl rotate-y-180">T</div>
        </div>

        {/* Result Overlay */}
        <div className={`mt-8 text-center transition-all duration-300 ${result && !isFlipping ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
           <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Result</p>
           <p className={`text-2xl font-black ${result === 'Heads' ? 'text-nintendo-red' : 'text-nintendo-blue'}`}>{result}</p>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <div className="absolute inset-0 bg-bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl animate-in zoom-in duration-300">
             <Trophy size={48} className="text-yellow-500 mb-4 animate-bounce" />
             <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Series Winner</p>
             <p className="text-3xl font-black text-text-main mb-6">{winner} wins!</p>
             <button 
               onClick={resetStats}
               className="px-6 py-2 bg-text-main text-bg-app rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-main transition-colors"
             >
               Rematch
             </button>
          </div>
        )}
      </div>

      {/* Scoreboard for Best of Modes */}
      {mode > 1 && (
        <div className="mt-6 flex justify-around bg-bg-app p-3 rounded-2xl border border-border-main">
           <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Heads</p>
              <p className="text-xl font-black text-nintendo-red">{score.heads}</p>
           </div>
           <div className="w-[1px] bg-border-main" />
           <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Tails</p>
              <p className="text-xl font-black text-nintendo-blue">{score.tails}</p>
           </div>
        </div>
      )}

      {/* Recent Log */}
      <div className="mt-6 flex items-center gap-2 opacity-40 overflow-x-auto scrollbar-hide">
         <History size={12} className="flex-shrink-0" />
         {history.map((h, i) => (
           <span key={i} className={`text-[8px] font-bold uppercase whitespace-nowrap ${h.result === 'Heads' ? 'text-nintendo-red' : 'text-nintendo-blue'}`}>
             {h.result[0]}
           </span>
         ))}
      </div>
    </div>
  );
};

export default CoinFlipWidget;
