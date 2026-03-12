import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  CheckCircle2, Clock,
  Link as LinkIcon,
  Flame,
  Zap,
  Target,
  ChevronRight,
  Sparkles,
  Settings2,
  Calendar
} from 'lucide-react';
import HUDContainer from './HUDContainer';
import usePersistedState from '../hooks/usePersistedState';


const DEFAULT_HABITS = [
  {
    id: 'habit-init-1',
    name: 'Wake Up',
    time: '07:00',
    isCompleted: false,
    linkedTo: null,
    atomicStep: 'Sit up and plant feet on floor',
    icon: 'Sun'
  }
];

const MyBit = () => {
  const [habits, setHabits] = usePersistedState('mybit-habits', DEFAULT_HABITS);
  const [lastResetDate, setLastResetDate] = usePersistedState('mybit-last-reset', new Date().toDateString());
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newAtomic, setNewAtomic] = useState('');
  const [newLink, setNewLink] = useState('');

  // Daily Reset
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setHabits(prev => prev.map(h => ({ ...h, isCompleted: false })));
      setLastResetDate(today);
    }
  }, [lastResetDate, setHabits, setLastResetDate]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newName) return;

    const newHabit = {
      id: `habit-${Date.now()}`,
      name: newName,
      time: newTime,
      isCompleted: false,
      linkedTo: newLink || null,
      atomicStep: newAtomic || `Start ${newName}`,
    };

    setHabits(prev => [...prev, newHabit].sort((a, b) => a.time.localeCompare(b.time)));
    setIsAdding(false);
    setNewName('');
    setNewAtomic('');
    setNewLink('');
  };

  const deleteHabit = (id) => {
    if (confirm("Remove this habit from your timeline?")) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const toggleComplete = (id) => {
    setHabits(prev => prev.map(h => 
      h.id === id ? { ...h, isCompleted: !h.isCompleted } : h
    ));
  };

  const completedCount = habits.filter(h => h.isCompleted).length;
  const progressPercent = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  return (
    <div className="p-4 pb-24 max-w-4xl mx-auto min-h-screen">
      <HUDContainer title="Habit Stack" icon={Settings2} color="bg-emerald-500" defaultOpen={habits.length === 1}>
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1 mb-4 leading-relaxed">
             Atomic habits are small changes that yield remarkable results. Stack them to build momentum.
          </p>
          
          {!isAdding ? (
            <button 
              onClick={() => setIsAdding(true)}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Plus size={18} /> New Habit Bit
            </button>
          ) : (
            <form onSubmit={addHabit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-1">Habit Name</label>
                  <input 
                    autoFocus
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g., Read Book"
                    className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-text-main font-bold"
                  />
               </div>
               <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-1">Time</label>
                    <input 
                      type="time"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-text-main font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-1">Stack After</label>
                    <select 
                      value={newLink}
                      onChange={e => setNewLink(e.target.value)}
                      className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-text-main font-bold text-xs"
                    >
                      <option value="">Independent</option>
                      {habits.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-text-muted px-1">Atomic Step (Make it Tiny)</label>
                  <input 
                    value={newAtomic}
                    onChange={e => setNewAtomic(e.target.value)}
                    placeholder="e.g., Read one page"
                    className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-text-main font-bold"
                  />
               </div>
               <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-bg-app border-2 border-border-main text-text-muted py-3 rounded-xl font-black uppercase tracking-widest text-[9px]">Cancel</button>
                  <button type="submit" className="flex-2 bg-emerald-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-lg shadow-emerald-500/20">Forge Habit</button>
               </div>
            </form>
          )}
        </div>
      </HUDContainer>

      <header className="mb-12">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-3xl font-pixel text-emerald-500 mb-2 uppercase italic tracking-tighter">MyBit</h1>
              <div className="flex items-center gap-3">
                 <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50 flex items-center gap-1">
                    <Calendar size={12} /> {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                 </p>
              </div>
           </div>
           <div className="text-right">
              <div className="flex items-center justify-end gap-2 text-emerald-500 mb-1">
                 <Flame size={16} fill="currentColor" />
                 <span className="font-black text-xl tracking-tighter">12<span className="text-[10px] ml-0.5 opacity-50">DAY STREAK</span></span>
              </div>
              <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.2em]">Consistency Engine Active</p>
           </div>
        </div>
      </header>

      {/* Progress Card */}
      <div className="material-card mb-12 p-6 border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group">
         <div className="flex justify-between items-end mb-4 relative z-10">
            <div>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Target size={14} /> Daily Sync Status
               </p>
               <h2 className="text-4xl font-black text-text-main tracking-tighter">
                  {completedCount}<span className="text-xl text-text-muted mx-1">/</span>{habits.length}
                  <span className="text-xs ml-3 text-text-muted uppercase font-bold tracking-widest">Units Locked</span>
               </h2>
            </div>
            <div className="text-right">
               <span className="text-4xl font-black text-emerald-500 tracking-tighter">{Math.round(progressPercent)}%</span>
            </div>
         </div>
         <div className="h-3 w-full bg-bg-app rounded-full overflow-hidden p-0.5 border border-border-main relative z-10">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              style={{ width: `${progressPercent}%` }}
            />
         </div>
         {/* Background Scanline Visual */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-size-[100%_4px] animate-scanline" 
              style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px)' }} />
      </div>

      {/* Timeline */}
      <div className="relative pl-8 space-y-8">
         {/* Vertical Line */}
         <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border-main/50" />
         
         {habits.length === 0 && (
           <div className="text-center py-12 opacity-30">
              <Sparkles size={48} className="mx-auto mb-4 text-text-muted" />
              <p className="font-pixel text-[10px] uppercase tracking-[0.2em]">Timeline Empty. Begin stacking.</p>
           </div>
         )}

         {habits.map((habit, index) => {
           const isLinked = habit.linkedTo !== null;
           const linkedHabit = isLinked ? habits.find(h => h.id === habit.linkedTo) : null;
           
           return (
             <div key={habit.id} className="relative animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                {/* Node */}
                <div className={`absolute -left-6.5 top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${habit.isCompleted ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-lg shadow-emerald-500/30' : 'bg-bg-app border-border-main'}`}>
                   {habit.isCompleted && <div className="absolute inset-0 flex items-center justify-center text-white"><CheckCircle2 size={10} strokeWidth={4} /></div>}
                </div>

                <div className={`material-card p-0 overflow-hidden transition-all duration-500 ${habit.isCompleted ? 'opacity-60 grayscale-[0.5] border-emerald-500/20 bg-emerald-500/2' : 'hover:border-emerald-500/50'}`}>
                   <div className="flex">
                      {/* Left: Time & Icon */}
                      <div className={`w-20 flex flex-col items-center justify-center border-r border-border-main/50 p-4 ${habit.isCompleted ? 'bg-emerald-500/5' : 'bg-bg-app'}`}>
                         <Clock size={16} className="text-text-muted mb-1" />
                         <span className="text-xs font-black text-text-main">{habit.time}</span>
                      </div>

                      {/* Right: Content */}
                      <div className="flex-1 p-5 flex items-center justify-between">
                         <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className={`text-lg font-black tracking-tight ${habit.isCompleted ? 'line-through text-text-muted' : 'text-text-main'}`}>
                                  {habit.name}
                               </h3>
                               {isLinked && (
                                 <div className="flex items-center gap-1 px-2 py-0.5 bg-bg-app border border-border-main rounded-full">
                                    <LinkIcon size={10} className="text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Stacked on {linkedHabit?.name || 'Habit'}</span>
                                 </div>
                               )}
                            </div>
                            <div className="flex items-center gap-2">
                               <Zap size={12} className="text-yellow-500" />
                               <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider italic">
                                  {habit.atomicStep}
                               </p>
                            </div>
                         </div>

                         <div className="flex items-center gap-3">
                            <button 
                              onClick={() => deleteHabit(habit.id)}
                              className="p-2 rounded-xl text-text-muted hover:text-nintendo-red hover:bg-nintendo-red/5 transition-colors opacity-0 group-hover:opacity-100"
                            >
                               <Trash2 size={18} />
                            </button>
                            <button 
                              onClick={() => toggleComplete(habit.id)}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 ${habit.isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-text-main text-bg-app shadow-lg'}`}
                            >
                               {habit.isCompleted ? 'Completed' : 'Execute'} <ChevronRight size={14} />
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           );
         })}
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline { animation: scanline 10s linear infinite; }
      `}</style>
    </div>
  );
};

export default MyBit;
