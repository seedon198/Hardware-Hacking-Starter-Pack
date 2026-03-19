# HHSP Interactive Webapp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Hardware Hacking Starter Pack into an interactive learning webapp deployed to GitHub Pages, with progress tracking, skill tree, full-text search, guided learning paths, bookmarks, and difficulty filtering.

**Architecture:** Vanilla JS (ES2020) + marked.js (CDN), no build step, no framework. A Python script generates `frontend/content-index.json` from the 57 markdown files; the frontend fetches article bodies on demand from GitHub raw URLs. All state is localStorage.

**Tech Stack:** Python 3 (build-index.py + pytest), Vanilla JS ES2020, marked.js CDN, CSS custom properties, GitHub Actions Pages deployment.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `scripts/build-index.py` | Generates `frontend/content-index.json` |
| Create | `tests/test_build_index.py` | pytest suite for build-index.py |
| Create | `frontend/index.html` | App shell, CDN imports, static structure |
| Create | `frontend/styles.css` | All styles — brutalist theme, layout, components |
| Create | `frontend/app.js` | All rendering, routing, and feature logic |
| Generate | `frontend/content-index.json` | Built by script; committed |
| Create | `.github/workflows/deploy-pages.yml` | CI/CD — build index → deploy Pages |
| Modify | `README.md` | Remove HTML class attrs, fix duplicate row, fix div wrapping |
| Modify | `sections/**/*.md` (57 files) | Add metadata comments, fix ASCII art, expand thin sections, fix links |

---

## Task 1: build-index.py + Tests

**Files:**
- Create: `scripts/build-index.py`
- Create: `tests/test_build_index.py`
- Generate: `frontend/content-index.json`

- [ ] **Step 1.1: Create test fixtures**

Create `tests/fixtures/` with minimal sample markdown files to test each extraction case:

```
tests/
  fixtures/
    sections/
      01-foundations/
        01-introduction.md      # has difficulty comment, tags comment
        index.md               # is_index test
      02-communication-protocols/
        wired/
          01-uart-protocol.md  # subsection test
        index.md
```

`tests/fixtures/sections/01-foundations/01-introduction.md`:
```markdown
<!-- difficulty: beginner -->
<!-- tags: foundations, intro -->

# Introduction to Hardware Hacking

Welcome to the hardware hacking starter pack. This guide covers the fundamentals.

```ascii
[HOST] ── USB ── [DEVICE]
```

More body text here to test preview extraction. Additional content to ensure we hit 300 chars in the preview for testing purposes so we can verify truncation works correctly and does not include HTML or headings.
```

`tests/fixtures/sections/01-foundations/index.md`:
```markdown
# Foundations

Overview of the foundations section.
```

`tests/fixtures/sections/02-communication-protocols/wired/01-uart-protocol.md`:
```markdown
# UART Protocol

UART is a serial communication protocol.
```

`tests/fixtures/sections/02-communication-protocols/index.md`:
```markdown
<!-- difficulty: intermediate -->

# Communication Protocols
```

- [ ] **Step 1.2: Write the failing tests**

`tests/test_build_index.py`:
```python
import json
import sys
import os
import pytest

# Allow importing from scripts/
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'scripts'))
import build_index

FIXTURE_ROOT = os.path.join(os.path.dirname(__file__), 'fixtures')


def get_entries(root=FIXTURE_ROOT):
    return build_index.build(root)


def find(entries, path_suffix):
    return next((e for e in entries if e['path'].endswith(path_suffix)), None)


class TestPathField:
    def test_no_md_extension(self):
        entries = get_entries()
        for e in entries:
            assert not e['path'].endswith('.md')

    def test_sections_prefix(self):
        entries = get_entries()
        for e in entries:
            assert e['path'].startswith('sections/')

    def test_specific_path(self):
        entries = get_entries()
        e = find(entries, '01-foundations/01-introduction')
        assert e is not None
        assert e['path'] == 'sections/01-foundations/01-introduction'


class TestTitleField:
    def test_extracts_h1(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['title'] == 'Introduction to Hardware Hacking'

    def test_fallback_filename(self, tmp_path):
        # File with no H1 heading
        sec = tmp_path / 'sections' / '01-foundations'
        sec.mkdir(parents=True)
        (sec / 'no-heading.md').write_text('Just some text without a heading.')
        entries = build_index.build(str(tmp_path))
        e = find(entries, 'no-heading')
        assert e['title'] == 'No Heading'


class TestSectionFields:
    def test_section_num(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['section_num'] == 1

    def test_section_name(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['section'] == 'Foundations'

    def test_subsection_null_for_flat(self):
        entries = get_entries()
        e = find(entries, '01-foundations/01-introduction')
        assert e['subsection'] is None

    def test_subsection_wired(self):
        entries = get_entries()
        e = find(entries, 'wired/01-uart-protocol')
        assert e['subsection'] == 'wired'


class TestIsIndex:
    def test_index_file(self):
        entries = get_entries()
        e = find(entries, '01-foundations/index')
        assert e['is_index'] is True

    def test_non_index_file(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['is_index'] is False


class TestDifficulty:
    def test_reads_comment(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['difficulty'] == 'beginner'

    def test_explicit_comment_overrides_fallback(self):
        entries = get_entries()
        e = find(entries, '02-communication-protocols/index')
        assert e['difficulty'] == 'intermediate'  # explicit, not inherited


class TestTags:
    def test_reads_tags(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert e['tags'] == ['foundations', 'intro']

    def test_empty_tags_when_absent(self):
        entries = get_entries()
        e = find(entries, '01-uart-protocol')
        assert e['tags'] == []


class TestPreview:
    def test_excludes_headings(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert 'Introduction to Hardware Hacking' not in e['preview']

    def test_excludes_code_blocks(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert '```' not in e['preview']
        assert 'USB' not in e['preview']  # inside ascii block

    def test_excludes_html_comments(self):
        entries = get_entries()
        e = find(entries, '01-introduction')
        assert '<!--' not in e['preview']

    def test_max_300_chars(self):
        entries = get_entries()
        for e in entries:
            assert len(e['preview']) <= 300


class TestOutputJSON:
    def test_writes_valid_json(self, tmp_path):
        out_path = tmp_path / 'content-index.json'
        build_index.build_and_write(FIXTURE_ROOT, str(out_path))
        with open(out_path) as f:
            data = json.load(f)
        assert isinstance(data, list)
        assert len(data) > 0
```

- [ ] **Step 1.3: Run tests — confirm they all fail**

```bash
cd /path/to/repo
pip install pytest
pytest tests/test_build_index.py -v 2>&1 | head -40
```

Expected: `ImportError: No module named 'build_index'` (script doesn't exist yet)

- [ ] **Step 1.4: Implement `scripts/build-index.py`**

```python
#!/usr/bin/env python3
"""
build-index.py — Generates frontend/content-index.json from sections/ markdown files.
Usage: python scripts/build-index.py [sections_root] [output_path]
"""

import json
import os
import re
import sys

SECTIONS_ROOT_DEFAULT = os.path.join(os.path.dirname(__file__), '..', 'sections')
OUTPUT_DEFAULT = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'content-index.json')

