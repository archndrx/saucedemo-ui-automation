import { Locator, Page, expect } from '@playwright/test';

export class CartPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cart\.html$/);
    await expect(this.title).toHaveText('Your Cart');
  }

  async expectOnlyItem(name: string, price: string): Promise<void> {
    await expect(this.items).toHaveCount(1);
    await expect(this.items.getByTestId('inventory-item-name')).toHaveText(name);
    await expect(this.items.getByTestId('inventory-item-price')).toHaveText(price);
    await expect(this.items.getByTestId('item-quantity')).toHaveText('1');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
