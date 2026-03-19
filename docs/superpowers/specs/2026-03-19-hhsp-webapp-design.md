# Hardware Hacking Starter Pack — Interactive Webapp Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Repo:** seedon198/Hardware-Hacking-Starter-Pack

---

## Overview

Convert the existing markdown-based Hardware Hacking Starter Pack (~55 articles across 9 sections) into an interactive learning web application, deployed to GitHub Pages. The app adds progress tracking, a skill tree, full-text search, guided learning paths, bookmarks, and difficulty filtering on top of the existing content — without changing the markdown source format or adding a build framework.

A content quality pass runs in parallel: fix the README structure, standardise ASCII art fencing, repair broken diagrams, and fill shallow sections.

---

## Architecture

### Tech Stack

- **Vanilla JS (ES2020)**, no framework, no build step
- **marked.js** (CDN) — markdown rendering
- **No other dependencies**
- Deployed to GitHub Pages from the `frontend/` directory via GitHub Actions

### File Structure

```
Hardware-Hacking-Starter-Pack/
├── frontend/
│   ├── index.html            — app shell, CDN imports
│   ├── styles.css            — brutalist theme, all component styles
│   ├── app.js                — all rendering, routing, and feature logic
│   └── content-index.json    — pre-built article metadata (nav + search)
├── scripts/
│   └── build-index.py        — generates content-index.json from markdown files
├── sections/                 — existing markdown content (unchanged structure)
│   ├── 01-foundations/
│   ├── 02-communication-protocols/
│   │   ├── wired/
│   │   └── wireless/
│   ├── 03-firmware/
│   ├── 04-attack-vectors/
│   ├── 05-reverse-engineering/
│   ├── 06-embedded-security/
│   ├── 07-specialized-domains/
│   ├── 08-professional/
│   └── 09-resources/
└── .github/workflows/
    └── deploy-pages.yml      — deploys frontend/ to GitHub Pages on push to main
```

### Content Loading

- `frontend/content-index.json` is committed to the repo. It contains for every article: `path`, `title`, `section`, `section_num`, `difficulty`, `tags[]`, and `preview` (first 300 chars of body text). Built by `scripts/build-index.py`.
- Full article bodies are fetched on demand from GitHub raw URLs (`https://raw.githubusercontent.com/seedon198/Hardware-Hacking-Starter-Pack/main/<path>`) and cached in a `Map` in memory for the session duration.
- Search, navigation, learning paths, and the skill tree all operate against `content-index.json` — no article body fetches needed until the user opens an article.

### Routing

Hash-based routing: `#/sections/02-communication-protocols/wired/02-i2c-protocol`. Browser back/forward works. URLs are shareable and deep-linkable. On load, the app reads the hash and navigates to the matching article, or shows the dashboard if no hash is present.

---

## Visual Design

### Aesthetic: Technical / Brutalist

Inspired by PCB schematics, datasheet layouts, and terminal interfaces. High contrast, monospace typography, visible structural borders.

### CSS Custom Properties (Dark — default)

```css
--bg-primary:    #0a0a0a;
--bg-card:       #111111;
--bg-hover:      #1a1a1a;
--border:        #333333;
--border-strong: #ffffff;
--text-primary:  #e0e0e0;
--text-secondary:#888888;
--text-muted:    #444444;
--accent:        #ffff33;   /* amber yellow — primary accent */
--accent-green:  #00ff41;   /* code / completed */
--accent-red:    #ff3333;   /* advanced / error */
--accent-orange: #ff8800;   /* intermediate */
--font-mono:     'Courier New', 'Lucida Console', monospace;
```

### CSS Custom Properties (Light)

```css
--bg-primary:    #f5f5f0;
--bg-card:       #ffffff;
--bg-hover:      #eeeeea;
--border:        #cccccc;
--border-strong: #000000;
--text-primary:  #111111;
--text-secondary:#555555;
--text-muted:    #aaaaaa;
--accent:        #886600;
--accent-green:  #007700;
--accent-red:    #cc0000;
--accent-orange: #cc5500;
```

---

## Layout

### Top Bar (full width, sticky)

```
[ HH:SP ] Hardware Hacking Starter Pack    [ ⌕ Search all 55 articles... ⌘K ]  [BEGINNER] [INTERMEDIATE] [ADVANCED]  [☀ LIGHT]
```

