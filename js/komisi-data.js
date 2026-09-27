// Komisi Radar — tabel komisi Shopee Affiliate 2026 per skema & kategori.
// Data per Sep 2026 (riset web) — konfirmasi angka final di dashboard Shopee Affiliate.
// cap: 0 = tidak ada cap. rate: angka headline skema (%).
const KATEGORI_MID = {
    'Fashion': 7.5,
    'Beauty': 9.5,
    'Elektronik': 3.5,
    'Rumah': 6.5,
    'Makanan': 6,
    'Buku/Hobi': 7.5,
};

const COMMISSIONS = {
    sosmed: {
        label: 'Sosmed (Reguler)',
        rate: 2,
        cap: 10000,
        categories: { ...KATEGORI_MID, 'Elektronik': 0.5 },
        note: 'Reguler: maks Rp10.000 per pesanan',
    },
    partner: {
        label: 'Affiliate Partner',
        rate: 4,
        cap: 50000,
        categories: { ...KATEGORI_MID, 'Elektronik': 0.5 },
        note: 'Butuh 2rb+ subscriber: maks Rp50.000 per pesanan',
    },
    video: {
        label: 'Shopee Video',
        rate: 8,
        cap: 0,
        categories: { ...KATEGORI_MID },
        note: '6–10% non-elektronik, Golden Tick lebih tinggi · tanpa cap',
    },
    live: {
        label: 'Shopee Live',
        rate: 5,
        cap: 0,
        categories: { ...KATEGORI_MID },
        note: '3–7% non-elektronik, 1–3% elektronik (Golden Tick) · tanpa cap',
    },
};

const LAST_UPDATED = '2026-09-28';

if (typeof module !== 'undefined') module.exports = { COMMISSIONS, LAST_UPDATED, KATEGORI_MID };
