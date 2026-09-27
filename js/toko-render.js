// RacunKit — Toko card renderer + click tracker
// normalizeLink lives in toko-store.js: shared top-level const in the browser
// (script order: common -> toko-store -> toko-render), required module in node.
if (typeof module !== 'undefined') require('./common.js'); // sets globalThis.RK
const { formatRupiah: fmtRp } = globalThis.RK;
const _storeGet = globalThis.RK.storeGet, _storeSet = globalThis.RK.storeSet;
const _nl = typeof module !== 'undefined' ? require('./toko-store.js').normalizeLink : null;

const CLICKS_KEY = 'racunkit_clicks_v1';

const escHtml = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const PLACEHOLDER_SVG = `<svg class="ph" viewBox="0 0 200 200" aria-hidden="true">
<rect width="200" height="200" fill="#f1e8dc"/>
<path d="M70 78h60l-6 52a8 8 0 0 1-8 7H84a8 8 0 0 1-8-7l-6-52z" fill="none" stroke="#c9a227" stroke-width="6"/>
<path d="M82 78a18 18 0 0 1 36 0" fill="none" stroke="#c9a227" stroke-width="6"/>
</svg>`;

const imgHtml = (p) => {
    const src = (p.img || '').trim();
    if (/^https?:\/\//i.test(src)) return `<img src="${escHtml(src)}" alt="${escHtml(p.name)}" loading="lazy">`;
    return PLACEHOLDER_SVG;
};

const renderCard = (p) => {
    const nl = _nl || normalizeLink; // node: required | browser: toko-store.js const
    const id = escHtml(p.id || '');
    return `<div class="prod-card" data-id="${id}">
${imgHtml(p)}
<div class="body">
${p.badge ? `<span class="badge">${escHtml(p.badge)}</span>` : ''}
<h4>${escHtml(p.name) || 'Produk'}</h4>
<p class="price">${fmtRp(p.price)}</p>
<p class="cat">${escHtml(p.category || 'Lainnya')}</p>
<a class="buy" href="${escHtml(nl(p.link))}" target="_blank" rel="noopener" data-toko-id="${id}">Beli di Shopee</a>
</div>
</div>`;
};

const getClicks = (id) => {
    const all = _storeGet(CLICKS_KEY, {});
    return Number(all[id]) || 0;
};

const trackClick = (id) => {
    const all = _storeGet(CLICKS_KEY, {});
    all[id] = (Number(all[id]) || 0) + 1;
    _storeSet(CLICKS_KEY, all);
    return all[id];
};

if (typeof module !== 'undefined') module.exports = { renderCard, trackClick, getClicks };
