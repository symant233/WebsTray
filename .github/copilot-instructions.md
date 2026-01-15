# Copilot / AI Agent Instructions for WebsTray

Purpose: help an AI coding agent be immediately productive in this repo — how the app is wired, what to change, where to run it, and project-specific conventions.

Quick start

- Dev: `npm run dev` (runs `electron-forge start` with Vite plugin)
- Package: `npm run package` (builds platform bundle)
- Make distributable: `npm run make`

High-level architecture

- Electron app with Vite + Electron Forge. Entrypoints:
  - main process: `src/main.ts`
  - preload script: `src/preload.ts` (exposes `window.electron` helpers)
  - renderer bootstrap: `src/renderer.ts` → mounts React app at `src/client/index.tsx`
- Main-process helpers and window logic are in `src/main-process/*` (see `window.ts`, `ipcListener.ts`, `helper.ts`, `session.ts`).
- The UI is React + TypeScript in `src/client/` with Tailwind CSS; Zustand is used for persisted state.

Important runtime flows / integration points

- Tray windows: created by `createTrayWindow(url)` in `src/main-process/window.ts`. In dev this loads `MAIN_WINDOW_VITE_DEV_SERVER_URL + '/#<url>'`; packaged loads `renderer/<VITE_NAME>/index.html` with `hash`.
- Renderer determines tray mode by `location.hash` and renders `TrayContent` (see `src/client/index.tsx` and `src/client/components/TrayContent.tsx`).
- IPC channels (preload ↔ main): defined in `src/preload.ts` (exposed names) and handled in `src/main-process/ipcListener.ts`:
  - `minimize-window` — minimize main window
  - `open-window` — create a tray window for given URL
  - `reload-window` — reload window
  - `open-external` — open external URL via `shell.openExternal`
  - `set-proxy` — calls `session.defaultSession.setProxy(...)`
  - `set-tray-icon` — updates tray icon for a specific tray origin (used in tray windows)

State and patterns

- Persisted store: `src/client/hooks/useDataStore.ts` — Zustand with `persist`, storage key `webs-tray-storage` (uses `localStorage`). Keep mutations via provided actions (`addRecent`, `addFavorite`, `updater`, etc.).
- Theme: `src/client/hooks/useTheme.ts` supports `system|light|dark`; global theme applied in `src/client/index.tsx`.
- Hotkeys: `src/client/hooks/useHotkey.ts` used for app-level shortcuts (e.g., F5 reload).

Project-specific conventions and gotchas

- Webviews enabled: BrowserWindow `webPreferences` set `webviewTag: true` and `nodeIntegration: true` in `src/main-process/window.ts` for embedded web apps. Be cautious about security when editing these.
- Preload surface: `window.electron` is the limited API surface — modify `src/preload.ts` and mirror listeners in `src/main-process/ipcListener.ts` (note: `ipcListener` returns a remover that calls `ipcMain.removeAllListeners(...)` — when editing preload/ipc listeners you may need to restart the app to reload the preload script).
- Dev vs packaged asset paths: use `getPublicAsset()` in `src/main-process/helper.ts` which checks `MAIN_WINDOW_VITE_DEV_SERVER_URL` to select public files in dev vs packaged `process.resourcesPath`.
- Tray window positioning is computed in `src/main-process/helper.ts` (`setTrayWindowPosition`) — modify carefully if changing tray UI size.

Where to look for common changes

- Add UI: `src/client/components/` (split into `common`, `Content`, `Setting` subfolders)
- Add main-process behavior: `src/main-process/` (window, ipc, session)
- Preload API changes: `src/preload.ts` and update listeners in `src/main-process/ipcListener.ts`
- Assets: `public/` (app icon is `public/WebsTray.png`)

Build & environment

- Vite + Electron Forge plugin injects runtime constants: `MAIN_WINDOW_VITE_DEV_SERVER_URL` and `MAIN_WINDOW_VITE_NAME` (see `forge.env.d.ts`). Use these when reasoning about URLs and asset paths.

Notes for PRs / edits

- Keep changes minimal and focused. Follow existing TypeScript patterns.
- When touching IPC handlers, ensure both `preload.ts` and `ipcListener.ts` are kept in sync.
- Use the persisted Zustand store for global state; do not add ad-hoc global variables.

If anything here is unclear or you need more detail (e.g., specific file walkthroughs, example code changes, or to run the app locally), tell me which area to expand.
