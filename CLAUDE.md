# CLAUDE.md

This file is the **single source of truth** for any AI agent operating in this repo. Both Claude Code (`CLAUDE.md`) and Cursor (`AGENTS.md` symlink) read this file. Keep edits here, not in duplicates.

User-facing conversations are in Spanish.

## Agent operating contract

All agents (Claude Code, Cursor, sub-agents) must follow these three rails at all times.

### 1. Agentic workflow — AI-DLC

Non-trivial work runs through the AI-DLC plugin (`ai-dlc@ai-dlc`, enabled in `.claude/settings.local.json`). State is filesystem-first under `.ai-dlc/` and survives `/clear` and cross-agent handoff.

- **Elaborate first** (`/ai-dlc:elaborate`) for any feature, refactor, or bug investigation beyond a one-liner. Writes `intent.md`, `completion-criteria.md`, `discovery.md` into `.ai-dlc/{slug}/`.
- **Execute through hats** (`/ai-dlc:execute`). Default workflow: `planner → builder → reviewer`. Don't skip hats. Advance when done, fail back on reviewer rejection.
- **Persist state in files, not context**: `current-plan.md`, `scratchpad.md`, `blockers.md`, `iteration.json`. Update them during work so the next iteration (or the other agent) can resume.
- **One Bolt = one pass through the workflow for one unit.** Keep iterations focused; `/clear` is a feature, not a failure.
- **Project config** lives in `.ai-dlc/settings.yml`. Per-intent overrides in `.ai-dlc/{slug}/settings.yml`. Unit frontmatter wins over intent wins over global.
- **Cursor mirrors the same flow**: when running agentically in Cursor, follow the same hat discipline and read/write the same `.ai-dlc/{slug}/state/` files. Do not invent a parallel state store.

### 2. Cross-session memory — Engram MCP

Engram (`plugin-engram-engram`) is persistent memory that survives compactions and cross-agent handoff. Use it proactively, without being asked:

- **`mem_context`** at the start of any non-trivial session to load recent work on this project.
- **`mem_search`** before assuming something isn't written down (past decisions, bugs, conventions).
- **`mem_save`** immediately after: any architectural decision, bug fix with a non-obvious cause, discovery about the codebase, convention the user establishes, or preference they state. Do not batch; save when it happens.
- **`mem_session_summary`** before ending a session where meaningful work was done. Mandatory before saying "done" on a multi-step task.
- Keep notes topical and scoped to the project slug (`simple-templete`). Engram observations are searchable; write them as if the next agent has zero context.

### 3. Project context

## Project

**Mailcraft** — local, open-source (MIT) cross-platform desktop app (Electron) for non-technical users to build email templates visually, no-code. Positioned as a Beefree.io alternative, targeting both B2B and B2C mailing use cases. UX bar: extremely simple, modern, on par with Discord or VS Code in polish and multi-platform support.

The current checkout is a **design handoff prototype** landed at the repo root as an iterable starting point — UI copy is Spanish and scope decisions are driven by the handoff, not re-asked. Future work will refactor this prototype toward the architecture principles below.

User-facing conversations are in Spanish.

## Architecture principles (non-negotiable)

These are hard rules for new code and the direction all refactors must move toward:

1. **Single Responsibility** — one function does one thing. No helpers that do three things at once.
2. **Visual / logic decoupling** — `.tsx` files in the renderer are for presentation only. They must contain no business logic: they call functions exported from libraries (under `lib/` or a future `src/lib/`, `src/services/`, etc.). Logic lives in libs, components consume it.
3. **Modular by feature** — organize code by feature with clear boundaries; don't pile more into already-large files.
4. **DRY** with the rule of three — extract an abstraction only on the third repetition, not before.
5. **Persistence** — internal app state (settings, user data, anything beyond trivial UI state) belongs in a **SQLite** store, not scattered `localStorage` keys. The current prototype uses `localStorage` heavily (`mc:screen`, `mc:tweaks`, `mc:onboard`); that is prototype state, not the target.
6. **Cross-platform** — Windows, macOS, Linux. Don't hard-code platform assumptions.

When the existing code violates these (and a lot of it does — screen files are large, logic is inlined in `.tsx`, globals leak onto `window`), new work should not copy that pattern. Refactor opportunistically; introduce the lib/service layer as features land.

## Commands

