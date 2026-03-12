import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Play, 
  SlidersHorizontal, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Settings2,
  Check
} from 'lucide-react';
import pkg from '../../package.json';
import { storage } from '../utils/storage';

const AppCard = ({ app, index, isCustomizing, onToggle, onDragStart, onDragOver, onDragEnd }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const savedSettings = {};
    if (app.id === 'hydrometer') {
      savedSettings.goal = storage.get('h2o-goal', 2000);
      savedSettings.persist = storage.get('h2o-persist', true);
    } else if (app.id === 'random-generator') {
      savedSettings.min = storage.get('random-min', 1);
      savedSettings.max = storage.get('random-max', 100);
      savedSettings.persist = storage.get('random-persist', true);
    }
    setSettings(savedSettings);
  }, [app.id]);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    const storageKey = {
      goal: 'h2o-goal',
      persist: app.id === 'hydrometer' ? 'h2o-persist' : 'random-persist',
      min: 'random-min',
      max: 'random-max'
    }[key];

    if (storageKey) {
      storage.set(storageKey, value);
    }
  };

  const isEnabled = app.enabled !== false;

  return (
    <div 
      className={`perspective-1000 h-[380px] w-full transition-all duration-500 ${isCustomizing ? 'scale-[0.98]' : ''} ${!isEnabled && !isCustomizing ? 'hidden' : ''}`}
      draggable={isCustomizing}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front Side */}
        <div className={`absolute inset-0 backface-hidden ${!isEnabled ? 'opacity-40' : ''}`}>
          <div className="material-card h-full w-full flex flex-col p-0 overflow-hidden group border-2">
            {/* Visual Header */}
            <div className={`h-32 w-full ${app.color} relative flex items-center justify-center overflow-hidden`}>
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               <app.icon size={48} className="text-white relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500" />
               
               {isCustomizing && (
                 <div className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-lg cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-white" />
                 </div>
               )}

               {isCustomizing && (
                 <button 
                   onClick={() => onToggle(app.id)}
                   className={`absolute top-4 right-4 p-2 backdrop-blur-md rounded-lg transition-colors ${isEnabled ? 'bg-emerald-500/80 text-white' : 'bg-nintendo-red/80 text-white'}`}
                 >
                    {isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                 </button>
               )}
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col">
               <div className="flex justify-between items-start mb-1">
                  <h2 className="text-xl font-black text-text-main tracking-tight">{app.name}</h2>
                  {!isEnabled && <span className="text-[8px] font-black uppercase tracking-widest text-nintendo-red bg-nintendo-red/10 px-2 py-0.5 rounded">Disabled</span>}
               </div>
               <p className="text-xs font-medium text-text-muted mb-6 leading-relaxed line-clamp-2">
                  {app.description}
               </p>

               <div className="mt-auto space-y-3">
                  <Link 
                    to={isEnabled ? app.path : '#'} 
                    onClick={(e) => !isEnabled && e.preventDefault()}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg ${isEnabled ? 'bg-text-main text-bg-app hover:bg-accent-main' : 'bg-border-main text-text-muted cursor-not-allowed shadow-none'}`}
                  >
                    <Play size={14} fill="currentColor" /> Start Module
                  </Link>
                  
                  <button 
                    disabled={!isEnabled}
                    onClick={() => setIsFlipped(true)}
                    className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95 ${isEnabled ? 'bg-bg-app text-text-muted border-border-main hover:border-text-muted hover:text-text-main' : 'bg-bg-app/50 text-text-muted/50 border-border-main/50 cursor-not-allowed'}`}
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
               <div className="w-8" />
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1 scrollbar-thin">
               {app.id === 'hydrometer' && (
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

               {app.id === 'random-generator' && (
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

               {!['hydrometer', 'random-generator'].includes(app.id) && (
                 <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <div className="w-12 h-12 rounded-full bg-bg-app flex items-center justify-center mb-4">
                       <Settings2 className="text-text-muted opacity-30" size={24} />
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

const Home = ({ apps, setApps }) => {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleToggleApp = (id) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, enabled: app.enabled === false ? true : false } : app
    ));
  };

  const onDragStart = (e, index) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Add a ghost image or styling if needed
    e.target.style.opacity = '0.5';
  };

  const onDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newApps = [...apps];
    const draggedItem = newApps[draggedItemIndex];
    newApps.splice(draggedItemIndex, 1);
    newApps.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setApps(newApps);
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItemIndex(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto pb-32">
      <header className="mb-16 text-center max-w-2xl mx-auto relative">
        <div className="absolute -top-4 right-0 md:right-[-100px]">
           <button 
             onClick={() => setIsCustomizing(!isCustomizing)}
             className={`p-3 rounded-2xl flex items-center gap-2 transition-all active:scale-95 ${isCustomizing ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-bg-card border border-border-main text-text-muted hover:text-accent-main'}`}
           >
              {isCustomizing ? <Check size={18} /> : <Settings2 size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">
                {isCustomizing ? 'Done' : 'Customize'}
              </span>
           </button>
        </div>

        <h1 className="text-4xl md:text-6xl font-pixel mb-6 tracking-tight text-accent-main uppercase italic">
          APP BOX
        </h1>
        <p className="text-text-muted text-sm font-bold uppercase tracking-[0.2em] opacity-60">
          Modular Utility Suite // System v{pkg.version}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {apps.map((app, index) => (
          <AppCard 
            key={app.id} 
            app={app} 
            index={index}
            isCustomizing={isCustomizing}
            onToggle={handleToggleApp}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>

      {apps.filter(app => app.enabled !== false).length === 0 && !isCustomizing && (
        <div className="text-center py-20 opacity-20">
           <Settings2 size={64} className="mx-auto mb-4" />
           <p className="font-pixel text-xs uppercase tracking-widest">All modules offline. Use Customize to enable.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
