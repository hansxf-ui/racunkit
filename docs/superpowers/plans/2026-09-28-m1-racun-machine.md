# M1 Racun Machine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Racun Machine module: paste product info → get 5 hooks, a 30-second video script, and caption+hashtags, all copyable.

**Architecture:** Static multi-page site. Foundation (repo, shared CSS/JS, dashboard) is built in Task 1 of this plan since M1 builds first. Content generation is pure JS template slot-filling — no AI, no API, no backend. Tests run with plain `node`.

**Tech Stack:** HTML + CSS + vanilla JS. localStorage for persistence. GitHub Pages hosting.

**Spec:** `~/workspace/racunkit/SPEC.md` (sections 2/M1, 3, 4)

## Global Constraints

- Static HTML+CSS+JS only — no framework, no backend, no paid API.
- Mobile-first layout, all UI copy in Indonesian.
- localStorage keys: `racunkit_products_v1` (array), `racunkit_clicks_v1` (object id→count).
- Generated text must read natural (fan/seller voice), never robotic.
- Every generated string with a missing/empty field must not contain "undefined".

## Review Focus

- Empty product name → generators fall back to "Produk ini", never "undefined". (Test in Task 3.)
- price 0/missing → caption uses "cek harga di link", never "Rp0". (Test in Task 5.)
- Empty kelebihan list → templates still produce complete sentences via generic fallback. (Test in Task 3.)
- Copy button on Android Chrome → uses clipboard API with execCommand fallback. (Verified in Task 6.)
- Very long product name (>60 chars) → hooks stay under 140 chars (truncate with …). (Test in Task 3.)

---

### Task 1: Foundation — repo, dashboard, shared assets

**Files:**
- Create: `index.html`, `css/style.css`, `js/common.js`
- Test: `tests/common.test.js`

**Interfaces:**
- Produces (consumed by all later tasks/plans):
  - `formatRupiah(n: number) -> string` — "Rp45.000"
  - `storeGet(key: string, fallback: any) -> any`
  - `storeSet(key: string, value: any) -> void`
  - `copyText(text: string) -> Promise<void>` — clipboard with fallback
  - `toast(msg: string) -> void`
  - CSS classes: `.page`, `.card`, `.btn`, `.btn-primary`, `.input`, `.grid-modul`

- [ ] **Step 1: Write the failing test** — `tests/common.test.js`:
```js
const { formatRupiah } = require('../js/common.js'); // shim: common.js must export when required
assert(formatRupiah(45000) === 'Rp45.000');
assert(formatRupiah(0) === 'Rp0');
```
- [ ] **Step 2: Run test to verify it fails** — Run: `node tests/common.test.js` — Expected: FAIL (file not found).
- [ ] **Step 3: Implement** `js/common.js` with the five functions above (CommonJS export shim: `if (typeof module !== 'undefined') module.exports = {...}`), `css/style.css` (mobile-first, CSS variables for colors), `index.html` (dashboard with 3 module cards linking to `racun.html`, `toko.html`, `komisi.html`).
- [ ] **Step 4: Run test to verify it passes** — Run: `node tests/common.test.js` — Expected: PASS.
- [ ] **Step 5: Create GitHub repo** `hansxf-ui/racunkit` via API, push foundation files, enable Pages. Verify `https://hansxf-ui.github.io/racunkit/` loads (cache-buster).

### Task 2: Hook generator

**Files:**
- Create: `js/racun-templates.js`, modify: `js/common.js` (nothing — standalone)
- Test: `tests/racun.test.js`

**Interfaces:**
- Consumes: `formatRupiah` from `js/common.js`.
- Produces: `generateHooks(product) -> string[]` — exactly 5 non-empty hooks. `product = {name, price, category, kelebihan: string[], audience?: string}`.

