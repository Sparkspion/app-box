import { useState, useEffect, useMemo } from 'react';
import { Repeat, Droplets, Scale, Zap, Info, Banknote, Coins, RefreshCw } from 'lucide-react';
import HUDContainer from './HUDContainer';
import usePersistedState from '../hooks/usePersistedState';
import { ENDPOINTS } from '../utils/network';

const Convertor = () => {
  // Molecular State
  const [ml, setMl] = useState('');
  const [grams, setGrams] = useState('');
  const [density, setDensity] = useState(1);
  const [molecularInput, setMolecularInput] = useState(null);

  // Currency State
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = usePersistedState('conv-base-curr', 'USD');
  const [targetCurrency, setTargetCurrency] = usePersistedState('conv-target-curr', 'INR');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = usePersistedState('conv-rates-last-update', 0);
  const [currencyInput, setCurrencyInput] = useState(null);

  // UI State
  const [activeTab, setActiveTab] = usePersistedState('conv-active-tab', 'molecular');

  const densities = [
    { name: 'Water', value: 1 },
    { name: 'Milk', value: 1.03 },
    { name: 'Oil', value: 0.92 },
    { name: 'Honey', value: 1.42 },
    { name: 'Flour', value: 0.53 },
  ];

  const commonCurrencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY', 'SGD'];

  // Molecular Logic
  useEffect(() => {
    if (molecularInput === 'ml' && ml !== '') {
      setGrams((parseFloat(ml) * density).toFixed(2));
    } else if (molecularInput === 'g' && grams !== '') {
      setMl((parseFloat(grams) / density).toFixed(2));
    }
  }, [density]);

  const handleMlChange = (val) => {
    setMl(val);
    setMolecularInput('ml');
    if (val === '') { setGrams(''); return; }
    setGrams((parseFloat(val) * density).toFixed(2));
  };

  const handleGramsChange = (val) => {
    setGrams(val);
    setMolecularInput('g');
    if (val === '') { setMl(''); return; }
    setMl((parseFloat(val) / density).toFixed(2));
  };

  // Currency Logic
  const fetchRates = async (force = false) => {
    const now = Date.now();
    // Cache for 1 hour
    if (!force && lastUpdated && now - lastUpdated < 3600000 && Object.keys(rates).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch(ENDPOINTS.CURRENCY.LATEST(baseCurrency));
      const data = await res.json();
      setRates(data.rates);
      setLastUpdated(now);
    } catch (err) {
      console.error('Failed to fetch rates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [baseCurrency]);

  useEffect(() => {
    if (!rates[targetCurrency]) return;
    if (currencyInput === 'base' && amount !== '') {
      setConvertedAmount((parseFloat(amount) * rates[targetCurrency]).toFixed(2));
    } else if (currencyInput === 'target' && convertedAmount !== '') {
      setAmount((parseFloat(convertedAmount) / rates[targetCurrency]).toFixed(2));
    }
  }, [rates, targetCurrency]);

  const handleBaseAmountChange = (val) => {
    setAmount(val);
    setCurrencyInput('base');
    if (val === '' || !rates[targetCurrency]) { setConvertedAmount(''); return; }
    setConvertedAmount((parseFloat(val) * rates[targetCurrency]).toFixed(2));
  };

  const handleTargetAmountChange = (val) => {
    setConvertedAmount(val);
    setCurrencyInput('target');
    if (val === '' || !rates[targetCurrency]) { setAmount(''); return; }
    setAmount((parseFloat(val) / rates[targetCurrency]).toFixed(2));
  };

  const swapCurrencies = () => {
    const temp = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(temp);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
  };

  return (
    <div className="p-4 pb-20 max-w-4xl mx-auto min-h-screen">
      <HUDContainer title="Configuration" icon={Info} color="bg-emerald-500">
        <div className="space-y-6">
          {activeTab === 'molecular' ? (
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Substance Density</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {densities.map((d) => (
                  <button
                    key={d.name}
                    onClick={() => setDensity(d.value)}
                    className={`py-2 px-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                      density === d.value 
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'bg-bg-app border-border-main text-text-muted hover:border-emerald-500/50'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                 <label className="text-[8px] font-black uppercase tracking-widest text-text-muted px-1">Custom Density (g/ml)</label>
                 <input 
                   type="number" 
                   step="0.01"
                   value={density} 
                   onChange={(e) => setDensity(parseFloat(e.target.value) || 0)}
                   className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:outline-none focus:border-emerald-500 text-text-main font-bold transition-colors mt-1"
                 />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Source</label>
                  <select 
                    value={baseCurrency}
                    onChange={(e) => setBaseCurrency(e.target.value)}
                    className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-text-main font-bold uppercase text-[10px]"
                  >
                    {commonCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-muted px-1">Target</label>
                  <select 
                    value={targetCurrency}
                    onChange={(e) => setTargetCurrency(e.target.value)}
                    className="w-full bg-bg-app border-2 border-border-main rounded-xl py-2 px-3 focus:border-emerald-500 outline-none text-text-main font-bold uppercase text-[10px]"
                  >
                    {commonCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button 
                onClick={() => fetchRates(true)}
                disabled={loading}
                className="w-full py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all"
              >
                <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
                Force Rate Update
              </button>
            </div>
          )}
        </div>
      </HUDContainer>

      <header className="mb-8">
        <h1 className="text-3xl font-pixel text-emerald-500 mb-2 uppercase italic tracking-tighter text-center">Convertor</h1>
        <div className="flex justify-center gap-2 p-1 bg-bg-card border-2 border-border-main rounded-2xl w-fit mx-auto shadow-xl">
          <button 
            onClick={() => setActiveTab('molecular')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'molecular' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-text-muted hover:text-text-main'}`}
          >
            <Droplets size={14} /> Molecular
          </button>
          <button 
            onClick={() => setActiveTab('currency')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'currency' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-text-muted hover:text-text-main'}`}
          >
            <Banknote size={14} /> Currency
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-6 items-center animate-in fade-in zoom-in duration-500">
        
        {/* Top Card */}
        <div className={`material-card w-full max-w-md relative overflow-hidden group border-2 ${activeTab === 'molecular' ? 'border-sky-500/20' : 'border-emerald-500/20'}`}>
          <div className={`absolute top-0 left-0 w-1 h-full ${activeTab === 'molecular' ? 'bg-sky-500' : 'bg-emerald-500'}`} />
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center gap-2 ${activeTab === 'molecular' ? 'text-sky-500' : 'text-emerald-500'}`}>
              {activeTab === 'molecular' ? <Droplets size={18} /> : <Coins size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{activeTab === 'molecular' ? 'Volume' : 'Source'}</span>
            </div>
            <span className="text-xl font-black text-text-muted opacity-20 group-focus-within:opacity-100 transition-opacity">
              {activeTab === 'molecular' ? 'ML' : baseCurrency}
            </span>
          </div>
          <input 
            type="number" 
            value={activeTab === 'molecular' ? ml : amount}
            onChange={(e) => activeTab === 'molecular' ? handleMlChange(e.target.value) : handleBaseAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-5xl font-black text-text-main outline-none placeholder:opacity-10"
          />
        </div>

        {/* Swap/Sync Icon */}
        <button 
          onClick={activeTab === 'currency' ? swapCurrencies : undefined}
          className="p-4 bg-bg-card border-2 border-border-main rounded-full shadow-xl relative z-10 -my-8 hover:rotate-180 transition-transform duration-500 active:scale-90"
        >
          <Repeat size={24} className="text-emerald-500" />
        </button>

        {/* Bottom Card */}
        <div className="material-card w-full max-w-md border-emerald-500/20 relative overflow-hidden group border-2">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-500">
              {activeTab === 'molecular' ? <Scale size={18} /> : <Banknote size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{activeTab === 'molecular' ? 'Mass' : 'Target'}</span>
            </div>
            <span className="text-xl font-black text-text-muted opacity-20 group-focus-within:opacity-100 transition-opacity">
              {activeTab === 'molecular' ? 'GRAMS' : targetCurrency}
            </span>
          </div>
          <input 
            type="number" 
            value={activeTab === 'molecular' ? grams : convertedAmount}
            onChange={(e) => activeTab === 'molecular' ? handleGramsChange(e.target.value) : handleTargetAmountChange(e.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-5xl font-black text-text-main outline-none placeholder:opacity-10"
          />
        </div>

        {/* Diagnostic Visual */}
        <div className="w-full max-w-md mt-8 grid grid-cols-2 gap-4">
           <div className="bg-bg-card/30 border-2 border-dashed border-border-main p-4 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="text-[8px] font-black text-text-muted uppercase mb-1">{activeTab === 'molecular' ? 'Current Ratio' : 'Exchange Rate'}</p>
              <p className="text-xs font-mono font-bold text-text-main">
                {activeTab === 'molecular' 
                  ? `1ml : ${density}g` 
                  : `1 ${baseCurrency} : ${rates[targetCurrency]?.toFixed(4) || '---'} ${targetCurrency}`
                }
              </p>
           </div>
           <div className="bg-bg-card/30 border-2 border-dashed border-border-main p-4 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
              <p className="text-[8px] font-black text-text-muted uppercase mb-1">{activeTab === 'molecular' ? 'Precision State' : 'Sync Status'}</p>
              <div className={`flex items-center gap-1 ${loading ? 'text-yellow-500' : 'text-emerald-500'}`}>
                <Zap size={10} fill="currentColor" className={loading ? 'animate-pulse' : ''} />
                <span className="text-[10px] font-black uppercase tracking-widest">{loading ? 'Syncing...' : 'Optimized'}</span>
              </div>
              {activeTab === 'currency' && lastUpdated > 0 && (
                <p className="text-[6px] text-text-muted uppercase mt-1 absolute bottom-1">
                  Last Sync: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Convertor;
