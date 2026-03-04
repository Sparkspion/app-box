# 🎮 App Box v1.1.0

A modular collection of lightweight utility tools and proof-of-concepts (POCs) built with a focus on modern UX, performance, and offline-first persistence.

## 🕹️ Experience Design
App Box features a unique **Nintendo Switch / Material Design hybrid** aesthetic. It is built to feel like a modern gaming console's utility suite.

- **Switch-Material Theme:** High-contrast accents (Nintendo Red & Blue) combined with Material You's rounded geometry and elevated surfaces.
- **Persistent Header:** Modern sticky header with safe-area support for PWA standalone mode.
- **Flip-Card Discovery:** Homepage interactive 3D flip cards for quick tool launching and advanced configuration.
- **Scrollable NavDock:** A fixed bottom navigation "dock" optimized for mobile reach with horizontal overflow support.
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
- **Entropy Engine:** Generates random numbers (0-9999) with customizable ranges.
- **Pokemon Reveal:** Matches results against Dex IDs to reveal interactive 3D Pokemon cards.
- **Coin Oracle:** Integrated coin flip widget using RNG output as a seed for true randomization. Supports "Best Of" series (1, 3, 5).
- **Settings:** Configurable min/max ranges and session persistence.

### 💧 Hydration Meter (Hydro-Pulse)
Track your daily water intake with a gaming aesthetic.
- **Visuals:** Dynamic liquid-fill animation with wave physics.
- **Config:** Customizable daily goals, depletion rates, and intake persistence.
- **Vitality System:** Real-time vitality decay based on sync intervals.
- **Persistence:** Remembers goals and progress across sessions.

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
