# M2 Toko Rekomendasi Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Toko Rekomendasi module: a personal affiliate storefront (public page) plus an admin page to manage products, with per-product click counting.

**Architecture:** Static pages on the M1 foundation. Products and click counts persist in localStorage (`racunkit_products_v1`, `racunkit_clicks_v1`). Pure logic (store, card HTML) tested with plain `node`.

**Tech Stack:** HTML + CSS + vanilla JS. Same repo `hansxf-ui/racunkit`.

**Spec:** `~/workspace/racunkit/SPEC.md` (sections 2/M2, 3, 4)

**Depends on:** M1 Plan Task 1 interfaces (`formatRupiah`, `storeGet`, `storeSet`, `toast`, CSS classes). Do not reimplement them.

## Global Constraints

- Static only — no backend; "public" page is public by URL, data lives in Ryan's browser.
- Mobile-first, Indonesian copy.
- Product: `{id: string, name: string, price: number, img: string, link: string, category: string, badge?: string}`.
- Affiliate links open in new tab (`target="_blank" rel="noopener"`).
- Never render "undefined" for missing fields; invalid image URL → placeholder SVG.

## Review Focus

- Image URL broken/empty → card shows inline SVG placeholder, layout intact. (Test in Task 2.)
- Link missing scheme (`shopee.co.id/...`) → normalized to `https://`. (Test in Task 1.)
- Duplicate product add → new id (Date.now-based), never overwrites. (Test in Task 1.)
- Click tracking survives reload (localStorage round-trip). (Test in Task 2.)
- Admin delete → confirm dialog before removal. (Verified in Task 4.)

---

### Task 1: Product store (CRUD + link normalize)

**Files:**
- Create: `js/toko-store.js`
- Test: `tests/toko.test.js`

**Interfaces:**
- Consumes: `storeGet`, `storeSet` from `js/common.js`.
- Produces:
  - `getProducts() -> Product[]`
  - `saveProduct(p: Product) -> Product` (assigns id if missing)
  - `deleteProduct(id: string) -> void`
  - `normalizeLink(url: string) -> string`

- [ ] **Step 1: Write the failing test**:
```js
storeSet('racunkit_products_v1', []);
const p = saveProduct({name:'Tumbler', price:45000, img:'', link:'shopee.co.id/x', category:'Rumah'});
assert(p.id && getProducts().length === 1);
assert(normalizeLink('shopee.co.id/x') === 'https://shopee.co.id/x');
assert(normalizeLink('https://s.shopee.co.id/y') === 'https://s.shopee.co.id/y');
deleteProduct(p.id); assert(getProducts().length === 0);
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** `js/toko-store.js` (CommonJS export shim). id = `'p' + Date.now().toString(36)`.
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 2: Card renderer + click tracker

**Files:**
- Create: `js/toko-render.js`
- Test: `tests/toko.test.js` (append)

**Interfaces:**
- Consumes: `formatRupiah` from `js/common.js`; `normalizeLink` from `js/toko-store.js`.
- Produces:
  - `renderCard(p: Product) -> string` (HTML string)
  - `trackClick(id: string) -> number` (returns new count)
  - `getClicks(id: string) -> number`

- [ ] **Step 1: Write the failing test**:
```js
const html = renderCard({id:'p1', name:'Tumbler', price:45000, img:'', link:'https://s.shopee.co.id/x', category:'Rumah', badge:'Termurah'});
assert(html.includes('Tumbler') && html.includes('Rp45.000') && html.includes('Termurah'));
assert(html.includes('target="_blank"'));
const broken = renderCard({id:'p2', name:'X', price:1000, img:'not-a-url', link:'https://s.shopee.co.id/y', category:'Fashion'});
assert(!broken.includes('not-a-url')); // placeholder used instead
trackClick('p1'); trackClick('p1'); assert(getClicks('p1') === 2);
```
- [ ] **Step 2: Run test** — Expected: FAIL.
- [ ] **Step 3: Implement** — card: image (or inline SVG placeholder), badge, name, price, category chip, "Beli di Shopee" button with `onclick="trackClick('id')"` wiring note for the page.
- [ ] **Step 4: Run test** — Expected: PASS.

### Task 3: toko.html (public storefront)

**Files:**
- Create: `toko.html`

**Interfaces:**
- Consumes: `getProducts`, `renderCard`, `trackClick`, `getClicks`.

- [ ] **Step 1: Build page** — header (title + short desc), category filter chips (Semua + categories present), responsive product grid, empty state ("Belum ada produk — tambah via admin").
- [ ] **Step 2: Wire clicks** — card button opens normalized link in new tab AND increments counter.
- [ ] **Step 3: Verify in browser** — seed 3 sample products via console, check grid, filter, click-through. Fix issues.
- [ ] **Step 4: Push + live verify** with cache-buster.

### Task 4: toko-admin.html (manage products)

**Files:**
- Create: `toko-admin.html`

**Interfaces:**
- Consumes: `getProducts`, `saveProduct`, `deleteProduct`, `getClicks`.

- [ ] **Step 1: Build page** — product list (name, price, clicks, edit/delete buttons) + form (all Product fields, badge optional select).
- [ ] **Step 2: Wire CRUD** — add/edit saves and re-renders; delete asks `confirm()` first; toast on save/delete.
- [ ] **Step 3: Verify in browser** — full cycle: add → appears in toko.html → edit → delete. Fix issues.
- [ ] **Step 4: Push + live verify** — link admin page from dashboard card (small "kelola" link).
