# App Box 📦

A modular collection of utility tools designed with a "Nintendo-meets-Material" aesthetic. Built for speed, offline-first reliability, and a clean user experience.

## ✨ Core Principles
- **Simplicity:** One tool per view, no clutter.
- **Atomicity:** Independent modules that don't depend on each other.
- **Offline-First:** PWA support for use without an internet connection.
- **Manual Control:** No background syncing or automated triggers; you are in control.
- **Network Integrity:** Centralized and authorized communication channels.

## 🛠 Modules

### 🤖 Proxil
Advanced collector reconnaissance tool for tracking the next grail using real-time market intelligence.
- **Dual-Source Engine:** Native support for Shopify (`/products.json`) and Generic scrapers.
- **New Intel Tracking:** Persistent "seen" state with highlighting for new arrivals.
- **Watchlist:** Save your grails to a persistent list for quick monitoring.
- **Market Filters:** Sort by price (INR) or newest additions.

### 💧 Hydrometer
A manual water intake tracker with liquid physics and custom vessel configuration.
- **Vessel Registry:** Configure custom glass/bottle sizes for one-tap injection.
- **Interactive UI:** Dynamic wave animations based on current intake.
- **Sync Diagnostics:** Track last intake time and remaining target.

### 📈 Wauction
Advanced auction intelligence engine for analyzing WhatsApp bid streams.
- **Bid Extraction:** Automatically identifies bids and winners from raw text logs.
- **Inventory Lineage:** Tracks item frequency and valuation history.
- **Spending Ledger:** Aggregated collector stats and spending summaries.

### 🔄 Convertor
Molecular and Currency transformation engine.
- **Currency Mode:** Real-time exchange rates (powered by Frankfurter API).
- **Molecular Mode:** Convert volume (ml) to mass (g) with substance density presets.
- **Offline Cache:** One-hour caching strategy for exchange rates.

### 🃏 Randomizer
A true random number generator with hidden rewards.
- **Range Control:** Define min and max boundaries.
- **Pokemon Reveal:** High-roll results reveal entity data from PokéAPI.
- **Persistent State:** Remembers your last roll between sessions.

### ⚡ MyBit
Atomic habit tracker for consistent daily wins.
- **Habit Stacking:** Group related tasks for maximum efficiency.
- **Consistency Bars:** Visual feedback on your current streak.

## 🌐 Infrastructure

### Network Intelligence
Centralized oversight of all external communication channels.
- **AUTHORIZED_DOMAINS:** registry of all allowed external endpoints.
- **System Diagnostics:** Network Intel module in the Debug Page for real-time visibility.

## 🚀 Tech Stack
- **Framework:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **PWA:** Vite PWA Plugin
- **Data:** Frankfurer API, PokéAPI, AllOrigins Proxy

## 📦 Installation
1. Clone the repository.
2. Run `npm install`.
3. Start development with `npm run dev`.
4. Build for production with `npm run build`.

## 🎨 UI/UX Philosophy
Inspired by modern gaming consoles and material design:
- **High Contrast:** Bold blacks, crisp whites, and vibrant accents.
- **Tactile Feedback:** Scale and rotation animations on interactions.
- **HUD Elements:** Scanlines, corner accents, and pixel-style typography.
