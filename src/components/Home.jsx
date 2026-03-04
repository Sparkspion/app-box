import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Hash, Droplets, Settings, ChevronLeft, Play, SlidersHorizontal } from 'lucide-react';

const AppCard = ({ app }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const savedSettings = {};
    if (app.path === '/hydration-meter') {
      savedSettings.goal = JSON.parse(localStorage.getItem('h2o-goal')) || 2000;
      savedSettings.depletion = JSON.parse(localStorage.getItem('h2o-depletion-rate')) || 20;
      savedSettings.persist = JSON.parse(localStorage.getItem('h2o-persist')) ?? true;
    } else if (app.path === '/random-generator') {
      savedSettings.min = JSON.parse(localStorage.getItem('random-min')) || 1;
      savedSettings.max = JSON.parse(localStorage.getItem('random-max')) || 100;
      savedSettings.persist = JSON.parse(localStorage.getItem('random-persist')) ?? true;
    }
    setSettings(savedSettings);
  }, [app.path]);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const storageKey = {
      goal: 'h2o-goal',
      depletion: 'h2o-depletion-rate',
      persist: app.path === '/hydration-meter' ? 'h2o-persist' : 'random-persist',
      min: 'random-min',
      max: 'random-max'
    }[key];

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  };

  return (
    <div className="perspective-1000 h-[380px] w-full">
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="material-card h-full w-full flex flex-col p-0 overflow-hidden group">
            {/* Visual Header */}
            <div className={`h-32 w-full ${app.color} relative flex items-center justify-center overflow-hidden`}>
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               <app.icon size={48} className="text-white relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
               <h2 className="text-xl font-black text-text-main mb-1 tracking-tight">{app.name}</h2>
               <p className="text-xs font-medium text-text-muted mb-6 leading-relaxed line-clamp-2">
                  {app.description}
               </p>

               <div className="mt-auto space-y-3">
                  <Link 
                    to={app.path} 
                    className="w-full bg-text-main text-bg-app py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-accent-main transition-colors active:scale-95 shadow-lg"
                  >
                    <Play size={14} fill="currentColor" /> Start Module
                  </Link>
                  
                  <button 
                    onClick={() => setIsFlipped(true)}
                    className="w-full bg-bg-app text-text-muted py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-2 border-border-main hover:border-text-muted hover:text-text-main transition-all active:scale-95"
                  >
                    <SlidersHorizontal size={14} /> Options
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Back Side (Settings) */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className="material-card h-full w-full bg-bg-card border-accent-main/30 flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
               <button onClick={() => setIsFlipped(false)} className="p-2 -ml-2 rounded-lg hover:bg-bg-app text-text-muted transition-colors">
                  <ChevronLeft size={20} />
               </button>
               <span className="text-[10px] font-black uppercase tracking-widest text-accent-main">Settings</span>
               <div className="w-8" /> {/* Balance */}
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin">
               {app.path === '/hydration-meter' && (
                 <>
                   <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Daily Target (ml)</label>
                     <input 
                       type="number" 
                       value={settings.goal || ''} 
                       onChange={(e) => updateSetting('goal', Number(e.target.value))}
                       className="w-full bg-bg-app border-2 border-border-main rounded-xl px-4 py-2 text-sm font-bold focus:border-sky-500 outline-none transition-colors"
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Vitality Decay (%/hr)</label>
                     <input 
                       type="number" 
                       value={settings.depletion || ''} 
                       onChange={(e) => updateSetting('depletion', Number(e.target.value))}
                       className="w-full bg-bg-app border-2 border-border-main rounded-xl px-4 py-2 text-sm font-bold focus:border-sky-500 outline-none transition-colors"
                     />
                   </div>
                   <div className="flex items-center justify-between bg-bg-app p-3 rounded-xl border border-border-main mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-main">Persistence</span>
                        <span className="text-[7px] font-bold text-text-muted uppercase">Keep intake on reload</span>
                      </div>
                      <button 
                        onClick={() => updateSetting('persist', !settings.persist)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${settings.persist ? 'bg-sky-500' : 'bg-border-main'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.persist ? 'left-5' : 'left-1'}`} />
                      </button>
                   </div>
                 </>
               )}

               {app.path === '/random-generator' && (
                 <>
                   <div className="grid grid-cols-2 gap-3">
                     <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Min Val</label>
                       <input 
                         type="number" 
                         value={settings.min || ''} 
                         onChange={(e) => updateSetting('min', Number(e.target.value))}
                         className="w-full bg-bg-app border-2 border-border-main rounded-xl px-4 py-2 text-sm font-bold focus:border-nintendo-blue outline-none transition-colors"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-1">Max Val</label>
                       <input 
                         type="number" 
                         value={settings.max || ''} 
                         onChange={(e) => updateSetting('max', Number(e.target.value))}
                         className="w-full bg-bg-app border-2 border-border-main rounded-xl px-4 py-2 text-sm font-bold focus:border-nintendo-blue outline-none transition-colors"
                       />
                     </div>
                   </div>
                   <div className="flex items-center justify-between bg-bg-app p-3 rounded-xl border border-border-main mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest text-text-main">Last Result</span>
                        <span className="text-[7px] font-bold text-text-muted uppercase">Persist session output</span>
                      </div>
                      <button 
                        onClick={() => updateSetting('persist', !settings.persist)}
                        className={`w-10 h-6 rounded-full relative transition-colors ${settings.persist ? 'bg-nintendo-blue' : 'bg-border-main'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.persist ? 'left-5' : 'left-1'}`} />
                      </button>
                   </div>
                 </>
               )}

               {app.path === '/whatsapp-analyzer' && (
                 <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-bg-app flex items-center justify-center mb-4">
                       <Settings className="text-text-muted opacity-30" size={24} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted leading-relaxed">
                       This module uses session-based volatile memory. No global settings available.
                    </p>
                 </div>
               )}
            </div>

            <Link 
              to={app.path} 
              className={`mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${app.color}`}
            >
               Apply & Start
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const apps = [
  {
    name: 'WhatsApp Auction',
    path: '/whatsapp-analyzer',
    icon: MessageSquare,
    color: 'bg-nintendo-red',
    description: 'Specialized parser for WhatsApp chat exports to detect auction bids and winners.'
  },
  {
    name: 'Randomizer',
    path: '/random-generator',
    icon: Hash,
    color: 'bg-nintendo-blue',
    description: 'True random number generator with hidden Pokemon reveal mechanics.'
  },
  {
    name: 'Hydration Meter',
    path: '/hydration-meter',
    icon: Droplets,
    color: 'bg-sky-500',
    description: 'Gaming-inspired water intake tracker with vitality decay and wave physics.'
  }
];

const Home = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-pixel mb-6 tracking-tight text-accent-main uppercase italic">
          APP BOX
        </h1>
        <p className="text-text-muted text-sm font-bold uppercase tracking-[0.2em] opacity-60">
          Modular Utility Suite // System v1.0.4
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {apps.map((app) => (
          <AppCard key={app.path} app={app} />
        ))}
      </div>
    </div>
  );
};

export default Home;