- Left: `HH:SP` wordmark (monospace, accent-coloured colon) + subtitle
- Centre: Search trigger box (opens modal on click or ⌘K/Ctrl+K)
- Right: Three difficulty toggle buttons + theme toggle

### Main Area

Two panels side by side, separated by a `2px solid var(--border-strong)` border.

**Left sidebar (260px, fixed):**
Three tabs — `CONTENTS` / `ON PAGE` / `BOOKMARKS`

- **CONTENTS tab**: progress bar at top (overall % + active path label), then a collapsible section tree. Each section header shows section number, name, and `n/total ✓` count. Each article item shows completion checkbox (`■` done / `□` todo), title, and a right-aligned difficulty badge.
- **ON PAGE tab**: auto-generated TOC from `##` and `###` headings in the current article. Active heading highlighted in accent colour as user scrolls (IntersectionObserver).
- **BOOKMARKS tab**: list of bookmarked articles. Click to navigate, click bookmark icon again to remove.

**Content area (flex: 1):**

- Thin filter strip below top bar showing active difficulty filters and current path position (`PATH: BEGINNER ▸ Topic 12 of 35`)
- Article header: section reference (`§02.wired.02`), breadcrumb, title (large, all-caps), difficulty badge, topic tags, `[ MARK COMPLETE ✓ ]` button
- Article body: rendered markdown, max-width 820px, 40px side padding
- Floating `[ SKILL TREE ]` button fixed bottom-right

---

## Features

### 1. Progress Tracking

- Each article has a `[ MARK COMPLETE ✓ ]` button in its header.
- State stored in `localStorage` as a `Set` of completed article paths, serialised to JSON.
- Section headers in the nav tree show live completion counts (`4/4 ✓`).
- Overall % shown in sidebar progress bar. Updates immediately on mark/unmark.

### 2. Skill Tree

- Full-screen overlay, triggered by the floating `[ SKILL TREE ]` button.
- Pure CSS/HTML node graph (no SVG, no canvas). Nine section nodes arranged in a left-to-right progression grid, connected by horizontal/diagonal `border` lines via pseudo-elements.
- Node states:
  - **Completed** (all articles done): amber border + filled background
  - **In progress** (some done): white border, amber label
  - **Not started**: dark grey border, muted label
- Clicking a node closes the overlay and navigates to that section's first article.
- Close with `Escape` or a `[ × CLOSE ]` button.

### 3. Full-Text Search

- ⌘K / Ctrl+K opens a full-screen modal overlay.
- Search runs client-side against `content-index.json` fields: `title`, `section`, `tags`, `preview`.
- Results show: section reference badge, article title, difficulty badge, matching preview snippet with the search term highlighted.
- Keyboard navigation: `↑`/`↓` to move between results, `Enter` to open, `Escape` to close.
- No network request — instant results.

### 4. Guided Learning Paths

Three pre-defined sequences in `app.js`:

| Path | Sequence summary |
|------|-----------------|
| `BEGINNER` | Foundations (all) → Wired Protocols (basic) → Firmware → Projects |
| `SOFTWARE DEV` | Foundations → Firmware → Attack Vectors → Embedded Security → IoT |
| `ELECTRONICS ENG` | Foundations (fast) → All Protocols → Reverse Engineering → Attack Vectors |

- Selected via a modal on first visit (path stored in `localStorage`).
- Active path drives the sidebar progress bar and the filter strip's `Topic N of M` counter.
- `[ CHANGE PATH ]` button in the sidebar footer re-opens the path selector.
- Path navigation: `[ ← PREV ]` / `[ NEXT → ]` buttons at the bottom of each article.

### 5. Bookmarks

- Bookmark icon button in each article header. Filled when bookmarked.
- Stored in `localStorage` as an array of `{ path, title, section }`.
- Accessible from the `BOOKMARKS` sidebar tab.
- Maximum 50 bookmarks; oldest dropped when limit reached.

### 6. Difficulty Filter

- Three toggle buttons in the top bar: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`.
- Toggling a difficulty off greys out those articles in the nav tree and hides them from learning path progression.
- At least one difficulty must remain active (last active one cannot be deselected).
- Filter state persisted in `localStorage`.

### 7. Dark / Light Mode

CSS custom properties on `:root` (dark) overridden by `body.light`. Toggle button in top bar. Persisted in `localStorage`. Default: dark.

### 8. ASCII Art Rendering

In markdown files, ASCII diagrams use fenced code blocks labelled `ascii` or `ansi`:

````markdown
```ascii
VCC ──┬── SDA
      R
      │
