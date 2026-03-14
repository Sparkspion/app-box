import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import { Moon, Sun, LayoutGrid, ChevronLeft, Terminal } from 'lucide-react';
import Home from './components/Home';
import Wauction from './components/Wauction';
import Convertor from './components/Convertor';
import RandomNumberGenerator from './components/RandomNumberGenerator';
import Hydrometer from './components/Hydrometer';
import MyBit from './components/MyBit';
import DebugPage from './components/DebugPage';
import { storage } from './utils/storage';
import { ALL_APPS } from './utils/appsConfig';

const Header = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isOnline = navigator.onLine;

  return (
    <header className="sticky top-0 z-[100] bg-bg-app/80 backdrop-blur-xl border-b border-border-main/50 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link 
              to="/" 
              className="p-2 -ml-2 rounded-full hover:bg-bg-card transition-colors text-text-muted hover:text-accent-main"
            >
              <ChevronLeft size={24} />
            </Link>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter text-text-main flex items-center gap-2">
              <span className="text-accent-main">APP</span> BOX
            </h1>
            <div 
              className={`w-2 h-2 rounded-full mt-1 ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-nintendo-red'}`} 
              title={isOnline ? 'System Online' : 'System Offline'} 
            />
          </div>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-bg-card border border-border-main/50 text-text-main hover:bg-bg-app transition-all active:scale-90"
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-nintendo-blue" />}
        </button>
      </div>
    </header>
  );
};

const NavDock = ({ apps }) => {
  const enabledApps = apps.filter(app => app.enabled !== false);
  
  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Menu', color: 'text-nintendo-red' },
    ...enabledApps.map(app => ({
      path: app.path,
      icon: app.icon,
      label: app.name.split(' ')[0], // Short label
      color: app.color.replace('bg-', 'text-')
    }))
  ];

  return (
    <div className="fixed bottom-8 left-4 right-24 md:left-1/2 md:-translate-x-1/2 md:right-auto z-50 w-auto md:w-full max-w-xl">
      <nav className="bg-bg-card/90 backdrop-blur-2xl border-2 border-border-main rounded-[2.5rem] p-2 shadow-2xl flex items-center justify-between relative">
        <div className="flex items-center gap-1 flex-1 justify-start overflow-x-auto scrollbar-thin px-2 pb-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center w-20 py-2 rounded-3xl transition-all duration-300 flex-shrink-0
                ${isActive ? 'bg-accent-main text-white shadow-lg shadow-accent-main/30' : 'text-text-muted hover:bg-bg-app ' + item.color}
              `}
            >
              <item.icon size={20} />
              <span className="text-[9px] font-black uppercase tracking-tighter mt-1">
                {item.label}
              </span>
            </NavLink>
          ))}
        </div>

        <div className="w-[1px] h-8 bg-border-main mx-2 opacity-30" />

        <NavLink
          to="/debug"
          className={({ isActive }) => `
            relative flex flex-col items-center justify-center w-20 py-2 rounded-3xl transition-all duration-300 flex-shrink-0
            ${isActive ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/30' : 'text-text-muted hover:bg-bg-app text-yellow-500'}
          `}
        >
          <Terminal size={20} />
          <span className="text-[9px] font-black uppercase tracking-tighter mt-1">
            Debug
          </span>
        </NavLink>
      </nav>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(() => storage.get('app-theme', 'dark'));
  
  // App Configuration State (Enabled & Order)
  const [apps, setApps] = useState(() => {
    const saved = storage.get('app-config', null);
    if (!saved) return ALL_APPS.map(app => ({ ...app, enabled: true }));
    
    // Merge saved config with ALL_APPS to handle new apps being added in code
    const merged = saved.map(savedApp => {
      const original = ALL_APPS.find(a => a.id === savedApp.id);
      return original ? { ...original, enabled: savedApp.enabled } : null;
    }).filter(Boolean);

    // Add any apps from ALL_APPS that weren't in saved config
    ALL_APPS.forEach(original => {
      if (!merged.find(a => a.id === original.id)) {
        merged.push({ ...original, enabled: true });
      }
    });

    return merged;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    storage.set('app-theme', theme);
  }, [theme]);

  useEffect(() => {
    storage.set('app-config', apps.map(a => ({ id: a.id, enabled: a.enabled })));
  }, [apps]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className="min-h-screen bg-bg-app transition-colors duration-500 selection:bg-nintendo-red/30 pb-32">
        <Header theme={theme} toggleTheme={toggleTheme} />
        <NavDock apps={apps} />
        <main>
          <Routes>
            <Route path="/" element={<Home apps={apps} setApps={setApps} />} />
            <Route path="/wauction" element={<Wauction />} />
            <Route path="/convertor" element={<Convertor />} />
            <Route path="/random-generator" element={<RandomNumberGenerator />} />
            <Route path="/hydrometer" element={<Hydrometer />} />
            <Route path="/my-bit" element={<MyBit />} />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