# Difficulty fallback rules — ordered, first match wins.
# Each rule is (pattern_fn, difficulty) where pattern_fn takes the relative path.
def _make_fallback_rules():
    def p(path, *fragments):
        return all(f in path for f in fragments)

    return [
        (lambda path: re.search(r'01-foundations/', path), 'beginner'),
        (lambda path: re.search(r'wired/0[123]-', path), 'beginner'),
        (lambda path: re.search(r'wired/0[456]-', path), 'intermediate'),
        (lambda path: re.search(r'wireless/index', path), 'beginner'),
        (lambda path: re.search(r'wireless/01-', path), 'beginner'),
        (lambda path: re.search(r'wireless/0[2-6]-', path), 'intermediate'),
        (lambda path: re.search(r'03-firmware/', path), 'intermediate'),
        (lambda path: re.search(r'04-attack-vectors/01-physical', path), 'intermediate'),
        (lambda path: re.search(r'04-attack-vectors/0[2-5]', path), 'advanced'),
        (lambda path: re.search(r'05-reverse-engineering/0[1-4]-', path), 'intermediate'),
        (lambda path: re.search(r'05-reverse-engineering/05-', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/01-secure-boot', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/02-memory', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/03-secure', path), 'advanced'),
        (lambda path: re.search(r'06-embedded-security/04-physical', path), 'intermediate'),
        (lambda path: re.search(r'06-embedded-security/05-security', path), 'advanced'),
        (lambda path: re.search(r'07-specialized-domains/', path), 'advanced'),
        (lambda path: re.search(r'08-professional/', path), 'all'),
        (lambda path: re.search(r'09-resources/', path), 'all'),
    ]

FALLBACK_RULES = _make_fallback_rules()


def _strip_leading_num(name):
    """'02-communication-protocols' → 'Communication Protocols'"""
    name = re.sub(r'^\d+-', '', name)
    return name.replace('-', ' ').title()


def _extract_metadata_comments(lines):
    """Parse <!-- difficulty: X --> and <!-- tags: a, b --> from first 10 lines."""
    difficulty = None
    tags = []
    for line in lines[:10]:
        m = re.match(r'<!--\s*difficulty:\s*(\w+)\s*-->', line.strip())
        if m:
            difficulty = m.group(1).lower()
        m = re.match(r'<!--\s*tags:\s*(.+?)\s*-->', line.strip())
        if m:
            tags = [t.strip() for t in m.group(1).split(',')]
    return difficulty, tags


def _extract_title(lines):
    """First # heading, or None."""
    for line in lines:
        m = re.match(r'^#\s+(.+)', line)
        if m:
            return m.group(1).strip()
    return None


def _extract_preview(content):
    """First 300 chars of non-heading, non-code-block, non-HTML body text."""
    lines = content.splitlines()
    in_code = False
    parts = []
    for line in lines:
        if line.strip().startswith('```'):
            in_code = not in_code
            continue
        if in_code:
            continue
        if line.strip().startswith('#'):
            continue
        if line.strip().startswith('<!--') or line.strip().startswith('-->'):
            continue
        if line.strip().startswith('<'):
            continue
        text = line.strip()
        if text:
            parts.append(text)
        if sum(len(p) for p in parts) >= 300:
            break
    preview = ' '.join(parts)
    return preview[:300]


def _fallback_difficulty(rel_path):
    """Apply fallback difficulty rules. rel_path is sections/... without .md."""
    for rule_fn, diff in FALLBACK_RULES:
        if rule_fn(rel_path):
            return diff
    return 'beginner'


def _compute_index_difficulty(section_dir, all_entries):
    """For index.md files: return the lowest difficulty of all non-index articles in same section tree."""
    order = ['beginner', 'intermediate', 'advanced', 'all']
    siblings = [
        e for e in all_entries
        if not e['is_index'] and e['path'].startswith(section_dir) and e['difficulty'] != 'all'
    ]
    if not siblings:
        return 'beginner'
    difficulties = [e['difficulty'] for e in siblings]
    for d in order:
        if d in difficulties:
            return d
    return 'beginner'


def build(sections_root):
    """Walk sections_root, return list of article dicts."""
    entries = []
    sections_root = os.path.abspath(sections_root)

    for dirpath, dirnames, filenames in os.walk(sections_root):
        dirnames.sort()
        for filename in sorted(filenames):
            if not filename.endswith('.md'):
                continue

            filepath = os.path.join(dirpath, filename)
            rel = os.path.relpath(filepath, os.path.dirname(sections_root))
            rel = rel.replace(os.sep, '/')
            path = rel[:-3]  # strip .md

            with open(filepath, encoding='utf-8') as f:
                content = f.read()
            lines = content.splitlines()

            # section_num + section name
            parts = path.split('/')
            # parts[0] = 'sections', parts[1] = '01-foundations', ...
            sec_dir = parts[1] if len(parts) > 1 else parts[0]
            sec_num_m = re.match(r'^(\d+)-', sec_dir)
            section_num = int(sec_num_m.group(1)) if sec_num_m else 0
            section = _strip_leading_num(sec_dir)

            # subsection — immediate subdir below section root
            subsection = None
            if len(parts) >= 4:  # sections / sec / sub / file
                subsection = parts[2]

            is_index = filename == 'index.md'

            difficulty_comment, tags = _extract_metadata_comments(lines)
            title = _extract_title(lines)
            if not title:
                base = filename[:-3]
                title = base.replace('-', ' ').title()

            preview = _extract_preview(content)

            entries.append({
                'path': path,
                'title': title,
                'section_num': section_num,
                'section': section,
                'subsection': subsection,
                'is_index': is_index,
                'difficulty': difficulty_comment,  # None = not yet resolved
                'tags': tags,
                'preview': preview,
            })

    # Second pass: resolve difficulty for non-index files without comment
    for e in entries:
        if e['difficulty'] is None and not e['is_index']:
            e['difficulty'] = _fallback_difficulty(e['path'])

    # Third pass: resolve index.md difficulty
    for e in entries:
        if e['difficulty'] is None and e['is_index']:
            # section_dir = everything up to and including the section root
            path_parts = e['path'].split('/')
            # For sections/01-foundations/index → section_dir is sections/01-foundations
            section_dir = '/'.join(path_parts[:2]) + '/'
            e['difficulty'] = _compute_index_difficulty(section_dir, entries)

    return entries


def build_and_write(sections_root, output_path):
    entries = build(sections_root)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(entries)} entries to {output_path}")


if __name__ == '__main__':
    root = sys.argv[1] if len(sys.argv) > 1 else SECTIONS_ROOT_DEFAULT
    out = sys.argv[2] if len(sys.argv) > 2 else OUTPUT_DEFAULT
    build_and_write(root, out)
```

- [ ] **Step 1.5: Run tests — all must pass**

```bash
pytest tests/test_build_index.py -v
```

Expected: all tests PASS. Fix any failures before continuing.

- [ ] **Step 1.6: Generate content-index.json**

```bash
python scripts/build-index.py
```

Expected: `Wrote 57 entries to frontend/content-index.json`. Open the file and spot-check 3–4 entries. Verify `is_index`, `difficulty`, `subsection` fields look correct.

- [ ] **Step 1.7: Commit**

```bash
git add scripts/build-index.py tests/ frontend/content-index.json
git commit -m "feat: add build-index.py and generate content-index.json"
```

---

## Task 2: HTML Shell

**Files:**
- Create: `frontend/index.html`

- [ ] **Step 2.1: Write `frontend/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Hardware Hacking Starter Pack</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════ TOP BAR -->
<header class="topbar" role="banner">
  <div class="topbar-brand">
    <span class="topbar-logo">HH<span class="accent">:</span>SP</span>
    <span class="topbar-subtitle">Hardware Hacking Starter Pack</span>
  </div>
  <button class="search-trigger" id="searchTrigger" aria-label="Open search (Ctrl+K)">
    <span class="search-icon">⌕</span>
    <span class="search-placeholder">Search articles...</span>
    <kbd>⌘K</kbd>
  </button>
  <nav class="topbar-right" aria-label="Difficulty and theme">
    <button class="diff-btn active" data-diff="beginner" aria-pressed="true">BEGINNER</button>
    <button class="diff-btn active" data-diff="intermediate" aria-pressed="true">INTERMEDIATE</button>
    <button class="diff-btn active" data-diff="advanced" aria-pressed="true">ADVANCED</button>
    <button class="theme-btn" id="themeBtn" aria-label="Toggle light mode">☀ LIGHT</button>
  </nav>
</header>

<!-- ═══════════════════════════════════════════════════════════ MAIN -->
<div class="main-layout">

  <!-- ─── SIDEBAR ─── -->
  <aside class="sidebar" role="complementary" aria-label="Navigation">
    <div class="sidebar-tabs" role="tablist">
      <button class="sidebar-tab active" data-tab="contents" role="tab" aria-selected="true">CONTENTS</button>
      <button class="sidebar-tab" data-tab="onpage" role="tab" aria-selected="false">ON PAGE</button>
      <button class="sidebar-tab" data-tab="bookmarks" role="tab" aria-selected="false">BOOKMARKS</button>
    </div>

    <!-- CONTENTS panel -->
    <div class="sidebar-panel active" id="panel-contents" role="tabpanel">
      <div class="progress-block">
        <div class="progress-header">
          <span class="label-accent">OVERALL PROGRESS</span>
          <span id="progressPct">0%</span>
        </div>
        <div class="progress-bar-outer" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="progressBar">
          <div class="progress-bar-inner" id="progressBarInner"></div>
        </div>
        <div class="progress-meta" id="progressMeta"></div>
      </div>
      <nav class="nav-tree" id="navTree" aria-label="Section navigation"></nav>
      <div class="sidebar-footer">
        <button class="sidebar-footer-btn" id="changePathBtn">[ CHANGE PATH ]</button>
      </div>
    </div>

    <!-- ON PAGE panel -->
    <div class="sidebar-panel" id="panel-onpage" role="tabpanel" hidden>
      <nav class="toc-list" id="tocList" aria-label="Table of contents"></nav>
    </div>

    <!-- BOOKMARKS panel -->
    <div class="sidebar-panel" id="panel-bookmarks" role="tabpanel" hidden>
      <div class="bookmark-list" id="bookmarkList"></div>
    </div>
  </aside>

  <!-- ─── CONTENT AREA ─── -->
  <main class="content-area" id="contentArea" role="main">
    <div class="filter-strip" id="filterStrip">
      <span class="filter-label">FILTER:</span>
      <div class="filter-indicators" id="filterIndicators"></div>
      <span class="path-position" id="pathPosition"></span>
    </div>

    <!-- Dashboard (shown when no article is open) -->
    <div id="dashboard" class="dashboard" hidden></div>

    <!-- Article view -->
    <article id="articleView" hidden>
      <header class="article-header" id="articleHeader"></header>
      <div class="article-body" id="articleBody"></div>
      <nav class="article-nav" id="articleNav"></nav>
    </article>

    <!-- Loading state -->
    <div id="loadingState" class="loading-state" hidden>
      <span class="loading-text">LOADING...</span>
    </div>

    <!-- Error state -->
    <div id="errorState" class="error-state" hidden></div>
  </main>
</div>

<!-- ═══════════════════════════════════════════════════════════ OVERLAYS -->

<!-- Search modal -->
<div class="overlay" id="searchOverlay" role="dialog" aria-modal="true" aria-label="Search" hidden>
  <div class="search-modal">
    <div class="search-input-row">
      <span class="search-icon-lg">⌕</span>
      <input type="search" id="searchInput" class="search-input" placeholder="Search articles, protocols, techniques..." autocomplete="off" />
      <kbd class="search-esc">ESC</kbd>
    </div>
    <div class="search-results" id="searchResults" role="listbox"></div>
  </div>
  <div class="overlay-backdrop" id="searchBackdrop"></div>
</div>

<!-- Skill tree overlay -->
<div class="overlay" id="skillTreeOverlay" role="dialog" aria-modal="true" aria-label="Skill Tree" hidden>
  <div class="skilltree-modal">
    <div class="skilltree-header">
      <span class="label-accent">SKILL TREE</span>
      <button class="close-btn" id="skillTreeClose" aria-label="Close skill tree">[ × CLOSE ]</button>
    </div>
    <div class="skilltree-graph" id="skillTreeGraph"></div>
  </div>
  <div class="overlay-backdrop" id="skillTreeBackdrop"></div>
</div>

<!-- Learning path selector modal -->
<div class="overlay" id="pathOverlay" role="dialog" aria-modal="true" aria-label="Choose Learning Path" hidden>
  <div class="path-modal" id="pathModal"></div>
  <div class="overlay-backdrop" id="pathBackdrop"></div>
</div>

<!-- Skill tree FAB -->
<button class="skilltree-fab" id="skillTreeFab" aria-label="Open skill tree">[ SKILL TREE ]</button>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2.2: Open in browser — verify it loads without JS errors**

Open `frontend/index.html` directly (file://) or serve with `python -m http.server 8000` from `frontend/`. Expected: blank page, no console errors, document title correct.

- [ ] **Step 2.3: Commit**

```bash
git add frontend/index.html
git commit -m "feat: add HTML app shell"
```

---

## Task 3: CSS — Brutalist Theme + Layout

**Files:**
- Create: `frontend/styles.css`

- [ ] **Step 3.1: Write `frontend/styles.css`**

Write the full stylesheet in sections. Complete content below:

```css
/* ═══════════════════════════════════════════════════ CUSTOM PROPERTIES */
:root {
  --bg-primary:     #0a0a0a;
  --bg-card:        #111111;
  --bg-hover:       #1a1a1a;
  --border:         #333333;
  --border-strong:  #ffffff;
  --text-primary:   #e0e0e0;
  --text-secondary: #888888;
  --text-muted:     #444444;
  --accent:         #ffff33;
  --accent-green:   #00ff41;
  --accent-red:     #ff3333;
  --accent-orange:  #ff8800;
  --font-mono:      'Courier New', 'Lucida Console', monospace;
  --topbar-h:       44px;
  --sidebar-w:      260px;
}

body.light {
  --bg-primary:     #f5f5f0;
  --bg-card:        #ffffff;
  --bg-hover:       #eeeeea;
  --border:         #cccccc;
  --border-strong:  #000000;
  --text-primary:   #111111;
  --text-secondary: #555555;
  --text-muted:     #aaaaaa;
  --accent:         #886600;
  --accent-green:   #007700;
  --accent-red:     #cc0000;
  --accent-orange:  #cc5500;
}

/* ═══════════════════════════════════════════════════════════ RESET */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 13px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
button { cursor: pointer; font-family: var(--font-mono); }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

/* ═══════════════════════════════════════════════════════════ TOP BAR */
.topbar {
  height: var(--topbar-h);
  background: var(--bg-card);
  border-bottom: 2px solid var(--border-strong);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  flex-shrink: 0;
  z-index: 100;
}
.topbar-brand { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.topbar-logo { font-size: 15px; font-weight: bold; letter-spacing: 0.15em; color: var(--text-primary); }
.topbar-subtitle { color: var(--text-secondary); font-size: 11px; border-left: 1px solid var(--border); padding-left: 12px; }
.accent { color: var(--accent); }

.search-trigger {
  flex: 1;
  max-width: 320px;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  text-align: left;
}
.search-trigger:hover { border-color: var(--accent); }
.search-trigger kbd {
  margin-left: auto;
  font-size: 10px;
  border: 1px solid var(--border);
  padding: 1px 4px;
  color: var(--text-muted);
  background: none;
}
.search-icon { color: var(--text-muted); }

.topbar-right { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }
.diff-btn, .theme-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 3px 9px;
  font-size: 11px;
  letter-spacing: 0.05em;
}
.diff-btn.active[data-diff="beginner"]     { border-color: var(--accent-green); color: var(--accent-green); }
.diff-btn.active[data-diff="intermediate"] { border-color: var(--accent-orange); color: var(--accent-orange); }
.diff-btn.active[data-diff="advanced"]     { border-color: var(--accent-red); color: var(--accent-red); }
.diff-btn:hover, .theme-btn:hover { border-color: var(--text-primary); color: var(--text-primary); }

/* ═══════════════════════════════════════════════════════════ LAYOUT */
.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ═══════════════════════════════════════════════════════════ SIDEBAR */
.sidebar {
  width: var(--sidebar-w);
  background: var(--bg-card);
  border-right: 2px solid var(--border-strong);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow: hidden;
}
.sidebar-tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.sidebar-tab {
  flex: 1;
  background: none;
  border: none;
  border-right: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 10px;
  padding: 7px 4px;
  letter-spacing: 0.05em;
}
.sidebar-tab:last-child { border-right: none; }
.sidebar-tab.active { color: var(--text-primary); background: var(--bg-hover); border-bottom: 2px solid var(--accent); }
.sidebar-tab:hover:not(.active) { color: var(--text-secondary); }

.sidebar-panel { display: flex; flex-direction: column; flex: 1; overflow: hidden; }
.sidebar-panel[hidden] { display: none; }

.progress-block {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}
.progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
.label-accent { color: var(--accent); font-size: 10px; letter-spacing: 0.1em; }
.progress-bar-outer {
  background: var(--bg-hover);
  border: 1px solid var(--border);
  height: 7px;
}
.progress-bar-inner { background: var(--accent); height: 100%; width: 0%; transition: width 0.3s; }
.progress-meta { color: var(--text-muted); font-size: 10px; margin-top: 4px; display: flex; justify-content: space-between; }

.nav-tree { flex: 1; overflow-y: auto; padding: 6px 0; }
.nav-section-header {
  padding: 5px 14px;
  color: var(--text-secondary);
  font-size: 10px;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
}
.nav-section-header:hover { color: var(--text-primary); }
.nav-section-header .section-toggle { color: var(--accent); }
.nav-section-header .section-count { margin-left: auto; color: var(--text-muted); font-size: 10px; }
.nav-items { /* shown by default */ }
.nav-items.collapsed { display: none; }

.nav-item {
  padding: 4px 14px 4px 26px;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav-item:hover { color: var(--text-primary); background: var(--bg-hover); }
.nav-item.active { color: var(--text-primary); background: var(--bg-hover); border-left: 2px solid var(--accent); padding-left: 24px; }
.nav-item.done { color: var(--text-muted); }
.nav-item.done .nav-check { color: var(--accent-green); }
.nav-item.filtered-off { color: var(--text-muted); opacity: 0.3; pointer-events: none; }

.diff-badge {
  font-size: 9px;
  padding: 1px 5px;
  border: 1px solid;
  margin-left: auto;
  flex-shrink: 0;
}
.diff-badge.beginner     { color: var(--accent-green); border-color: var(--accent-green); }
.diff-badge.intermediate { color: var(--accent-orange); border-color: var(--accent-orange); }
.diff-badge.advanced     { color: var(--accent-red); border-color: var(--accent-red); }
.diff-badge.all          { color: var(--text-muted); border-color: var(--border); }

.sidebar-footer {
  border-top: 1px solid var(--border);
  padding: 8px 14px;
  flex-shrink: 0;
}
.sidebar-footer-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 10px;
  padding: 4px 8px;
  width: 100%;
}
.sidebar-footer-btn:hover { border-color: var(--accent); color: var(--accent); }

/* TOC */
.toc-list { flex: 1; overflow-y: auto; padding: 8px 0; }
.toc-item {
  padding: 4px 14px;
  color: var(--text-muted);
  font-size: 11px;
  cursor: pointer;
  display: block;
}
.toc-item:hover { color: var(--text-primary); }
.toc-item.active { color: var(--accent); }
.toc-item.h3 { padding-left: 26px; font-size: 10px; }

/* Bookmarks */
.bookmark-list { flex: 1; overflow-y: auto; padding: 8px 0; }
.bookmark-item {
  padding: 6px 14px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.bookmark-item:hover { background: var(--bg-hover); }
.bookmark-title { color: var(--text-primary); font-size: 11px; }
.bookmark-section { color: var(--text-muted); font-size: 10px; }
.bookmark-empty { padding: 20px 14px; color: var(--text-muted); font-size: 11px; }

/* ═══════════════════════════════════════════════════════════ CONTENT AREA */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.filter-strip {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  padding: 5px 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: var(--text-muted);
  flex-shrink: 0;
}
.filter-label { flex-shrink: 0; }
.filter-indicators { display: flex; gap: 8px; }
.filter-indicator { font-size: 10px; padding: 1px 8px; border: 1px solid var(--border); }
.filter-indicator.on.beginner     { border-color: var(--accent-green); color: var(--accent-green); }
.filter-indicator.on.intermediate { border-color: var(--accent-orange); color: var(--accent-orange); }
.filter-indicator.on.advanced     { border-color: var(--accent-red); color: var(--accent-red); }
.path-position { margin-left: auto; color: var(--text-muted); font-size: 10px; flex-shrink: 0; }

/* ═══════════════════════════════════════════════════════════ ARTICLE */
.article-header {
  padding: 20px 40px 16px;
  border-bottom: 2px solid var(--border-strong);
  background: var(--bg-card);
  flex-shrink: 0;
}
.article-meta { color: var(--text-muted); font-size: 10px; letter-spacing: 0.08em; margin-bottom: 6px; }
.article-meta .section-ref { color: var(--accent); }
.article-title { font-size: 20px; font-weight: bold; color: var(--text-primary); letter-spacing: 0.06em; text-transform: uppercase; }
.article-tags { display: flex; gap: 8px; margin-top: 10px; align-items: center; flex-wrap: wrap; }
.tag { font-size: 10px; padding: 2px 8px; border: 1px solid var(--border); color: var(--text-secondary); }
.tag.beginner     { border-color: var(--accent-green); color: var(--accent-green); }
.tag.intermediate { border-color: var(--accent-orange); color: var(--accent-orange); }
.tag.advanced     { border-color: var(--accent-red); color: var(--accent-red); }
.mark-complete-btn {
  margin-left: auto;
  background: var(--bg-card);
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 4px 12px;
  font-size: 11px;
  flex-shrink: 0;
}
.mark-complete-btn.done { background: var(--accent); color: var(--bg-primary); }
.mark-complete-btn:hover { background: var(--accent); color: var(--bg-primary); }
.bookmark-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  padding: 4px 10px;
  font-size: 11px;
  flex-shrink: 0;
}
.bookmark-btn.active { border-color: var(--accent); color: var(--accent); }
.bookmark-btn:hover { border-color: var(--accent); color: var(--accent); }

.article-body {
  padding: 32px 40px;
  max-width: 860px;
  line-height: 1.75;
  color: var(--text-secondary);
}
.article-body h2 {
  color: var(--text-primary);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 32px 0 10px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
}
.article-body h3 {
  color: var(--accent);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 20px 0 8px;
}
.article-body p { margin-bottom: 12px; font-size: 12px; }
.article-body ul, .article-body ol { margin: 0 0 12px 20px; font-size: 12px; }
.article-body li { margin-bottom: 4px; }
.article-body code {
  background: var(--bg-hover);
  border: 1px solid var(--border);
  padding: 1px 5px;
  font-size: 11px;
  color: var(--accent-green);
}
.article-body pre.code-block {
  background: #0d0d0d;
  border: 1px solid var(--border);
  border-left: 3px solid var(--border);
  padding: 12px 16px;
  margin: 12px 0;
  font-size: 11px;
  color: var(--accent-green);
  line-height: 1.6;
  overflow-x: auto;
}
.article-body pre.code-block code {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
}

/* ASCII art — amber glow */
.article-body pre.ascii-art {
  color: var(--accent);
  background: #0d0d0d;
  border-left: 3px solid var(--accent);
  text-shadow: 0 0 8px var(--accent);
  padding: 1rem 1.25rem;
  margin: 12px 0;
  font-size: 11px;
  overflow-x: auto;
  line-height: 1.4;
}
body.light .article-body pre.ascii-art { text-shadow: none; }

.article-body table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 11px; }
.article-body th { border: 1px solid var(--border); padding: 6px 10px; color: var(--accent); text-align: left; background: var(--bg-hover); }
.article-body td { border: 1px solid var(--border); padding: 5px 10px; }
.article-body blockquote { border-left: 3px solid var(--accent); padding: 8px 16px; margin: 12px 0; color: var(--text-muted); font-style: italic; }

.article-nav {
  padding: 20px 40px 40px;
  display: flex;
  gap: 12px;
  max-width: 860px;
  border-top: 1px solid var(--border);
  margin-top: 20px;
}
.article-nav-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 7px 14px;
  font-size: 11px;
}
.article-nav-btn:hover { border-color: var(--accent); color: var(--accent); }
.article-nav-btn.next { margin-left: auto; }

/* ═══════════════════════════════════════════════════════════ DASHBOARD */
.dashboard { padding: 40px; max-width: 900px; }
.dashboard-title { font-size: 22px; font-weight: bold; color: var(--text-primary); letter-spacing: 0.08em; margin-bottom: 6px; }
.dashboard-subtitle { color: var(--text-secondary); font-size: 12px; margin-bottom: 32px; }
.dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
.dashboard-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 16px;
}
.dashboard-card-label { color: var(--accent); font-size: 10px; letter-spacing: 0.1em; margin-bottom: 8px; }
.dashboard-card-value { color: var(--text-primary); font-size: 24px; font-weight: bold; }
.dashboard-card-sub { color: var(--text-muted); font-size: 10px; margin-top: 4px; }

/* ═══════════════════════════════════════════════════════════ LOADING / ERROR */
.loading-state, .error-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}
.loading-text { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* ═══════════════════════════════════════════════════════════ OVERLAYS */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.overlay[hidden] { display: none; }
.overlay-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
}

/* Search modal */
.search-modal {
  position: relative;
  z-index: 1;
  background: var(--bg-card);
  border: 2px solid var(--border-strong);
  width: 100%;
  max-width: 660px;
  margin-top: 80px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}
.search-input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
}
.search-icon-lg { color: var(--text-muted); font-size: 18px; }
.search-input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
  outline: none;
}
.search-input::placeholder { color: var(--text-muted); }
.search-esc { font-size: 10px; border: 1px solid var(--border); padding: 2px 6px; color: var(--text-muted); background: none; }
.search-results { overflow-y: auto; flex: 1; }
.search-result {
  padding: 10px 16px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.search-result:hover, .search-result.focused { background: var(--bg-hover); }
.search-result-title { color: var(--text-primary); font-size: 12px; }
.search-result-meta { display: flex; align-items: center; gap: 8px; }
.search-result-preview { color: var(--text-muted); font-size: 11px; }
.search-result-preview mark { background: none; color: var(--accent); font-style: italic; }
.search-empty { padding: 24px 16px; color: var(--text-muted); font-size: 11px; text-align: center; }

/* Skill tree modal */
.skilltree-modal {
  position: relative;
  z-index: 1;
  background: var(--bg-card);
  border: 2px solid var(--border-strong);
  width: calc(100% - 80px);
  max-width: 860px;
  margin-top: 60px;
  padding: 24px;
}
.skilltree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.close-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 4px 10px;
  font-size: 11px;
}
.close-btn:hover { border-color: var(--accent-red); color: var(--accent-red); }

/* Skill tree graph */
.skilltree-graph { display: flex; flex-direction: column; gap: 16px; }
.skilltree-row { display: flex; align-items: center; gap: 0; }
.skilltree-node {
  background: var(--bg-primary);
  border: 2px solid var(--border);
  padding: 12px 16px;
  cursor: pointer;
  min-width: 130px;
  text-align: center;
  flex-shrink: 0;
}
.skilltree-node:hover { border-color: var(--text-primary); }
.skilltree-node.completed { border-color: var(--accent); background: rgba(255,255,51,0.06); }
.skilltree-node.in-progress { border-color: var(--text-primary); }
.skilltree-node-num { color: var(--text-muted); font-size: 10px; margin-bottom: 4px; }
.skilltree-node-name { color: var(--text-primary); font-size: 11px; letter-spacing: 0.05em; text-transform: uppercase; }
.skilltree-node.completed .skilltree-node-name { color: var(--accent); }
.skilltree-node-pct { font-size: 10px; color: var(--text-muted); margin-top: 4px; }
.skilltree-connector {
  height: 2px;
  flex: 1;
  background: var(--border);
  position: relative;
}
.skilltree-connector::after {
  content: '►';
  position: absolute;
  right: -6px;
  top: -8px;
  color: var(--border);
  font-size: 10px;
}

/* Learning path modal */
.path-modal {
  position: relative;
  z-index: 1;
  background: var(--bg-card);
  border: 2px solid var(--border-strong);
  width: 100%;
  max-width: 560px;
  margin-top: 80px;
  padding: 28px;
}
.path-modal h2 { color: var(--text-primary); font-size: 14px; letter-spacing: 0.1em; margin-bottom: 6px; }
.path-modal p { color: var(--text-secondary); font-size: 11px; margin-bottom: 20px; }
.path-option {
  border: 1px solid var(--border);
  padding: 14px 16px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.path-option:hover { border-color: var(--accent); }
.path-option.selected { border-color: var(--accent); background: rgba(255,255,51,0.05); }
.path-option-name { color: var(--text-primary); font-size: 13px; font-weight: bold; }
.path-option-desc { color: var(--text-muted); font-size: 11px; }
.path-option-count { color: var(--accent); font-size: 10px; }
.path-skip {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 11px;
  padding: 8px 0;
  text-decoration: underline;
  display: block;
  margin-top: 8px;
}
.path-skip:hover { color: var(--text-secondary); }

/* ═══════════════════════════════════════════════════════════ FAB */
.skilltree-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--bg-card);
  border: 2px solid var(--accent);
  color: var(--accent);
  padding: 10px 18px;
  font-size: 11px;
  letter-spacing: 0.1em;
  z-index: 200;
}
.skilltree-fab:hover { background: var(--accent); color: var(--bg-primary); }

/* ═══════════════════════════════════════════════════════════ SCROLLBAR */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: var(--border); }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
```

- [ ] **Step 3.2: Verify layout in browser**

Serve `frontend/` with `python -m http.server 8000`. Open `http://localhost:8000`. Verify:
- Top bar is visible with correct brand, search box, difficulty buttons, theme toggle
- Sidebar is 260px on the left with 3 tabs
- Content area fills remaining width
- Dark background (#0a0a0a) with correct accent colours

- [ ] **Step 3.3: Commit**

```bash
git add frontend/styles.css
git commit -m "feat: add brutalist theme CSS with full layout"
```

---

## Task 4: app.js — §1 Constants + §2 Theme

**Files:**
- Create: `frontend/app.js` (initial)

- [ ] **Step 4.1: Write `frontend/app.js` (sections 1–2)**

```javascript
/* ═══════════════════════════════════════════════ §1 CONSTANTS & CONFIG */

const RAW_BASE = 'https://raw.githubusercontent.com/seedon198/Hardware-Hacking-Starter-Pack/main/';
const INDEX_URL = 'content-index.json';

const SECTIONS_META = [
  { num: 1, name: '01 — FOUNDATIONS' },
  { num: 2, name: '02 — PROTOCOLS' },
  { num: 3, name: '03 — FIRMWARE' },
  { num: 4, name: '04 — ATTACK VECTORS' },
  { num: 5, name: '05 — REVERSE ENGINEERING' },
  { num: 6, name: '06 — EMBEDDED SECURITY' },
  { num: 7, name: '07 — SPECIALIZED DOMAINS' },
  { num: 8, name: '08 — PROFESSIONAL' },
  { num: 9, name: '09 — RESOURCES' },
];

const LEARNING_PATHS = {
  BEGINNER: {
    label: 'BEGINNER',
    description: 'Foundations-first. No prior hardware knowledge required.',
    articles: [
      'sections/01-foundations/01-introduction',
      'sections/01-foundations/02-lab-setup',
      'sections/01-foundations/03-tools-equipment',
      'sections/01-foundations/04-basic-electronics',
      'sections/02-communication-protocols/index',
      'sections/02-communication-protocols/wired/01-uart-protocol',
      'sections/02-communication-protocols/wired/02-i2c-protocol',
      'sections/02-communication-protocols/wired/03-spi-protocol',
      'sections/03-firmware/01-firmware-analysis',
      'sections/08-professional/01-learning-path',
      'sections/08-professional/05-project-ideas',
      'sections/08-professional/06-glossary',
    ],
  },
  SOFTWARE_DEV: {
    label: 'SOFTWARE DEV',
    description: 'Firmware and software-adjacent attack paths. Best if you code.',
    articles: [
      'sections/01-foundations/01-introduction',
      'sections/01-foundations/04-basic-electronics',
      'sections/03-firmware/01-firmware-analysis',
      'sections/04-attack-vectors/index',
      'sections/04-attack-vectors/01-physical-access',
      'sections/04-attack-vectors/02-side-channel',
      'sections/04-attack-vectors/03-fault-injection',
      'sections/06-embedded-security/index',
      'sections/06-embedded-security/01-secure-boot',
      'sections/06-embedded-security/02-memory-protection',
      'sections/06-embedded-security/03-secure-communications',
      'sections/07-specialized-domains/02-iot-security',
      'sections/08-professional/04-legal-ethical',
    ],
  },
  ELECTRONICS_ENG: {
    label: 'ELECTRONICS ENG',
    description: 'Protocol-heavy and RE-focused. Great if you have EE background.',
    articles: [
      'sections/01-foundations/01-introduction',
      'sections/01-foundations/03-tools-equipment',
      'sections/01-foundations/04-basic-electronics',
      'sections/02-communication-protocols/index',
      'sections/02-communication-protocols/wired/01-uart-protocol',
      'sections/02-communication-protocols/wired/02-i2c-protocol',
      'sections/02-communication-protocols/wired/03-spi-protocol',
      'sections/02-communication-protocols/wired/04-jtag-swd',
      'sections/02-communication-protocols/wired/05-usb-protocol',
      'sections/02-communication-protocols/wired/06-ethernet-protocols',
      'sections/02-communication-protocols/wireless/01-rf-fundamentals',
      'sections/02-communication-protocols/wireless/06-rfid-nfc',
      'sections/05-reverse-engineering/index',
      'sections/05-reverse-engineering/01-re-fundamentals',
      'sections/05-reverse-engineering/02-pcb-analysis',
      'sections/05-reverse-engineering/03-component-id',
      'sections/05-reverse-engineering/04-circuit-extraction',
      'sections/04-attack-vectors/01-physical-access',
      'sections/04-attack-vectors/04-hardware-implants',
    ],
  },
};

/* ═══════════════════════════════════════════════ §2 THEME */

const LS_THEME = 'hhsp_theme';

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'light' ? '☾ DARK' : '☀ LIGHT';
}

function initTheme() {
  const saved = localStorage.getItem(LS_THEME) || 'dark';
  applyTheme(saved);
  document.getElementById('themeBtn').addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem(LS_THEME, next);
    applyTheme(next);
  });
}
```

- [ ] **Step 4.2: Verify theme toggle works**

Open in browser. Click `☀ LIGHT` button. Page should switch to light mode. Click again for dark. Reload — theme should persist.

- [ ] **Step 4.3: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §1 constants + §2 theme"
```

---

## Task 5: app.js — §3 Router + §4 Content Index

**Files:**
- Modify: `frontend/app.js`

- [ ] **Step 5.1: Append §3 Router + §4 Content Index to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §3 ROUTER */

let _currentPath = null;

function navigate(path, pushState = true) {
  if (path === _currentPath) return;
  _currentPath = path;
  if (pushState) {
    window.location.hash = path ? `/${path}` : '';
  }
  if (path) {
    showArticle(path);
  } else {
    showDashboard();
  }
}

function getHashPath() {
  const hash = window.location.hash; // e.g. #/sections/01-foundations/01-introduction
  if (!hash || hash === '#' || hash === '#/') return null;
  return hash.replace(/^#\//, '');
}

window.addEventListener('hashchange', () => {
  const path = getHashPath();
  if (path !== _currentPath) {
    _currentPath = path;
    if (path) {
      showArticle(path);
    } else {
      showDashboard();
    }
  }
});

/* ═══════════════════════════════════════════════ §4 CONTENT INDEX */

let _index = [];            // Array<ArticleEntry>
const _articleCache = new Map(); // path → markdown string

async function loadIndex() {
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`Failed to load index: ${res.status}`);
  _index = await res.json();
}

async function fetchArticle(path) {
  if (_articleCache.has(path)) return _articleCache.get(path);
  const url = `${RAW_BASE}${path}.md`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Article not found: ${path} (${res.status})`);
  const md = await res.text();
  _articleCache.set(path, md);
  return md;
}

function getEntry(path) {
  return _index.find(e => e.path === path) || null;
}

function getEntriesForSection(sectionNum) {
  return _index.filter(e => e.section_num === sectionNum);
}
```

- [ ] **Step 5.2: Verify index loads (browser console)**

In browser console, after page load: `_index.length` should return 57. `getEntry('sections/01-foundations/01-introduction')` should return a full object.

- [ ] **Step 5.3: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §3 router + §4 content index"
```

---

## Task 6: app.js — §5 Sidebar

**Files:**
- Modify: `frontend/app.js`

- [ ] **Step 6.1: Append §5 Sidebar to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §5 SIDEBAR */

/* ── State ── */
const LS_PROGRESS  = 'hhsp_progress';   // JSON array of completed paths
const LS_FILTER    = 'hhsp_filter';     // JSON {beginner, intermediate, advanced}
const LS_BOOKMARKS = 'hhsp_bookmarks';  // JSON array of {path, title, section}
const LS_PATH_KEY  = 'hhsp_active_path'; // string key of LEARNING_PATHS

let _completed = new Set();
let _filter    = { beginner: true, intermediate: true, advanced: true };
let _bookmarks = [];
let _activePath = null; // key in LEARNING_PATHS or null

function loadState() {
  try { _completed = new Set(JSON.parse(localStorage.getItem(LS_PROGRESS) || '[]')); } catch {}
  try { _filter = { ...{ beginner: true, intermediate: true, advanced: true }, ...JSON.parse(localStorage.getItem(LS_FILTER) || '{}') }; } catch {}
  try { _bookmarks = JSON.parse(localStorage.getItem(LS_BOOKMARKS) || '[]'); } catch {}
  _activePath = localStorage.getItem(LS_PATH_KEY) || null;
}

function saveProgress()  { localStorage.setItem(LS_PROGRESS, JSON.stringify([..._completed])); }
function saveFilter()    { localStorage.setItem(LS_FILTER, JSON.stringify(_filter)); }
function saveBookmarks() { localStorage.setItem(LS_BOOKMARKS, JSON.stringify(_bookmarks)); }

/* ── Difficulty filter ── */
function isDifficultyVisible(diff) {
  if (diff === 'all') return true;
  return _filter[diff] !== false;
}

function initDifficultyButtons() {
  document.querySelectorAll('.diff-btn').forEach(btn => {
    const d = btn.dataset.diff;
    btn.classList.toggle('active', _filter[d]);
    btn.setAttribute('aria-pressed', String(_filter[d]));
    btn.addEventListener('click', () => {
      // At least one must remain active
      const active = Object.values(_filter).filter(Boolean).length;
      if (_filter[d] && active === 1) return;
      _filter[d] = !_filter[d];
      saveFilter();
      btn.classList.toggle('active', _filter[d]);
      btn.setAttribute('aria-pressed', String(_filter[d]));
      renderNavTree();
      renderFilterStrip();
      updateProgress();
    });
  });
}

/* ── Nav tree ── */
function renderNavTree() {
  const tree = document.getElementById('navTree');
  if (!tree) return;

  tree.innerHTML = SECTIONS_META.map(sec => {
    const entries = getEntriesForSection(sec.num);
    const nonIndex = entries.filter(e => !e.is_index);
    const done = nonIndex.filter(e => _completed.has(e.path));
    const allDone = nonIndex.length > 0 && done.length === nonIndex.length;
    const countStr = allDone ? `${nonIndex.length}/${nonIndex.length} ✓` : `${done.length}/${nonIndex.length}`;

    const items = entries.map(e => {
      const isDone = _completed.has(e.path);
      const isActive = e.path === _currentPath;
      const isOff = !isDifficultyVisible(e.difficulty);
      const cls = ['nav-item', isDone ? 'done' : '', isActive ? 'active' : '', isOff ? 'filtered-off' : ''].filter(Boolean).join(' ');
      const check = isDone ? '<span class="nav-check">■</span>' : '<span class="nav-check">□</span>';
      const badge = e.difficulty !== 'all'
        ? `<span class="diff-badge ${e.difficulty}">${e.difficulty.slice(0,3).toUpperCase()}</span>`
        : '';
      return `<div class="${cls}" data-path="${e.path}">${check} ${escHtml(e.title)} ${badge}</div>`;
    }).join('');

    return `
      <div class="nav-section">
        <div class="nav-section-header" data-sec="${sec.num}">
          <span class="section-toggle">▾</span>
          <span>${escHtml(sec.name)}</span>
          <span class="section-count">${countStr}</span>
        </div>
        <div class="nav-items" id="nav-sec-${sec.num}">${items}</div>
      </div>`;
  }).join('');

  // Click handlers
  tree.querySelectorAll('.nav-item:not(.filtered-off)').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.path));
  });
  tree.querySelectorAll('.nav-section-header').forEach(el => {
    el.addEventListener('click', () => {
      const sec = el.dataset.sec;
      const items = document.getElementById(`nav-sec-${sec}`);
      if (!items) return;
      const collapsed = items.classList.toggle('collapsed');
      el.querySelector('.section-toggle').textContent = collapsed ? '▸' : '▾';
    });
  });
}

