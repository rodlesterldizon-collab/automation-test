import { Locator, Page } from '@playwright/test';

export class NavigationBar {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly openMenuButton: Locator;
  readonly allItemsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = page.locator('[data-testid="shopping-cart-link"], .shopping_cart_link');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' }).or(page.locator('[data-testid="open-menu"]'));
    this.allItemsLink = page.getByRole('link', { name: 'All Items' }).or(page.locator('[data-testid="all-items"]'));
    this.aboutLink = page.getByRole('link', { name: 'About' }).or(page.locator('[data-testid="about-link"]'));
    this.logoutLink = page.getByRole('link', { name: 'Logout' }).or(page.locator('[data-testid="logout-link"]'));
    this.resetAppStateLink = page.getByRole('link', { name: 'Reset App State' }).or(page.locator('[data-testid="reset-link"]'));
  }

  async openCart() {
    await this.cartLink.click();
  }

  async openMenu() {
    await this.openMenuButton.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetAppStateLink.click();
  }

  async goToAllItems() {
    await this.openMenu();
    await this.allItemsLink.click();
  }
}
