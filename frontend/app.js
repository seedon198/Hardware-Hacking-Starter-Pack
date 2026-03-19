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
  const hash = window.location.hash;
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

let _index = [];
const _articleCache = new Map();

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

/* ═══════════════════════════════════════════════ §5 SIDEBAR */

/* ── State ── */
const LS_PROGRESS  = 'hhsp_progress';
const LS_FILTER    = 'hhsp_filter';
const LS_BOOKMARKS = 'hhsp_bookmarks';
const LS_PATH_KEY  = 'hhsp_active_path';

let _completed = new Set();
let _filter    = { beginner: true, intermediate: true, advanced: true };
let _bookmarks = [];
let _activePath = null;

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
    if (_bookmarks.length >= 50) _bookmarks.shift();
    _bookmarks.push({ path, title: entry.title, section: entry.section });
  }
  saveBookmarks();
  renderBookmarks();
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
  document.getElementById('searchTrigger').addEventListener('click', openSearch);
  document.getElementById('searchBackdrop').addEventListener('click', closeSearch);

  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') {
      if (!document.getElementById('searchOverlay').hidden) closeSearch();
    }
  });

  document.getElementById('searchInput').addEventListener('input', e => {
    renderSearchResults(e.target.value);
  });

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

  const row1 = [1, 2, 3, 4, 5];
  const row2 = [9, 8, 7, 6];

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
  const row2Html = row2.map((n, i) => nodeHtml(n) + (i < row2.length - 1 ? connector : '')).join('');

  graph.innerHTML = `
    <div class="skilltree-row">${row1Html}</div>
    <div class="skilltree-row" style="flex-direction:row-reverse">${row2Html}</div>`;

  graph.querySelectorAll('.skilltree-node').forEach(el => {
    el.addEventListener('click', () => {
      const num = parseInt(el.dataset.sec);
      closeSkillTree();
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
    localStorage.setItem(LS_PATH_KEY + '_skipped', '1');
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

/* ═══════════════════════════════════════════════ §9 ARTICLE RENDERER */

function configureMarked() {
  const renderer = new marked.Renderer();

  renderer.code = function(code, language) {
    if (language === 'ascii' || language === 'ansi') {
      return `<pre class="ascii-art">${escHtml(code)}</pre>`;
    }
    const lang = escHtml(language || '');
    return `<pre class="code-block"><code class="language-${lang}">${escHtml(code)}</code></pre>`;
  };

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
  document.getElementById('dashboard').hidden = true;
  document.getElementById('articleView').hidden = true;
  document.getElementById('errorState').hidden = true;
  document.getElementById('loadingState').hidden = false;

  try {
    const md = await fetchArticle(path);
    const html = marked.parse(md);
    const entry = getEntry(path);
    const headings = extractHeadings(html);

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

    document.getElementById('articleBody').innerHTML = html;

    const prev = getPrevArticle(path);
    const next = getNextArticle(path);
    document.getElementById('articleNav').innerHTML = `
      ${prev ? `<button class="article-nav-btn prev" data-path="${escHtml(prev.path)}">[ ← ${escHtml(prev.title)} ]</button>` : ''}
      ${next ? `<button class="article-nav-btn next" data-path="${escHtml(next.path)}">[ ${escHtml(next.title)} → ]</button>` : ''}
    `;

    document.querySelectorAll('.article-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.path));
    });

    document.getElementById('markCompleteBtn').addEventListener('click', () => {
      if (_completed.has(path)) {
        _completed.delete(path);
      } else {
        _completed.add(path);
      }
      saveProgress();
      updateProgress();
      renderNavTree();
      const btn = document.getElementById('markCompleteBtn');
      const isDone = _completed.has(path);
      btn.textContent = isDone ? '[ ✓ COMPLETE ]' : '[ MARK COMPLETE ✓ ]';
      btn.classList.toggle('done', isDone);
    });

    document.getElementById('bookmarkBtn').addEventListener('click', () => {
      toggleBookmark(path);
      const btn = document.getElementById('bookmarkBtn');
      btn.textContent = isBookmarked(path) ? '★ BOOKMARKED' : '☆ BOOKMARK';
      btn.classList.toggle('active', isBookmarked(path));
    });

    renderToc(headings);
    startTocObserver(headings);

    document.getElementById('loadingState').hidden = true;
    document.getElementById('articleView').hidden = false;
    document.getElementById('contentArea').scrollTop = 0;

    renderNavTree();
    document.querySelector('.nav-item.active')?.scrollIntoView({ block: 'nearest' });

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

/* ═══════════════════════════════════════════════ §10 INIT */

async function init() {
  try {
    loadState();
    initTheme();
    initSidebarTabs();
    initDifficultyButtons();
    initSearch();
    initSkillTree();
    initPathModal();

    await loadIndex();

    renderNavTree();
    renderFilterStrip();
    renderBookmarks();
    updateProgress();

    const initialPath = getHashPath();
    if (initialPath) {
      _currentPath = initialPath;
      await showArticle(initialPath);
    } else {
      showDashboard();
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
