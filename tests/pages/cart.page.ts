import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CheckoutOnePage } from './checkout-one.page';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="inventory-item"], .cart_item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' }).or(page.locator('[data-testid="checkout-button"]'));
    this.cartBadge = page.locator('[data-testid="shopping-cart-badge"], .shopping_cart_badge');
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' }).or(page.locator('[data-testid="continue-shopping"]'));
  }

  async expectCartPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(this.cartItems.first()).toBeVisible();
  }

  async expectCartPageEmpty() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/cart.html');
  }

  async expectCartItemCount(count: number) {
    await expect(this.cartItems).toHaveCount(count);
  }

  async removeFirstItem() {
    const removeBtn = this.cartItems.first().locator('button:has-text("Remove"), [data-testid="remove-item"]');
    await removeBtn.click();
  }

  async removeItemByIndex(index: number) {
    const removeBtn = this.cartItems.nth(index).locator('button:has-text("Remove"), [data-testid="remove-item"]');
    await removeBtn.click();
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(`${count}`);
  }

  async expectCheckoutVisible() {
    await expect(this.checkoutButton).toBeVisible();
  }

  async expectContinueShoppingVisible() {
    await expect(this.continueShoppingButton).toBeVisible();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
    const checkoutOne = new CheckoutOnePage(this.page);
    await checkoutOne.expectPage();
    return checkoutOne;
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