/* ── Progress ── */
function updateProgress() {
  const nonIndex = _index.filter(e => !e.is_index && isDifficultyVisible(e.difficulty));
  const done = nonIndex.filter(e => _completed.has(e.path));
  const pct = nonIndex.length ? Math.round((done.length / nonIndex.length) * 100) : 0;

  const bar = document.getElementById('progressBarInner');
  const barOuter = document.getElementById('progressBar');
  const pctEl = document.getElementById('progressPct');
  const metaEl = document.getElementById('progressMeta');

  if (bar) bar.style.width = pct + '%';
  if (barOuter) barOuter.setAttribute('aria-valuenow', pct);
  if (pctEl) pctEl.textContent = pct + '%';

  const pathLabel = _activePath ? LEARNING_PATHS[_activePath]?.label : null;
  if (metaEl) {
    metaEl.innerHTML = `<span>${done.length} of ${nonIndex.length} topics</span>` +
      (pathLabel ? `<span>PATH: ${escHtml(pathLabel)}</span>` : '');
  }
}

/* ── TOC ── */
let _tocObserver = null;

function renderToc(headings) {
  const list = document.getElementById('tocList');
  if (!list) return;

  // Max 20 entries. If > 20, show only ## headings.
  let items = headings;
  if (items.length > 20) items = items.filter(h => h.level === 2);

  list.innerHTML = items.map(h =>
    `<div class="toc-item ${h.level === 3 ? 'h3' : ''}" data-id="${escHtml(h.id)}">${escHtml(h.text)}</div>`
  ).join('');

  list.querySelectorAll('.toc-item').forEach(el => {
    el.addEventListener('click', () => {
      const target = document.getElementById(el.dataset.id);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function startTocObserver(headings) {
  if (_tocObserver) _tocObserver.disconnect();
  _tocObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        document.querySelectorAll('.toc-item').forEach(el => {
          el.classList.toggle('active', el.dataset.id === entry.target.id);
        });
        break;
      }
    }
  }, { rootMargin: '-20% 0px -70% 0px' });

  headings.forEach(h => {
    const el = document.getElementById(h.id);
    if (el) _tocObserver.observe(el);
  });
}

/* ── Bookmarks ── */
function isBookmarked(path) {
  return _bookmarks.some(b => b.path === path);
}

function toggleBookmark(path) {
  const entry = getEntry(path);
  if (!entry) return;
  if (isBookmarked(path)) {
    _bookmarks = _bookmarks.filter(b => b.path !== path);
  } else {
    if (_bookmarks.length >= 50) _bookmarks.shift(); // FIFO
    _bookmarks.push({ path, title: entry.title, section: entry.section });
  }
  saveBookmarks();
  renderBookmarks();
  // Update bookmark button state in article header
  const btn = document.querySelector('.bookmark-btn');
  if (btn) btn.classList.toggle('active', isBookmarked(path));
}

function renderBookmarks() {
  const list = document.getElementById('bookmarkList');
  if (!list) return;
  if (_bookmarks.length === 0) {
    list.innerHTML = '<div class="bookmark-empty">No bookmarks yet. Click the bookmark icon on any article.</div>';
    return;
  }
  list.innerHTML = _bookmarks.map(b =>
    `<div class="bookmark-item" data-path="${escHtml(b.path)}">
      <span class="bookmark-title">${escHtml(b.title)}</span>
      <span class="bookmark-section">${escHtml(b.section)}</span>
    </div>`
  ).join('');
  list.querySelectorAll('.bookmark-item').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.path));
  });
}

