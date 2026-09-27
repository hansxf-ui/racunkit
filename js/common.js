// RacunKit shared helpers
const formatRupiah = (n) => 'Rp' + Number(n || 0).toLocaleString('id-ID');

const storeGet = (key, fallback) => {
    try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
};

const storeSet = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
};

const copyText = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
};

let _toastTimer = null;
const toast = (msg) => {
    let el = document.getElementById('rk-toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'rk-toast';
        el.className = 'toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
};

if (typeof module !== 'undefined') module.exports = { formatRupiah, storeGet, storeSet, copyText, toast };
globalThis.RK = { formatRupiah, storeGet, storeSet, copyText, toast };
