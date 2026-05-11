import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CartPage } from './cart.page';

export class InventoryPage extends BasePage {
  readonly inventoryList: Locator;
  readonly addToCartButtons: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.locator('[data-testid="inventory-list"], .inventory_list');
    this.addToCartButtons = page.locator('button:has-text("Add to cart"), [data-testid="add-to-cart"]');
    this.cartBadge = page.locator('[data-testid="shopping-cart-badge"], .shopping_cart_badge');
  }

  async expectInventoryPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(this.inventoryList).toBeVisible();
  }

  async addProductsToCart(count = 1) {
    for (let index = 0; index < count; index++) {
      await this.addToCartButtons.nth(index).click();
    }
  }

  async expectCartBadgeCount(count: number) {
    await expect(this.cartBadge).toHaveText(`${count}`);
  }

  async openCart() {
    await this.navigationBar.openCart();
    const cartPage = new CartPage(this.page);
    await cartPage.expectCartPage();
    return cartPage;
  }
}
