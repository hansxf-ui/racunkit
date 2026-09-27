// RacunKit — Toko product store (localStorage CRUD + link normalize)
if (typeof module !== 'undefined') require('./common.js'); // sets globalThis.RK
const { storeGet: sget, storeSet: sset } = globalThis.RK;

const KEY = 'racunkit_products_v1';

const normalizeLink = (url) => {
    const u = (url || '').trim();
    if (!u) return '';
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(u) ? u : 'https://' + u;
};

const getProducts = () => sget(KEY, []);

const genId = (list) => {
    let id = 'p' + Date.now().toString(36);
    while (list.some(x => x.id === id)) id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return id;
};

const saveProduct = (p) => {
    const list = getProducts();
    const clean = {
        id: p.id || genId(list),
        name: (p.name || '').trim(),
        price: Number(p.price) || 0,
        img: (p.img || '').trim(),
        link: normalizeLink(p.link),
        category: (p.category || '').trim(),
        badge: (p.badge || '').trim(),
    };
    const i = list.findIndex(x => x.id === clean.id);
    if (i >= 0) list[i] = clean; else list.push(clean);
    sset(KEY, list);
    return clean;
};

const deleteProduct = (id) => sset(KEY, getProducts().filter(x => x.id !== id));

if (typeof module !== 'undefined') module.exports = { getProducts, saveProduct, deleteProduct, normalizeLink };
