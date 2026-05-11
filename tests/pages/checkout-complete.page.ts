import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  readonly completeMessage: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeMessage = page.getByText('THANK YOU FOR YOUR ORDER').or(page.locator('[data-testid="complete-header"]'));
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' }).or(page.locator('[data-testid="back-home"]'));
  }

  async expectPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(this.completeMessage).toBeVisible();
  }

  async verifyOrderComplete() {
    await expect(this.completeMessage).toBeVisible();
  }

  async backHome() {
    await this.backHomeButton.click();
  }
}