/* ── Sidebar tabs ── */
function initSidebarTabs() {
  document.querySelectorAll('.sidebar-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.sidebar-panel').forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
    });
  });
}

/* ── Filter strip ── */
function renderFilterStrip() {
  const indicators = document.getElementById('filterIndicators');
  if (!indicators) return;
  indicators.innerHTML = ['beginner', 'intermediate', 'advanced'].map(d =>
    `<span class="filter-indicator ${_filter[d] ? 'on' : ''} ${d}">
      ${_filter[d] ? '■' : '□'} ${d.toUpperCase()}
    </span>`
  ).join('');
}

/* ── Utility ── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

- [ ] **Step 6.2: Verify sidebar renders nav tree**

Navigate to dashboard. Sidebar should show 9 sections with article counts. Sections should be collapsible. Clicking an article in nav should update the URL hash.

- [ ] **Step 6.3: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §5 sidebar - nav tree, TOC, bookmarks, progress"
```

---

## Task 7: app.js — §6 Search

**Files:**
- Modify: `frontend/app.js`

- [ ] **Step 7.1: Append §6 Search to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §6 SEARCH */

let _searchFocusIdx = -1;

function openSearch() {
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  overlay.hidden = false;
  input.value = '';
  input.focus();
  renderSearchResults('');
}

