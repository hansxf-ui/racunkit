// Komisi Radar — pure calculation functions (integer rupiah math, no float display artifacts).
const _C = typeof module !== 'undefined' ? require('./komisi-data.js').COMMISSIONS : COMMISSIONS;

const parseRupiah = (s) => {
    const n = Number(String(s == null ? '' : s).replace(/[^\d]/g, ''));
    return isNaN(n) ? 0 : n;
};

// Category rate for scheme; unknown category falls back to the scheme's lowest rate (never NaN).
const schemeRate = (category, scheme) => {
    const sc = _C[scheme] || _C.sosmed;
    if (Object.prototype.hasOwnProperty.call(sc.categories, category)) return sc.categories[category];
    return Math.min(...Object.values(sc.categories));
};

const calcCommission = (price, category, scheme) => {
    const sc = _C[scheme] || _C.sosmed;
    const rate = schemeRate(category, scheme);
    const p = Math.max(0, Math.floor(Number(price) || 0));
    const gross = Math.round(p * rate / 100);
    const capped = sc.cap > 0 && gross > sc.cap;
    return { rate, gross, net: capped ? sc.cap : gross, capped };
};

const calcTarget = (targetRp, price, category, scheme) => {
    const { net: perSale } = calcCommission(price, category, scheme);
    const target = Math.max(0, Math.floor(Number(targetRp) || 0));
    if (perSale <= 0) return { perSale: 0, pcs: 0 }; // unreachable: price too low / no commission
    return { perSale, pcs: Math.max(1, Math.ceil(target / perSale)) };
};

if (typeof module !== 'undefined') module.exports = { parseRupiah, calcCommission, calcTarget, schemeRate };
