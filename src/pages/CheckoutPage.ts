import { Locator, Page, expect } from '@playwright/test';

/** Mencakup tiga langkah checkout: informasi pembeli, overview, dan halaman selesai. */
export class CheckoutPage {
  readonly title: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly error: Locator;
  readonly items: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.error = page.getByTestId('error');
    this.items = page.getByTestId('inventory-item');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async fillInformation(info: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
    await this.firstName.fill(info.firstName);
    await this.lastName.fill(info.lastName);
    await this.postalCode.fill(info.postalCode);
    await this.continueButton.click();
  }

  async expectOverview(itemName: string, price: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(this.title).toHaveText('Checkout: Overview');
    await expect(this.items).toHaveCount(1);
    await expect(this.items.getByTestId('inventory-item-name')).toHaveText(itemName);
    await expect(this.subtotal).toHaveText(`Item total: ${price}`);

    // Total harus sama dengan item total + pajak.
    const amount = async (l: Locator) => Number((await l.innerText()).replace(/[^0-9.]/g, ''));
    const expected = (await amount(this.subtotal)) + (await amount(this.tax));
    expect(await amount(this.total)).toBeCloseTo(expected, 2);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectComplete(): Promise<void> {
    await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(this.title).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