- [ ] **Step 1: Write the failing test** — sample product `{name:'Tumbler Viral 1L', price:45000, category:'Rumah', kelebihan:['dingin 24 jam','anti tumpah'], audience:'anak kos'}`:
```js
const hooks = generateHooks(sample);
assert(hooks.length === 5);
hooks.forEach(h => { assert(typeof h === 'string' && h.length > 10); assert(h.toLowerCase().includes('tumbler')); assert(h.length <= 140); });
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** `generateHooks` in `js/racun-templates.js`: ≥8 hook templates with `{nama}`, `{harga}`, `{kelebihan}`, `{audiens}` slots; pick 5 deterministically varied (no immediate repeats across calls — rotate by stored counter in localStorage `racunkit_hook_idx_v1`).
- [ ] **Step 4: Run test** — Expected: PASS.
- [ ] **Step 5: Edge test** — `generateHooks({name:'', price:0, category:'', kelebihan:[]})` returns 5 strings, none containing "undefined", none over 140 chars. Add to test file, run, PASS.

### Task 3: Script generator (3 tones)

**Files:**
- Modify: `js/racun-templates.js`
- Test: `tests/racun.test.js` (append)

**Interfaces:**
- Produces: `generateScript(product, tone) -> string` — `tone ∈ {'heboh','kalem','lucu'}`. Output has three labeled sections `[HOOK]`, `[DEMO]`, `[CTA]` in that order.

- [ ] **Step 1: Write the failing test**:
```js
['heboh','kalem','lucu'].forEach(t => {
  const s = generateScript(sample, t);
  assert(s.indexOf('[HOOK]') < s.indexOf('[DEMO]') && s.indexOf('[DEMO]') < s.indexOf('[CTA]'));
  assert(s.includes('Tumbler Viral 1L'));
});
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** `generateScript`: one template per tone, slots filled from product; DEMO section uses up to 3 kelebihan items; CTA includes "Link di bio / keranjang oren".
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 4: Caption + hashtag generator

**Files:**
- Modify: `js/racun-templates.js`
- Test: `tests/racun.test.js` (append)

**Interfaces:**
- Produces: `generateCaption(product) -> {caption: string, hashtags: string[]}` — hashtags length ≥ 5, each starts with '#'.

- [ ] **Step 1: Write the failing test**:
```js
const { caption, hashtags } = generateCaption(sample);
assert(caption.includes('Tumbler Viral 1L') && caption.includes('Rp45.000'));
assert(hashtags.length >= 5 && hashtags.every(h => h.startsWith('#')));
const noPrice = generateCaption({...sample, price: 0});
assert(!noPrice.caption.includes('Rp0') && noPrice.caption.includes('cek harga di link'));
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** `generateCaption`: ≥2 caption templates; hashtag pool per category + generic (`#racunshopee`, `#shopeehaul`, `#rekomendasi`, …); pick 5-8 relevant.
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 5: racun.html UI

**Files:**
- Create: `racun.html`

**Interfaces:**
- Consumes: `generateHooks`, `generateScript`, `generateCaption` from `js/racun-templates.js`; `copyText`, `toast` from `js/common.js`.

- [ ] **Step 1: Build page** — form fields: nama produk (text), harga (number), kategori (select: Fashion, Beauty, Elektronik, Rumah, Makanan, Buku/Hobi), kelebihan (textarea, one per line), audiens (optional text), nada (3 radio: heboh/kalem/lucu), button "Generate".
- [ ] **Step 2: Wire output** — sections: 5 hooks (each with copy button), script (copy button), caption + hashtags (copy buttons). Regenerate button.
- [ ] **Step 3: Verify in browser** — open page, fill sample product, generate, confirm all sections render and copy buttons work. Fix issues found.
- [ ] **Step 4: Push** via gh-push, verify live with cache-buster.

### Task 6: Polish + ship M1

- [ ] **Step 1: Crosscheck** — empty form submit → friendly validation (no crash); test on mobile viewport.
- [ ] **Step 2: Final push + live verify** — all M1 files on Pages, `racun.html` reachable from dashboard card.
