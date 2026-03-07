import { useState, useEffect, useMemo } from 'react';
import { Coins, Trophy, History } from 'lucide-react';

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

    // Physics timing
    setTimeout(() => {
      const flipResult = entropy % 2 === 0 ? 'Heads' : 'Tails';
      
      setResult(flipResult);
      setIsFlipping(false);
      
      const newHistory = [{ result: flipResult, time: Date.now() }, ...history].slice(0, 5);
      setHistory(newHistory);

      setScore(prev => ({
        ...prev,
        [flipResult.toLowerCase()]: prev[flipResult.toLowerCase()] + 1
      }));
    }, 1000); // Longer duration for the enhanced animation
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
      <style>{`
        @keyframes coin-flip-heads {
          0% { transform: rotateX(0); scale: 1; }
          50% { transform: rotateX(1080deg); scale: 1.5; }
          100% { transform: rotateX(2160deg); scale: 1; }
        }
        @keyframes coin-flip-tails {
          0% { transform: rotateX(0); scale: 1; }
          50% { transform: rotateX(1080deg); scale: 1.5; }
          100% { transform: rotateX(2340deg); scale: 1; }
        }
        .animate-flip-heads { animation: coin-flip-heads 1s ease-out forwards; }
        .animate-flip-tails { animation: coin-flip-tails 1s ease-out forwards; }
      `}</style>

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
          className="bg-bg-app border border-border-main rounded-lg text-[9px] font-black uppercase px-2 py-1 outline-none focus:border-nintendo-blue cursor-pointer"
        >
          <option value={1}>Single</option>
          <option value={3}>Best of 3</option>
          <option value={5}>Best of 5</option>
        </select>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Coin Visual Container */}
        <div className="perspective-1000">
          <div className={`
            w-28 h-24 rounded-full relative preserve-3d transition-transform duration-500
            ${isFlipping ? (seed % 2 === 0 ? 'animate-flip-heads' : 'animate-flip-tails') : ''}
            ${!isFlipping && result === 'Tails' ? 'rotate-x-180' : ''}
          `}>
            {/* Heads Face */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center rounded-full border-4 border-yellow-600 bg-linear-to-br from-yellow-300 via-yellow-400 to-yellow-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)]">
              <div className="w-16 h-16 rounded-full border-2 border-yellow-600/30 flex items-center justify-center">
                <span className="font-black text-yellow-800 text-4xl drop-shadow-sm select-none">H</span>
              </div>
            </div>
            {/* Tails Face */}
            <div className="absolute inset-0 backface-hidden flex items-center justify-center rounded-full border-4 border-yellow-600 bg-linear-to-br from-yellow-300 via-yellow-400 to-yellow-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.2)] rotate-x-180">
              <div className="w-16 h-16 rounded-full border-2 border-yellow-600/30 flex items-center justify-center">
                <span className="font-black text-yellow-800 text-4xl drop-shadow-sm select-none">T</span>
              </div>
            </div>
          </div>
        </div>

        {/* Result Text */}
        <div className={`mt-12 text-center transition-all duration-300 ${result && !isFlipping ? 'opacity-100 translate-y-0 scale-110' : 'opacity-0 translate-y-2 scale-90'}`}>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Outcome</p>
           <p className={`text-3xl font-black italic tracking-tighter ${result === 'Heads' ? 'text-nintendo-red' : 'text-nintendo-blue'}`}>{result}</p>
        </div>

        {/* Winner Announcement */}
        {winner && (
          <div className="absolute inset-0 bg-bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-2xl animate-in zoom-in duration-300">
             <div className="p-4 bg-yellow-500/10 rounded-full mb-4">
                <Trophy size={48} className="text-yellow-500 animate-bounce" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Series Winner</p>
             <p className="text-3xl font-black text-text-main mb-6">{winner} wins!</p>
             <button 
               onClick={resetStats}
               className="switch-btn switch-btn-blue px-8 py-2 text-[10px] font-black uppercase tracking-[0.2em]"
             >
               Rematch
             </button>
          </div>
        )}
      </div>

      {/* Scoreboard */}
      {mode > 1 && (
        <div className="mt-6 grid grid-cols-2 bg-bg-app p-4 rounded-2xl border border-border-main relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-nintendo-red via-transparent to-nintendo-blue opacity-20" />
           <div className="text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Heads</p>
              <p className="text-2xl font-black text-nintendo-red">{score.heads}</p>
           </div>
           <div className="text-center border-l border-border-main">
              <p className="text-[8px] font-black uppercase tracking-widest text-text-muted mb-1">Tails</p>
              <p className="text-2xl font-black text-nintendo-blue">{score.tails}</p>
           </div>
        </div>
      )}

      {/* History Log */}
      <div className="mt-6 flex items-center gap-3 opacity-40 group hover:opacity-100 transition-opacity overflow-x-auto scrollbar-none">
         <History size={12} className="flex-shrink-0" />
         <div className="flex gap-2">
           {history.map((h, i) => (
             <span key={i} className={`text-[9px] font-black uppercase w-5 h-5 flex items-center justify-center rounded-md border border-current ${h.result === 'Heads' ? 'text-nintendo-red' : 'text-nintendo-blue'}`}>
               {h.result[0]}
             </span>
           ))}
         </div>
      </div>
    </div>
  );
};

export default CoinFlipWidget;
