# Saucedemo UI Automation

Take Home Test – Task 3. Automation test UI untuk [saucedemo.com](https://www.saucedemo.com), dibuat dengan **Playwright Test + TypeScript** dan pola **Page Object Model**.

| Skenario | File spec | Jumlah test |
| --- | --- | --- |
| Login | `tests/login.spec.ts` | 7 |
| E2E Checkout | `tests/checkout.spec.ts` | 5 |
| **Total** | | **12** |

## Kebutuhan

- Node.js 18 atau lebih baru (`node -v`)

## Instalasi dan menjalankan test

```bash
npm install
npx playwright install chromium   # unduh browser, cukup sekali
npm test                          # jalankan semua test
npm run report                    # buka laporan HTML
```

Perintah lain:

```bash
npm run test:headed     # jalankan dengan browser terlihat
npm run test:login      # hanya test login
npm run test:checkout   # hanya test checkout
npm run typecheck       # cek tipe TypeScript
```

Laporan tersimpan di `playwright-report/` (HTML) dan `test-results/junit.xml` (JUnit, untuk CI). Jika test gagal, screenshot dan trace disimpan otomatis di `test-results/`.

## Laporan

| File | Isi |
| --- | --- |
| [TEST_REPORT.md](TEST_REPORT.md) | Ringkasan hasil run terakhir, hasil per test, dan langkah skenario checkout |
| `reports/html/index.html` | Laporan HTML Playwright (buka di browser, atau `npx playwright show-report reports/html`) |
| `reports/junit.xml` | Hasil dalam format JUnit |

Setiap `npm test` membuat laporan baru di `playwright-report/` dan `test-results/` (tidak di-commit). Untuk memperbarui laporan di repo, salin hasilnya ke `reports/`.

## Daftar test

**Login**

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| TC-LOGIN-01 | Login dengan `standard_user` | Masuk ke halaman Products |
| TC-LOGIN-02 | Password salah | Pesan "Username and password do not match…" |
| TC-LOGIN-03 | `locked_out_user` | Pesan "Sorry, this user has been locked out." |
| TC-LOGIN-04 | Username kosong | Pesan "Username is required" |
| TC-LOGIN-05 | Password kosong | Pesan "Password is required" |
| TC-LOGIN-06 | Buka `/inventory.html` tanpa login | Dikembalikan ke halaman login dengan pesan error |
| TC-LOGIN-07 | Logout | Kembali ke halaman login |

**E2E Checkout**

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| TC-CHK-01 | Tambah "Sauce Labs Onesie" → buka keranjang → checkout → finish | Halaman "Checkout: Complete!" dan "Thank you for your order!", keranjang kosong |
| TC-CHK-02 | Klik Back Home setelah checkout | Kembali ke Products, keranjang kosong |
| TC-CHK-03 – 05 | First Name / Last Name / Postal Code kosong | Pesan "… is required", tetap di halaman informasi |

TC-CHK-01 adalah skenario utama dari soal. Setiap langkahnya ditulis sebagai `test.step`, jadi terlihat terpisah di laporan HTML. Selain memastikan halaman selesai muncul, test ini juga mengecek badge keranjang, isi keranjang (nama, harga, jumlah), dan total di overview (item total + pajak).

## Struktur project

```
src/
  pages/
    LoginPage.ts       halaman login
    InventoryPage.ts   daftar produk, keranjang, menu logout
    CartPage.ts        halaman keranjang
    CheckoutPage.ts    informasi pembeli, overview, dan halaman selesai
  data/users.ts        user, password, data pembeli, dan produk
  fixtures.ts          page object + fixture loggedIn
tests/
  login.spec.ts
  checkout.spec.ts
reports/               laporan HTML dan JUnit dari run terakhir
TEST_REPORT.md         ringkasan hasil test
playwright.config.ts   base URL, browser, reporter
```

## Catatan desain

- **Page Object Model.** Selector dan aksi halaman ada di `src/pages`, sehingga test hanya berisi alur dan
  pengecekan. Jika tampilan berubah, cukup ubah satu file.
- **Selector `data-test`.** Saucedemo menyediakan atribut `data-test`, dan `testIdAttribute` di config diset
  ke atribut ini. Selector seperti ini lebih stabil daripada class CSS atau XPath.
- **Produk dicari berdasarkan nama**, bukan urutan di halaman, sehingga test tetap benar jika urutan produk berubah.
- **Fixture `loggedIn`** melakukan login sebelum test checkout, sehingga setiap test berdiri sendiri dan bisa
  berjalan paralel.
- **Tanpa `waitForTimeout`.** Semua pengecekan memakai auto-wait dari `expect` Playwright.
