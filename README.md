# 🎮 App Box v1.2.0

A modular collection of lightweight utility tools and proof-of-concepts (POCs) built with a focus on modern UX, performance, and offline-first persistence.

## 🕹️ Experience Design
App Box features a unique **Nintendo Switch / Material Design hybrid** aesthetic. It is built to feel like a modern gaming console's utility suite.

- **Switch-Material Theme:** High-contrast accents (Nintendo Red & Blue) combined with Material You's rounded geometry and elevated surfaces.
- **Persistent Header:** Modern sticky header with a **functional Network Status Dot** (pulsing Green for Online, Red for Offline) and integrated Theme Toggle.
- **Flip-Card Discovery:** Homepage interactive 3D flip cards for quick tool launching and advanced configuration.
- **Scrollable NavDock:** A fixed bottom navigation "dock" optimized for mobile reach, now featuring a dedicated **System Diagnostics** module.
- **Adaptive HUD:** Collapsible configuration FAB aligned with the NavDock that auto-opens for first-time setup and collapses once synced.
- **Offline-First (PWA):** Full service-worker support for asset caching and offline functionality.

## 🛠️ Included Tools

### 📱 WhatsApp Auction Analyzer
A specialized parser for WhatsApp chat exports.
- **Input:** `.txt` chat export file.
- **Functionality:** Automatically detects auction starts, bids, and winners.
- **Output:** Structured JSON data and interactive session reports.

### 🎲 Randomizer (with Pokemon Reveal & Coin Oracle)
More than just a random number generator.
- **Entropy Engine:** Generates random numbers (0-9999) with accessible **"Resync"** buttons across all modules and a dedicated mobile FAB.
- **Pokemon Reveal:** Matches results against Dex IDs to reveal interactive 3D Pokemon cards.
- **Coin Oracle:** **Realistic 3D Coin Flip** animation with high-velocity rotation. Uses RNG output as a seed for true randomization. Supports "Best Of" series (1, 3, 5).
- **Settings:** Configurable min/max ranges via the adaptive HUD.

### 💧 Hydration Meter (Hydro-Pulse)
Track your daily water intake with a technical HUD aesthetic.
- **Visuals:** Refined liquid-fill animation with **Scanline Effects**, background **Scan Grids**, and technical corner HUD accents.
- **System Vitality:** Advanced health logic balancing daily intake against constant time-based decay (`100 + Progress% - Decay`).
- **Smart Notifications:** Automated alerts triggered when vitality falls below 25% (Critical), featuring a 1-hour cooldown.
- **HUD Interface:** Clean "Awaiting Uplink" state that hides foreground metrics until the first intake is recorded.

### 🛠️ System Diagnostics (Debug)
Internal toolkit for app health monitoring and data management.
- **Connectivity:** Real-time Network status and synchronization timestamps.
- **Readiness Tests:** Automated verification of PWA registration, Cache Storage, Service Worker status, and Notification API support.
- **Storage Explorer:** Live view of all `localStorage` keys and values with a one-tap "Purge All Data" function.
- **Environment Info:** Hardware and browser diagnostics (OS, Screen Resolution, Browser Agent).

## 🚀 Tech Stack
- **Framework:** React 19 + Vite
- **PWA:** Vite PWA Plugin
- **Styling:** Tailwind CSS v4 (with 3D animations)
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Persistence:** LocalStorage API

## 📋 Philosophy & Criteria
- **Simplicity:** One tool, one job.
- **Atomicity:** Modular, reusable component architecture.
- **Offline-First:** No server-side dependencies.
- **Operation-as-Code:** Consistent and clean implementation.

---
*Built as a "Basis" project component.*
