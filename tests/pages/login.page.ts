import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { InventoryPage } from './inventory.page';
import { BASE_URL, SELECTORS } from '../helpers/test-config';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorIcons: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('#user-name, [data-testid="username"]');
    this.passwordInput = page.locator('#password, [data-testid="password"]');
    this.loginButton = page.locator('#login-button, button:has-text("Login")');
    this.errorIcons = page.locator(SELECTORS.errorIcon);
  }

  async goto() {
    await this.page.goto(BASE_URL);
    await expect(this.page).toHaveURL(BASE_URL);
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
