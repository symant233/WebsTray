# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WebsTray is an Electron application that allows users to pin web apps to the system tray. It uses React for the UI, Zustand for state management, Tailwind CSS for styling, and Electron Forge with Vite for building.

## Common Commands

- **Development**: `npm run dev` or `npm start` - Start the Electron app in development mode with hot reload
- **Linting**: `npm run lint` - Run ESLint on the codebase
- **Packaging**: `npm run package` - Package into a platform-specific executable bundle
- **Build distributables**: `npm run make` - Create installers for distribution
- **Publish**: `npm run publish` - Publish to configured distribution channels

## Architecture

### Process Model

The app follows Electron's multi-process architecture:

1. **Main Process** (`src/main.ts`): Entry point that creates the main window and handles app lifecycle
2. **Preload Script** (`src/preload.ts`): Securely exposes limited Node/Electron APIs to the renderer via `contextBridge`
3. **Renderer Process** (`src/client/index.tsx`): React application that renders the UI

### Window Types

The app creates two types of windows:

- **Main Window**: The primary application window showing the app list and settings
- **Tray Windows**: Pop-up windows created when clicking on a tray icon; each web app gets its own tray window with an embedded webview

Window logic is in `src/main-process/window.ts`. Tray windows are positioned relative to the tray icon using helpers in `src/main-process/helper.ts`.

### IPC Communication

IPC channels are defined in `src/preload.ts` and handled in `src/main-process/ipcListener.ts`:

| Channel | Direction | Purpose |
|---------|-----------|---------|
| `minimize-window` | Renderer → Main | Minimize the main window |
| `open-window` | Renderer → Main | Create a new tray window for a URL |
| `reload-window` | Renderer → Main | Reload the current window |
| `open-external` | Renderer → Main | Open URL in system browser |
| `set-proxy` | Renderer → Main | Configure session proxy settings |
| `set-tray-icon` | Renderer → Main | Update tray icon from webview favicon |

### State Management

- **Zustand store** (`src/client/hooks/useDataStore.ts`): Persists app data (recent/favorite web apps) and config (proxy, theme) to `localStorage` under key `webs-tray-storage`
- **Theme handling** (`src/client/hooks/useTheme.ts`): Supports `light`, `dark`, and `system` modes
- **Hotkeys** (`src/client/hooks/useHotkey.ts`): App-level keyboard shortcuts (e.g., F5 to reload)

### Rendering Modes

The renderer switches behavior based on `location.hash`:
- **No hash**: Renders the main app (frame, input, content list)
- **With hash**: Renders `TrayContent` with an embedded webview for the URL in the hash

### Build Configuration

- **Vite configs**: Separate configs for main (`vite.main.config.ts`), preload (`vite.preload.config.ts`), and renderer (`vite.renderer.config.ts`) processes
- **Path aliases**: `@` maps to `./src`, `@client` maps to `./src/client`
- **Electron Forge** (`forge.config.ts`): Configured with makers for Squirrel (Windows), ZIP, DEB, and RPM

### Important Files

- `src/main-process/constant.ts`: Window bounds constants and tray dimensions
- `src/main-process/session.ts`: Session-level configuration (user agent, etc.)
- `src/interface.d.ts`: TypeScript declarations for the exposed `window.electron` API
- `src/client/types.ts`: Core data types (`IData`, `ThemeMode`)

### Security Considerations

- BrowserWindow has `webviewTag: true` and `nodeIntegration: true` to support embedded web apps
- Preload script is the only bridge between renderer and main process
- When modifying IPC, update both `preload.ts` and `ipcListener.ts` and restart the app to reload the preload script
