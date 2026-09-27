const assert = require('assert');
const { formatRupiah } = require('../js/common.js');

assert.strictEqual(formatRupiah(45000), 'Rp45.000');
assert.strictEqual(formatRupiah(0), 'Rp0');
assert.strictEqual(formatRupiah(1500000), 'Rp1.500.000');

console.log('common.test.js PASS');
