import { useState } from 'react';
import { ChevronRight, Settings } from 'lucide-react';

const HUDContainer = ({ children, title, icon: Icon, color = 'bg-accent-main' }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`fixed top-6 right-6 z-40 flex flex-col items-end transition-all duration-500 ease-in-out`}>
      {/* Toggle Button / FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group mb-4 flex items-center gap-3 p-4 rounded-3xl shadow-2xl border-2 border-border-main backdrop-blur-xl bg-bg-card/90 text-text-main transition-all active:scale-95 ${!isOpen ? 'animate-bounce-slow' : ''}`}
      >
        <div className={`${color} p-2 rounded-xl text-white group-hover:rotate-90 transition-transform duration-500`}>
          <Icon size={20} />
        </div>
        <span className="font-black uppercase tracking-widest text-xs pr-2">
          {isOpen ? 'Minimize' : title}
        </span>
        <div className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`}>
          <ChevronRight size={18} />
        </div>
      </button>

      {/* Content Panel */}
      <div className={`
        transform transition-all duration-500 origin-top-right
        ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}
      `}>
        <div className="material-card w-80 shadow-2xl border-accent-main/20 overflow-hidden">
          <div className="p-1 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDContainer;