- `npm run dev` — runs Vite (port 5173) + Electron concurrently via `concurrently`; Electron waits on `127.0.0.1:5173` before launching.
- `npm run dev:web` — Vite only (useful to iterate the renderer in a browser).
- `npm run dev:electron` — Electron only, pointed at a running Vite. Needs `ELECTRON_RUN_AS_NODE` unset in the env (the scripts strip it with `env -u`).
- `npm run start` — Electron against the static `index.html` (no Vite).
- `npm run build:web` — Vite production bundle to `dist/`.

No test runner, no lint, no typecheck configured. `.tsx` is a JSX convenience only — there is no TypeScript compiler in the pipeline.

## Architecture

### Electron shell (`electron/main.js`)
Single file, no preload, no IPC. `contextIsolation: true`, `nodeIntegration: false`. In dev it reads `ELECTRON_START_URL` and opens detached DevTools; otherwise it loads `index.html` from disk. Renderer is a pure web app — there is nothing Electron-specific in `src/`.

### Renderer loading model (IMPORTANT)
This is **not** a normal ES-module React app. Files under `src/` are loaded for side effects in a specific order from `src/main.tsx`, and each file attaches its exports to `window` via `Object.assign(window, { ... })`. Components then consume each other as globals: `window.I.xxx` for icons, `window.App`, `window.TEMPLATES`, `window.TWEAKS`, `window.toast`, `Dashboard`, `Editor`, etc.

Implications:
- **Order in `src/main.tsx` matters** — a file that uses `I.search` must be imported after `icons.tsx`. New files must register themselves (`Object.assign(window, { Foo })`) and be added to the import list at the right position.
- `React` is not imported in renderer files. `vite.config.js` uses `jsxRuntime: "classic"` and `oxc.jsxInject: 'import React from "react"'` so every `.tsx` gets React auto-injected at build time. `React.useState`, `React.useEffect` etc. are called off the injected binding.
- The root render is `<window.App />` in `src/main.tsx`.

### Screens and state
`src/app.tsx` is the screen orchestrator. Screen is one of `dashboard | gallery | editor | preview | library`, persisted to `localStorage` under `mc:screen`. Modals (`export`, `test`, `vars`, `settings`) are driven by a single `modal` state. `⌘K`/`Ctrl+K` opens the command palette; `⌘⇧R` opens the review panel. Auto-save is simulated with a `setInterval` stashed on `window.__mcAutoSave`.

### Document model
`src/data.tsx` defines a **section-based document**: `sections → columns → blocks`. Each section has `layout` (`1col | 2col | 3col`), a `style` (bg/text/padding/font/align) and one or more columns (`w%` width + `blocks[]`). Blocks are atomic (`type`, `data`, optional per-block style). `DEFAULT_DOC` is the seeded template; `BLANK_DOC` is the empty one; `SECTION_PRESETS` feeds the "Añadir sección" gallery. Email block renderers live in `src/email-blocks.tsx` and read `data.style`, `data.spacing`, `data.content` (with backward compat for older flat shape via `getContent`).

### Theming / Tweaks
All styles live in `index.html` (~800 lines of CSS). Theme switching is driven by attributes on `<html>`: `data-theme="<theme>-<mode>"`, `data-density`, `data-radius`, `data-panels`, plus `--font-sans` inline. Three themes × two modes are defined (`indigo|ocean|violet` × `light|dark`).

`window.TWEAKS` defaults are embedded in `index.html` between `/*EDITMODE-BEGIN*/ ... /*EDITMODE-END*/` markers so an external host can rewrite that JSON in place. The tweaks panel (`src/tweaks.tsx`) also talks to a parent window via `postMessage` using message types `__edit_mode_available`, `__activate_edit_mode`, `__deactivate_edit_mode`, `__edit_mode_set_keys`. User overrides are mirrored into `localStorage` under `mc:tweaks`.

### `lib/design-canvas.tsx`
Standalone Figma-like pan/zoom canvas component. It is **not** currently wired into `src/main.tsx` — treat it as a parked building block.

## Conventions worth preserving

- Keep the globals-on-`window` convention unless deliberately refactoring it; partial migration to ES modules will break the load order.
- Preserve the `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/` markers around `window.TWEAKS` in `index.html` — external tooling parses them.
- Spanish UI copy throughout. `localStorage` keys are namespaced `mc:*`.
- Do not add `Co-Authored-By` lines to commits (per global user config).
