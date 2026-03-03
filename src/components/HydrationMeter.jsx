import { useState, useEffect, useRef } from 'react';
import { Droplets, Plus, RotateCcw, Settings2, Trash2, GlassWater, Bell, BellOff, Zap, Timer } from 'lucide-react';
import HUDContainer from './HUDContainer';
import { notificationService } from '../utils/notificationService';

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

const HydrationMeter = () => {
  // Persistence
  const [goal, setGoal] = usePersistedState('h2o-goal', 2000);
  const [currentIntake, setCurrentIntake] = usePersistedState('h2o-current', 0);
  const [lastDate, setLastDate] = usePersistedState('h2o-last-date', new Date().toDateString());
  const [lastDrinkTime, setLastDrinkTime] = usePersistedState('h2o-last-time', Date.now());
  const [isNotifyEnabled, setIsNotifyEnabled] = usePersistedState('h2o-notify', false);
  const [depletionRate, setDepletionRate] = usePersistedState('h2o-depletion-rate', 20); // % per hour
  const [containers, setContainers] = usePersistedState('h2o-containers', [
    { id: 1, name: 'Glass', size: 250 },
    { id: 2, name: 'Bottle', size: 500 },
  ]);

  // Derived State
  const [vitality, setVitality] = useState(100); 
  const timerRef = useRef(null);

  // Daily Reset Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastDate !== today) {
      setCurrentIntake(0);
      setLastDate(today);
    }
  }, [lastDate, setCurrentIntake, setLastDate]);

  // Vitality Depletion Logic
  useEffect(() => {
    const updateVitality = () => {
      const hoursSinceLastDrink = (Date.now() - lastDrinkTime) / (1000 * 60 * 60);
      const newVitality = Math.max(0, 100 - (hoursSinceLastDrink * depletionRate));
      setVitality(Math.round(newVitality));

      // Trigger Notification if vitality hits critical
      if (isNotifyEnabled && newVitality <= 20 && newVitality > 19) {
        notificationService.send("Hydration Critical!", {
          body: "Your vitality is dropping. Time for a quick sync (drink water)!",
          tag: 'hydration-nudge'
        });
      }
    };

    updateVitality();
    timerRef.current = setInterval(updateVitality, 60000); 
    return () => clearInterval(timerRef.current);
  }, [lastDrinkTime, isNotifyEnabled, depletionRate]);

  const addWater = (amount) => {
    setCurrentIntake(prev => Math.min(goal * 2, prev + amount));
    setLastDrinkTime(Date.now());
    setVitality(100);
  };

  const toggleNotifications = async () => {
    if (!isNotifyEnabled) {
      const granted = await notificationService.requestPermission();
      if (granted) setIsNotifyEnabled(true);
    } else {
      setIsNotifyEnabled(false);
    }
  };

  const percentage = Math.min(100, Math.round((currentIntake / goal) * 100));

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto min-h-screen">
      <HUDContainer title="Config" icon={Settings2} color="bg-sky-500">
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-bg-app p-3 rounded-2xl border-2 border-border-main">
            <div className="flex items-center gap-3">
              {isNotifyEnabled ? <Bell className="text-sky-500" size={18} /> : <BellOff className="text-text-muted" size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Reminders</span>
            </div>
            <button 
              onClick={toggleNotifications}
              className={`w-10 h-6 rounded-full transition-colors relative ${isNotifyEnabled ? 'bg-sky-500' : 'bg-border-main'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isNotifyEnabled ? 'left-5' : 'left-1'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Daily Target (ml)</label>
            <input
              type="number"
              value={goal}
              onChange={(e) => setGoal(Math.max(100, Number(e.target.value)))}
              className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:outline-none focus:border-sky-500 text-text-main font-bold transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">Depletion Rate</label>
              <span className="text-[10px] font-bold text-sky-500">{depletionRate}%/hr</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={depletionRate}
              onChange={(e) => setDepletionRate(Number(e.target.value))}
              className="w-full h-2 bg-bg-app rounded-lg appearance-none cursor-pointer accent-sky-500 border border-border-main"
            />
            <p className="text-[8px] text-text-muted font-bold uppercase opacity-50 px-1">Adjusts vitality decay speed</p>
          </div>
          
          <button
            onClick={() => { if(confirm("Reset progress?")) setCurrentIntake(0); }}
            className="switch-btn switch-btn-red w-full py-2 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <RotateCcw size={14} /> System Reset
          </button>
        </div>
      </HUDContainer>

      <header className="mb-12">
        <h1 className="text-3xl font-pixel text-sky-500 mb-2 uppercase italic tracking-tighter">Hydro-Pulse</h1>
        <div className="flex items-center gap-4">
           <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50">Intake Synchronization Active</p>
           {isNotifyEnabled && <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping" />}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Main Meter View */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="material-card w-full aspect-square max-w-[400px] relative overflow-hidden flex flex-col items-center justify-center border-sky-500/20 group">
            
            {/* Liquid Animation */}
            <div 
              className="absolute bottom-0 left-0 w-full bg-sky-500 transition-all duration-1000 ease-out"
              style={{ height: `${percentage}%` }}
            >
              {percentage > 0 && (
                <div className="absolute top-0 left-0 w-full overflow-hidden h-20 -translate-y-full pointer-events-none">
                  <svg className="absolute bottom-0 w-[200%] h-full animate-wave-flow fill-sky-500" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                  </svg>
                  <svg className="absolute bottom-0 w-[200%] h-full animate-wave-flow-slow fill-sky-400/40" viewBox="0 0 1000 100" preserveAspectRatio="none" style={{ animationDelay: '-2s' }}>
                    <path d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 L1000,100 L0,100 Z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Redesigned Empty State Visuals */}
            {percentage === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <div className="relative">
                    <Droplets size={160} className="text-border-main/20 animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="font-pixel text-[10px] text-text-muted/40 uppercase tracking-tighter">Empty</span>
                    </div>
                 </div>
              </div>
            )}

            {/* Percentage Display - Improved Contrast */}
            <div className="relative z-10 text-center select-none">
              <div className={`text-9xl font-black tracking-tighter transition-all duration-500 ${percentage > 55 ? 'text-white' : 'text-text-main drop-shadow-sm'}`}>
                {percentage}<span className="text-3xl">%</span>
              </div>
              <p className={`font-pixel text-[10px] mt-6 tracking-widest uppercase transition-colors duration-500 ${percentage > 55 ? 'text-white/80' : 'text-text-main font-black'}`}>
                {currentIntake} / {goal} ML
              </p>
            </div>
          </div>

          {/* Vitality Bar */}
          <div className="w-full max-w-[400px] mt-8 bg-bg-card border-2 border-border-main rounded-2xl p-4 shadow-xl">
             <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                   <Zap size={14} className={vitality < 30 ? 'text-nintendo-red animate-pulse' : 'text-yellow-400'} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Hydration Vitality</span>
                </div>
                <span className={`font-pixel text-[8px] ${vitality < 30 ? 'text-nintendo-red' : 'text-text-muted'}`}>{vitality}%</span>
             </div>
             <div className="h-3 w-full bg-bg-app rounded-full overflow-hidden p-0.5 border border-border-main">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${vitality < 30 ? 'bg-nintendo-red' : 'bg-yellow-400'}`}
                  style={{ width: `${vitality}%` }}
                />
             </div>
             <div className="flex justify-between items-start mt-3 px-1">
                <p className="text-[8px] font-bold text-text-muted uppercase tracking-tight max-w-[70%]">
                   {vitality < 30 ? 'Critical: System requires immediate fluid sync' : 'Vital signs optimal. Next sync recommended soon.'}
                </p>
                <div className="flex items-center gap-1 opacity-30">
                   <Timer size={10} className="text-text-muted" />
                   <span className="text-[7px] font-black text-text-muted">-{depletionRate}%/HR</span>
                </div>
             </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-2 gap-6">
          {containers.map((c) => (
            <button
              key={c.id}
              onClick={() => addWater(c.size)}
              className="material-card group hover:scale-105 active:scale-95 transition-all flex flex-col items-center justify-center gap-6 py-12 hover:border-sky-500/50"
            >
              <div className="p-6 bg-bg-app rounded-3xl group-hover:bg-sky-500 group-hover:text-white transition-all group-hover:rotate-12">
                <GlassWater size={40} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-sky-500">Inject Module</p>
                <p className="text-3xl font-black text-text-main mt-1">+{c.size}<span className="text-xs ml-1 opacity-50">ml</span></p>
              </div>
            </button>
          ))}
          
          <div className="material-card col-span-full bg-bg-card/30 flex flex-col justify-center p-10 border-dashed relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Droplets size={100} />
             </div>
             <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Sync Report</span>
                <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black">STABLE</div>
             </div>
             <div className="grid grid-cols-2 gap-12">
                <div>
                   <p className="text-[8px] font-black text-text-muted uppercase mb-2">Target Remaining</p>
                   <p className="text-4xl font-black text-text-main tracking-tighter">{Math.max(0, goal - currentIntake)}<span className="text-sm ml-1 opacity-30 italic font-medium uppercase">ml</span></p>
                </div>
                <div>
                   <p className="text-[8px] font-black text-text-muted uppercase mb-2">Last Sync</p>
                   <p className="text-sm font-mono font-bold text-text-main mt-2">
                      {new Date(lastDrinkTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
             </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave-flow { animation: wave-flow 4s linear infinite; }
        .animate-wave-flow-slow { animation: wave-flow 7s linear infinite; }
      `}</style>
    </div>
  );
};

export default HydrationMeter;
