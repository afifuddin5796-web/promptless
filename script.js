const ICONS = {
  gambar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
  video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
  presentasi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  tulisan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  dokumen: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,
  multi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
  audio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  kode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
};

const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
const ALERT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
const GIFT_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>`;
const EXTERNAL_LINK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

let DATA = null;
let activeCategory = null;

// Used by the onerror handler on <img class="logo"> tags: if a logo file is
// missing or fails to load, swap it for the plain category icon instead.
window.__fallbackAvatar = function (toolId) {
  const tool = DATA.tools.find(t => t.id === toolId);
  const icon = tool ? primaryIcon(tool) : ICONS.multi;
  return `<span class="tool-avatar">${icon}</span>`;
};

async function init() {
  const res = await fetch('data/tools.json');
  DATA = await res.json();

  document.getElementById('updatedDate').textContent = formatDate(DATA.updated);
  renderCategoryNav();
  renderResults();

  document.getElementById('searchInput').addEventListener('input', (e) => {
    activeCategory = null;
    updateActiveNavButton();
    renderResults(e.target.value.trim().toLowerCase());
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderCategoryNav() {
  const nav = document.getElementById('catNav');
  nav.innerHTML = '';

  // Tombol "Semua" untuk meriset filter kategori
  const allBtn = document.createElement('button');
  allBtn.dataset.cat = 'all';
  allBtn.className = !activeCategory ? 'active' : '';
  allBtn.innerHTML = `
    <span class="cat-icon">${ICONS.multi}</span>
    <span class="cat-text">Semua AI</span>
  `;
  allBtn.addEventListener('click', () => {
    activeCategory = null;
    document.getElementById('searchInput').value = '';
    updateActiveNavButton();
    renderResults();
  });
  nav.appendChild(allBtn);

  // Render kategori bawaan dari JSON
  DATA.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.dataset.cat = cat.id;
    btn.innerHTML = `
      <span class="cat-icon">${ICONS[cat.id] || ''}</span>
      <span class="cat-text">${cat.label}</span>
    `;
    btn.addEventListener('click', () => {
      activeCategory = cat.id;
      document.getElementById('searchInput').value = '';
      updateActiveNavButton();
      renderResults();
    });
    nav.appendChild(btn);
  });
}

function updateActiveNavButton() {
  document.querySelectorAll('.cat-nav button').forEach(b => {
    if (!activeCategory && b.dataset.cat === 'all') {
      b.classList.add('active');
    } else {
      b.classList.toggle('active', b.dataset.cat === activeCategory);
    }
  });
}
function updateActiveNavButton() {
  document.querySelectorAll('.cat-nav button').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === activeCategory);
  });
}

function renderResults(searchTerm) {
  const title = document.getElementById('resultsTitle');
  const sub = document.getElementById('resultsSub');
  const list = document.getElementById('toolList');
  list.innerHTML = '';

  let tools = DATA.tools;

  if (searchTerm) {
    title.textContent = `Hasil untuk "${searchTerm}"`;
    sub.textContent = `${countMatches(searchTerm)} AI ditemukan.`;
    tools = tools.filter(t => matchesSearch(t, searchTerm));
  } else if (activeCategory) {
    const cat = DATA.categories.find(c => c.id === activeCategory);
    title.textContent = cat.label;
    sub.textContent = cat.hint;
    tools = tools.filter(t => t.categories.includes(activeCategory));
    tools = sortMultiFirst(tools);
  } else {
    title.textContent = 'Semua kategori';
    sub.textContent = 'Klik salah satu kategori di samping untuk mulai, atau ketik pencarian di atas.';
    tools = sortMultiFirst(tools);
  }

  if (tools.length === 0) {
    list.innerHTML = `<p class="empty">Belum ada AI yang cocok untuk pencarian ini. Coba kata kunci lain.</p>`;
    return;
  }

  tools.forEach(t => list.appendChild(renderToolRow(t)));
}

function sortMultiFirst(tools) {
  return [...tools].sort((a, b) => (b.multi === true) - (a.multi === true));
}

function matchesSearch(tool, term) {
  const haystack = [tool.name, tool.kelebihan, tool.keterbatasan, ...tool.categories]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term);
}

function countMatches(term) {
  return DATA.tools.filter(t => matchesSearch(t, term)).length;
}

function primaryIcon(tool) {
  const order = ['multi', 'gambar', 'video', 'presentasi', 'tulisan', 'dokumen', 'audio', 'kode'];
  const cat = order.find(c => tool.categories.includes(c)) || tool.categories[0];
  return ICONS[cat] || ICONS.multi;
}

function renderToolRow(tool) {
  const row = document.createElement('article');
  row.className = 'tool-row';

  const tags = [];
  if (tool.multi) tags.push(`<span class="tag multi">Multi-fungsi</span>`);
  tags.push(`<span class="tag ${tool.pricing}">${labelForPricing(tool.pricing)}</span>`);
  if (tool.bahasa_indonesia) tags.push(`<span class="tag id">Dukung Bahasa Indonesia</span>`);

  // Prefer a real logo file (data/tools.json -> "logo"). If it's missing or
  // fails to load (404), fall back to the plain category icon automatically.
  const avatarHtml = tool.logo
    ? `<span class="tool-avatar has-logo">
         <img src="${tool.logo}" alt="Logo ${tool.name}" loading="lazy"
              onerror="this.closest('.tool-avatar').outerHTML = window.__fallbackAvatar('${tool.id}')">
       </span>`
    : `<span class="tool-avatar">${primaryIcon(tool)}</span>`;

  row.innerHTML = [
    '<div class="tool-head">',
    avatarHtml,
    `<h3 class="tool-name">${tool.name}</h3>`,
    '</div>',
    `<div class="tool-tags">${tags.join('')}</div>`,
    '<div class="tool-body">',
    `<p class="kelebihan"><span class="line-icon good">${CHECK_ICON}</span><span class="label">Kelebihan.</span>${tool.kelebihan}</p>`,
    `<p class="keter"><span class="line-icon warn">${ALERT_ICON}</span><span class="label">Keterbatasan.</span>${tool.keterbatasan}</p>`,
    `<p class="free-limit"><span class="line-icon gift">${GIFT_ICON}</span><span class="label">Jatah gratis.</span>${tool.free_limit}</p>`,
    '</div>',
    tool.catatan_pribadi ? `<p class="tool-note">${tool.catatan_pribadi}</p>` : '',
    `<a class="tool-cta" href="${tool.affiliate_url || tool.url}" target="_blank" rel="noopener sponsored">Coba tool ini ${EXTERNAL_LINK_ICON}</a>`
  ].join('\n');

  return row;
}

function labelForPricing(p) {
  if (p === 'gratis') return 'Gratis';
  if (p === 'freemium') return 'Gratis terbatas';
  if (p === 'berbayar') return 'Berbayar';
  return p;
}

init();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
