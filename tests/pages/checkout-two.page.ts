import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CheckoutCompletePage } from './checkout-complete.page';
import { InventoryPage } from './inventory.page';

export class CheckoutTwoPage extends BasePage {
  readonly cartItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="inventory-item"], .cart_item');
    this.subtotalLabel = page.locator('[data-testid="subtotal"], .summary_subtotal_label');
    this.taxLabel = page.locator('[data-testid="tax"], .summary_tax_label');
    this.totalLabel = page.locator('[data-testid="total"], .summary_total_label');
    this.finishButton = page.getByRole('button', { name: 'Finish' }).or(page.locator('[data-testid="finish-button"]'));
    this.cancelButton = page.locator('[data-test="cancel"], button:has-text("Cancel"), [data-testid="cancel-button"]');
  }

  async expectPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  }

  async verifyOverview() {
    await expect(this.cartItems).toHaveCount(1);
    await expect(this.subtotalLabel).toContainText('Item total');
    await expect(this.taxLabel).toContainText('Tax');
    await expect(this.totalLabel).toContainText('Total');
    await expect(this.finishButton).toBeVisible();
  }

  async verifyOverviewMultipleItems(expectedCount: number) {
    await expect(this.cartItems).toHaveCount(expectedCount);
    await expect(this.subtotalLabel).toContainText('Item total');
    await expect(this.taxLabel).toContainText('Tax');
    await expect(this.totalLabel).toContainText('Total');
    await expect(this.finishButton).toBeVisible();
  }

  async finishPurchase() {
    await this.finishButton.click();
    const completePage = new CheckoutCompletePage(this.page);
    await completePage.expectPage();
    return completePage;
  }

  async cancelCheckout() {
    await this.cancelButton.click();
    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.expectInventoryPage();
    return inventoryPage;
  }
}