function closeSearch() {
  document.getElementById('searchOverlay').hidden = true;
  _searchFocusIdx = -1;
}

function searchIndex(query) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return _index
    .filter(e => {
      return e.title.toLowerCase().includes(q) ||
             e.section.toLowerCase().includes(q) ||
             e.preview.toLowerCase().includes(q) ||
             e.tags.some(t => t.toLowerCase().includes(q));
    })
    .slice(0, 20);
}

function highlightMatch(text, query) {
  if (!query) return escHtml(text);
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return escHtml(text);
  const before = escHtml(text.slice(0, idx));
  const match  = escHtml(text.slice(idx, idx + query.length));
  const after  = escHtml(text.slice(idx + query.length));
  return `${before}<mark>${match}</mark>${after}`;
}

function renderSearchResults(query) {
  const container = document.getElementById('searchResults');
  const results = searchIndex(query);
  _searchFocusIdx = -1;

  if (!query.trim()) {
    container.innerHTML = '<div class="search-empty">Type to search all articles...</div>';
    return;
  }
  if (results.length === 0) {
    container.innerHTML = `<div class="search-empty">No results for "${escHtml(query)}"</div>`;
    return;
  }

  container.innerHTML = results.map((e, i) =>
    `<div class="search-result" data-path="${escHtml(e.path)}" data-idx="${i}" role="option">
      <div class="search-result-meta">
        <span class="diff-badge ${e.difficulty}">${e.difficulty.slice(0,3).toUpperCase()}</span>
        <span style="color:var(--text-muted);font-size:10px">${escHtml(e.section)}</span>
      </div>
      <div class="search-result-title">${highlightMatch(e.title, query)}</div>
      <div class="search-result-preview">${highlightMatch(e.preview.slice(0, 120), query)}</div>
    </div>`
  ).join('');

  container.querySelectorAll('.search-result').forEach(el => {
    el.addEventListener('click', () => {
      closeSearch();
      navigate(el.dataset.path);
    });
  });
}

