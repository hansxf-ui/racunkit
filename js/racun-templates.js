// RacunKit — Racun Machine templates (template slot-filling, no AI)
if (typeof module !== 'undefined') require('./common.js'); // sets globalThis.RK
const { formatRupiah: fmtRp, storeGet: sget, storeSet: sset } = globalThis.RK;

const vals = (p) => {
    const nama = (p.name || '').trim() || 'Produk ini';
    const harga = p.price ? fmtRp(p.price) : 'harga spesial';
    const kl = (p.kelebihan || []).map(s => (s || '').trim()).filter(Boolean);
    const kelebihan = kl.length ? kl : ['kualitasnya oke', 'worth it banget'];
    const audiens = (p.audience || '').trim() || 'kamu';
    return { nama, harga, kelebihan, audiens };
};

const fillSlots = (tpl, v) => tpl
    .replaceAll('{nama}', v.nama)
    .replaceAll('{harga}', v.harga)
    .replaceAll('{kelebihan}', v.kelebihan[0])
    .replaceAll('{kelebihan2}', v.kelebihan[1] || v.kelebihan[0])
    .replaceAll('{kelebihan3}', v.kelebihan[2] || v.kelebihan[0])
    .replaceAll('{audiens}', v.audiens);

const fill = (tpl, p) => {
    const out = fillSlots(tpl, vals(p));
    return out.length > 140 ? out.slice(0, 137) + '…' : out;
};

const HOOK_TEMPLATES = [
    'STOP SCROLL! {nama} cuma {harga}, {audiens} wajib punya sih.',
    'Gue nemu {nama} yang {kelebihan}, harganya cuma {harga} 😭',
    'POV: {audiens} akhirnya nemu {nama} {harga} yang {kelebihan}.',
    'Jangan beli {nama} sebelum nonton ini… eh tapi {harga} doang, gas lah.',
    '{nama} viral lagi! Yang {kelebihan} cuma {harga}, kapan lagi coba.',
    'Racun hari ini: {nama}. {kelebihan}, {kelebihan2}, cuma {harga}.',
    'Buat {audiens} yang cari {nama}, ini paling worth it: {harga} udah {kelebihan}.',
    'Spill {nama} {harga} yang lagi rame dibahas, ternyata {kelebihan}!',
    'Kenapa baru tau ada {nama} seenak ini? {harga} doang weh.',
    '{audiens} merapat! {nama} jadi {harga}, stoknya rebutan terus.'
];

const generateHooks = (p) => {
    let idx = Number(sget('racunkit_hook_idx_v1', 0)) || 0;
    const out = [];
    for (let i = 0; i < 5; i++) out.push(fill(HOOK_TEMPLATES[(idx + i) % HOOK_TEMPLATES.length], p));
    sset('racunkit_hook_idx_v1', (idx + 5) % HOOK_TEMPLATES.length);
    return out;
};

const SCRIPT_TEMPLATES = {
    heboh: `[HOOK]
EH {audiens}! {nama} cuma {harga} dan {kelebihan}!

[DEMO]
Nih liat: {kelebihan}, {kelebihan2}. Udah gitu harganya {harga} doang. Gila sih ini.

[CTA]
Jangan sampe kehabisan! Link di bio / keranjang oren, checkout sekarang!`,
    kalem: `[HOOK]
Buat {audiens} yang lagi cari {nama}, coba simak dulu.

[DEMO]
Jujur, yang paling berasa itu {kelebihan}. Terus {kelebihan2} juga oke. Harganya {harga}, masih masuk akal banget.

[CTA]
Kalo tertarik, link ada di bio. Santai aja, dipikir-pikir dulu juga boleh.`,
    lucu: `[HOOK]
Dompet {audiens}: "jangan jajan". {nama}: "{harga} doang, {kelebihan} pula".

[DEMO]
Coba tebak: {kelebihan} plus {kelebihan2}, harganya? {harga}! Dompet langsung pasrah.

[CTA]
Udah, checkout aja gih. Link di keranjang oren. Salahin gue kalo nyesel (nggak bakal).`
};

const generateScript = (p, tone) => fillSlots(SCRIPT_TEMPLATES[tone] || SCRIPT_TEMPLATES.heboh, vals(p));

const CAPTION_TEMPLATES = [
    `{nama} cuma {harga}! 🧡

{kelebihan} + {kelebihan2} — {audiens} wajib checkout.

Link di bio ya!`,
    `Spill {nama} yang lagi viral 🛒
Harga: {harga}
Kenapa wajib punya: {kelebihan}, {kelebihan2}.

Buruan, stoknya cepet abis! Link di keranjang oren 👆`
];

const HASHTAG_POOL = {
    generic: ['#racunshopee', '#shopeehaul', '#rekomendasi', '#viral', '#belanjahemat', '#racun', '#shopee', '#diskon'],
    Fashion: ['#ootd', '#fashionmurah', '#racunfashion'],
    Beauty: ['#skincare', '#racunskincare', '#beautyhaul'],
    Elektronik: ['#gadget', '#racungadget', '#techhaul'],
    Rumah: ['#homehaul', '#racunrumah', '#dekorasi'],
    Makanan: ['#jajan', '#racunjajan', '#foodhaul'],
    'Buku/Hobi': ['#hobi', '#racunhobi', '#bookhaul']
};

const generateCaption = (p) => {
    const v = vals(p);
    if (!p.price) v.harga = 'cek harga di link';
    let idx = Number(sget('racunkit_caption_idx_v1', 0)) || 0;
    const caption = fillSlots(CAPTION_TEMPLATES[idx % CAPTION_TEMPLATES.length], v);
    sset('racunkit_caption_idx_v1', (idx + 1) % CAPTION_TEMPLATES.length);
    const tags = [...(HASHTAG_POOL[p.category] || []), ...HASHTAG_POOL.generic].slice(0, 7);
    return { caption, hashtags: tags };
};

if (typeof module !== 'undefined') module.exports = { generateHooks, generateScript, generateCaption };
