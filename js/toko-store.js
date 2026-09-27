// RacunKit — Toko product store.
// Sumber permanen (publik): js/produk.js -> PRODUK_TOKO (di repo, terlihat semua pengunjung).
// Perubahan lokal (tambah/ubah/hapus di HP ini) tersimpan di localStorage dan menimpa data repo.
if (typeof module !== 'undefined') require('./common.js'); // sets globalThis.RK
const { storeGet: sget, storeSet: sset } = globalThis.RK;

const KEY = 'racunkit_products_v1';
const KEY_DELETED = 'racunkit_products_deleted_v1';

const normalizeLink = (url) => {
    const u = (url || '').trim();
    if (!u) return '';
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(u) ? u : 'https://' + u;
};

const repoProducts = () => (typeof PRODUK_TOKO !== 'undefined' && Array.isArray(PRODUK_TOKO) ? PRODUK_TOKO : []);

// Daftar gabungan: produk repo (minus yang dihapus lokal) + produk lokal (menang jika id sama).
const getProducts = () => {
    const deleted = sget(KEY_DELETED, []);
    const byId = {};
    repoProducts().forEach(p => {
        if (p && p.id && !deleted.includes(p.id)) byId[p.id] = { ...p };
    });
    sget(KEY, []).forEach(p => {
        if (p && p.id) byId[p.id] = { ...p };
    });
    return Object.values(byId);
};

// Daftar mentah perubahan lokal (untuk label "lokal" di admin).
const getLocalProducts = () => sget(KEY, []);

const isRepoProduct = (id) => repoProducts().some(p => p && p.id === id);

const genId = (list) => {
    let id = 'p' + Date.now().toString(36);
    while (list.some(x => x.id === id)) id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    return id;
};

const saveProduct = (p) => {
    const clean = {
        id: p.id || genId(getProducts()),
        name: (p.name || '').trim(),
        price: Number(p.price) || 0,
        img: (p.img || '').trim(),
        link: normalizeLink(p.link),
        category: (p.category || '').trim(),
        badge: (p.badge || '').trim(),
    };
    const local = getLocalProducts();
    const i = local.findIndex(x => x.id === clean.id);
    if (i >= 0) local[i] = clean; else local.push(clean);
    sset(KEY, local);
    // tambah/ubah lagi = batalkan flag hapus lokal
    sset(KEY_DELETED, sget(KEY_DELETED, []).filter(d => d !== clean.id));
    return clean;
};

const deleteProduct = (id) => {
    sset(KEY, getLocalProducts().filter(x => x.id !== id));
    if (isRepoProduct(id)) {
        const del = sget(KEY_DELETED, []);
        if (!del.includes(id)) { del.push(id); sset(KEY_DELETED, del); }
    }
    return true;
};

// Hasilkan isi file js/produk.js dari daftar gabungan saat ini (untuk dipush ke repo).
const exportProdukJs = () => {
    const header = '// Daftar produk permanen Toko Rekomendasi — RacunKit.\n' +
        '// Tujuan file: js/produk.js (push ke repo agar terlihat semua pengunjung)\n';
    return header + 'const PRODUK_TOKO = ' + JSON.stringify(getProducts(), null, 2) + ';\n';
};

if (typeof module !== 'undefined') module.exports = { getProducts, getLocalProducts, saveProduct, deleteProduct, normalizeLink, exportProdukJs };
