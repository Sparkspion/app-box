import { useState, useEffect } from 'react';
import { X, Settings } from 'lucide-react';

const HUDContainer = ({ children, title, icon: Icon, color = 'bg-accent-main', defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Allow controlled-ish behavior if defaultOpen changes (e.g. on navigation)
  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

  return (
    <div className="fixed bottom-8 right-4 z-[60] flex flex-col items-end pointer-events-none">
      {/* Content Panel - Drop-up */}
      <div className={`
        transform transition-all duration-500 origin-bottom-right mb-4 pointer-events-auto
        ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'}
      `}>
        <div className="material-card w-[calc(100vw-2.5rem)] max-w-[320px] shadow-2xl border-border-main overflow-hidden">
          <div className="flex items-center gap-2 mb-4 border-b border-border-main pb-2">
            <div className={`${color} p-1.5 rounded-lg text-white`}>
              <Icon size={16} />
            </div>
            <span className="font-black uppercase tracking-widest text-[10px] text-text-main">
              {title}
            </span>
          </div>
          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>

      {/* Toggle Button - Aligned vertically with NavDock using margin */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-center w-16 h-[66px] mb-[11px] rounded-[2.5rem] 
          bg-bg-card/90 backdrop-blur-2xl border-2 border-border-main shadow-2xl
          text-text-main transition-all active:scale-95 pointer-events-auto
          ${isOpen ? 'border-accent-main shadow-lg shadow-accent-main/20' : 'hover:bg-bg-app'}
        `}
      >
        <div className={`
          flex items-center justify-center w-12 h-12 rounded-3xl transition-all duration-500
          ${isOpen ? 'bg-accent-main text-white shadow-lg shadow-accent-main/30 rotate-90' : color + ' text-white shadow-md'}
        `}>
          {isOpen ? <X size={22} /> : <Icon size={22} />}
        </div>
      </button>
    </div>
  );
};

export default HUDContainer;
