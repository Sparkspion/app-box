import { Lock, ShieldAlert } from 'lucide-react';
import { storage } from '../utils/storage';

/**
 * Gatekeeper Component
 * 
 * Wraps protected features and shows a restricted UI if the user is not an admin.
 * Features a breathable, adaptive layout for small widgets.
 */
const Gatekeeper = ({ children, title = "Tool", mini = false }) => {
  const adminKey = storage.get('admin-key', '');
  const isAuthenticated = !!adminKey;

  if (!isAuthenticated) {
    if (mini) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center animate-in fade-in duration-500">
          <div className="p-3 bg-nintendo-red/10 rounded-2xl text-nintendo-red mb-3">
            <Lock size={20} />
          </div>
          <p className="text-[9px] font-pixel text-text-main uppercase tracking-tighter mb-1">{title} Locked</p>
          <p className="text-[7px] font-bold text-text-muted uppercase tracking-widest">Admin Key Required</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 material-card border-dashed border-nintendo-red/20 bg-nintendo-red/[0.01] min-h-[300px] animate-in fade-in zoom-in duration-500">
        <div className="p-5 bg-nintendo-red/10 rounded-full text-nintendo-red mb-6 relative">
          <Lock size={32} />
          <ShieldAlert size={16} className="absolute top-0 right-0 bg-bg-app rounded-full p-0.5" />
        </div>
        
        <div className="text-center space-y-3">
          <h2 className="text-lg font-pixel text-text-main uppercase italic tracking-tighter">
            {title} Access Restricted
          </h2>
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.15em] max-w-[240px] mx-auto leading-relaxed opacity-70">
            This module requires a <span className="text-nintendo-red">Super Admin Uplink</span> key to enable server-side data extraction.
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-border-main/30 w-full max-w-[140px] text-center">
           <div className="flex items-center justify-center gap-2 text-nintendo-red/50">
              <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest">Offline Mode</span>
           </div>
        </div>
      </div>
    );
  }

  return children;
};

export default Gatekeeper;
