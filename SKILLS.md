# App Box Specialized Skills

This document defines specialized agent skills for the App Box project. Call `activate_skill` with the skill name to receive expert guidance for specific tasks.

## 🛠️ tool-creator
**Purpose:** Streamlines the end-to-end process of adding a new utility tool to the App Box suite while enforcing all design and technical standards.

**Available Resources:**
- `src/components/HUDContainer.jsx`: Template for collapsible settings.
- `src/utils/storage.js`: Mandatory data persistence layer.
- `src/utils/appsConfig.js`: Tool registration file.
- `src/App.jsx`: Routing and navigation configuration.

**Instructions:**
1.  **Requirement Analysis:** Determine the core "one job" of the tool.
2.  **Scaffolding:**
    - Create a new component in `src/components/`.
    - Implement the `HUDContainer` for any tool-specific settings.
    - Use the `storage` utility for all persistence.
3.  **Registration:**
    - Export a new entry in `ALL_APPS` within `src/utils/appsConfig.js`.
    - Assign an appropriate Lucide icon and "Nintendo" brand color (`bg-nintendo-red`, `bg-nintendo-blue`, `bg-emerald-500`, etc.).
4.  **Integration:**
    - Import the component and add a `<Route>` in `src/App.jsx`.
    - **UI Mandate:** Do NOT modify the `NavDock` styles in `App.jsx` unless explicitly asked. Specifically, ensure the `nav` element does NOT have `overflow-hidden` to maintain horizontal scrolling for tool icons.
5.  **Validation:**
    - Verify the tool appears on the dashboard.
    - Test "Customize" mode reordering and visibility toggling.
    - Ensure the NavDock synchronizes correctly and remains scrollable if tools exceed the viewport width.

## 🔍 diagnostics-pro
**Purpose:** Expert guidance for investigating system health, PWA performance, and data layer integrity.

**Instructions:**
1.  Analyze `src/components/DebugPage.jsx` to understand current health checks.
2.  Use the "Storage Explorer" to verify data prefixing and serialization.
3.  Monitor "Sync Status" to ensure persistence logic is firing as expected.
4.  Suggest enhancements to the `DebugPage` if new technical layers are added.

## 🏷️ tool-namer
**Purpose:** Guidance for naming new tools or applications with a single-word, descriptive, and creative name.

**Instructions:**
1.  **Core Mandates:**
    - **Single Word:** Names must always be a single word.
    - **Descriptive Intent:** The name should hint at the tool's purpose (e.g., `Collex` for a collector tool).
    - **Phonetic Clarity:** Names should be easy to pronounce and sound like actual words, even if spelled creatively.
2.  **Naming Strategies:**
    - **Portmanteaus:** WhatsApp + Auction -> `Wauction`.
    - **Phonetic Innovation:** Collector + Action -> `Collex`, Hydration -> `Hydrometer`.
    - **Truncation & Suffixes:** Converter -> `Convertor`, Habit + Tracker -> `Habitex`.
    - **Root Extraction:** Water -> `Aqua`, Time -> `Chronos`.
3.  **Validation:**
    - Is it a single word?
    - Is it easy to pronounce?
    - Does it sound like a real word?
    - Can you tell what it does?

## 🚀 release-prep
**Purpose:** Efficiently manages the end-to-end release lifecycle, ensuring version integrity, environment readiness, and security compliance.

**Instructions:**
1.  **Version Synchronization:**
    - Identify the current version in `package.json`.
    - Increment the version (Patch, Minor, or Major) based on the scope of changes.
    - Verify the version is correctly reflected in the UI (e.g., `Home.jsx` system version string).
2.  **Environment Audit:**
    - Check `src/utils/network.js` to ensure all `ENDPOINTS` are configured for production (e.g., using the local `/api/proxy` instead of external development proxies).
    - Review `api/proxy.js` for security "best practices" (CORS, SSRF protection, and timeouts).
3.  **Integrity Check:**
    - Run `git status` to ensure no sensitive files or debug logs are being accidentally committed.
    - If a build script exists, verify it compiles without errors before finalizing.
4.  **Final Synthesis:**
    - Summarize the "Reason for Release" (New features, bug fixes, or infrastructure upgrades like the Vercel Proxy).
