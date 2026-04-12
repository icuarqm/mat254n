/* MAT254 Lineer Cebir — notes.js
   Not sayfaları ve ana sayfa (index) için ortak JS */

const _isIndex = document.body.classList.contains('index-page');

/* ══════════════════════════════════════════════════════
   NOT SAYFALARI (w*.html)
   ══════════════════════════════════════════════════════ */

if (!_isIndex) {

  /* ── Dark Mode ── */
  function applyDarkMode() {
    if (localStorage.getItem('dm') === '1') document.body.classList.add('dark');
  }
  function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('dm', isDark ? '1' : '0');
    syncDarkIcon();
  }
  function syncDarkIcon() {
    const icon = document.querySelector('.dm-icon');
    if (!icon) return;
    icon.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }
  applyDarkMode();

  /* ── Navigasyon ── */
  function parsePage() {
    const name = location.pathname.split('/').pop() || '';
    const m = name.match(/^w(\d+)-(\d+)\.html$/);
    if (!m) return null;
    return { week: +m[1], part: +m[2] };
  }
  async function findLinks(week, part) {
    try {
      const res = await fetch('../manifest.json');
      const pages = await res.json();
      const current = `w${week}-${part}.html`;
      const idx = pages.findIndex(p => p.file === current);
      return {
        prev: idx > 0 ? pages[idx - 1].file : null,
        next: idx >= 0 && idx < pages.length - 1 ? pages[idx + 1].file : null,
      };
    } catch { return { prev: null, next: null }; }
  }

  /* ── Site Header ── */
  function buildHeader() {
    const nav = document.createElement('nav');
    nav.className = 'site-header';
    nav.innerHTML = `
      <a class="nav-btn prev-btn disabled" aria-disabled="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Önceki
      </a>
      <div class="header-center">
        <a href="../index.html" class="nav-btn home-btn" title="Ana Sayfa">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round"
               aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </a>
        <button class="nav-btn dm-toggle" onclick="toggleDarkMode()" title="Karanlık / Aydınlık mod">
          <span class="dm-icon">🌙</span>
        </button>
      </div>
      <a class="nav-btn next-btn disabled" aria-disabled="true">
        Sonraki
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    `;
    document.body.prepend(nav);
    syncDarkIcon();
  }

  /* ── Site Footer ── */
  function buildFooter() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <a class="nav-btn prev-btn disabled" aria-disabled="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Önceki
      </a>
      <a class="nav-btn next-btn disabled" aria-disabled="true">
        Sonraki
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </a>
    `;
    document.body.append(footer);
  }

  function setNav(selector, href) {
    document.querySelectorAll(selector).forEach(el => {
      el.href = href;
      el.classList.remove('disabled');
      el.removeAttribute('aria-disabled');
    });
  }

  /* ── Scroll Animasyonları ── */
  function initAnimations() {
    const targets = document.querySelectorAll(
      '.card, .def-box, .q-box, .section-title, .summary-box, .type-card'
    );
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -10px 0px' });
    targets.forEach((el, i) => {
      el.classList.add('anim-ready');
      if (i < 5) setTimeout(() => observer.observe(el), i * 55);
      else observer.observe(el);
    });
  }

  /* ── KaTeX ── */
  function loadKaTeX() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
    script.onload = () => {
      const ar = document.createElement('script');
      ar.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js';
      ar.onload = () => {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$',  right: '$',  display: false },
          ],
          throwOnError: false,
        });
      };
      document.head.appendChild(ar);
    };
    document.head.appendChild(script);
  }

  /* ── Init ── */
  const page = parsePage();
  buildHeader();
  buildFooter();
  initAnimations();
  loadKaTeX();
  if (page) {
    findLinks(page.week, page.part).then(({ prev, next }) => {
      if (prev) setNav('.prev-btn', prev);
      if (next) setNav('.next-btn', next);
    });
  }

} /* end !_isIndex */

/* ══════════════════════════════════════════════════════
   INDEX SAYFASI (index.html)
   ══════════════════════════════════════════════════════ */

if (_isIndex) {

  const weekColors = [
    '#c9a84c', '#6ba3be', '#b07cc6',
    '#6bbf8a', '#cf7b5f', '#8b8fd4',
  ];

  async function loadNotes() {
    const res = await fetch('manifest.json');
    if (!res.ok) throw new Error('manifest.json bulunamadı');
    const pages = await res.json();
    const found = {};
    pages.forEach(p => {
      const m = p.file.match(/^w(\d+)-(\d+)\.html$/);
      if (!m) return;
      const w = +m[1], part = +m[2];
      if (!found[w]) found[w] = [];
      found[w].push({ week: w, part, file: 'pages/' + p.file, title: p.title, subtitle: p.subtitle, topics: p.topics || [] });
    });
    return found;
  }

  function renderNotes(notes) {
    const container = document.getElementById('notesContainer');
    const weekCount = document.getElementById('weekCount');
    const emptyState = document.getElementById('emptyState');
    const weeks = Object.keys(notes).map(Number).sort((a, b) => a - b);

    if (weeks.length === 0) {
      emptyState.style.display = 'block';
      weekCount.textContent = '0 hafta';
      return;
    }

    const totalParts = weeks.reduce((sum, w) => sum + notes[w].length, 0);
    weekCount.textContent = `${weeks.length} hafta · ${totalParts} not`;

    weeks.forEach((w, idx) => {
      const parts = notes[w];
      const color = weekColors[(w - 1) % weekColors.length];
      const block = document.createElement('div');
      block.className = 'week-block';
      block.setAttribute('data-week', w);
      block.innerHTML = `
        <div class="week-header">
          <div class="week-number" style="color:${color}">${String(w).padStart(2, '0')}</div>
          <div class="week-label" style="color:${color}">Hafta ${w}</div>
          <div class="week-parts-count">${parts.length} bölüm</div>
        </div>
        <div class="parts-grid">
          ${parts.map(p => `
            <a href="${p.file}" class="part-card" style="--card-color:${color}">
              <div class="part-front">
                <div class="part-icon">📄</div>
                <div class="part-name">Bölüm ${p.part}</div>
                <div class="part-file">${p.file}</div>
              </div>
              <div class="part-reveal">
                <div class="reveal-title">${p.title ?? `Bölüm ${p.part}`}</div>
                ${p.subtitle ? `<div class="reveal-subtitle">${p.subtitle}</div>` : ''}
                <div class="reveal-arrow">→</div>
              </div>
            </a>
          `).join('')}
        </div>
      `;
      container.appendChild(block);
      setTimeout(() => block.classList.add('visible'), 100 + idx * 150);
    });

    /* Week nav buttons */
    const nav = document.getElementById('weekNav');
    weeks.forEach(w => {
      const color = weekColors[(w - 1) % weekColors.length];
      const btn = document.createElement('button');
      btn.className = 'week-nav-btn';
      btn.textContent = `W${w}`;
      btn.style.color = color;
      btn.style.borderColor = color + '55';
      btn.addEventListener('mouseenter', () => { btn.style.background = color + '18'; });
      btn.addEventListener('mouseleave', () => { btn.style.background = 'transparent'; });
      btn.addEventListener('click', () => {
        const block = document.querySelector(`.week-block[data-week="${w}"]`);
        if (!block) return;
        const y = block.getBoundingClientRect().top + window.scrollY - 24;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setTimeout(() => {
          block.style.transition = 'box-shadow 0.2s ease';
          block.style.boxShadow = `0 0 0 6px ${color}30, 0 0 32px ${color}18`;
          block.style.borderRadius = '10px';
          block.style.padding = '0.75rem 0.5rem';
          block.style.margin = '0 -0.5rem';
          setTimeout(() => {
            block.style.boxShadow = 'none';
            setTimeout(() => {
              block.style.boxShadow = '';
              block.style.borderRadius = '';
              block.style.padding = '';
              block.style.margin = '';
              block.style.transition = '';
            }, 350);
          }, 750);
        }, 420);
      });
      nav.appendChild(btn);
    });

    /* Per-week hover ve reveal stilleri */
    const style = document.createElement('style');
    weeks.forEach(w => {
      const color = weekColors[(w - 1) % weekColors.length];
      style.textContent += `
        [data-week="${w}"] .part-card:hover { border-color:${color}55; box-shadow:0 12px 36px ${color}18; }
        [data-week="${w}"] .part-reveal { background: linear-gradient(160deg, var(--bg-card-hover) 0%, ${color}14 100%); }
      `;
    });
    document.head.appendChild(style);
  }

  /* ── Search Modal ── */
  let allPages = [];
  let searchMode = 'idle'; // 'idle' | 'text' | 'topic'
  let activeTopic = null;
  let focusedIdx = -1;

  function topicColorMap() {
    const map = {};
    allPages.forEach(p => {
      (p.topics || []).forEach(t => {
        if (!map[t]) map[t] = weekColors[(p.week - 1) % weekColors.length];
      });
    });
    return map;
  }

  function getPanel() { return document.querySelector('.search-panel'); }

  function setMode(mode) {
    searchMode = mode;
    getPanel().setAttribute('data-mode', mode);
  }

  function buildModal() {
    const fab = document.createElement('button');
    fab.className = 'search-fab';
    fab.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <span class="fab-label">Ara</span>
      <span class="fab-hint">s</span>
    `;
    fab.addEventListener('click', openSearch);
    document.body.appendChild(fab);

    const overlay = document.createElement('div');
    overlay.className = 'search-overlay';
    overlay.id = 'searchOverlay';
    overlay.innerHTML = `
      <div class="search-panel" data-mode="idle" role="dialog" aria-modal="true">
        <div class="search-input-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-input" id="searchInput" type="text"
                 placeholder="Başlık veya konu ara…" autocomplete="off" spellcheck="false">
          <button class="search-esc" id="searchEsc">esc</button>
        </div>
        <div class="search-topic-header">
          <button class="search-back" id="searchBack">←</button>
          <span class="search-active-topic" id="searchActiveTopic"></span>
          <span class="search-topic-count" id="searchTopicCount"></span>
        </div>
        <div class="search-chips-section">
          <div class="search-chips-label">Konular</div>
          <div class="search-chips-grid" id="searchChipsGrid"></div>
        </div>
        <div class="search-results" id="searchResults"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
    overlay.querySelector('#searchEsc').addEventListener('click', closeSearch);
    overlay.querySelector('#searchBack').addEventListener('click', () => {
      setMode('idle');
      activeTopic = null;
      document.getElementById('searchResults').innerHTML = '';
      setTimeout(() => document.getElementById('searchInput').focus(), 30);
    });
  }

  function openSearch() {
    document.getElementById('searchOverlay').classList.add('open');
    setMode('idle');
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    renderChips();
    setTimeout(() => document.getElementById('searchInput').focus(), 60);
  }

  function closeSearch() {
    document.getElementById('searchOverlay').classList.remove('open');
    const input = document.getElementById('searchInput');
    input.value = '';
    input.blur();
    activeTopic = null;
    focusedIdx = -1;
    setMode('idle');
  }

  const pinnedTopics = ['Soru Çözümü'];

  function renderChips() {
    const grid = document.getElementById('searchChipsGrid');
    if (!grid) return;
    const colors = topicColorMap();
    grid.innerHTML = '';

    const allTopics = Object.keys(colors);
    const pinned = pinnedTopics.filter(t => allTopics.includes(t));
    const rest = allTopics.filter(t => !pinnedTopics.includes(t));

    [...pinned, ...rest].forEach(topic => {
      const isPin = pinnedTopics.includes(topic);
      const color = colors[topic];
      const btn = document.createElement('button');
      btn.className = 'search-chip' + (isPin ? ' pinned' : '');
      btn.textContent = topic;
      if (isPin) {
        btn.style.cssText = `background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.14); color:#c8c5d8;`;
      } else {
        btn.style.cssText = `background:${color}1a; border-color:${color}44; color:${color};`;
      }
      btn.addEventListener('click', () => {
        activeTopic = topic;
        setMode('topic');
        const results = allPages.filter(p => (p.topics || []).includes(topic));
        document.getElementById('searchActiveTopic').textContent = topic;
        document.getElementById('searchTopicCount').textContent = `${results.length} not`;
        renderResultItems(results, null, topic);
      });
      grid.appendChild(btn);
    });
  }

  function renderResultItems(items, query, topic) {
    const container = document.getElementById('searchResults');
    focusedIdx = -1;
    if (!items.length) {
      container.innerHTML = `<div class="search-empty">Sonuç bulunamadı.</div>`;
      return;
    }
    container.innerHTML = items.map((p, i) => {
      const color = weekColors[(p.week - 1) % weekColors.length];
      const badgeStyle = `color:${color};border-color:${color}44;background:${color}14`;
      const tagsHtml = (p.topics || []).map(t => {
        const isMatch = (topic && t === topic) || (query && t.toLowerCase().includes(query));
        return `<span class="result-tag${isMatch ? ' match' : ''}">${t}</span>`;
      }).join('');
      return `
        <a class="result-item" href="${p.file}" tabindex="-1">
          <div class="result-badge" style="${badgeStyle}">W${p.week}</div>
          <div class="result-body">
            <div class="result-title">${p.title}</div>
            <div class="result-sub">${p.subtitle}</div>
            <div class="result-tags">${tagsHtml}</div>
          </div>
        </a>
      `;
    }).join('');
  }

  function moveFocus(dir) {
    const items = document.querySelectorAll('#searchResults .result-item');
    if (!items.length) return;
    items.forEach(el => el.classList.remove('focused'));
    focusedIdx = Math.max(0, Math.min(items.length - 1, focusedIdx + dir));
    items[focusedIdx].classList.add('focused');
    items[focusedIdx].scrollIntoView({ block: 'nearest' });
  }

  function selectFocused() {
    const focused = document.querySelector('#searchResults .result-item.focused');
    if (focused) { focused.click(); return; }
    const first = document.querySelector('#searchResults .result-item');
    if (first) first.click();
  }

  document.addEventListener('keydown', e => {
    const overlay = document.getElementById('searchOverlay');
    const isOpen = overlay && overlay.classList.contains('open');
    if (!isOpen) {
      if (e.key === 's' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault(); openSearch();
      }
      return;
    }
    if (e.key === 'Escape') { closeSearch(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); moveFocus(-1); return; }
    if (e.key === 'Enter')     { e.preventDefault(); selectFocused(); return; }
  });

  document.addEventListener('input', e => {
    if (e.target.id !== 'searchInput') return;
    const q = e.target.value.trim();
    if (!q) { setMode('idle'); document.getElementById('searchResults').innerHTML = ''; return; }
    setMode('text');
    const ql = q.toLowerCase();
    const results = allPages.filter(p =>
      p.title.toLowerCase().includes(ql) ||
      p.subtitle.toLowerCase().includes(ql) ||
      (p.topics || []).some(t => t.toLowerCase().includes(ql))
    );
    renderResultItems(results, ql, null);
  });

  loadNotes().then(data => {
    renderNotes(data);
    allPages = Object.values(data).flat();
    buildModal();
  });

} /* end _isIndex */
