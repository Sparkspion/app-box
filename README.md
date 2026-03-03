# 🎮 App Box

A modular collection of lightweight utility tools and proof-of-concepts (POCs) built with a focus on modern UX, performance, and offline-first persistence.

## 🕹️ Experience Design
App Box features a unique **Nintendo Switch / Material Design hybrid** aesthetic. It is built to feel like a modern gaming console's utility suite.

- **Switch-Material Theme:** High-contrast accents (Nintendo Red & Blue) combined with Material You's rounded geometry and elevated surfaces.
- **Dual Mode Support:** Fully responsive Light and Dark themes that persist across sessions.
- **NavDock Navigation:** A fixed bottom navigation "dock" for instantaneous tool switching from any page.
- **HUD Interface:** Collapsible floating "Heads-Up Display" control panels for tool inputs, keeping the focus on your data output.
- **Typography:** Modern "Outfit" font paired with retro "Press Start 2P" pixel-style headers.

## 🛠️ Included Tools

### 📱 WhatsApp Auction Analyzer
A specialized parser for WhatsApp chat exports.
- **Input:** `.txt` chat export file.
- **Functionality:** Automatically detects auction starts (base price), bid messages, and auction winners (Congratulations).
- **Output:** Structured JSON data ready for download or clipboard copying.
- **HUD Controls:** File upload and action buttons tucked into a collapsible top-right panel.

### 🎲 Randomizer (with Pokemon Reveal)
More than just a random number generator.
- **Functionality:** Generates random numbers within a customizable range (persisted via `localStorage`).
- **Pokemon Reveal:** If the generated number is a valid National Dex ID (1-1024), a mystery Pokemon card appears.
- **Experience:** Click the Pokeball to "catch" and reveal the Pokemon with a 3D spinning and card-flip animation.

## 🚀 Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Typography:** Google Fonts (Outfit, Press Start 2P)
- **Persistence:** LocalStorage API

## 📋 Philosophy & Criteria
- **Simplicity:** No unnecessary bloat; each tool does one thing well.
- **Atomicity:** Modular components that are easy to maintain or refactor.
- **Offline-First:** No server-side dependencies for tool functionality.
- **Operation-as-Code:** Clean, readable, and consistent logic.

---
*Built as a "Basis" project component.*
