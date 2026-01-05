import { useState } from "react";
import { Upload, Download, Code } from "lucide-react";

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

const WhatsAppParser = () => {
  const [messages, setMessages] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [_rawText, setRawText] = useState("");

  const parseWhatsAppChat = (text) => {
    const lines = text.split("\n");
    const parsedMessages = [];
    const auctions = [];
    let isAuctionRunning = false;
    let auctionIndex = 0;
    let currentMessage = null;

    // Regex to match: DD/MM/YY, HH:MM AM/PM - Sender: Message
    const messageRegex =
      /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s*(\d{1,2}:\d{2}(?:\s*[ap]m)?)\s*-\s*([^:]+):\s*(.*)$/i;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(messageRegex);

      if (match) {
        // Save previous message if exists
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
            // get bidder
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
            if (hasWinner) {
              auctions[auctionIndex - 1].messages.push(currentMessage);
              auctions[auctionIndex - 1].endTime = currentMessage.time;
            }
          }

          parsedMessages.push(currentMessage);
        }

        // Start new message
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
        // Multi-line message continuation
        currentMessage.message += "\n" + line.trim();
      }
    }

    // Don't forget the last message
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
      setRawText(text);
      const [parsedMsgs, parsedAuctions] = parseWhatsAppChat(text);
      setMessages(parsedMsgs);
      setAuctions(parsedAuctions);
    };
    reader.readAsText(file);
  };

  console.log(auctions);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(messages, null, 2));
    alert("JSON copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-4 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-800/50 text-center backdrop-blur rounded-lg shadow-2xl p-6 border border-slate-700">
          <h1 className="text-3xl font-bold text-white mb-2 text-center gap-3">
            Chat Analysis
          </h1>
          <p className="text-slate-400 mb-6">
            Parse WhatsApp chat exports into structured JSON data
          </p>

          <div className="mb-6">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-lg cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-slate-400" />
                <p className="mb-2 text-sm text-slate-300">
                  <span className="font-semibold">Click to upload</span>{" "}
                  WhatsApp chat export
                </p>
                <p className="text-xs text-slate-400">.txt file only</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          <div>
            {auctions.map((m, i) => (
              <div className="flex gap-2" key={i}>
                <div className="p-2">
                  <p>{m.startTime}</p>
                  <p>{m.endTime}</p>
                </div>
                <div className="text-left flex-1">
                  {m.items.map((k, n) => (
                    <div key={n} className="flex gap-4">
                      <p className="capitalize">{k.title}</p>
                      <p className="font-bold">{k.buyOutPrice}</p>
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  {Object.keys(m.bidders).map((k) => (
                    <p key={k} className="whitespace-nowrap">
                      {k}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {messages && (
            <div className="py-6">
              {/* Actions */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadJSON}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-all"
                >
                  <Download size={20} />
                  Download JSON
                </button>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded transition-all"
                >
                  <Code size={20} />
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}

          {!messages && (
            <div className="text-center py-12 text-slate-400">
              Upload your WhatsApp chat export to see parsed data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppParser;
