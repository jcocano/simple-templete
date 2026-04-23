# Simple Template

Open-source, local-first desktop app to design email templates visually — a no-code Beefree alternative for macOS, Windows and Linux.

- Visual block-based editor (sections → columns → blocks)
- Local SQLite storage, nothing leaves your machine
- Export HTML, MJML, plain text or ZIP (HTML + images)
- Built-in test-send via SMTP
- Pre-flight review (21 automated checks)
- Light / dark with three accent themes (indigo, ocean, violet)
- Fully i18n: Spanish (default), English, Portuguese, French, Japanese, Chinese

## Install

### From source

```sh
git clone https://github.com/jcocano/simple-templete.git
cd simple-templete
npm install
npm run dev
```

Requires Node 20+ and a working C toolchain for `better-sqlite3` (comes pre-installed on most dev machines).

### Pre-built binaries

Not shipped yet — coming with v0.1.0 release. Until then, build locally with `npm run dist`.

## Build

- `npm run dev` — Vite + Electron with live reload
- `npm run build:web` — Vite production bundle into `dist/`
- `npm run pack` — packaged `.app` / `.exe` / unpacked Linux, no installer
- `npm run dist` — full installers into `release/` (unsigned on a dev machine)

## Status

v0.1 — first public cut. No auto-update yet; no code-signing on the local build (macOS will ask you to confirm the first open in System Settings → Privacy & Security).

## License

[MIT](./LICENSE) — Jesus Cocaño.
