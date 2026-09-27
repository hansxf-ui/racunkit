// M3 Task 1 RED: Commission data table
const assert = require('assert');
const { COMMISSIONS, LAST_UPDATED } = require('../js/komisi-data.js');

assert.strictEqual(COMMISSIONS.sosmed.cap, 10000, 'sosmed cap 10rb');
assert.strictEqual(COMMISSIONS.partner.rate, 4, 'partner headline rate 4%');
assert.strictEqual(COMMISSIONS.video.categories.Beauty, 9.5, 'video Beauty 9.5%');
assert.strictEqual(COMMISSIONS.sosmed.categories.Elektronik, 0.5, 'sosmed Elektronik 0.5%');
assert.strictEqual(COMMISSIONS.live.rate, 5, 'live headline rate 5%');
assert.strictEqual(COMMISSIONS.video.cap, 0, 'video no cap');
assert.strictEqual(LAST_UPDATED, '2026-09-28');
for (const s of ['sosmed', 'partner', 'video', 'live']) {
    assert.ok(COMMISSIONS[s].categories, s + ' has categories');
    assert.strictEqual(Object.keys(COMMISSIONS[s].categories).length, 6, s + ' has 6 categories');
}
console.log('komisi.test.js data PASS');

// M3 Task 2 RED: commission calculator
const { parseRupiah, calcCommission } = require('../js/komisi-calc.js');

assert.strictEqual(parseRupiah('150.000'), 150000, 'dots parsed');
assert.strictEqual(parseRupiah('150000'), 150000, 'plain digits');
assert.strictEqual(parseRupiah('Rp 1.250.000'), 1250000, 'Rp prefix');
assert.strictEqual(parseRupiah(''), 0, 'empty -> 0');

let r = calcCommission(200000, 'Beauty', 'sosmed'); // 9.5% = 19000 > cap 10000
assert.strictEqual(r.rate, 9.5);
assert.strictEqual(r.gross, 19000);
assert.strictEqual(r.net, 10000);
assert.strictEqual(r.capped, true);

r = calcCommission(150000, 'Fashion', 'sosmed'); // 7.5% = 11250 > cap
assert.strictEqual(r.net, 10000);
assert.strictEqual(r.capped, true);

r = calcCommission(50000, 'Makanan', 'sosmed'); // 6% = 3000, no cap hit
assert.strictEqual(r.net, 3000);
assert.strictEqual(r.capped, false);

r = calcCommission(1000000, 'Elektronik', 'partner'); // 0.5% = 5000 < cap 50000
assert.strictEqual(r.net, 5000);
assert.strictEqual(r.capped, false);

r = calcCommission(1000000, 'Beauty', 'video'); // 9.5% = 95000, no cap
assert.strictEqual(r.net, 95000);
assert.strictEqual(r.capped, false);

r = calcCommission(100000, 'Unknown', 'sosmed');
assert.ok(!isNaN(r.net) && r.net >= 0, 'unknown category never NaN');

console.log('komisi.test.js calc PASS');

// M3 Task 3 RED: reverse target calculator
const { calcTarget } = require('../js/komisi-calc.js');

let t = calcTarget(1000000, 50000, 'Makanan', 'sosmed'); // perSale 3000 -> 334 pcs
assert.strictEqual(t.perSale, 3000);
assert.strictEqual(t.pcs, 334);

t = calcTarget(1000, 50000, 'Makanan', 'sosmed'); // less than one sale -> 1 pcs
assert.strictEqual(t.pcs, 1);

t = calcTarget(100000, 200000, 'Beauty', 'video'); // perSale 19000 -> ceil(100000/19000)=6
assert.strictEqual(t.perSale, 19000);
assert.strictEqual(t.pcs, 6);

t = calcTarget(50000, 0, 'Makanan', 'sosmed'); // zero price -> unreachable
assert.strictEqual(t.perSale, 0);
assert.strictEqual(t.pcs, 0);

console.log('komisi.test.js target PASS');
