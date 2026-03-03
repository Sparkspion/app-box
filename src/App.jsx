import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { MessageSquare, Hash, Moon, Sun, LayoutGrid } from 'lucide-react';
import Home from './components/Home';
import WhatsAppAuctionAnalyzer from './components/WhatsAppAuctionAnalyzer';
import RandomNumberGenerator from './components/RandomNumberGenerator';

const NavDock = ({ theme, toggleTheme }) => {
  const navItems = [
    { path: '/', icon: LayoutGrid, label: 'Menu', color: 'text-nintendo-red' },
    { path: '/whatsapp-analyzer', icon: MessageSquare, label: 'Auction', color: 'text-emerald-500' },
    { path: '/random-generator', icon: Hash, label: 'Random', color: 'text-nintendo-blue' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-md">
      <nav className="bg-bg-card/90 backdrop-blur-2xl border-2 border-border-main rounded-[2.5rem] p-2 shadow-2xl flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-1 flex-1 justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex flex-col items-center justify-center w-20 py-2 rounded-3xl transition-all duration-300
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

        <button
          onClick={toggleTheme}
          className="p-4 rounded-full text-text-main hover:bg-bg-app transition-all active:scale-90"
        >
          {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-nintendo-blue" />}
        </button>
      </nav>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <Router>
      <div className="min-h-screen bg-bg-app transition-colors duration-500 selection:bg-nintendo-red/30 pb-32">
        <NavDock theme={theme} toggleTheme={toggleTheme} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/whatsapp-analyzer" element={<WhatsAppAuctionAnalyzer />} />
            <Route path="/random-generator" element={<RandomNumberGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
