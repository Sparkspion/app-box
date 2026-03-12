import { useState, useEffect } from 'react';
import { AlertCircle, WifiOff } from 'lucide-react';
import { ENDPOINTS } from '../utils/network';

const TYPE_COLORS = {
  normal: 'bg-[#A8A77A]', fire: 'bg-[#EE8130]', water: 'bg-[#6390F0]', electric: 'bg-[#F7D02C]',
  grass: 'bg-[#7AC74C]', ice: 'bg-[#96D9D6]', fighting: 'bg-[#C22E28]', poison: 'bg-[#A33EA1]',
  ground: 'bg-[#E2BF65]', flying: 'bg-[#A98FF3]', psychic: 'bg-[#F95587]', bug: 'bg-[#A6B91A]',
  rock: 'bg-[#B6A136]', ghost: 'bg-[#735797]', dragon: 'bg-[#6F35FC]', steel: 'bg-[#B7B7CE]',
  fairy: 'bg-[#D685AD]', dark: 'bg-[#705746]'
};

const PokemonWidget = ({ dexNumber }) => {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      const [pRes, sRes] = await Promise.all([
        fetch(ENDPOINTS.POKEMON.DETAIL(dexNumber)),
        fetch(`${ENDPOINTS.POKEMON.BASE}/pokemon-species/${dexNumber}`)
      ]);
      
      if (!pRes.ok) throw new Error("Pokemon not found");
      const pData = await pRes.json();
      const sData = await sRes.json();
      
      const speciesName = sData.genera.find(g => g.language.name === 'en')?.genus || "";
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPokemon({
        name: pData.name,
        image: pData.sprites.other['official-artwork'].front_default,
        types: pData.types.map(t => t.type.name),
        id: pData.id,
        species: speciesName
      });
      setIsFlipped(true);
    } catch (err) {
      if (!navigator.onLine) {
        setError("Offline: Not Cached");
      } else {
        setError("Failed to fetch");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!dexNumber) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
      <div 
        onClick={!loading && !isFlipped ? fetchPokemon : undefined}
        className={`relative w-full max-w-[280px] aspect-[4/5] transition-all duration-700 preserve-3d cursor-pointer group ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front: Pokeball State */}
        <div className="absolute inset-0 backface-hidden bg-bg-card rounded-[2.5rem] border-4 border-border-main flex flex-col items-center justify-center p-6 shadow-xl overflow-hidden">
          <div className={`relative transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:scale-110'}`}>
             <PokeballIcon className="w-32 h-32 drop-shadow-lg" />
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-text-muted font-bold text-center tracking-wider uppercase text-[10px]">
              {loading ? 'Catching...' : 'Tap to reveal'}
            </p>
            {isOffline && (
              <div className="flex items-center gap-1 text-accent-main animate-pulse">
                <WifiOff size={10} />
                <span className="text-[8px] font-black uppercase">Offline Mode</span>
              </div>
            )}
          </div>
          <p className="mt-1 text-2xl font-black text-text-muted/30">DEX #{dexNumber.toString().padStart(4, '0')}</p>
          
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-400 text-[10px] bg-red-400/10 px-3 py-1 rounded-full font-bold">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Back: Pokemon Reveal */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-linear-to-b from-bg-card to-bg-app rounded-[2.5rem] border-4 border-border-main flex flex-col items-center justify-center p-6 shadow-xl">
          {pokemon && (
            <>
              <div className="absolute top-6 left-6 text-text-muted font-pixel text-[8px]">
                #{pokemon.id.toString().padStart(4, '0')}
              </div>
              <img 
                src={pokemon.image} 
                alt={pokemon.name}
                className="w-36 h-36 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />
              <div className="text-center mt-2">
                <h2 className="text-xl font-black capitalize tracking-tight text-text-main">
                  {pokemon.name}
                </h2>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1 italic">
                  {pokemon.species}
                </p>
              </div>
              <div className="mt-4 flex gap-2">
                {pokemon.types.map(type => (
                  <span 
                    key={type}
                    className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-black/10 shadow-sm ${TYPE_COLORS[type] || 'bg-slate-500'}`}
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
          className="mt-6 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-nintendo-red transition-colors"
        >
          ← Release
        </button>
      )}
    </div>
  );
};

const PokeballIcon = ({ className }) => (
  <svg viewBox="-4 -4 108 108" className={className}>
    <circle cx="50" cy="50" r="48" fill="#f1f5f9" stroke="#1e293b" strokeWidth="6" />
    <path d="M2 50 A 48 48 0 0 1 98 50 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="6" />
    <rect x="2" y="46" width="96" height="8" fill="#1e293b" />
    <circle cx="50" cy="50" r="16" fill="#1e293b" />
    <circle cx="50" cy="50" r="10" fill="white" stroke="#1e293b" strokeWidth="2" />
    <circle cx="50" cy="50" r="6" fill="white" stroke="#cbd5e1" strokeWidth="1" />
  </svg>
);

export default PokemonWidget;
