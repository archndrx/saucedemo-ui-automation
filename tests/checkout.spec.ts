import { test, expect } from '../src/fixtures';
import { CUSTOMER, PRODUCT } from '../src/data/users';

test.describe('E2E Checkout', () => {
  test('TC-CHK-01 checkout Sauce Labs Onesie sampai selesai', async ({
    loggedIn,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await test.step(`Tambahkan '${PRODUCT.name}' ke keranjang`, async () => {
      await inventoryPage.addToCart(PRODUCT.name);

      await expect(inventoryPage.cartBadge).toHaveText('1');
      await expect(inventoryPage.removeButton(PRODUCT.name)).toBeVisible();
    });

    await test.step('Buka keranjang', async () => {
      await inventoryPage.openCart();

      await cartPage.expectLoaded();
      await cartPage.expectOnlyItem(PRODUCT.name, PRODUCT.price);
    });

    await test.step('Lanjut ke checkout dan isi data pembeli', async () => {
      await cartPage.checkout();
      await checkoutPage.fillInformation(CUSTOMER);
    });

    await test.step('Periksa overview lalu selesaikan pesanan', async () => {
      await checkoutPage.expectOverview(PRODUCT.name, PRODUCT.price);
      await checkoutPage.finish();
    });

    await test.step('Pastikan checkout selesai', async () => {
      await checkoutPage.expectComplete();
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
  });

  test('TC-CHK-02 Back Home setelah checkout kembali ke produk dengan keranjang kosong', async ({
    loggedIn,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart(PRODUCT.name);
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(CUSTOMER);
    await checkoutPage.finish();
    await checkoutPage.expectComplete();

    await checkoutPage.backHomeButton.click();

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });

  const missingFields = [
    { id: 'TC-CHK-03', field: 'First Name', data: { ...CUSTOMER, firstName: '' } },
    { id: 'TC-CHK-04', field: 'Last Name', data: { ...CUSTOMER, lastName: '' } },
    { id: 'TC-CHK-05', field: 'Postal Code', data: { ...CUSTOMER, postalCode: '' } },
  ];

  for (const { id, field, data } of missingFields) {
    test(`${id} checkout tidak bisa lanjut tanpa ${field}`, async ({
      loggedIn,
      inventoryPage,
      cartPage,
      checkoutPage,
      page,
    }) => {
      await inventoryPage.addToCart(PRODUCT.name);
      await inventoryPage.openCart();
      await cartPage.checkout();

      await checkoutPage.fillInformation(data);

      await expect(checkoutPage.error).toContainText(`${field} is required`);
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    });
  }
});