function initSearch() {
  // Open triggers
  document.getElementById('searchTrigger').addEventListener('click', openSearch);
  document.getElementById('searchBackdrop').addEventListener('click', closeSearch);

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      if (!document.getElementById('searchOverlay').hidden) closeSearch();
    }
  });

  // Input handler
  document.getElementById('searchInput').addEventListener('input', e => {
    renderSearchResults(e.target.value);
  });

  // Keyboard navigation in results
  document.getElementById('searchInput').addEventListener('keydown', e => {
    const results = document.querySelectorAll('.search-result');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _searchFocusIdx = Math.min(_searchFocusIdx + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      _searchFocusIdx = Math.max(_searchFocusIdx - 1, 0);
    } else if (e.key === 'Enter' && _searchFocusIdx >= 0) {
      const el = results[_searchFocusIdx];
      if (el) { closeSearch(); navigate(el.dataset.path); }
      return;
    } else {
      return;
    }
    results.forEach((r, i) => r.classList.toggle('focused', i === _searchFocusIdx));
    results[_searchFocusIdx]?.scrollIntoView({ block: 'nearest' });
  });
}
```

- [ ] **Step 7.2: Test search in browser**

Press Ctrl+K or click search box. Type "uart". Verify results appear instantly with highlighted matches, difficulty badges, previews. Arrow keys should move focus. Enter should navigate and close modal. Escape should close.

- [ ] **Step 7.3: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §6 full-text search modal"
```

---

## Task 8: app.js — §7 Skill Tree

**Files:**
- Modify: `frontend/app.js`

- [ ] **Step 8.1: Append §7 Skill Tree to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §7 SKILL TREE */

function computeNodeState(sectionNum) {
  const entries = getEntriesForSection(sectionNum).filter(e => !e.is_index);
  if (entries.length === 0) return 'empty';
  const done = entries.filter(e => _completed.has(e.path));
  if (done.length === entries.length) return 'completed';
  if (done.length > 0) return 'in-progress';
  return 'not-started';
}

function renderSkillTree() {
  const graph = document.getElementById('skillTreeGraph');
  if (!graph) return;

  // Two-row snake: row1 = 1→5 left-to-right, row2 = 6→9 right-to-left
  const row1 = [1, 2, 3, 4, 5];
  const row2 = [9, 8, 7, 6]; // displayed right-to-left for snake

  function nodeHtml(num) {
    const meta = SECTIONS_META.find(s => s.num === num);
    const state = computeNodeState(num);
    const entries = getEntriesForSection(num).filter(e => !e.is_index);
    const done = entries.filter(e => _completed.has(e.path)).length;
    const pct = entries.length ? Math.round((done / entries.length) * 100) : 0;
    const name = meta ? meta.name.replace(/^\d+ — /, '') : `SECTION ${num}`;
    return `
      <div class="skilltree-node ${state}" data-sec="${num}">
        <div class="skilltree-node-num">0${num}</div>
        <div class="skilltree-node-name">${escHtml(name)}</div>
        <div class="skilltree-node-pct">${pct}%</div>
      </div>`;
  }

  const connector = '<div class="skilltree-connector"></div>';

  const row1Html = row1.map((n, i) => nodeHtml(n) + (i < row1.length - 1 ? connector : '')).join('');
  // Row 2 is displayed reversed with arrow pointing left
  const row2Html = row2.map((n, i) => nodeHtml(n) + (i < row2.length - 1 ? connector : '')).join('');

  graph.innerHTML = `
    <div class="skilltree-row">${row1Html}</div>
    <div class="skilltree-row" style="flex-direction:row-reverse">${row2Html}</div>`;

  graph.querySelectorAll('.skilltree-node').forEach(el => {
    el.addEventListener('click', () => {
      const num = parseInt(el.dataset.sec);
      closeSkillTree();
      // Navigate to index.md if exists, else first article
      const entries = getEntriesForSection(num);
      const indexEntry = entries.find(e => e.is_index);
      const firstEntry = entries.find(e => !e.is_index);
      const target = indexEntry || firstEntry;
      if (target) navigate(target.path);
    });
  });
}

function openSkillTree() {
  renderSkillTree();
  document.getElementById('skillTreeOverlay').hidden = false;
}

function closeSkillTree() {
  document.getElementById('skillTreeOverlay').hidden = true;
}

function initSkillTree() {
  document.getElementById('skillTreeFab').addEventListener('click', openSkillTree);
  document.getElementById('skillTreeClose').addEventListener('click', closeSkillTree);
  document.getElementById('skillTreeBackdrop').addEventListener('click', closeSkillTree);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('skillTreeOverlay').hidden) {
      closeSkillTree();
    }
  });
}
```

- [ ] **Step 8.2: Test skill tree in browser**

Click `[ SKILL TREE ]` button. Verify 9 nodes appear in two rows. Clicking a node should navigate to that section. Nodes should reflect current progress state.

- [ ] **Step 8.3: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §7 skill tree overlay"
```

---

## Task 9: app.js — §8 Learning Paths

**Files:**
- Modify: `frontend/app.js`

- [ ] **Step 9.1: Append §8 Learning Paths to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §8 LEARNING PATHS */

function getActivePath() {
  return _activePath ? LEARNING_PATHS[_activePath] : null;
}

function getResolvedPathArticles(pathKey) {
  const path = LEARNING_PATHS[pathKey];
  if (!path) return [];
  return path.articles
    .map(p => getEntry(p))
    .filter(Boolean);
}

function getVisiblePathArticles(pathKey) {
  return getResolvedPathArticles(pathKey)
    .filter(e => isDifficultyVisible(e.difficulty));
}

function getNextArticle(currentPath) {
  if (!_activePath) return null;
  const articles = getVisiblePathArticles(_activePath);
  const idx = articles.findIndex(e => e.path === currentPath);
  if (idx === -1 || idx >= articles.length - 1) return null;
  return articles[idx + 1];
}

function getPrevArticle(currentPath) {
  if (!_activePath) return null;
  const articles = getVisiblePathArticles(_activePath);
  const idx = articles.findIndex(e => e.path === currentPath);
  if (idx <= 0) return null;
  return articles[idx - 1];
}

function getPathPosition(currentPath) {
  if (!_activePath) return null;
  const articles = getVisiblePathArticles(_activePath);
  const idx = articles.findIndex(e => e.path === currentPath);
  if (idx === -1) return null;
  return { current: idx + 1, total: articles.length };
}

function renderPathModal() {
  const modal = document.getElementById('pathModal');
  const current = _activePath;
  modal.innerHTML = `
    <h2>CHOOSE LEARNING PATH</h2>
    <p>Select a path to get guided navigation and progress tracking. You can change this at any time.</p>
    ${Object.entries(LEARNING_PATHS).map(([key, path]) => `
      <div class="path-option ${current === key ? 'selected' : ''}" data-key="${key}">
        <div class="path-option-name">${escHtml(path.label)}</div>
        <div class="path-option-desc">${escHtml(path.description)}</div>
        <div class="path-option-count">${getResolvedPathArticles(key).length} articles</div>
      </div>
    `).join('')}
    <button class="path-skip" id="pathSkip">Skip — browse freely</button>
  `;

  modal.querySelectorAll('.path-option').forEach(el => {
    el.addEventListener('click', () => {
      _activePath = el.dataset.key;
      localStorage.setItem(LS_PATH_KEY, _activePath);
      closePathModal();
      updateProgress();
      renderNavTree();
      updatePathPosition();
    });
  });

  document.getElementById('pathSkip').addEventListener('click', () => {
    _activePath = null;
    localStorage.removeItem(LS_PATH_KEY);
    closePathModal();
    updateProgress();
    updatePathPosition();
  });
}

function openPathModal() {
  renderPathModal();
  document.getElementById('pathOverlay').hidden = false;
}

function closePathModal() {
  document.getElementById('pathOverlay').hidden = true;
}

function updatePathPosition() {
  const el = document.getElementById('pathPosition');
  if (!el) return;
  if (!_activePath || !_currentPath) { el.textContent = ''; return; }
  const pos = getPathPosition(_currentPath);
  if (!pos) { el.textContent = ''; return; }
  el.textContent = `PATH: ${escHtml(LEARNING_PATHS[_activePath].label)} ▸ Topic ${pos.current} of ${pos.total}`;
}

function initPathModal() {
  document.getElementById('changePathBtn').addEventListener('click', openPathModal);
  document.getElementById('pathBackdrop').addEventListener('click', closePathModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('pathOverlay').hidden) {
      closePathModal();
    }
  });
}
```

- [ ] **Step 9.2: Test path selector**

Reload app (first visit). Path modal should open automatically (handled in init). Select BEGINNER path. Verify path position updates in filter strip when navigating. Verify PREV/NEXT navigation works. Click `[ CHANGE PATH ]` to re-open modal.

- [ ] **Step 9.3: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §8 learning paths + prev/next navigation"
```

---

## Task 10: app.js — §9 Article Renderer + §10 Init

**Files:**
- Modify: `frontend/app.js`

- [ ] **Step 10.1: Append §9 Article Renderer to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §9 ARTICLE RENDERER */

