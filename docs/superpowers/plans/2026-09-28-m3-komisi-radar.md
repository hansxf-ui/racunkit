# M3 Komisi Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Komisi Radar module: Shopee Affiliate 2026 commission table per category/scheme, a commission calculator (with caps), and a reverse target calculator.

**Architecture:** Static page on the M1 foundation. Commission data is a JS constant researched Sep 2026, displayed with "last updated" date and a disclaimer to confirm in the Shopee dashboard. Pure calculation functions tested with plain `node`.

**Tech Stack:** HTML + CSS + vanilla JS. Same repo `hansxf-ui/racunkit`.

**Spec:** `~/workspace/racunkit/SPEC.md` (sections 2/M3, 3, 4)

**Depends on:** M1 Plan Task 1 interfaces (`formatRupiah`, CSS classes). Do not reimplement them.

## Global Constraints

- All rates from SPEC section 2/M3 (researched Sep 2026). Page shows "Data per Sep 2026 — konfirmasi di dashboard Shopee Affiliate".
- Schemes: `sosmed` (reguler), `partner` (Affiliate Partner), `video` (Shopee Video), `live` (Shopee Live).
- Categories: Fashion, Beauty, Elektronik, Rumah, Makanan, Buku/Hobi.
- Money math in integers (rupiah), no floating display artifacts.

## Review Focus

- Commission exceeding max cap → capped value returned, UI shows "terkena cap". (Test in Task 2.)
- Electronics rate differs per scheme → correct rate picked per scheme+category. (Test in Task 2.)
- Target smaller than one sale's commission → "cukup 1 pcs". (Test in Task 3.)
- Price input with dots/thousand separators ("150.000") → parsed to 150000. (Test in Task 2.)
- Unknown category string → falls back to lowest rate of scheme, never NaN. (Test in Task 2.)

---

### Task 1: Commission data table

**Files:**
- Create: `js/komisi-data.js`
- Test: `tests/komisi.test.js`

**Interfaces:**
- Produces: `COMMISSIONS: { [scheme]: { rate: number, cap: number, categories: { [cat]: number } } }` and `LAST_UPDATED = '2026-09-28'`.
- Rates (from spec): sosmed {rate:2%, cap:10000, Elektronik:0.5%}; partner {rate:4%, cap:50000, Elektronik:0.5%}; video {rate:8%, cap:Infinity→use 0 (no cap), note "6-10%, Golden Tick lebih tinggi"}; live {rate:5%, cap:0, note "3-7% non-elektronik, 1-3% elektronik (Golden Tick)"}. Category overrides where spec gives ranges → use midpoint: Fashion 7.5%, Beauty 9.5%, Elektronik 3.5%, Rumah 6.5%, Makanan 6%, Buku/Hobi 7.5%.

- [ ] **Step 1: Write the failing test**:
```js
assert(COMMISSIONS.sosmed.cap === 10000);
assert(COMMISSIONS.partner.rate === 4);
assert(COMMISSIONS.video.categories.Beauty === 9.5);
assert(LAST_UPDATED === '2026-09-28');
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** `js/komisi-data.js` (CommonJS export shim).
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 2: Commission calculator

**Files:**
- Create: `js/komisi-calc.js`
- Test: `tests/komisi.test.js` (append)

**Interfaces:**
- Consumes: `COMMISSIONS` from `js/komisi-data.js`.
- Produces:
  - `parseRupiah(s: string) -> number` — "150.000" → 150000, "150000" → 150000.
  - `calcCommission(price: number, category: string, scheme: string) -> {rate, gross, net, capped: boolean}` — net = min(gross, cap) when cap > 0.

- [ ] **Step 1: Write the failing test**:
```js
assert(parseRupiah('150.000') === 150000);
let r = calcCommission(200000, 'Beauty', 'sosmed'); // 9.5% = 19000 > cap 10000
assert(r.gross === 19000 && r.net === 10000 && r.capped === true);
r = calcCommission(150000, 'Fashion', 'sosmed'); // 7.5% = 11250 > cap
assert(r.net === 10000 && r.capped === true);
r = calcCommission(50000, 'Makanan', 'sosmed'); // 6% = 3000, no cap hit
assert(r.net === 3000 && r.capped === false);
r = calcCommission(100000, 'Unknown', 'sosmed'); assert(!isNaN(r.net));
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** — category rate lookup with fallback to scheme base rate; integer rounding on gross.
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 3: Target (reverse) calculator

**Files:**
- Modify: `js/komisi-calc.js`
- Test: `tests/komisi.test.js` (append)

**Interfaces:**
- Produces: `calcTarget(targetRp: number, price: number, category: string, scheme: string) -> {perSale: number, pcs: number}` — pcs = ceil(targetRp / perSale), min 1.

- [ ] **Step 1: Write the failing test**:
```js
let t = calcTarget(1000000, 50000, 'Makanan', 'sosmed'); // perSale 3000 → 334 pcs
assert(t.perSale === 3000 && t.pcs === 334);
t = calcTarget(1000, 50000, 'Makanan', 'sosmed'); assert(t.pcs === 1);
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** `calcTarget` using `calcCommission` net.
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 4: komisi.html UI

**Files:**
- Create: `komisi.html`

**Interfaces:**
- Consumes: `COMMISSIONS`, `LAST_UPDATED`, `parseRupiah`, `calcCommission`, `calcTarget`, `formatRupiah`.

- [ ] **Step 1: Build page** — sections: (a) rate table per scheme × category + last-updated + disclaimer; (b) "Kategori paling cuan" ranking (sort categories by video-scheme rate desc); (c) kalkulator komisi (price input, category select, scheme select → result with cap notice); (d) kalkulator target (target Rp input + same selectors → pcs needed).
- [ ] **Step 2: Verify in browser** — check table renders, both calculators compute, cap notice appears when hit. Fix issues.
- [ ] **Step 3: Push + live verify** with cache-buster.
