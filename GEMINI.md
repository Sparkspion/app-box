# App Box Project Mandates

This document contains foundational mandates for the App Box project. These instructions take absolute precedence over general workflows.

## 🎯 Project Philosophy (Basis)
App Box is a component of the "Basis" ecosystem. All development must adhere to:
- **Simplicity:** One tool, one job. Avoid feature creep.
- **Atomicity:** Modular, reusable component architecture.
- **Offline-First:** All tools must function without a server. Assets should be cached via PWA.
- **Operation-as-Code:** Consistent, clean, and self-documenting implementation.

## 🎨 Experience Design (XD)
- **Aesthetic:** A "Nintendo Switch / Material Design hybrid."
- **Colors:** Primary use of Nintendo Red (`#E60012`) and Nintendo Blue (`#00A0E4`).
- **UI Components:**
  - Use `material-card` for container surfaces.
  - Use `switch-btn` for primary actions.
  - Use `HUDContainer` for collapsible settings/config panels.
- **Navigation:** All primary tools must be accessible via the homepage dashboard and the bottom `NavDock`.

## 🏗️ Technical Standards
- **Data Layer:** NEVER use `localStorage` directly. Use the `storage` utility from `src/utils/storage.js` to ensure all data is prefixed with `box-`.
- **Tool Registration:** To add a new tool:
  1. Create the component in `src/components/`.
  2. Register it in `src/utils/appsConfig.js`.
  3. Add the route in `src/App.jsx`.
- **State Management:** Prefer persisted component state using the `usePersistedState` pattern (or equivalent `storage` utility wrapper) for anything the user would expect to remain after a reload.

## 🔍 Validation Protocol
- **Persistence Check:** Always verify that settings and state survive a page refresh.
- **PWA Integrity:** Ensure any new assets (icons, etc.) are compatible with service worker caching.
- **Customization Sync:** Verify that new tools respect the "Customize" mode (ordering and visibility) on the dashboard and NavDock.
