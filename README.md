# 🎮 App Box

A modular collection of lightweight utility tools and proof-of-concepts (POCs) built with a focus on modern UX, performance, and offline-first persistence.

## 🕹️ Experience Design
App Box features a unique **Nintendo Switch / Material Design hybrid** aesthetic. It is built to feel like a modern gaming console's utility suite.

- **Switch-Material Theme:** High-contrast accents (Nintendo Red & Blue) combined with Material You's rounded geometry and elevated surfaces.
- **Dual Mode Support:** Fully responsive Light and Dark themes that persist across sessions.
- **NavDock Navigation:** A fixed bottom navigation "dock" for instantaneous tool switching from any page.
- **HUD Interface:** Collapsible floating "Heads-Up Display" control panels for tool inputs, keeping the focus on your data output.
- **Typography:** Modern "Outfit" font paired with retro "Press Start 2P" pixel-style headers.
- **Offline-First (PWA):** Full service-worker support for asset caching and offline functionality.

## 🛠️ Included Tools

### 📱 WhatsApp Auction Analyzer
A specialized parser for WhatsApp chat exports.
- **Input:** `.txt` chat export file.
- **Functionality:** Automatically detects auction starts, bids, and winners.
- **Output:** Structured JSON data and interactive session reports.

### 🎲 Randomizer (with Pokemon Reveal)
More than just a random number generator.
- **Functionality:** Generates random numbers (0-9999) with 4-digit padding.
- **Pokemon Reveal:** If the number matches a Dex ID, a mystery Pokemon card appears with species and type-specific coloring.
- **Experience:** 3D card-flip reveal with smart offline caching for Pokemon data.

### 💧 Hydration Meter (Hydro-Pulse)
Track your daily water intake with a gaming aesthetic.
- **Visuals:** Dynamic liquid-fill animation with wave physics.
- **Config:** Customizable daily goals and container sizes (e.g., 250ml, 500ml).
- **Daily Sync:** Automatically resets your progress every 24 hours.
- **Persistence:** Remembers your goal and intake history locally.

## 🚀 Tech Stack
- **Framework:** React 19 + Vite
- **PWA:** Vite PWA Plugin
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Typography:** Outfit, Press Start 2P
- **Persistence:** LocalStorage API

## 📋 Philosophy & Criteria
- **Simplicity:** One tool, one job.
- **Atomicity:** Modular, reusable component architecture.
- **Offline-First:** No server-side dependencies.
- **Operation-as-Code:** Consistent and clean implementation.

---
*Built as a "Basis" project component.*
