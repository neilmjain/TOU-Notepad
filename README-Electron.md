# TOU-Notepad — Electron wrapper

This repo contains your original `index.html` UI. The Electron scaffold here allows running the web UI as a desktop app with an always-on-top floating window.

## Run (development)

1. From the project root install dev deps:

```bash
npm install
```

2. Start the Electron app:

```bash
npm start
```

This opens the main window which loads `index.html` from the repo root.

## Build (macOS)

```bash
npm run build
```

The `build` target uses `electron-builder` and will create a DMG under `dist/` by default.

## Notes & integration
- The main process is `main.js` and the renderer is `index.html` (unchanged).
- A small `preload.js` exposes `window.electronAPI.createFloating()` and `closeFloating()` for the renderer to request a floating always-on-top window.
- The scaffold intentionally keeps the renderer files in place so integration is minimal; if you want tighter integration (control only the notepad inside the floating window), I can patch `index.html` to call `electronAPI.createFloating()` from the floating toggle and to listen for `floating` in the query string to change behavior.
