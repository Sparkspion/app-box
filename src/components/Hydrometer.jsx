import { useEffect } from 'react';
import { RotateCcw, Settings2, GlassWater, Target, Plus, Trash2 } from 'lucide-react';
import HUDContainer from './HUDContainer';
import usePersistedState from '../hooks/usePersistedState';

const DEFAULT_GOAL = 2000;

const Hydrometer = () => {
  // Persistence
  const [goal, setGoal] = usePersistedState('h2o-goal', DEFAULT_GOAL);
  const [currentIntake, setCurrentIntake] = usePersistedState('h2o-current', 0);
  const [lastDate, setLastDate] = usePersistedState('h2o-last-date', new Date().toDateString());
  const [lastDrinkTime, setLastDrinkTime] = usePersistedState('h2o-last-time', Date.now());
  const [containers, setContainers] = usePersistedState('h2o-containers', [
    { id: 1, name: 'Glass', size: 250 },
  ]);

  // Daily Reset Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastDate !== today) {
      setCurrentIntake(0);
      setLastDate(today);
      setLastDrinkTime(Date.now());
    }
  }, [lastDate, setCurrentIntake, setLastDate, setLastDrinkTime]);

  const addWater = (amount) => {
    setCurrentIntake(prev => Math.min(goal * 2, prev + amount));
    setLastDrinkTime(Date.now());
  };

  const removeContainer = (id) => {
    if (containers.length > 1) {
      setContainers(containers.filter(c => c.id !== id));
    }
  };

  const addContainer = () => {
    const newId = Math.max(0, ...containers.map(c => c.id)) + 1;
    setContainers([...containers, { id: newId, name: 'New Vessel', size: 250 }]);
  };

  const updateContainer = (id, field, value) => {
    setContainers(containers.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const percentage = Math.min(100, Math.round((currentIntake / goal) * 100));
  const isDefault = goal === DEFAULT_GOAL;

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto min-h-screen">
      <HUDContainer title="Calibration" icon={Settings2} color="bg-sky-500" defaultOpen={isDefault}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Daily Target (ml)</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Math.max(100, Number(e.target.value)))}
              className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:outline-none focus:border-sky-500 text-text-main font-bold transition-colors"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Vessel Configuration</label>
            {containers.map((c, idx) => (
              <div key={c.id} className="flex gap-2 items-center bg-bg-app border border-border-main p-2 rounded-xl group">
                <input 
                  value={c.name}
                  onChange={(e) => updateContainer(c.id, 'name', e.target.value)}
                  className="bg-transparent text-[10px] font-bold uppercase flex-1 outline-none"
                  placeholder="Vessel Name"
                />
                <input 
                  type="number"
                  value={c.size}
                  onChange={(e) => updateContainer(c.id, 'size', Math.max(1, Number(e.target.value)))}
                  className="bg-black/10 w-16 text-[10px] font-bold p-1 rounded text-center outline-none"
                />
                <button 
                  onClick={() => removeContainer(c.id)}
                  disabled={containers.length <= 1}
                  className="p-1 text-nintendo-red opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button 
              onClick={addContainer}
              className="w-full py-2 border-2 border-dashed border-border-main rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:border-sky-500 transition-colors"
            >
              <Plus size={14} /> Register Vessel
            </button>
          </div>
          
          <button
            onClick={() => { if(confirm("Reset progress?")) { setCurrentIntake(0); } }}
            className="switch-btn switch-btn-red w-full py-2 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <RotateCcw size={14} /> Manual Reset
          </button>
        </div>
      </HUDContainer>

      <header className="mb-12">
        <h1 className="text-4xl font-pixel text-sky-500 mb-2 uppercase italic tracking-tighter">Hydrometer</h1>
        <div className="flex items-center gap-4">
           <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50">H2O Core Synchronization Active</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Main Meter View */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="material-card w-full aspect-square max-w-[400px] relative overflow-hidden flex flex-col items-center justify-center border-sky-500/20 bg-bg-app/30 group">
            
            {/* HUD Scan Grid (Background) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Liquid Animation */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-linear-to-t from-sky-600 to-sky-400 transition-all duration-1000 ease-out"
              style={{ height: `${percentage}%` }}
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[length:100%_4px] animate-scanline" 
                   style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)' }} />
              
              {percentage > 0 && (
                <div className="absolute top-0 left-0 w-full overflow-hidden h-20 -translate-y-full pointer-events-none">
                  <svg className="absolute bottom-0 w-[200%] h-full animate-wave-flow fill-sky-400" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Empty State Scanning Visual */}
            {percentage === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                 <div className="w-48 h-48 border border-sky-500/30 rounded-full flex items-center justify-center animate-pulse">
                    <Target size={40} className="text-sky-500 animate-spin-slow" />
                 </div>
                 <span className="font-pixel text-[8px] text-sky-500 mt-6 tracking-widest uppercase">Awaiting Transmission</span>
              </div>
            )}

            {/* Percentage Display */}
            {percentage > 0 && (
              <div className="relative z-10 text-center select-none animate-in fade-in zoom-in duration-500">
                <div className={`text-9xl font-black tracking-tighter transition-all duration-500 ${percentage > 55 ? 'text-white drop-shadow-lg' : 'text-text-main'}`}>
                  {percentage}<span className="text-3xl ml-1">%</span>
                </div>
                <p className={`font-pixel text-[10px] mt-6 tracking-widest uppercase transition-colors duration-500 ${percentage > 55 ? 'text-white/80' : 'text-text-main font-black'}`}>
                  {currentIntake} / {goal} ML
                </p>
              </div>
            )}

            {/* Corner HUD Accents */}
            <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-sky-500/20" />
            <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-sky-500/20" />
            <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-sky-500/20" />
            <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-sky-500/20" />
          </div>
        </div>

        {/* Action Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {containers.map((c) => (
            <button
              key={c.id}
              onClick={() => addWater(c.size)}
              className="material-card group hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-6 py-10 border-border-main/50"
            >
              <div className="p-5 bg-bg-app rounded-3xl group-hover:bg-sky-500 group-hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-sky-500/20">
                <GlassWater size={32} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-sky-500">Inject Intake</p>
                <p className="text-3xl font-black text-text-main mt-1">+{c.size}<span className="text-xs ml-1 opacity-50">ml</span></p>
                <p className="text-[8px] font-black text-text-muted uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{c.name}</p>
              </div>
            </button>
          ))}
          
          <div className="material-card sm:col-span-2 bg-bg-card/30 flex flex-col justify-center p-8 border-dashed border-border-main/50 relative overflow-hidden group">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Core Diagnostics</span>
                </div>
                <div className="px-3 py-1 rounded-full text-[8px] font-black bg-emerald-500/10 text-emerald-500">
                   ACTIVE
                </div>
             </div>
             <div className="grid grid-cols-2 gap-8">
                <div>
                   <p className="text-[8px] font-black text-text-muted uppercase mb-1">Target Remaining</p>
                   <p className="text-3xl font-black text-text-main tracking-tighter">{Math.max(0, goal - currentIntake)}<span className="text-xs ml-1 opacity-30 italic">ml</span></p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-text-muted uppercase mb-1">Last Transmission</p>
                   <p className="text-sm font-mono font-bold text-text-main mt-1">
                      {new Date(lastDrinkTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
             </div>
             {/* Decorative Corner */}
             <div className="absolute top-0 right-0 w-16 h-16 bg-sky-500/5 rotate-45 translate-x-8 -translate-y-8" />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .animate-wave-flow { animation: wave-flow 4s linear infinite; }
        .animate-scanline { animation: scanline 8s linear infinite; }
        .animate-spin-slow { animation: spin 10s linear infinite; }
      `}</style>
    </div>
  );
};

export default Hydrometer;
