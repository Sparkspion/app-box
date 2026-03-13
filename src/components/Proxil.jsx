import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, RefreshCw, ExternalLink, Settings2, Globe, Plus, Trash2, Search, Package, CheckCircle2, Zap, Radio, Bot, Heart, ArrowUpDown, Filter } from 'lucide-react';
import HUDContainer from './HUDContainer';
import usePersistedState from '../hooks/usePersistedState';
import { ENDPOINTS } from '../utils/network';

const Proxil = () => {
  const [sites, setSites] = usePersistedState('proxil-sites-v1', []);
  const [seenIds, setSeenIds] = usePersistedState('proxil-seen-ids', []);
  const [watchlistIds, setWatchlistIds] = usePersistedState('proxil-watchlist-ids', []);
  const [cachedProducts, setCachedProducts] = usePersistedState('proxil-cached-products', []);
  const [products, setProducts] = useState(cachedProducts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all', 'new', 'watchlist'
  const [sortBy, setSortBy] = useState('newest');

  const fetchShopifyProducts = async (site) => {
    const proxyUrl = ENDPOINTS.PROXY.wrap(`${site.url}/products.json?limit=25`);
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    // Our new proxy returns the JSON directly if it's application/json
    const products = data.products || [];
    
    return products.map(p => {
      const rawPrice = p.variants?.[0]?.price || '0';
      return {
        id: `sh-${p.id}`,
        title: p.title,
        price: parseFloat(rawPrice),
        displayPrice: `₹${rawPrice}`,
        link: `${site.url}/products/${p.handle}`,
        image: p.images?.[0]?.src || '',
        site: site.name,
        timestamp: new Date(p.published_at).getTime()
      };
    });
  };

  const fetchGenericProducts = async (site) => {
    const proxyUrl = ENDPOINTS.PROXY.wrap(site.url);
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    // For generic HTML, our proxy wraps it in .contents
    if (!data.contents) return [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, 'text/html');
    const elements = Array.from(doc.querySelectorAll(site.itemSelector)).slice(0, 25);

    return elements.map(el => {
      const title = el.querySelector(site.titleSelector)?.textContent?.trim() || 'Unknown Product';
      const priceText = el.querySelector(site.priceSelector)?.textContent?.trim() || '0';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
      let link = el.querySelector(site.linkSelector)?.getAttribute('href') || '';
      let image = el.querySelector(site.imageSelector)?.getAttribute('src') || '';

      if (link && !link.startsWith('http')) {
        const baseUrl = new URL(site.url).origin;
        link = baseUrl + (link.startsWith('/') ? '' : '/') + link;
      }
      if (image && !image.startsWith('http')) {
        const baseUrl = new URL(site.url).origin;
        image = baseUrl + (image.startsWith('/') ? '' : '/') + image;
      }

      return { 
        id: `gen-${btoa(link).substr(0, 16)}`, 
        title, 
        price, 
        displayPrice: `₹${price}`,
        link, 
        image, 
        site: site.name,
        timestamp: Date.now()
      };
    });
  };

  const fetchProducts = async () => {
    if (sites.length === 0) return;
    setLoading(true);
    setError(null);
    let allItems = [];

    try {
      for (const site of sites) {
        try {
          const siteItems = site.type === 'shopify' 
            ? await fetchShopifyProducts(site)
            : await fetchGenericProducts(site);
          allItems = [...allItems, ...siteItems];
        } catch (e) {
          console.error(`Failed to fetch ${site.name}:`, e);
        }
      }
      setProducts(allItems);
      setCachedProducts(allItems);
    } catch (err) {
      setError('System Uplink Failed. Check connectivity.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = (id) => {
    if (watchlistIds.includes(id)) {
      setWatchlistIds(watchlistIds.filter(i => i !== id));
    } else {
      setWatchlistIds([...watchlistIds, id]);
    }
  };

  const markAllSeen = () => {
    const currentIds = products.map(p => p.id);
    setSeenIds([...new Set([...seenIds, ...currentIds])]);
  };

  useEffect(() => {
    if (products.length === 0 && sites.length > 0) fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (viewMode === 'new') {
      result = result.filter(p => !seenIds.includes(p.id));
    } else if (viewMode === 'watchlist') {
      result = result.filter(p => watchlistIds.includes(p.id));
    }

    if (filter) {
      const f = filter.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(f) || 
        p.site.toLowerCase().includes(f)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return b.timestamp - a.timestamp;
    });

    return result;
  }, [products, filter, viewMode, seenIds, watchlistIds, sortBy]);

  const stats = useMemo(() => ({
    new: products.filter(p => !seenIds.includes(p.id)).length,
    watchlist: watchlistIds.length
  }), [products, seenIds, watchlistIds]);

  return (
    <div className="p-4 pb-32 max-w-6xl mx-auto min-h-screen">
      <HUDContainer title="Recon Sectors" icon={Settings2} color="bg-orange-500">
        <div className="space-y-6">
          {sites.map((site, index) => (
            <div key={site.id || index} className="bg-bg-app border border-border-main p-4 rounded-xl space-y-3 relative group">
              <button onClick={() => setSites(sites.filter((_, i) => i !== index))} className="absolute top-2 right-2 p-1 text-nintendo-red opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14} />
              </button>
              <div className="flex gap-2">
                <select value={site.type} onChange={(e) => {
                  const n = [...sites];
                  n[index].type = e.target.value;
                  if (e.target.value === 'shopify') {
                    delete n[index].itemSelector; delete n[index].titleSelector; delete n[index].priceSelector;
                  } else {
                    n[index].itemSelector = '.product'; n[index].titleSelector = 'h2'; n[index].priceSelector = '.price'; n[index].linkSelector = 'a'; n[index].imageSelector = 'img';
                  }
                  setSites(n);
                }} className="bg-black/20 text-[10px] font-black uppercase p-1 rounded outline-none">
                  <option value="shopify">Shopify</option>
                  <option value="generic">Generic</option>
                </select>
                <input value={site.name} onChange={(e) => { const n = [...sites]; n[index].name = e.target.value; setSites(n); }} className="flex-1 bg-transparent border-b border-border-main text-[10px] font-black uppercase p-1 outline-none" placeholder="Site Name" />
              </div>
              <input value={site.url} onChange={(e) => { const n = [...sites]; n[index].url = e.target.value; setSites(n); }} className="w-full bg-transparent border-b border-border-main text-[10px] p-1 outline-none" placeholder="Base URL (e.g. https://store.com)" />
            </div>
          ))}
          <button onClick={() => setSites([...sites, { id: Math.random().toString(36).substr(2, 9), name: '', url: '', type: 'shopify' }])} className="w-full py-2 border-2 border-dashed border-border-main rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase hover:border-orange-500 transition-colors">
            <Plus size={14} /> Add Recon Sector
          </button>
        </div>
      </HUDContainer>

      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-pixel text-orange-500 mb-2 italic tracking-tighter uppercase flex items-center gap-3">
            <Bot size={32} /> Proxil
          </h1>
          <div className="flex items-center gap-4 text-text-muted font-bold text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-1"><Zap size={12} className="text-orange-500" /> Intel Feed</span>
            {products.length > 0 && <span>{products.length} Items Logged</span>}
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={markAllSeen} title="Clear Intel Badges" className="p-4 rounded-2xl bg-bg-card border-2 border-border-main text-text-muted hover:text-orange-500 transition-all active:scale-90">
            <CheckCircle2 size={20} />
          </button>
          <button onClick={fetchProducts} disabled={loading || sites.length === 0} className={`p-4 rounded-2xl bg-orange-500 text-white shadow-lg active:scale-90 transition-all ${loading ? 'animate-spin' : ''}`}>
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 material-card border-dashed bg-transparent">
          <Radio size={64} className="text-orange-500/20 mb-6 animate-pulse" />
          <h2 className="text-xl font-pixel text-text-main mb-4 italic text-center">System Offline</h2>
          <button onClick={() => setSites([{ id: 'init', name: '', url: '', type: 'shopify' }])} className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">
            Deploy First Scout
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input type="text" placeholder="Filter intelligence..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full bg-bg-card border-2 border-border-main rounded-2xl py-4 pl-12 pr-4 font-bold text-text-main focus:border-orange-500 outline-none shadow-xl" />
            </div>
            <div className="flex gap-2 p-1 bg-bg-card border-2 border-border-main rounded-2xl shadow-xl">
              {['all', 'new', 'watchlist'].map(mode => (
                <button 
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 ${viewMode === mode ? 'bg-orange-500 text-white' : 'text-text-muted hover:text-text-main'}`}
                >
                  {mode} {mode !== 'all' && stats[mode] > 0 && <span className="bg-white/20 px-1.5 rounded-full text-[8px]">{stats[mode]}</span>}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 p-1 bg-bg-card border-2 border-border-main rounded-2xl shadow-xl">
              <ArrowUpDown size={14} className="ml-3 text-text-muted" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-[10px] font-black uppercase pr-4 outline-none">
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
              </select>
            </div>
          </div>

          {error && <div className="bg-nintendo-red/10 border-2 border-nintendo-red p-6 rounded-2xl text-nintendo-red mb-8 flex items-center gap-4"><Globe size={24} /><p className="font-bold text-sm uppercase tracking-tight">{error}</p></div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {loading && products.length === 0 ? (
              Array(8).fill(0).map((_, i) => <div key={i} className="material-card aspect-[3/4] animate-pulse bg-bg-card/50" />)
            ) : (
              filteredProducts.map((product) => {
                const isNew = !seenIds.includes(product.id);
                const isWatched = watchlistIds.includes(product.id);
                return (
                  <div key={product.id} className={`material-card !p-0 flex flex-col group transition-all overflow-hidden border-2 relative ${isNew ? 'border-orange-500/30 bg-orange-500/[0.02]' : 'hover:border-orange-500/50'}`}>
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWatchlist(product.id); }}
                      className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all active:scale-75 ${isWatched ? 'bg-nintendo-red text-white' : 'bg-black/40 text-white/60 hover:text-white'}`}
                    >
                      <Heart size={16} fill={isWatched ? "currentColor" : "none"} />
                    </button>
                    <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-4">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                      ) : (
                        <Package size={48} className="opacity-20 text-text-muted" />
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[8px] font-black text-white uppercase tracking-widest">
                        {product.site}
                      </div>
                      {isNew && <div className="absolute bottom-2 right-2 px-2 py-1 bg-orange-500 text-white rounded text-[8px] font-black uppercase tracking-widest animate-pulse">New Recon</div>}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-[10px] font-black text-text-main line-clamp-2 mb-2 leading-tight uppercase italic min-h-[2.5rem]">
                        {product.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between gap-2">
                        <span className="text-xl font-pixel text-orange-500 tracking-tighter whitespace-nowrap">{product.displayPrice}</span>
                        <a href={product.link} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-text-main text-bg-app rounded-xl hover:bg-orange-500 hover:text-white transition-all active:scale-90">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-32 opacity-20">
              <Filter size={64} className="mx-auto mb-4" />
              <p className="font-pixel text-xs uppercase tracking-widest">No matching intel in this sector</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Proxil;
