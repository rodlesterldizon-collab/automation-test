import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { CheckoutTwoPage } from './checkout-two.page';

export class CheckoutOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firs, [data-testid="firs"]'); 
    this.lastNameInput = page.locator('#last-name, [data-testid="last-name"]');
    this.postalCodeInput = page.locator('#postal-code, [data-testid="postal-code"]');
    this.continueButton = page.locator('#continue, button:has-text("Continue"), [data-testid="continue-button"]');
  }

  async expectPage() {
    await expect(this.page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  }

  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();

    const checkoutTwo = new CheckoutTwoPage(this.page);
    await checkoutTwo.expectPage();
    return checkoutTwo;
  }
}
