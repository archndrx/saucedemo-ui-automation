# Laporan Hasil Test – Saucedemo UI Automation

Run terakhir: **3 November 2026, 14:53 WIB** · Playwright Test · browser Chromium · `https://www.saucedemo.com`

**12 test, 12 passed, 0 failed** (durasi 18,2 detik). Tidak ditemukan bug pada skenario yang diuji.

| Skenario | Test | Passed |
| --- | --- | --- |
| Login | 7 | 7 |
| E2E Checkout | 5 | 5 |

## Detail per test

| ID | Test | Hasil | Durasi |
| --- | --- | --- | --- |
| TC-LOGIN-01 | login berhasil dengan standard_user | Pass | 2,3 s |
| TC-LOGIN-02 | login gagal dengan password salah | Pass | 1,8 s |
| TC-LOGIN-03 | login gagal untuk user yang terkunci | Pass | 1,8 s |
| TC-LOGIN-04 | username wajib diisi | Pass | 1,2 s |
| TC-LOGIN-05 | password wajib diisi | Pass | 1,5 s |
| TC-LOGIN-06 | halaman produk tidak bisa dibuka tanpa login | Pass | 1,5 s |
| TC-LOGIN-07 | logout mengembalikan user ke halaman login | Pass | 1,9 s |
| TC-CHK-01 | checkout Sauce Labs Onesie sampai selesai | Pass | 9,3 s |
| TC-CHK-02 | Back Home setelah checkout kembali ke produk dengan keranjang kosong | Pass | 8,5 s |
| TC-CHK-03 | checkout tidak bisa lanjut tanpa First Name | Pass | 8,7 s |
| TC-CHK-04 | checkout tidak bisa lanjut tanpa Last Name | Pass | 8,8 s |
| TC-CHK-05 | checkout tidak bisa lanjut tanpa Postal Code | Pass | 3,1 s |

## Skenario utama: E2E Checkout (TC-CHK-01)

| Langkah | Yang dicek | Hasil |
| --- | --- | --- |
| 1. Login sebagai `standard_user` | Halaman Products terbuka | Pass |
| 2. Tambahkan 'Sauce Labs Onesie' ke keranjang | Badge keranjang = 1, tombol berubah menjadi Remove | Pass |
| 3. Buka keranjang | Hanya ada Sauce Labs Onesie, harga $7.99, jumlah 1 | Pass |
| 4. Checkout dan isi data pembeli | Pindah ke halaman Checkout: Overview | Pass |
| 5. Periksa overview lalu klik Finish | Item total $7.99, total = item total + pajak | Pass |
| 6. Pastikan checkout selesai | Halaman "Checkout: Complete!", pesan "Thank you for your order!", keranjang kosong | Pass |

## File laporan

- `reports/html/index.html` – laporan HTML Playwright, termasuk langkah-langkah TC-CHK-01. Unduh repo lalu buka file ini di browser, atau jalankan `npx playwright show-report reports/html`.
- `reports/junit.xml` – hasil dalam format JUnit, untuk CI.
