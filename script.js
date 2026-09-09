const EXTERNAL_LINK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;

let DATA = null;
let activeCategory = null;

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
  DATA.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.dataset.cat = cat.id;
    btn.innerHTML = `${cat.label}<span class="hint">${cat.hint}</span>`;
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

function renderToolRow(tool) {
  const row = document.createElement('article');
  row.className = 'tool-row';

  const tags = [];
  if (tool.multi) tags.push(`<span class="tag multi">Multi-fungsi</span>`);
  tags.push(`<span class="tag ${tool.pricing}">${labelForPricing(tool.pricing)}</span>`);
  if (tool.bahasa_indonesia) tags.push(`<span class="tag id">Dukung Bahasa Indonesia</span>`);

  row.innerHTML = `
    <div class="tool-head">
      <h3 class="tool-name">${tool.name}</h3>
    </div>
    <div class="tool-tags">${tags.join('')}</div>
    <div class="tool-body">
      <p class="kelebihan"><span class="label">Kelebihan.</span>${tool.kelebihan}</p>
      <p class="keter"><span class="label">Keterbatasan.</span>${tool.keterbatasan}</p>
      <p class="free-limit"><span class="label">Jatah gratis.</span>${tool.free_limit}</p>
    </div>
    ${tool.catatan_pribadi ? `<p class="tool-note">${tool.catatan_pribadi}</p>` : ''}
    <a class="tool-cta" href="${tool.affiliate_url || tool.url}" target="_blank" rel="noopener sponsored">
      Coba tool ini ${EXTERNAL_LINK_ICON}
    </a>
  `;
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
