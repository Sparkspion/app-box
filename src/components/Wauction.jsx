import { useState, useMemo } from "react";
import { Upload, FileText, Share2, Users, TrendingUp, History, ArrowUpDown, Search, Package, Award } from "lucide-react";
import HUDContainer from "./HUDContainer";

const ADMIN = "hobson store";

// --- Utility & Extraction Logic ---

function extractBids(text, items = []) {
  const bids = [];
  const cleanText = text.replace(/,/g, '').toLowerCase();
  const directPattern = /(?:#\s*)?(\d{1,2})\s+(\d+)(k?)\b/g;
  const kForPattern = /(\d+)(k?)\s*for\s*(?:#\s*)?(\d{1,2})\b/g;
  const buyoutPattern = /(?:#\s*)?(\d{1,2})\s+buyout\b/g;

  for (const m of cleanText.matchAll(directPattern)) {
    let amount = Number(m[2]);
    if (m[3] === 'k') amount *= 1000;
    bids.push({ itemId: Number(m[1]), amount });
  }
  for (const m of cleanText.matchAll(kForPattern)) {
    let amount = Number(m[1]);
    if (m[2] === 'k') amount *= 1000;
    bids.push({ itemId: Number(m[3]), amount });
  }
  for (const m of cleanText.matchAll(buyoutPattern)) {
    const itemId = Number(m[1]);
    const item = items.find(it => it.id === itemId);
    if (item) bids.push({ itemId, amount: item.buyOutPrice, isBuyout: true });
  }
  return bids;
}

function extractAuctionItems(text) {
  const clean = text.replace(/,/g, '');
  const itemBlockPattern = /#(\d+)\s+([^#\n]+)[\s\S]*?Base\s*(?:Price:)?\s*₹?(\d+)\s*Buy\s*out\s*(?:Price:)?\s*₹?(\d+)/gi;
  const items = [];
  for (const m of clean.matchAll(itemBlockPattern)) {
    items.push({
      id: Number(m[1]),
      title: m[2].trim().toLowerCase(),
      displayTitle: m[2].trim(),
      basePrice: Number(m[3]),
      buyOutPrice: Number(m[4]),
    });
  }
  return items;
}

// --- Sortable Table Component ---

const SortableTable = ({ data, columns, defaultSort = "" }) => {
  const [sortConfig, setSortConfig] = useState({ key: defaultSort, direction: 'desc' });
  const [filter, setFilter] = useState("");

  const sortedData = useMemo(() => {
    let items = [...data];
    if (filter) {
      items = items.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(filter.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      items.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [data, sortConfig, filter]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
        <input 
          type="text" 
          placeholder="Filter data..." 
          className="w-full bg-bg-app border border-border-main rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-text-main focus:border-accent-main outline-none transition-colors"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto border border-border-main rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-card border-b border-border-main">
              {columns.map(col => (
                <th 
                  key={col.key}
                  onClick={() => requestSort(col.key)}
                  className="p-4 text-[10px] font-black uppercase tracking-widest text-text-muted cursor-pointer hover:text-text-main transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    <ArrowUpDown size={12} className={sortConfig.key === col.key ? 'text-accent-main' : 'opacity-20'} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main/30">
            {sortedData.map((row, i) => (
              <tr key={i} className="hover:bg-bg-app/50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="p-4 text-xs font-mono font-bold text-text-main truncate max-w-[200px]">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Wauction = () => {
  const [messages, setMessages] = useState(null);
  const [analysis, setAnalysis] = useState({
    sessions: [],
    users: [],
    inventory: [],
  });

  const isDefault = messages === null;

  const parseWhatsAppChat = (text) => {
    const lines = text.split("\n");
    const sessions = [];
    const globalUsers = {};
    const globalItems = {};
    
    let currentSession = null;
    let currentMessage = null;

    const messageRegex = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}\s*[\u202f\s]*[ap]m)\s*-\s*([^:]+):\s*(.*)$/i;

    const recordWinner = (session, itemId, winnerName, price) => {
      session.winners[itemId] = { name: winnerName, price };
      
      if (!globalUsers[winnerName]) {
        globalUsers[winnerName] = { name: winnerName, wins: 0, spend: 0, items: [] };
      }
      globalUsers[winnerName].wins++;
      globalUsers[winnerName].spend += price;
      
      const itemObj = session.items.find(it => it.id === itemId);
      if (itemObj) {
        globalUsers[winnerName].items.push(itemObj.displayTitle);
        const key = itemObj.title.substring(0, 40);
        if (globalItems[key]) globalItems[key].lastOwner = winnerName;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(messageRegex);

      if (match) {
        if (currentMessage) {
          const senderLower = currentMessage.sender.toLowerCase();
          const isAdmin = senderLower.includes('hobson');
          const detectedItems = isAdmin ? extractAuctionItems(currentMessage.message) : [];

          if (isAdmin && detectedItems.length > 0) {
            if (currentSession) sessions.push(currentSession);
            currentSession = {
              id: sessions.length + 1,
              startTime: currentMessage.time,
              date: currentMessage.date,
              items: detectedItems,
              bids: [], 
              winners: {},
              isActive: true,
              sessionBidders: new Set()
            };

            detectedItems.forEach(item => {
              const key = item.title.substring(0, 40);
              if (!globalItems[key]) {
                globalItems[key] = { 
                  title: item.displayTitle, 
                  base: item.basePrice, 
                  buyout: item.buyOutPrice,
                  history: [], 
                  lastOwner: 'Admin' 
                };
              }
              globalItems[key].history.push(currentMessage.date);
            });
          }

          if (currentSession?.isActive && !isAdmin) {
            const detectedBids = extractBids(currentMessage.message, currentSession.items);
            detectedBids.forEach(bid => {
              currentSession.bids.push({ ...bid, user: currentMessage.sender, time: currentMessage.time });
              currentSession.sessionBidders.add(currentMessage.sender);
            });
          }

          if (isAdmin) {
            const congratsMatches = currentMessage.message.matchAll(/Congratulations\s*@[\u2068\s]*([^⁩\n]+)[\u2069\s]*you\s*have\s*won.*#(\d+)/gi);
            for (const wm of congratsMatches) {
              const winnerName = wm[1].replace(/[~]/g, '').trim();
              const itemId = Number(wm[2]);
              const session = currentSession || sessions[sessions.length - 1];
              if (session) {
                const lastBid = [...session.bids].reverse().find(b => b.itemId === itemId);
                recordWinner(session, itemId, winnerName, lastBid?.amount || 0);
              }
            }

            const soldMatch = currentMessage.message.match(/#(\d+)\s+sold/i);
            if (soldMatch && currentSession) {
              const itemId = Number(soldMatch[1]);
              const lastBid = [...currentSession.bids].reverse().find(b => b.itemId === itemId);
              if (lastBid) recordWinner(currentSession, itemId, lastBid.user, lastBid.amount);
            }
          }
        }

        const [, date, time, sender, messageText] = match;
        currentMessage = { date: date.trim(), time: time.trim(), sender: sender.trim(), message: messageText.trim() };
      } else if (currentMessage && line.trim()) {
        currentMessage.message += "\n" + line.trim();
      }
    }

    if (currentSession) sessions.push(currentSession);

    return { 
      sessions, 
      users: Object.values(globalUsers),
      inventory: Object.values(globalItems)
    };
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = parseWhatsAppChat(e.target.result);
      setMessages(true);
      setAnalysis(result);
    };
    reader.readAsText(file);
  };

  const userColumns = [
    { key: 'name', label: 'Collector' },
    { key: 'wins', label: 'Wins' },
    { key: 'spend', label: 'Total Spend', render: (val) => `₹${val.toLocaleString()}` },
    { key: 'items', label: 'Recent Acquisitions', render: (val) => val.slice(-2).join(', ') }
  ];

  const inventoryColumns = [
    { key: 'title', label: 'Item Name' },
    { key: 'history', label: 'Frequency', render: (val) => `${val.length}x Listed` },
    { key: 'buyout', label: 'Current Valuation', render: (val) => `₹${val.toLocaleString()}` },
    { key: 'lastOwner', label: 'Last Owner' }
  ];

  return (
    <div className="p-4 pb-20 max-w-6xl mx-auto min-h-screen">
      <HUDContainer title="Terminal" icon={FileText} color="bg-nintendo-red" defaultOpen={isDefault}>
        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-main rounded-2xl cursor-pointer bg-bg-app hover:bg-bg-app/50 transition-all group">
            <Upload className="w-8 h-8 mb-2 text-nintendo-red group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Inject Chat Stream</span>
            <input type="file" className="hidden" accept=".txt" onChange={handleFileUpload} />
          </label>
        </div>
      </HUDContainer>

      <header className="mb-12">
        <h1 className="text-3xl font-pixel text-accent-main mb-2">WAUCTION</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50 italic">Aggregated Collector & Inventory Management</p>
      </header>

      {!isDefault && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="material-card bg-nintendo-red/5 border-nintendo-red/20">
              <Users className="text-nintendo-red mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Unique Collectors</p>
              <p className="text-3xl font-black text-text-main">{analysis.users.length}</p>
            </div>
            <div className="material-card bg-nintendo-blue/5 border-nintendo-blue/20">
              <Package className="text-nintendo-blue mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Catalog Items</p>
              <p className="text-3xl font-black text-text-main">{analysis.inventory.length}</p>
            </div>
            <div className="material-card bg-emerald-500/5 border-emerald-500/20">
              <TrendingUp className="text-emerald-500 mb-2" size={20} />
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Market Volume</p>
              <p className="text-3xl font-black text-text-main">
                ₹{analysis.users.reduce((acc, curr) => acc + curr.spend, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <section className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-lg font-black text-text-main uppercase italic flex items-center gap-3">
                 <Award size={18} className="text-accent-main" />
                 Collector Spending Ledger
              </h2>
              <SortableTable data={analysis.users} columns={userColumns} defaultSort="spend" />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-text-main uppercase italic flex items-center gap-3">
                 <History size={18} className="text-emerald-500" />
                 Inventory Lineage & Valuations
              </h2>
              <SortableTable data={analysis.inventory} columns={inventoryColumns} defaultSort="history" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-black text-text-main uppercase italic flex items-center gap-3">
               <Share2 size={18} className="text-nintendo-blue" />
               Raw Session Feed
            </h2>
            {analysis.sessions.map((s, idx) => (
              <div key={idx} className="material-card !p-0 overflow-hidden border-border-main hover:border-nintendo-blue/30 transition-colors">
                <div className="bg-bg-app p-4 flex justify-between items-center border-b-2 border-border-main">
                  <div className="flex items-center gap-4">
                    <span className="font-pixel text-[10px] text-nintendo-blue">ID_{s.id.toString().padStart(3, '0')}</span>
                    <span className="font-mono text-xs font-bold text-text-muted">{s.date} | {s.startTime}</span>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    {s.items.map((item, i) => (
                      <div key={i} className="bg-bg-card p-4 rounded-2xl border border-border-main">
                        <p className="font-black text-text-main text-xs">{item.displayTitle}</p>
                        <div className="flex justify-between items-end mt-4">
                           <p className="text-[10px] font-black text-emerald-500">₹{item.buyOutPrice}</p>
                           {s.winners[item.id] && (
                             <div className="text-right">
                               <p className="text-[7px] font-black text-text-muted uppercase">Winner</p>
                               <p className="text-[9px] font-mono font-bold text-nintendo-blue truncate">@{s.winners[item.id].name} (₹{s.winners[item.id].price})</p>
                             </div>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-bg-app/50 rounded-2xl p-4 border border-border-main">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Session Bid Stream</p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
                      {s.bids.map((b, i) => (
                        <div key={i} className="flex justify-between items-center p-2 bg-bg-card rounded-lg border border-border-main/30">
                          <p className="text-[9px] font-mono font-bold text-text-main truncate max-w-[60%]">@{b.user}</p>
                          <span className="text-[9px] font-black text-emerald-500">₹{b.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {isDefault && (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
          <FileText size={80} className="mb-6" />
          <p className="font-pixel text-xs">Awaiting Data Stream</p>
        </div>
      )}
    </div>
  );
};

export default Wauction;
