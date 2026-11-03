import { test, expect } from '../src/fixtures';
import { PASSWORD, USERS } from '../src/data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('TC-LOGIN-01 login berhasil dengan standard_user', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard, PASSWORD);

    await inventoryPage.expectLoaded();
    await expect(inventoryPage.cartLink).toBeVisible();
  });

  test('TC-LOGIN-02 login gagal dengan password salah', async ({ loginPage, page }) => {
    await loginPage.login(USERS.standard, 'wrong_password');

    await loginPage.expectError('Username and password do not match any user in this service');
    await expect(page).toHaveURL('/');
  });

  test('TC-LOGIN-03 login gagal untuk user yang terkunci', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await loginPage.expectError('Sorry, this user has been locked out.');
  });

  test('TC-LOGIN-04 username wajib diisi', async ({ loginPage }) => {
    await loginPage.login('', PASSWORD);

    await loginPage.expectError('Username is required');
  });

  test('TC-LOGIN-05 password wajib diisi', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, '');

    await loginPage.expectError('Password is required');
  });

  test('TC-LOGIN-06 halaman produk tidak bisa dibuka tanpa login', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');

    await expect(page).toHaveURL('/');
    await loginPage.expectError('You can only access');
  });

  test('TC-LOGIN-07 logout mengembalikan user ke halaman login', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await inventoryPage.expectLoaded();

    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
