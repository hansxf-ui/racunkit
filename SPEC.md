# SPEC: RacunKit — Shopee Affiliate Toolkit

## 1. Ringkasan
Toolkit web pribadi untuk membantu Ryan menghasilkan uang sebagai Shopee Affiliate.
Fokus: bikin konten "racun" yang konversi, kelola etalase produk, dan paham
struktur komisi Shopee.

**Bukan:** situs tools umum, bukan untuk publik luas (personal use, tapi
halaman etalase bisa di-share).

## 2. Modul

### M1 — Racun Machine (generator paket konten)
Input: nama produk, harga, kategori, 2-3 kelebihan, target pembeli (opsional).
Output (satu klik, semua bisa di-copy):
- 5 hook pembuka gaya "racun Shopee"
- Script video 30 detik (hook → demo → CTA)
- Caption + hashtag siap posting
- Varian nada: heboh / kalem / lucu

Cara kerja: template + slot-filling murni di JS (tanpa API/AI berbayar).
Template ditulis natural, gaya bahasa Indonesia sosmed.

### M2 — Toko Rekomendasi (etalase affiliate pribadi)
- Tambah produk: nama, harga, foto (URL), link affiliate Shopee, kategori,
  badge (mis. "Termurah", "Best Seller")
- Halaman etalase mobile-friendly, tiap kartu → link affiliate
- Link halaman bisa taro di bio sosmed
- Hitung klik per produk (localStorage) → keliatan produk mana yang dilirik
- Kelola (tambah/edit/hapus) lewat halaman admin sederhana

### M3 — Komisi Radar (peta komisi + kalkulator)
- Tabel komisi per kategori Shopee Affiliate 2026 (data riset, ada tanggal
  update & disclaimer "cek dashboard Shopee untuk angka final")
- Kalkulator: harga × % komisi = cuan per pcs (dengan max cap per skema)
- Kalkulator target (kebalikan): target Rp/bulan → butuh berapa pcs terjual
- Ranking kategori paling cuan
- Skema yang didukung: Media Sosial reguler, Affiliate Partner, Shopee Video,
  Shopee Live (angka dari riset 2026)

Data komisi (riset Sep 2026, wajib verifikasi ulang di dashboard):
- Sosmed reguler: non-elektronik 2%, elektronik 0.5%, max Rp10rb/pesanan
- Affiliate Partner (2rb+ subscriber): 4%, max Rp50rb/pesanan
- Shopee Video: non-elektronik 6-10% (Golden Tick lebih tinggi)
- Shopee Live: non-elektronik 3-7%, elektronik 1-3% (Golden Tick)
- Estimasi kategori: Fashion 5-10%, Beauty 7-12%, Elektronik 2-5%,
  Rumah 5-8%, Makanan 4-8%, Buku/Hobi 5-10% (+XTRA masing-masing)

## 3. Teknis
- Static site: HTML + CSS + JS murni (tanpa framework, tanpa backend)
- Data (produk, klik): localStorage di browser
- Mobile-first (dipake dari HP Android), bahasa Indonesia
- Hosting: GitHub Pages (repo baru `hansxf-ui/racunkit`), pola sama kayak
  galeri & preloved shop
- Tanpa dependensi berbayar / API key

## 4. Struktur halaman
- `index.html` — dashboard: 3 kartu modul + statistik ringkas
- `racun.html` — Racun Machine
- `toko.html` — etalase publik
- `toko-admin.html` — kelola produk etalase
- `komisi.html` — Komisi Radar

## 5. Di luar scope (sengaja TIDAK dibikin)
- Login / multi-user / backend / database server
- Integrasi API Shopee (butuh approval & key)
- Auto-posting ke sosmed
- Tracking klik real-time lintas device (cukup localStorage)

## 6. Pertanyaan terbuka
1. Nama "RacunKit" oke, atau mau nama lain?
2. Urutan build: M1 → M2 → M3, atau mau prioritas lain?
