import { useState } from "react";
import { Upload, Download, Code, AlertCircle, FileText, Share2 } from "lucide-react";
import HUDContainer from "./HUDContainer";

const ADMIN = "hobson store";

function getHighestBids(text, amounts = []) {
  const regex =
    /(?:#\s*)?(\d)\s+(\d{3,5})|(\d{1,2})\s*[kK]\s*for\s*(?:#\s*)?(\d)/g;

  for (const m of text.matchAll(regex)) {
    const item = Number(m[1] ?? m[4]);
    const amount = m[2] ? Number(m[2]) : Number(m[3]) * 1000;

    if (amounts[item] == null || amount > amounts[item]) {
      amounts[item] = amount;
    }
  }

  return amounts;
}

function extractAuctionItems(text) {
  const clean = text.replace(
    /,?\s*\d{1,2}:\d{2}\s*(?:am|pm)?\s*-\s*\+?\d[\d\s]{7,}\s+(?:joined|left|added|removed).*?(?:\n|$)/gi,
    ""
  );

  const regex =
    /#(\d+)\s+(.+?)\s+Base price\s+₹?\d+\s+Buy out price\s+₹?(\d+)/gi;

  const items = [];

  for (const m of clean.matchAll(regex)) {
    items.push({
      item: Number(m[1]),
      title: m[2].trim(),
      buyOutPrice: Number(m[3]),
    });
  }

  return items;
}

const WhatsAppAuctionAnalyzer = () => {
  const [messages, setMessages] = useState(null);
  const [auctions, setAuctions] = useState([]);

  const isDefault = messages === null;

  const parseWhatsAppChat = (text) => {
    const lines = text.split("\n");
    const parsedMessages = [];
    const auctions = [];
    let isAuctionRunning = false;
    let auctionIndex = 0;
    let currentMessage = null;

    const messageRegex =
      /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s*[ap]m)?)\s*-\s*([^:]+):\s*(.*)$/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(messageRegex);

      if (match) {
        if (currentMessage) {
          const isAdmin = currentMessage.sender === ADMIN;
          const hasItem = !!currentMessage.message.match(/base price/i)?.length;
          const hasWinner =
            !!currentMessage.message.match(/Congratulations @/i)?.length;

          if (isAdmin) {
            if (hasItem) {
              isAuctionRunning = true;
              if (!auctions[auctionIndex]) {
                auctions[auctionIndex] = {
                  messages: [],
                  startTime: currentMessage.time,
                  bidders: {},
                  items: extractAuctionItems(currentMessage.message),
                };
              }
            }
            if (isAuctionRunning && hasWinner) {
              isAuctionRunning = false;
              auctionIndex++;
            }
          }

          if (isAuctionRunning) {
            auctions[auctionIndex].messages.push(currentMessage);
            if (!isAdmin) {
              if (!auctions[auctionIndex].bidders[currentMessage.sender]) {
                auctions[auctionIndex].bidders[currentMessage.sender] = {
                  bids: [],
                };
              }
              const currentBid =
                auctions[auctionIndex].bidders[currentMessage.sender].bids;
              const bidMsg = currentMessage.message.replace(
                /,?\s*\d{1,2}:\d{2}\s*(?:am|pm)?\s*-\s*\+?\d[\d\s]{7,}\s+(?:joined|left|added|removed).*?(?:\n|$)/gi,
                ""
              );
              const updatedBids = getHighestBids(bidMsg, currentBid) ?? [];
              if (
                auctions[auctionIndex]?.bidders[currentMessage.sender]?.bids
              ) {
                auctions[auctionIndex].bidders[currentMessage.sender].bids = [
                  ...updatedBids,
                ];
              }
            }
          } else {
            if (hasWinner && auctions[auctionIndex - 1]) {
              auctions[auctionIndex - 1].messages.push(currentMessage);
              auctions[auctionIndex - 1].endTime = currentMessage.time;
            }
          }

          parsedMessages.push(currentMessage);
        }

        const [, date, time, sender, messageText] = match;
        currentMessage = {
          id: parsedMessages.length + 1,
          date: date.trim(),
          time: time.trim(),
          sender: sender.trim(),
          message: messageText.trim(),
          lineNumber: i + 1,
        };
      } else if (currentMessage && line.trim()) {
        currentMessage.message += "\n" + line.trim();
      }
    }

    if (currentMessage) {
      parsedMessages.push(currentMessage);
    }
    return [parsedMessages, auctions];
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const [parsedMsgs, parsedAuctions] = parseWhatsAppChat(text);
      setMessages(parsedMsgs);
      setAuctions(parsedAuctions);
    };
    reader.readAsText(file);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "whatsapp-messages.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 pb-20 max-w-5xl mx-auto min-h-screen">
      <HUDContainer title="Files" icon={FileText} color="bg-nintendo-red" defaultOpen={isDefault}>
        <div className="space-y-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-main rounded-2xl cursor-pointer bg-bg-app hover:bg-bg-app/50 transition-all group">
            <Upload className="w-8 h-8 mb-2 text-nintendo-red group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-text-main">Upload Chat</span>
            <input type="file" className="hidden" accept=".txt" onChange={handleFileUpload} />
          </label>

          {messages && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={downloadJSON} className="switch-btn switch-btn-blue py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                <Download size={14} /> Download
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(messages, null, 2));
                  alert("Copied!");
                }} 
                className="switch-btn switch-btn-red py-2 rounded-xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Code size={14} /> Copy
              </button>
            </div>
          )}
        </div>
      </HUDContainer>

      <header className="mb-12">
        <h1 className="text-3xl font-pixel text-accent-main mb-2">AUCTION ANALYZER</h1>
        <p className="text-text-muted font-bold text-xs uppercase tracking-widest opacity-50">Data Stream Active</p>
      </header>

      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {auctions.map((m, i) => (
            <div className="material-card !p-0 overflow-hidden" key={i}>
              <div className="bg-bg-app p-4 flex justify-between items-center border-b-2 border-border-main">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-nintendo-red flex items-center justify-center text-white font-pixel text-xs">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Session ID</p>
                    <p className="font-mono text-xs font-bold">{m.startTime} - {m.endTime || '...'}</p>
                  </div>
                </div>
                <Share2 size={16} className="text-text-muted cursor-pointer hover:text-nintendo-red" />
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-nintendo-red flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nintendo-red animate-pulse" />
                    Detected Items
                  </p>
                  <div className="space-y-3">
                    {m.items.map((k, n) => (
                      <div key={n} className="flex justify-between items-center bg-bg-app/50 p-4 rounded-2xl border border-border-main group hover:border-nintendo-red/30 transition-colors">
                        <span className="font-bold text-text-main capitalize">{k.title}</span>
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black text-text-muted uppercase">Buyout</span>
                          <span className="font-black text-nintendo-red">₹{k.buyOutPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-nintendo-blue flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-nintendo-blue animate-pulse" />
                    Active Bidders
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(m.bidders).map((k) => (
                      <span key={k} className="px-4 py-2 rounded-xl bg-bg-app text-[10px] font-black text-text-main border border-border-main hover:bg-nintendo-blue hover:text-white hover:border-nintendo-blue transition-all cursor-default">
                        @{k.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-20">
          <FileText size={80} className="mb-6" />
          <p className="font-pixel text-xs">Waiting for Data Uplink</p>
        </div>
      )}
    </div>
  );
};

export default WhatsAppAuctionAnalyzer;
