import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const PokemonWidget = ({ dexNumber }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsFlipped(false);
    setPokemon(null);
    setError(null);
  }, [dexNumber]);

  const fetchPokemon = async () => {
    if (!dexNumber || dexNumber < 1 || dexNumber > 1025) {
      setError("Invalid Dex # (1-1025)");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${dexNumber}`);
      if (!response.ok) throw new Error("Pokemon not found");
      const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPokemon({
        name: data.name,
        image: data.sprites.other['official-artwork'].front_default,
        types: data.types.map(t => t.type.name),
        id: data.id
      });
      setIsFlipped(true);
    } catch (err) {
      setError("Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  if (!dexNumber) return null;

  return (
    <div className="mt-12 flex flex-col items-center">
      <div 
        onClick={!loading && !isFlipped ? fetchPokemon : undefined}
        className={`relative w-64 h-80 transition-all duration-700 preserve-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front: Pokeball State */}
        <div className="absolute inset-0 backface-hidden bg-slate-800 rounded-2xl border-4 border-slate-700 flex flex-col items-center justify-center p-6 shadow-xl overflow-hidden">
          <div className={`relative transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:scale-110'}`}>
             <PokeballIcon className="w-32 h-32 drop-shadow-lg" />
          </div>
          
          <p className="mt-8 text-slate-300 font-bold text-center tracking-wider uppercase text-xs">
            {loading ? 'Catching...' : 'Tap to reveal'}
          </p>
          <p className="mt-1 text-3xl font-black text-slate-600">#{dexNumber}</p>
          
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-full">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Back: Pokemon Reveal */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-b from-slate-700 to-slate-800 rounded-2xl border-4 border-slate-600 flex flex-col items-center justify-center p-6 shadow-xl">
          {pokemon && (
            <>
              <div className="absolute top-4 left-4 text-slate-500 font-mono text-xs font-bold">
                NO. {pokemon.id.toString().padStart(4, '0')}
              </div>
              <img 
                src={pokemon.image} 
                alt={pokemon.name}
                className="w-40 h-40 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
              <h2 className="mt-4 text-2xl font-black capitalize tracking-tight text-white">
                {pokemon.name}
              </h2>
              <div className="mt-3 flex gap-2">
                {pokemon.types.map(type => (
                  <span 
                    key={type}
                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900/50 text-slate-300 border border-slate-600"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {isFlipped && (
        <button 
          onClick={() => setIsFlipped(false)}
          className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors"
        >
          ← Release Pokemon
        </button>
      )}
    </div>
  );
};

const PokeballIcon = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Bottom half white */}
    <circle cx="50" cy="50" r="48" fill="#f1f5f9" stroke="#1e293b" strokeWidth="6" />
    {/* Top half red */}
    <path d="M2 50 A 48 48 0 0 1 98 50 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="6" />
    {/* Middle line shadow */}
    <rect x="2" y="46" width="96" height="8" fill="#1e293b" />
    {/* Center button assembly */}
    <circle cx="50" cy="50" r="16" fill="#1e293b" />
    <circle cx="50" cy="50" r="10" fill="white" stroke="#1e293b" strokeWidth="2" />
    <circle cx="50" cy="50" r="6" fill="white" stroke="#cbd5e1" strokeWidth="1" />
  </svg>
);

export default PokemonWidget;
