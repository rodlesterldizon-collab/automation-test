// spec: specs/checkout-flow.md
// seed: tests/seed.spec.ts

import { test } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Sauce Demo Checkout Flow', () => {
  test('Standard user can complete checkout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductsToCart(1);
    await inventoryPage.expectCartBadgeCount(1);

    const cartPage = await inventoryPage.openCart();
    await cartPage.expectCartItemCount(1);

    const checkoutOnePage = await cartPage.goToCheckout();
    const checkoutTwoPage = await checkoutOnePage.fillCheckoutInformation('Test', 'User', '94103');
    await checkoutTwoPage.verifyOverview();

    const checkoutCompletePage = await checkoutTwoPage.finishPurchase();
    await checkoutCompletePage.verifyOrderComplete();
    await checkoutCompletePage.backHome();

    await inventoryPage.expectInventoryPage();
  });

  test('Remove item from cart before checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    await inventoryPage.addProductsToCart(2);
    await inventoryPage.expectCartBadgeCount(2);

    const cartPage = await inventoryPage.openCart();
    await cartPage.expectCartItemCount(2);

    await cartPage.removeFirstItem();
    await cartPage.expectCartItemCount(1);
    await cartPage.expectCartBadgeCount(1);
    await cartPage.expectCheckoutVisible();
  });
});
