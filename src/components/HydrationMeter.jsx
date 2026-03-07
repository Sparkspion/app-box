import { useState, useEffect, useRef } from 'react';
import { Plus, RotateCcw, Settings2, Trash2, GlassWater, Bell, BellOff, Zap, Timer, Activity, Target, ShieldCheck } from 'lucide-react';
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

const DEFAULT_GOAL = 2000;
const DEFAULT_DEPLETION = 10; // % per hour

const HydrationMeter = () => {
  // Persistence
  const [goal, setGoal] = usePersistedState('h2o-goal', DEFAULT_GOAL);
  const [currentIntake, setCurrentIntake] = usePersistedState('h2o-current', 0);
  const [lastDate, setLastDate] = usePersistedState('h2o-last-date', new Date().toDateString());
  const [startTime, setStartTime] = usePersistedState('h2o-start-time', Date.now());
  const [lastDrinkTime, setLastDrinkTime] = usePersistedState('h2o-last-time', Date.now());
  const [isNotifyEnabled, setIsNotifyEnabled] = usePersistedState('h2o-notify', false);
  const [depletionRate, setDepletionRate] = usePersistedState('h2o-depletion-rate', DEFAULT_DEPLETION); // % per hour
  const [containers] = usePersistedState('h2o-containers', [
    { id: 1, name: 'Glass', size: 250 },
    { id: 2, name: 'Bottle', size: 500 },
  ]);

  // Derived State
  const [vitality, setVitality] = useState(100); 
  const timerRef = useRef(null);
  const notificationCooldown = useRef(0);

  // Daily Reset Logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastDate !== today) {
      setCurrentIntake(0);
      setLastDate(today);
      setStartTime(Date.now());
      setLastDrinkTime(Date.now());
    }
  }, [lastDate, setCurrentIntake, setLastDate, setStartTime, setLastDrinkTime]);

  // Vitality Calculation Logic
  useEffect(() => {
    const updateVitality = () => {
      const elapsedHours = (Date.now() - startTime) / (1000 * 60 * 60);
      const progressPercent = (currentIntake / goal) * 100;
      const decay = elapsedHours * depletionRate;
      
      const calculatedVitality = Math.max(0, Math.min(100, 100 + progressPercent - decay));
      setVitality(Math.round(calculatedVitality));

      if (isNotifyEnabled && calculatedVitality <= 25 && Date.now() > notificationCooldown.current) {
        notificationService.send("Vitality Low!", {
          body: `System vitality is at ${Math.round(calculatedVitality)}%. Hydration levels require synchronization.`,
          tag: 'hydration-nudge'
        });
        notificationCooldown.current = Date.now() + (1000 * 60 * 60);
      }
    };

    updateVitality();
    timerRef.current = setInterval(updateVitality, 60000); 
    return () => clearInterval(timerRef.current);
  }, [currentIntake, goal, startTime, depletionRate, isNotifyEnabled]);

  const addWater = (amount) => {
    setCurrentIntake(prev => Math.min(goal * 2, prev + amount));
    setLastDrinkTime(Date.now());
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
  const isDefault = goal === DEFAULT_GOAL && depletionRate === DEFAULT_DEPLETION && !isNotifyEnabled;

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto min-h-screen">
      <HUDContainer title="Config" icon={Settings2} color="bg-sky-500" defaultOpen={isDefault}>
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
            onClick={() => { if(confirm("Reset progress?")) { setCurrentIntake(0); setStartTime(Date.now()); } }}
            className="switch-btn switch-btn-red w-full py-2 rounded-xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
          >
            <RotateCcw size={14} /> System Reset
          </button>
        </div>
      </HUDContainer>

      <header className="mb-12">
        <h1 className="text-3xl font-pixel text-sky-500 mb-2 uppercase italic tracking-tighter">Hydro-Pulse</h1>
        <div className="flex items-center gap-4">
           <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50">Pulse Synchronization Active</p>
           {isNotifyEnabled && <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping" />}
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
                 <span className="font-pixel text-[8px] text-sky-500 mt-6 tracking-widest uppercase">Awaiting Uplink</span>
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

          {/* Vitality Bar */}
          <div className="w-full max-w-[400px] mt-8 bg-bg-card border-2 border-border-main rounded-2xl p-4 shadow-xl relative overflow-hidden">
             <div className="flex justify-between items-center mb-3 px-1">
                <div className="flex items-center gap-2">
                   <Zap size={14} className={vitality < 30 ? 'text-nintendo-red animate-pulse' : 'text-yellow-400'} />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-main">System Vitality</span>
                </div>
                <span className={`font-pixel text-[8px] ${vitality < 30 ? 'text-nintendo-red' : 'text-text-muted'}`}>{vitality}%</span>
             </div>
             <div className="h-3 w-full bg-bg-app rounded-full overflow-hidden p-0.5 border border-border-main">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${vitality < 30 ? 'bg-nintendo-red shadow-[0_0_10px_rgba(230,0,18,0.5)]' : 'bg-yellow-400'}`}
                  style={{ width: `${vitality}%` }}
                />
             </div>
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
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-sky-500">Inject Sync</p>
                <p className="text-3xl font-black text-text-main mt-1">+{c.size}<span className="text-xs ml-1 opacity-50">ml</span></p>
              </div>
            </button>
          ))}
          
          <div className="material-card sm:col-span-2 bg-bg-card/30 flex flex-col justify-center p-8 border-dashed border-border-main/50 relative overflow-hidden group">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Sync Diagnostics</span>
                </div>
                <div className={`px-3 py-1 rounded-full text-[8px] font-black ${vitality > 50 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-nintendo-red/10 text-nintendo-red'}`}>
                   {vitality > 50 ? 'SECURE' : 'CRITICAL'}
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

export default HydrationMeter;
