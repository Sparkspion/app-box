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
5.  **Validation:**
    - Verify the tool appears on the dashboard.
    - Test "Customize" mode reordering and visibility toggling.
    - Ensure the NavDock synchronizes correctly.

## 🔍 diagnostics-pro
**Purpose:** Expert guidance for investigating system health, PWA performance, and data layer integrity.

**Instructions:**
1.  Analyze `src/components/DebugPage.jsx` to understand current health checks.
2.  Use the "Storage Explorer" to verify data prefixing and serialization.
3.  Monitor "Sync Status" to ensure persistence logic is firing as expected.
4.  Suggest enhancements to the `DebugPage` if new technical layers are added.
