import { useState, useEffect } from 'react';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Monitor, 
  Database, 
  Cpu,
  ShieldCheck,
  Smartphone,
  Zap,
  ChevronDown,
  ChevronUp,
  Lock,
  Key,
  LogOut,
  Terminal
} from 'lucide-react';
import { storage } from '../utils/storage';
import { DATA_PROVIDERS, GATEWAY } from '../utils/network';

const StorageValue = ({ value }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isObject = typeof value === 'object' && value !== null;
  const displayValue = isObject ? JSON.stringify(value, null, 2) : String(value);

  if (!isObject) {
    return <span className="font-mono text-text-muted">{displayValue}</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-[8px] font-black uppercase text-accent-main hover:text-white transition-colors text-left"
      >
        {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        {Array.isArray(value) ? `Array(${value.length})` : 'Object'}
      </button>
      {isExpanded && (
        <pre className="bg-bg-app p-2 rounded-lg text-[9px] font-mono text-text-muted overflow-x-auto border border-border-main/50 max-h-40 overflow-y-auto">
          {displayValue}
        </pre>
      )}
    </div>
  );
};

const DebugPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(storage.get('h2o-last-time', null));
  const [storageItems, setStorageItems] = useState([]);
  const [pwaStatus, setPwaStatus] = useState('Checking...');
  const [cacheStatus, setCacheStatus] = useState('Checking...');
  const [gatewayStatus, setGatewayStatus] = useState('Checking...');
  const [adminKey, setAdminKey] = useState(storage.get('admin-key', ''));
  const [showKeyInput, setShowKeyInput] = useState(false);

  const updateStorageList = () => {
    setStorageItems(storage.getAll());
  };

  const checkGateway = async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(GATEWAY.ENDPOINT, { 
        headers: { 'x-box-admin-key': adminKey },
        signal: controller.signal 
      });
      const data = await response.json();
      clearTimeout(id);
      setGatewayStatus(data.authorized ? 'Authorized' : 'Unlinked');
    } catch (e) {
      setGatewayStatus('Offline / Local Dev');
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    updateStorageList();
    checkGateway();

    // Check PWA registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        setPwaStatus(registration ? 'Registered' : 'Not Registered');
      });
    } else {
      setPwaStatus('Not Supported');
    }

    // Check Cache
    if ('caches' in window) {
      caches.has('poke-api-cache').then(hasCache => {
        setCacheStatus(hasCache ? 'Active' : 'Empty');
      });
    } else {
      setCacheStatus('Not Supported');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [adminKey]);

  const handleKeySave = (e) => {
    e.preventDefault();
    storage.set('admin-key', adminKey);
    setShowKeyInput(false);
    updateStorageList();
    window.location.reload(); // Refresh to update all Gatekeepers
  };

  const handleLogout = () => {
    storage.remove('admin-key');
    setAdminKey('');
    window.location.reload();
  };

  const simulateSync = () => {
    const now = Date.now().toString();
    storage.set('h2o-last-time', now);
    setLastSync(now);
    updateStorageList();
  };

  const clearStorage = () => {
    if (confirm("Are you sure you want to clear all app data?")) {
      storage.clear();
      setStorageItems([]);
      setLastSync(null);
    }
  };

  const sysInfo = [
    { label: 'Browser', value: navigator.userAgent.split(' ').pop(), icon: Monitor },
    { label: 'Platform', value: navigator.platform, icon: Cpu },
    { label: 'Screen', value: `${window.innerWidth}x${window.innerHeight}`, icon: Smartphone },
    { label: 'Language', value: navigator.language, icon: Activity },
  ];

  const appTests = [
    { label: 'Gateway Auth', value: gatewayStatus, status: gatewayStatus === 'Authorized' ? 'success' : 'warning' },
    { label: 'PWA Registration', value: pwaStatus, status: pwaStatus === 'Registered' ? 'success' : 'warning' },
    { label: 'Cache Storage', value: cacheStatus, status: cacheStatus === 'Active' ? 'success' : 'info' },
    { label: 'Service Worker', value: 'serviceWorker' in navigator ? 'Active' : 'Unavailable', status: 'serviceWorker' in navigator ? 'success' : 'error' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-screen pb-32">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-text-main tracking-tighter uppercase italic flex items-center gap-3">
          <Terminal className="text-accent-main animate-pulse" size={32} />
          System Diagnostics
        </h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-widest mt-2 opacity-60">
          Internal Test & Debug Interface
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Admin Uplink (Login) */}
        <div className="material-card p-6 flex flex-col justify-between border-2 border-nintendo-red/20 bg-nintendo-red/[0.02]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-nintendo-red mb-1">Authorization</p>
              <h2 className="text-2xl font-black text-text-main uppercase italic">Admin Uplink</h2>
            </div>
            <div className={`p-3 rounded-2xl ${adminKey ? 'bg-nintendo-red text-white' : 'bg-bg-app text-text-muted border border-border-main'}`}>
              <Key size={24} />
            </div>
          </div>
          
          <div className="mt-6">
            {showKeyInput ? (
              <form onSubmit={handleKeySave} className="space-y-2">
                <input 
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter Secret Key"
                  autoFocus
                  className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 text-xs font-bold text-text-main focus:border-nintendo-red outline-none"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 py-2 bg-nintendo-red text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Connect</button>
                  <button type="button" onClick={() => setShowKeyInput(false)} className="px-4 py-2 bg-bg-app border border-border-main text-text-muted rounded-xl text-[10px] font-black uppercase">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-text-main">
                  <div className={`h-3 w-3 rounded-full ${adminKey ? 'bg-nintendo-red animate-pulse' : 'bg-border-main'}`} />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    {adminKey ? 'Super Admin Linked' : 'Uplink Terminated'}
                  </span>
                </div>
                {adminKey ? (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-bg-app border-2 border-border-main text-text-muted rounded-2xl text-[10px] font-black uppercase hover:text-nintendo-red hover:border-nintendo-red transition-all"
                  >
                    <LogOut size={14} /> Terminate Uplink
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowKeyInput(true)}
                    className="w-full py-3 bg-nintendo-red text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-nintendo-red/20 active:scale-95 transition-all"
                  >
                    Establish Uplink
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Network Status */}
        <div className="material-card p-6 flex flex-col justify-between border-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Connection State</p>
              <h2 className="text-2xl font-black text-text-main uppercase italic">Network</h2>
            </div>
            {isOnline ? (
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Wifi size={24} />
              </div>
            ) : (
              <div className="p-3 bg-nintendo-red/10 text-nintendo-red rounded-2xl">
                <WifiOff size={24} />
              </div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-3 text-text-main">
            <div className={`h-3 w-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-nintendo-red'}`} />
            <span className="text-sm font-bold uppercase tracking-wider">
              {isOnline ? 'System Online' : 'System Offline'}
            </span>
          </div>
        </div>

        {/* Sync Status */}
        <div className="material-card p-6 flex flex-col justify-between border-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Data Persistence</p>
              <h2 className="text-2xl font-black text-text-main uppercase italic">Synchronization</h2>
            </div>
            <div className="p-3 bg-sky-500/10 text-sky-500 rounded-2xl">
              <RefreshCw size={24} />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Last Synced Time</p>
              <p className="text-sm font-mono font-bold text-text-main">
                {lastSync ? new Date(parseInt(lastSync)).toLocaleString() : 'Never'}
              </p>
            </div>
            <button 
              onClick={simulateSync}
              className="switch-btn switch-btn-blue w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Zap size={14} /> Force Sync
            </button>
          </div>
        </div>

        {/* Gateway & Data Providers Card */}
        <div className="material-card border-emerald-500/20 bg-bg-card/30 flex flex-col relative overflow-hidden lg:row-span-2 border-2">
          <div className="flex items-center gap-3 mb-6 p-6 pb-0">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-text-main tracking-tight uppercase italic leading-none">Secure Gateway</h2>
              <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mt-1">Abstraction Layer</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto px-6 scrollbar-thin max-h-[400px] lg:max-h-none">
            {DATA_PROVIDERS.map((provider) => (
              <div key={provider.id} className="p-3 rounded-xl bg-bg-app border border-border-main/50 group hover:border-emerald-500/30 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-text-main uppercase tracking-tight">{provider.name}</span>
                  <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded bg-bg-card uppercase border border-border-main ${provider.type === 'Private' ? 'text-orange-500 border-orange-500/30' : 'text-text-muted group-hover:text-emerald-500 group-hover:border-emerald-500/30'}`}>
                    {provider.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                   {provider.type === 'Private' ? <Lock size={8} className="text-orange-500" /> : <ShieldCheck size={8} className="text-emerald-500" />}
                   <p className="text-[9px] font-mono text-text-muted opacity-80 truncate uppercase">ID: {provider.id}</p>
                </div>
                <p className="text-[8px] font-medium text-text-muted uppercase leading-tight">{provider.purpose}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border-main/50 flex items-center justify-between p-6">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${gatewayStatus === 'Authorized' ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-[8px] font-black text-text-muted uppercase tracking-widest truncate">Gateway Status: {gatewayStatus}</span>
            </div>
          </div>
        </div>

        {/* App Specific Tests */}
        <div className="material-card p-6 md:col-span-2 border-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
              <ShieldCheck size={18} />
            </div>
            <h2 className="text-lg font-black text-text-main uppercase tracking-tighter italic">Application Readiness Tests</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {appTests.map((test, i) => (
              <div key={i} className="bg-bg-app p-4 rounded-2xl border border-border-main/50">
                <p className="text-[8px] font-black text-text-muted uppercase tracking-widest mb-2">{test.label}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main">{test.value}</span>
                  <div className={`h-2 w-2 rounded-full ${
                    test.status === 'success' ? 'bg-emerald-500' : 
                    test.status === 'error' ? 'bg-nintendo-red' : 
                    test.status === 'warning' ? 'bg-yellow-500' : 'bg-sky-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environment Info */}
        <div className="material-card p-6 border-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-text-main/5 text-text-main rounded-xl">
              <Monitor size={18} />
            </div>
            <h2 className="text-lg font-black text-text-main uppercase tracking-tighter italic">Environment</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-text-main">
            {sysInfo.map((info, i) => (
              <div key={i} className="bg-bg-app p-3 rounded-2xl border border-border-main/50">
                <div className="flex items-center gap-2 mb-1">
                  <info.icon size={12} className="text-text-muted" />
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">{info.label}</p>
                </div>
                <p className="text-[10px] font-bold truncate">{info.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Storage Explorer */}
        <div className="material-card p-6 md:col-span-2 lg:col-span-3 border-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 text-yellow-400 rounded-xl">
                <Database size={18} />
              </div>
              <h2 className="text-lg font-black text-text-main uppercase tracking-tighter italic">Storage Explorer</h2>
            </div>
            <button 
              onClick={clearStorage}
              className="text-[10px] font-black uppercase text-nintendo-red hover:underline tracking-widest"
            >
              Purge App Data
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto pr-2 scrollbar-thin">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-bg-card z-10 text-text-main">
                <tr className="border-b border-border-main/50">
                  <th className="pb-2 text-[8px] font-black text-text-muted uppercase tracking-widest w-1/3">Key (box-*)</th>
                  <th className="pb-2 text-[8px] font-black text-text-muted uppercase tracking-widest">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main/20">
                {storageItems.length > 0 ? storageItems.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 text-[10px] font-mono font-bold text-accent-main align-top">{item.key}</td>
                    <td className="py-3 text-[10px] align-top">
                      <StorageValue value={item.value} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="py-8 text-center text-[10px] font-black text-text-muted uppercase tracking-widest">No system data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
