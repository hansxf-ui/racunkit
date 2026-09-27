// M2 Task 1 RED: Product store (CRUD + link normalize)
const assert = require('assert');
// In-memory localStorage stub (simulates browser for node tests)
global.localStorage = {
    _d: {},
    getItem(k) { return Object.prototype.hasOwnProperty.call(this._d, k) ? this._d[k] : null; },
    setItem(k, v) { this._d[k] = String(v); },
    removeItem(k) { delete this._d[k]; },
};
const { storeSet } = require('../js/common.js');
const { getProducts, saveProduct, deleteProduct, normalizeLink } = require('../js/toko-store.js');

storeSet('racunkit_products_v1', []);
const p = saveProduct({ name: 'Tumbler', price: 45000, img: '', link: 'shopee.co.id/x', category: 'Rumah' });
assert.ok(p.id, 'saved product gets an id');
assert.strictEqual(getProducts().length, 1, 'one product stored');
assert.strictEqual(getProducts()[0].link, 'https://shopee.co.id/x', 'link normalized on save');
assert.strictEqual(normalizeLink('shopee.co.id/x'), 'https://shopee.co.id/x');
assert.strictEqual(normalizeLink('https://s.shopee.co.id/y'), 'https://s.shopee.co.id/y');
assert.strictEqual(normalizeLink(''), '');

// upsert: same id updates, new object without id never overwrites
const p2 = saveProduct({ name: 'Tumbler 2', price: 50000, img: '', link: 'https://s.shopee.co.id/z', category: 'Rumah' });
assert.notStrictEqual(p2.id, p.id, 'duplicate add gets a new id');
assert.strictEqual(getProducts().length, 2);
const upd = saveProduct({ ...p, name: 'Tumbler Pro' });
assert.strictEqual(upd.id, p.id, 'update keeps id');
assert.strictEqual(getProducts().find(x => x.id === p.id).name, 'Tumbler Pro');

deleteProduct(p.id);
assert.strictEqual(getProducts().length, 1, 'delete removes one');
assert.ok(!getProducts().some(x => x.id === p.id));

storeSet('racunkit_products_v1', []);
console.log('toko.test.js store PASS');

// M2 Task 2 RED: Card renderer + click tracker
const { renderCard, trackClick, getClicks } = require('../js/toko-render.js');

const cardHtml = renderCard({ id: 'p1', name: 'Tumbler', price: 45000, img: '', link: 'https://s.shopee.co.id/x', category: 'Rumah', badge: 'Termurah' });
assert.ok(cardHtml.includes('Tumbler') && cardHtml.includes('Rp45.000') && cardHtml.includes('Termurah'));
assert.ok(cardHtml.includes('target="_blank"'), 'affiliate link opens in new tab');
assert.ok(cardHtml.includes('rel="noopener"'), 'noopener for safety');
assert.ok(cardHtml.includes('<svg'), 'empty img -> SVG placeholder');

const broken = renderCard({ id: 'p2', name: 'X', price: 1000, img: 'not-a-url', link: 'https://s.shopee.co.id/y', category: 'Fashion' });
assert.ok(!broken.includes('not-a-url'), 'broken img URL must not leak into HTML');

const evil = renderCard({ id: 'p3', name: '<script>alert(1)</script>', price: 1000, img: '', link: 'https://s.shopee.co.id/z', category: 'Fashion' });
assert.ok(!evil.includes('<script>alert'), 'name must be HTML-escaped');

const noscheme = renderCard({ id: 'p4', name: 'Y', price: 1000, img: '', link: 'shopee.co.id/abc', category: 'Rumah' });
assert.ok(noscheme.includes('href="https://shopee.co.id/abc"'), 'link normalized in card');

assert.strictEqual(trackClick('p1'), 1);
assert.strictEqual(trackClick('p1'), 2);
assert.strictEqual(getClicks('p1'), 2);
assert.strictEqual(getClicks('nope'), 0, 'unknown id -> 0 clicks');

// click counts survive a "reload" (fresh module, same localStorage)
delete require.cache[require.resolve('../js/toko-render.js')];
const { getClicks: getClicks2 } = require('../js/toko-render.js');
assert.strictEqual(getClicks2('p1'), 2, 'clicks persist across reload');

console.log('toko.test.js render PASS');

// Repo+local merge: produk repo publik, perubahan lokal menimpa
const store2 = require('../js/toko-store.js');
globalThis.PRODUK_TOKO = [
    { id: 'r1', name: 'Repo A', price: 10000, img: '', link: 'https://s.shopee.co.id/a', category: 'Rumah', badge: '' },
    { id: 'r2', name: 'Repo B', price: 20000, img: '', link: 'https://s.shopee.co.id/b', category: 'Beauty', badge: '' },
];
storeSet('racunkit_products_v1', []);
storeSet('racunkit_products_deleted_v1', []);
assert.strictEqual(store2.getProducts().length, 2, 'repo products visible with empty local');
assert.strictEqual(store2.getLocalProducts().length, 0, 'no local products yet');

const lc = store2.saveProduct({ name: 'Lokal C', price: 30000, img: '', link: 'https://s.shopee.co.id/c', category: 'Fashion' });
assert.strictEqual(store2.getProducts().length, 3, 'local add appends to repo list');
assert.strictEqual(store2.getLocalProducts().length, 1, 'local list tracks it');

store2.saveProduct({ id: 'r1', name: 'Repo A Edit', price: 11000, img: '', link: 'https://s.shopee.co.id/a', category: 'Rumah', badge: '' });
assert.strictEqual(store2.getProducts().find(x => x.id === 'r1').name, 'Repo A Edit', 'local edit overrides repo');
assert.strictEqual(store2.getProducts().length, 3, 'edit does not duplicate');

store2.deleteProduct('r2');
assert.ok(!store2.getProducts().some(x => x.id === 'r2'), 'repo product hidden after local delete');
assert.strictEqual(store2.getProducts().length, 2);

store2.saveProduct({ id: 'r2', name: 'Repo B', price: 20000, img: '', link: 'https://s.shopee.co.id/b', category: 'Beauty', badge: '' });
assert.ok(store2.getProducts().some(x => x.id === 'r2'), 're-adding unhides repo product');

const exp = store2.exportProdukJs();
assert.ok(exp.includes('const PRODUK_TOKO'), 'export declares PRODUK_TOKO');
assert.ok(exp.includes('js/produk.js'), 'export notes destination path');
assert.ok(exp.includes('Repo A Edit') && exp.includes('Lokal C'), 'export contains merged list');
assert.doesNotThrow(() => { new Function(exp + ';return PRODUK_TOKO;')(); }, 'export is valid JS');

delete globalThis.PRODUK_TOKO;
storeSet('racunkit_products_v1', []);
storeSet('racunkit_products_deleted_v1', []);
console.log('toko.test.js merge PASS');