GND ──┴── SCL
```
````

The custom marked.js renderer wraps these blocks in:

```html
<pre class="ascii-art">...</pre>
```

CSS styling:
```css
.ascii-art {
  color: var(--accent);           /* amber */
  background: #0d0d0d;
  border-left: 3px solid var(--accent);
  text-shadow: 0 0 8px var(--accent);
  font-family: var(--font-mono);
  padding: 1rem 1.25rem;
  overflow-x: auto;
  line-height: 1.4;
}
```

Regular code blocks (` ```bash `, ` ```c `, etc.) retain the standard green-on-dark styling.

---

## app.js Sections

Built incrementally. Each section is self-contained:

1. **Constants & Config** — DATA_URL base, PATHS definitions, SECTIONS manifest
2. **Theme** — `applyTheme()`, toggle handler, localStorage persistence
3. **Router** — hash-change listener, `navigate(path)`, history management
4. **Content Index** — `loadIndex()`, `fetchArticle(path)`, in-memory cache
5. **Sidebar** — nav tree render, TOC watcher (IntersectionObserver), bookmarks panel
6. **Search** — modal open/close, filter logic, keyboard navigation
7. **Skill Tree** — overlay render, node state computation, click handling
8. **Learning Paths** — path modal, `getNextArticle()`, `getPrevArticle()`, progress bar
9. **Article Renderer** — `renderArticle(md)`, custom marked renderer for ASCII art, `[ MARK COMPLETE ]` handler, difficulty filter application
10. **Init** — `DOMContentLoaded`, load index, apply saved state, route to initial hash

---

## scripts/build-index.py

Reads all markdown files under `sections/`, extracts:

- `path` — relative path from repo root (e.g. `sections/02-communication-protocols/wired/02-i2c-protocol.md`)
- `title` — first `# Heading` in the file
- `section_num` — parsed from directory name (`02`)
- `section` — human name (e.g. `Communication Protocols`)
- `difficulty` — from a metadata comment `<!-- difficulty: intermediate -->` at the top of the file, or inferred from directory depth
- `tags` — from `<!-- tags: uart, serial, debug -->` metadata comment
- `preview` — first 300 characters of non-heading, non-code body text

Outputs `frontend/content-index.json`. Run locally to bootstrap; also runs as a step in the GitHub Actions deploy workflow so the index auto-updates when articles change.

---

## Content Work

### README.md

- Remove `class="glass-table"` and `class="difficulty-*"` HTML attributes — render as plain markdown table on GitHub
- Remove duplicate "Secure Communications" row (appears twice in the embedded security section)
- Fix the `<div align="center">` wrapping the full document — keep only around the header badge block

### All 55 Markdown Files

1. **Metadata comments** — add `<!-- difficulty: beginner -->` and `<!-- tags: ... -->` to every file for `build-index.py`
2. **ASCII art fencing** — re-fence all ASCII diagrams with ` ```ascii ` so the webapp highlights them
3. **ASCII art errors** — fix misaligned characters, broken box-drawing, incorrect signal timing diagrams
4. **Shallow sections** — expand thin content in: fault injection pt.2, supply chain pts.2 & 3, advanced RE techniques (decapsulation methodology), mobile security baseband section
5. **Broken links** — audit and fix all relative cross-links between files
6. **Consistency** — standardise heading hierarchy (`#` title, `##` sections, `###` subsections) across all files

---

## GitHub Actions Deploy

`.github/workflows/deploy-pages.yml` — triggers on push to `main` when files under `frontend/**` or `sections/**` change:

1. Checkout
2. Run `python scripts/build-index.py` to regenerate `frontend/content-index.json`
3. Configure GitHub Pages
4. Upload `frontend/` as the Pages artifact
5. Deploy

GitHub Pages source must be set to **GitHub Actions** in repo settings.

---

## Out of Scope

- User accounts or server-side state (all state is localStorage)
- Comments or community features
- Auto-refresh of article content (manual browser refresh updates to latest)
- Versioning or changelogs
- Quiz / knowledge-check features
- Mobile app