function configureMarked() {
  const renderer = new marked.Renderer();

  // Custom code block renderer: ascii → .ascii-art, others → .code-block
  renderer.code = function(code, language) {
    if (language === 'ascii' || language === 'ansi') {
      return `<pre class="ascii-art">${escHtml(code)}</pre>`;
    }
    const lang = escHtml(language || '');
    return `<pre class="code-block"><code class="language-${lang}">${escHtml(code)}</code></pre>`;
  };

  // Add id attributes to headings for TOC linking
  renderer.heading = function(text, level) {
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h${level} id="${escHtml(id)}">${text}</h${level}>`;
  };

  marked.setOptions({ renderer, breaks: false, gfm: true });
}

function extractHeadings(html) {
  const matches = [...html.matchAll(/<h([23])\s+id="([^"]+)"[^>]*>([^<]+)/g)];
  return matches.map(m => ({ level: parseInt(m[1]), id: m[2], text: m[3] }));
}

function sectionRef(entry) {
  if (!entry) return '';
  let ref = `§0${entry.section_num}`;
  if (entry.subsection) ref += `.${entry.subsection}`;
  return ref;
}

async function showArticle(path) {
  // Show loading state
  document.getElementById('dashboard').hidden = true;
  document.getElementById('articleView').hidden = true;
  document.getElementById('errorState').hidden = true;
  document.getElementById('loadingState').hidden = false;

  try {
    const md = await fetchArticle(path);
    const html = marked.parse(md);
    const entry = getEntry(path);
    const headings = extractHeadings(html);

    // Render header
    const header = document.getElementById('articleHeader');
    const diff = entry?.difficulty || 'beginner';
    const tags = entry?.tags || [];
    const bookmarked = isBookmarked(path);
    const done = _completed.has(path);

    header.innerHTML = `
      <div class="article-meta">
        <span class="section-ref">${escHtml(sectionRef(entry))}</span>
        ${entry ? ` — ${escHtml(entry.section)}` : ''}
        — HARDWARE HACKING STARTER PACK
      </div>
      <div class="article-title">${escHtml(entry?.title || path)}</div>
      <div class="article-tags">
        ${diff !== 'all' ? `<span class="tag ${diff}">${diff.toUpperCase()}</span>` : ''}
        ${tags.map(t => `<span class="tag">${escHtml(t.toUpperCase())}</span>`).join('')}
        <button class="bookmark-btn ${bookmarked ? 'active' : ''}" id="bookmarkBtn" aria-label="Bookmark this article">
          ${bookmarked ? '★ BOOKMARKED' : '☆ BOOKMARK'}
        </button>
        <button class="mark-complete-btn ${done ? 'done' : ''}" id="markCompleteBtn">
          ${done ? '[ ✓ COMPLETE ]' : '[ MARK COMPLETE ✓ ]'}
        </button>
      </div>
    `;

    // Render body
    document.getElementById('articleBody').innerHTML = html;

    // Render prev/next nav
    const prev = getPrevArticle(path);
    const next = getNextArticle(path);
    document.getElementById('articleNav').innerHTML = `
      ${prev ? `<button class="article-nav-btn prev" data-path="${escHtml(prev.path)}">[ ← ${escHtml(prev.title)} ]</button>` : ''}
      ${next ? `<button class="article-nav-btn next" data-path="${escHtml(next.path)}">[ ${escHtml(next.title)} → ]</button>` : ''}
    `;

    document.querySelectorAll('.article-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.path));
    });

    // Mark complete handler
    document.getElementById('markCompleteBtn').addEventListener('click', () => {
      if (_completed.has(path)) {
        _completed.delete(path);
      } else {
        _completed.add(path);
      }
      saveProgress();
      updateProgress();
      renderNavTree();
      // Update button state without re-rendering whole article
      const btn = document.getElementById('markCompleteBtn');
      const isDone = _completed.has(path);
      btn.textContent = isDone ? '[ ✓ COMPLETE ]' : '[ MARK COMPLETE ✓ ]';
      btn.classList.toggle('done', isDone);
    });

    // Bookmark handler
    document.getElementById('bookmarkBtn').addEventListener('click', () => {
      toggleBookmark(path);
      const btn = document.getElementById('bookmarkBtn');
      btn.textContent = isBookmarked(path) ? '★ BOOKMARKED' : '☆ BOOKMARK';
      btn.classList.toggle('active', isBookmarked(path));
    });

    // TOC
    renderToc(headings);
    startTocObserver(headings);

    // Show article, update nav
    document.getElementById('loadingState').hidden = true;
    document.getElementById('articleView').hidden = false;
    document.getElementById('contentArea').scrollTop = 0;

    // Scroll nav tree to active item
    renderNavTree();
    document.querySelector('.nav-item.active')?.scrollIntoView({ block: 'nearest' });

    // Update path position
    updatePathPosition();

  } catch (err) {
    document.getElementById('loadingState').hidden = true;
    document.getElementById('errorState').hidden = false;
    document.getElementById('errorState').innerHTML =
      `<div style="padding:40px;color:var(--accent-red)">ERROR: ${escHtml(err.message)}</div>`;
  }
}

function showDashboard() {
  document.getElementById('articleView').hidden = true;
  document.getElementById('loadingState').hidden = true;
  document.getElementById('errorState').hidden = true;

  const db = document.getElementById('dashboard');
  db.hidden = false;

  const nonIndex = _index.filter(e => !e.is_index);
  const done = nonIndex.filter(e => _completed.has(e.path));
  const pct = nonIndex.length ? Math.round((done.length / nonIndex.length) * 100) : 0;

  db.innerHTML = `
    <div class="dashboard-title">HARDWARE HACKING STARTER PACK</div>
    <div class="dashboard-subtitle">An interactive learning guide to hardware security.</div>
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <div class="dashboard-card-label">PROGRESS</div>
        <div class="dashboard-card-value">${pct}%</div>
        <div class="dashboard-card-sub">${done.length} / ${nonIndex.length} articles</div>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-card-label">ACTIVE PATH</div>
        <div class="dashboard-card-value" style="font-size:14px">${_activePath ? LEARNING_PATHS[_activePath].label : '—'}</div>
        <div class="dashboard-card-sub">${_activePath ? getResolvedPathArticles(_activePath).length + ' articles' : 'Browse freely'}</div>
      </div>
      <div class="dashboard-card">
        <div class="dashboard-card-label">BOOKMARKS</div>
        <div class="dashboard-card-value">${_bookmarks.length}</div>
        <div class="dashboard-card-sub">saved articles</div>
      </div>
    </div>
    <p style="color:var(--text-muted);font-size:11px">Select a topic from the sidebar, or use <kbd style="border:1px solid var(--border);padding:1px 4px">⌘K</kbd> to search.</p>
  `;

  renderNavTree();
  updatePathPosition();
}
```

- [ ] **Step 10.2: Append §10 Init to `app.js`**

```javascript
/* ═══════════════════════════════════════════════ §10 INIT */

async function init() {
  try {
    // Load persisted state
    loadState();

    // Apply saved theme
    initTheme();

    // Wire up UI
    initSidebarTabs();
    initDifficultyButtons();
    initSearch();
    initSkillTree();
    initPathModal();

    // Load content index
    await loadIndex();

    // Render initial UI
    renderNavTree();
    renderFilterStrip();
    renderBookmarks();
    updateProgress();

    // Route to initial hash or show dashboard
    const initialPath = getHashPath();
    if (initialPath) {
      _currentPath = initialPath;
      await showArticle(initialPath);
    } else {
      showDashboard();
      // First visit: offer path selection
      if (!_activePath && !localStorage.getItem(LS_PATH_KEY + '_skipped')) {
        openPathModal();
      }
    }

  } catch (err) {
    document.getElementById('loadingState').hidden = true;
    document.getElementById('errorState').hidden = false;
    document.getElementById('errorState').innerHTML =
      `<div style="padding:40px;color:var(--accent-red)">FAILED TO LOAD: ${escHtml(err.message)}</div>`;
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  configureMarked();
  init();
});
```

Also update the `path-skip` click handler in `renderPathModal()` to set the skip sentinel:
```javascript
// Inside renderPathModal, update the pathSkip click handler:
document.getElementById('pathSkip').addEventListener('click', () => {
  _activePath = null;
  localStorage.removeItem(LS_PATH_KEY);
  localStorage.setItem(LS_PATH_KEY + '_skipped', '1');  // ← add this line
  closePathModal();
  updateProgress();
  updatePathPosition();
});
```

- [ ] **Step 10.3: Full integration test in browser**

Serve `frontend/` on port 8000. Test the following:
1. Page loads, dashboard shows, path modal appears on first visit
2. Select BEGINNER path → filter strip shows path label
3. Navigate to first article via sidebar → article renders with correct title, difficulty badge, ASCII art in amber
4. Click `[ MARK COMPLETE ✓ ]` → nav tree updates, progress bar moves
5. Click `☆ BOOKMARK` → bookmark appears in BOOKMARKS sidebar tab
6. Click `[ NEXT → ]` → navigates to next article in path
7. Press Ctrl+K → search modal opens, type "uart" → results appear
8. Click `[ SKILL TREE ]` → overlay shows 9 nodes in snake layout
9. Toggle ADVANCED off → advanced articles grey out in nav
10. Click `☀ LIGHT` → switches to light mode
11. Reload → all state persists (progress, path, theme, bookmarks)

- [ ] **Step 10.4: Commit**

```bash
git add frontend/app.js
git commit -m "feat: app.js §9 article renderer + §10 init — full app wired up"
```

---

## Task 11: GitHub Actions Deploy

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] **Step 11.1: Create workflows directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 11.2: Write `.github/workflows/deploy-pages.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
      - 'sections/**'
      - 'scripts/**'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Regenerate content index
        run: python scripts/build-index.py

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 11.3: Enable GitHub Pages in repo settings**

Go to `Settings → Pages → Source` and set to **GitHub Actions**. This must be done manually in the GitHub web UI before the first deploy will succeed.

- [ ] **Step 11.4: Commit and push**

```bash
git add .github/workflows/deploy-pages.yml
git commit -m "feat: add GitHub Actions Pages deploy workflow"
git push origin main
```

- [ ] **Step 11.5: Verify deployment**

Check the Actions tab on GitHub. The deploy workflow should run. After it completes, the site should be live at `https://seedon198.github.io/Hardware-Hacking-Starter-Pack/`.

---

## Task 12: README.md Cleanup

**Files:**
- Modify: `README.md`

- [ ] **Step 12.1: Read the current README**

Read `README.md` and identify:
1. The outer `<div align="center">` wrapping the entire document
2. All `class="glass-table"` and `class="difficulty-*"` attributes in HTML table cells/tags
3. The duplicate "Secure Communications" row in the embedded security section

- [ ] **Step 12.2: Fix the README**

- Remove the outer `<div align="center">` (keep only the one wrapping the header badge block if present)
- Strip all `class="..."` attributes from HTML elements, leaving the elements/tags intact or converting them to plain markdown
- Remove the duplicate "Secure Communications" row

- [ ] **Step 12.3: Verify on GitHub**

Push and verify the README renders as plain markdown tables with no broken HTML artifacts.

- [ ] **Step 12.4: Commit**

```bash
git add README.md
git commit -m "fix: clean README — remove HTML classes, fix duplicate row"
```

---

## Task 13: Content — Metadata Comments (All 57 Files)

**Files:**
- Modify: `sections/**/*.md` (all 57 files)

This task adds `<!-- difficulty: X -->` and `<!-- tags: ... -->` metadata to the top of every file, enabling `build-index.py` to use the comment-based source (higher accuracy than fallback table).

- [ ] **Step 13.1: Add metadata to 01-foundations (4 files)**

For each file, add within first 10 lines:

`sections/01-foundations/01-introduction.md`:
```
<!-- difficulty: beginner -->
<!-- tags: overview, getting-started, hardware-hacking -->
```

`sections/01-foundations/02-lab-setup.md`:
```
<!-- difficulty: beginner -->
<!-- tags: lab, setup, tools, environment -->
```

`sections/01-foundations/03-tools-equipment.md`:
```
<!-- difficulty: beginner -->
<!-- tags: tools, oscilloscope, multimeter, logic-analyzer -->
```

`sections/01-foundations/04-basic-electronics.md`:
```
<!-- difficulty: beginner -->
<!-- tags: electronics, voltage, current, resistors, capacitors -->
```

- [ ] **Step 13.2: Add metadata to 02-communication-protocols (13 files)**

Wired:
```
wired/01-uart-protocol:    beginner,  tags: uart, serial, debug, baud-rate
wired/02-i2c-protocol:     beginner,  tags: i2c, two-wire, bus, sensor
wired/03-spi-protocol:     beginner,  tags: spi, four-wire, flash, eeprom
wired/04-jtag-swd:         intermediate, tags: jtag, swd, debug, boundary-scan
wired/05-usb-protocol:     intermediate, tags: usb, hid, enumeration, descriptors
wired/06-ethernet-protocols: intermediate, tags: ethernet, tcp-ip, network
```

Wireless:
```
wireless/01-rf-fundamentals: beginner,    tags: rf, frequency, modulation, antenna
wireless/02-wifi:            intermediate, tags: wifi, 802.11, wpa, deauth
wireless/03-bluetooth:       intermediate, tags: bluetooth, ble, pairing, sniffing
wireless/04-zigbee:          intermediate, tags: zigbee, 802.15.4, mesh, iot
wireless/05-lora-lpwan:      intermediate, tags: lora, lpwan, lorawan, iot
wireless/06-rfid-nfc:        intermediate, tags: rfid, nfc, mifare, emulation
```

Index files (difficulty will be computed by build-index.py, but add tags):
```
02-communication-protocols/index: tags: protocols, wired, wireless, overview
wireless/index: tags: wireless, rf, protocols
```

- [ ] **Step 13.3: Add metadata to 03-firmware (1 file)**

IMPORTANT: `01-firmware-analysis` appears in the BEGINNER path — must be tagged beginner:
```
<!-- difficulty: beginner -->
<!-- tags: firmware, binwalk, extraction, analysis, reverse-engineering -->
```

- [ ] **Step 13.4: Add metadata to 04-attack-vectors (7 files)**

```
index.md:                   tags: attack-vectors, physical, side-channel, fault-injection
01-physical-access:         intermediate, tags: physical-access, jtag, uart, glitching
02-side-channel:            advanced, tags: side-channel, power-analysis, timing, dpa
03-fault-injection:         advanced, tags: fault-injection, glitching, voltage, laser
03-fault-injection-2:       advanced, tags: fault-injection, methodology, countermeasures
04-hardware-implants:       advanced, tags: implants, supply-chain, evil-maid
05-supply-chain-1:          advanced, tags: supply-chain, tampering, counterfeits
05-supply-chain-2:          advanced, tags: supply-chain, detection, verification
05-supply-chain-3:          advanced, tags: supply-chain, mitigation, secure-procurement
```

- [ ] **Step 13.5: Add metadata to 05-reverse-engineering through 09-resources (32 files)**

Apply the difficulty values from the spec's fallback table and the tags listed below to all remaining files. For `08-professional/*` and `09-resources/*`, use `difficulty: all`.

Special difficulty cases:
- `06-embedded-security/04-physical-security.md`: `difficulty: intermediate`
- `05-reverse-engineering/05-advanced-techniques.md`: `difficulty: advanced`
- `07-specialized-domains/*`: `difficulty: advanced`

Representative tags per section (use these as the baseline, add file-specific terms):
```
05-reverse-engineering/index:           tags: reverse-engineering, pcb, components, circuits
05-reverse-engineering/01-re-fundamentals: tags: reverse-engineering, methodology, tools, binwalk
05-reverse-engineering/02-pcb-analysis: tags: pcb, layers, components, schematics, x-ray
05-reverse-engineering/03-component-id: tags: components, identification, datasheets, markings
05-reverse-engineering/04-circuit-extraction: tags: circuit, netlist, extraction, schematic
05-reverse-engineering/05-advanced-techniques: tags: decapsulation, microscopy, sem, microprobing, fib

06-embedded-security/index:             tags: embedded, security, boot, memory, testing
06-embedded-security/01-secure-boot:    tags: secure-boot, tpm, attestation, chain-of-trust
06-embedded-security/02-memory-protection: tags: memory, mpu, nx, dep, aslr, stack-protection
06-embedded-security/03-secure-communications: tags: tls, encryption, certificates, secure-channel
06-embedded-security/04-physical-security: tags: physical, tamper, enclosures, potting, epoxy
06-embedded-security/05-security-testing: tags: testing, fuzzing, pentest, methodology

07-specialized-domains/01-mobile-hacking: tags: mobile, android, ios, baseband, modem, at-commands
07-specialized-domains/02-iot-security:   tags: iot, cloud, mqtt, firmware-update, ota

08-professional/01-learning-path:       tags: learning, roadmap, career, skills
08-professional/02-certifications:      tags: certifications, oscp, ecea, training
08-professional/03-community-resources: tags: community, forums, resources
08-professional/03a-forums-discussions: tags: forums, reddit, discord, community
08-professional/03b-chat-events:        tags: defcon, conferences, events, ctf
08-professional/03c-content-publications: tags: books, papers, blogs, publications
08-professional/03d-opensource-tools:   tags: tools, open-source, github, firmware
08-professional/04-legal-ethical:       tags: legal, ethics, responsible-disclosure, authorization
08-professional/05-project-ideas:       tags: projects, practice, beginner, ideas
08-professional/06-glossary:            tags: glossary, terms, definitions, reference

09-resources/index:                     tags: resources, references, links
09-resources/01-conferences:            tags: defcon, blackhat, conferences, talks
09-resources/02-talks-videos:           tags: talks, videos, youtube, presentations
09-resources/03-labs:                   tags: labs, practice, online, hardware
09-resources/04-bug-bounties:           tags: bug-bounty, hof, programs, rewards
```

- [ ] **Step 13.6: Regenerate content-index.json**

```bash
python scripts/build-index.py
```

Verify the output. Spot-check that `03-firmware/01-firmware-analysis` has `"difficulty": "beginner"`.

- [ ] **Step 13.7: Commit**

```bash
git add sections/ frontend/content-index.json
git commit -m "feat: add difficulty and tags metadata to all 57 markdown files"
```

---

## Task 14: Content — ASCII Art Fix + Re-fencing

**Files:**
- Modify: `sections/**/*.md` (files containing ASCII diagrams)

- [ ] **Step 14.1: Identify all ASCII diagram blocks**

Search for code blocks without a language tag or with unclear labels that are actually diagrams:

```bash
grep -rn '^\`\`\`$\|^\`\`\`text\|^\`\`\`diagram\|^\`\`\`ascii' sections/
```

Also search for inline ASCII art that isn't fenced:
```bash
grep -rn '─\|│\|┌\|┐\|└\|┘\|├\|┤\|┬\|┴\|┼' sections/
```

- [ ] **Step 14.2: Re-fence ASCII diagrams with ` ```ascii `**

For each file containing ASCII diagrams:
- Change ` ``` ` (bare) → ` ```ascii ` if the block contains box-drawing chars or is clearly a diagram
- Change ` ```text ` → ` ```ascii ` for diagram blocks
- Leave ` ```bash `, ` ```c `, ` ```python `, etc. unchanged

- [ ] **Step 14.3: Fix known broken diagrams**

Key files likely containing broken ASCII (validate by reading each):

`sections/02-communication-protocols/wired/01-uart-protocol.md` — signal timing diagrams
`sections/02-communication-protocols/wired/02-i2c-protocol.md` — bus topology
`sections/02-communication-protocols/wired/03-spi-protocol.md` — 4-wire diagram
`sections/02-communication-protocols/wired/04-jtag-swd.md` — TAP state machine
`sections/05-reverse-engineering/02-pcb-analysis.md` — PCB layer diagram

For each: read the file, check that box-drawing lines connect, that signal diagrams have correct column alignment, that timing diagrams have matching HIGH/LOW transitions.

- [ ] **Step 14.4: Commit**

```bash
git add sections/
git commit -m "fix: re-fence ASCII diagrams with ascii lang tag, fix misaligned art"
```

---

## Task 15: Content — Expand Shallow Sections

**Files:**
- Modify (listed below — all must reach ≥ 500 words body text):

| File | Key content to add |
|------|--------------------|
| `sections/04-attack-vectors/03-fault-injection-2.md` | Practical fault injection setup: clock glitching circuit, EM fault injection, VCC glitching, example attack walkthrough on a microcontroller, detection/mitigation |
| `sections/04-attack-vectors/05-supply-chain-2.md` | Detection methods: visual inspection checklist, X-ray analysis workflow, functional testing patterns, component fingerprinting tools |
| `sections/04-attack-vectors/05-supply-chain-3.md` | Mitigation strategies: secure procurement workflow, vendor vetting, tamper-evident packaging, chain of custody documentation |
| `sections/05-reverse-engineering/05-advanced-techniques.md` | Decapsulation methodology (acid vs laser), die photography, SEM/FIB analysis, microprobing, fault injection at die level |
| `sections/07-specialized-domains/01-mobile-hacking.md` | Baseband processor section: AT command interface, modem firmware extraction via UART, baseband debug ports on common SoCs, known CVEs |

- [ ] **Step 15.1: Expand each thin file to ≥ 500 words**

Read each file first, then expand in place. Add `##` sections for each key topic listed above. Include at least one `ascii` code block per file showing a relevant diagram.

- [ ] **Step 15.2: Commit**

```bash
git add sections/04-attack-vectors/ sections/05-reverse-engineering/05-advanced-techniques.md sections/07-specialized-domains/01-mobile-hacking.md
git commit -m "content: expand thin sections to ≥500 words"
```

---

## Task 16: Content — Broken Links + Heading Consistency

**Files:**
- Modify: various `sections/**/*.md`

- [ ] **Step 16.1: Audit all cross-links**

```bash
grep -rn '\[.*\](.*\.md)' sections/
```

For each relative link found, verify the target file exists. Fix any broken paths.

- [ ] **Step 16.2: Standardise heading hierarchy**

Check all files follow `#` title → `##` sections → `###` subsections. Fix any files that use `##` as the top-level or skip levels.

```bash
# Files using ## as title (no # heading):
grep -rL '^# ' sections/ | grep '\.md$'
```

- [ ] **Step 16.3: Regenerate content-index.json and verify**

```bash
python scripts/build-index.py
```

All 57 entries should be present. No entries should have an empty `title` (fallback to filename means something is wrong with heading extraction).

- [ ] **Step 16.4: Final commit**

```bash
git add sections/ frontend/content-index.json
git commit -m "fix: repair broken cross-links and standardise heading hierarchy"
```

---

## Verification Checklist

Before pushing to main for deployment:

- [ ] `pytest tests/test_build_index.py` — all tests pass
- [ ] `python scripts/build-index.py` — generates 57 entries, no errors
- [ ] Open `http://localhost:8000` (served from `frontend/`) — no console errors
- [ ] Dashboard loads, path modal appears on first visit
- [ ] Search works (Ctrl+K, typing "uart" returns results)
- [ ] Article renders with amber ASCII art, green code blocks
- [ ] Mark complete → progress bar updates
- [ ] Bookmark → appears in BOOKMARKS tab
- [ ] Dark/light toggle → theme switches and persists on reload
- [ ] Skill tree overlay shows 9 nodes in snake layout
- [ ] All difficulty filters work
- [ ] PREV/NEXT nav works on BEGINNER path
- [ ] GitHub Actions workflow runs and deploys successfully

---

## Notes for Implementer

- **local dev**: `cd frontend && python -m http.server 8000` (must serve from `frontend/`, not repo root — `content-index.json` is at the root of the served directory)
- **article fetches**: these only work when deployed to GitHub Pages (raw.githubusercontent.com). For local dev, create a `frontend/sections/` symlink or use a local static file server that also serves the repo root
- **local dev workaround for article fetches**: modify `RAW_BASE` during dev to `'../sections/'` and `fetchArticle` to `fetch(RAW_BASE + path.replace('sections/', '') + '.md')`. Revert before committing.
- **marked.js CDN**: if CDN is unavailable during dev, download to `frontend/marked.min.js` and change the script src. Do not commit the vendored file.
- **Index entries with `difficulty: null`**: if any appear in the output, a file has no metadata comment AND matched no fallback rule. Fix by adding the metadata comment to that file.
