import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { InventoryPage } from './inventory.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name, [data-testid="username"]');
    this.passwordInput = page.locator('#password, [data-testid="password"]');
    this.loginButton = page.locator('#login-button, button:has-text("Login")');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    const inventoryPage = new InventoryPage(this.page);
    await inventoryPage.expectInventoryPage();
    return inventoryPage;
  }
}
