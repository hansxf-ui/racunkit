const assert = require('assert');
const { generateHooks } = require('../js/racun-templates.js');

const sample = {
    name: 'Tumbler Viral 1L', price: 45000, category: 'Rumah',
    kelebihan: ['dingin 24 jam', 'anti tumpah'], audience: 'anak kos'
};

const hooks = generateHooks(sample);
assert.strictEqual(hooks.length, 5, 'must return exactly 5 hooks');
hooks.forEach(h => {
    assert.strictEqual(typeof h, 'string');
    assert.ok(h.length > 10, 'hook too short: ' + h);
    assert.ok(h.toLowerCase().includes('tumbler'), 'hook must mention product: ' + h);
    assert.ok(h.length <= 140, 'hook too long (' + h.length + '): ' + h);
    assert.ok(!h.includes('undefined'), 'contains undefined: ' + h);
});

console.log('racun.test.js hooks PASS');

const { generateScript } = require('../js/racun-templates.js');
['heboh', 'kalem', 'lucu'].forEach(t => {
    const s = generateScript(sample, t);
    assert.ok(s.indexOf('[HOOK]') !== -1 && s.indexOf('[DEMO]') !== -1 && s.indexOf('[CTA]') !== -1, 'missing section in ' + t);
    assert.ok(s.indexOf('[HOOK]') < s.indexOf('[DEMO]') && s.indexOf('[DEMO]') < s.indexOf('[CTA]'), 'wrong order in ' + t);
    assert.ok(s.includes('Tumbler Viral 1L'), 'must mention product in ' + t);
    assert.ok(!s.includes('undefined'), 'undefined in ' + t);
});
console.log('racun.test.js script PASS');

const { generateCaption } = require('../js/racun-templates.js');
const cap = generateCaption(sample);
assert.ok(cap.caption.includes('Tumbler Viral 1L'), 'caption must mention product');
assert.ok(cap.caption.includes('Rp45.000'), 'caption must include price');
assert.ok(cap.hashtags.length >= 5, 'need >= 5 hashtags');
assert.ok(cap.hashtags.every(h => h.startsWith('#')), 'all hashtags start with #');
const noPrice = generateCaption({ ...sample, price: 0 });
assert.ok(!noPrice.caption.includes('Rp0'), 'must not show Rp0');
assert.ok(noPrice.caption.includes('cek harga di link'), 'must say cek harga di link');
console.log('racun.test.js caption PASS');
