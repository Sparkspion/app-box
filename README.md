# App Box 📦

A modular collection of utility tools designed with a "Nintendo-meets-Material" aesthetic. Built for speed, offline-first reliability, and a clean user experience.

## ✨ Core Principles
- **Simplicity:** One tool per view, no clutter.
- **Atomicity:** Independent modules that don't depend on each other.
- **Offline-First:** PWA support for use without an internet connection.
- **Security:** Zero network traffic for unauthorized users.
- **Manual Control:** No background syncing or automated triggers; you are in control.

## 🛠 Modules

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
- **Molecular Mode:** Convert volume (ml) to mass (g) with substance density presets.
- **Currency Mode:** Real-time exchange rates (Super Admin Only).
- **Offline Cache:** One-hour caching strategy for active exchange rates.

### 🃏 Randomizer
A true random number generator with hidden rewards.
- **Range Control:** Define min and max boundaries.
- **Pokemon Reveal:** High-roll results reveal entity data (Super Admin Only).
- **Persistent State:** Remembers your last roll between sessions.

### ⚡ MyBit
Atomic habit tracker for consistent daily wins.
- **Habit Stacking:** Group related tasks for maximum efficiency.
- **Consistency Bars:** Visual feedback on your current streak.

## 🔒 Security & Infrastructure

### Secure API Gateway
All external communication is routed through a secure serverless gateway (`/api/gateway`). This hides target URLs and API keys from the public frontend.

### Super Admin Uplink
Certain features that require external data fetching are gated.
- **Gatekeeper:** Restricted features show a "Locked" UI for public users.
- **Zero-Traffic:** No network calls are made unless a valid Admin Key is established.
- **Uplink Interface:** Admins can establish a secure session via the Debug page.

## 🚀 Tech Stack
- **Framework:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **PWA:** Vite PWA Plugin
- **Environment:** Vercel Serverless Functions

## 🎨 UI/UX Philosophy
Inspired by modern gaming consoles and material design:
- **High Contrast:** Bold blacks, crisp whites, and vibrant accents.
- **Tactile Feedback:** Scale and rotation animations on interactions.
- **HUD Elements:** Scanlines, corner accents, and pixel-style typography.
