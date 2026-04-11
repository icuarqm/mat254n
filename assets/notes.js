/* MAT254 Lineer Cebir — notes.js
   Header/footer enjeksiyonu, dark mode, navigasyon, animasyonlar */

/* ── Dark Mode ──────────────────────────────────────────── */

function applyDarkMode() {
  if (localStorage.getItem('dm') === '1') {
    document.body.classList.add('dark');
  }
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

/* ── Navigasyon ─────────────────────────────────────────── */

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
  } catch {
    return { prev: null, next: null };
  }
}

/* ── Site Header ────────────────────────────────────────── */

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

/* ── Site Footer ────────────────────────────────────────── */

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

/* ── Scroll Animasyonları ───────────────────────────────── */

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
    // İlk birkaç element için kademeli gecikme, rest hemen gözlemle
    if (i < 5) {
      setTimeout(() => observer.observe(el), i * 55);
    } else {
      observer.observe(el);
    }
  });
}

/* ── KaTeX ──────────────────────────────────────────────── */

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

/* ── Init ───────────────────────────────────────────────── */

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
