/**
 * TESTING ARCHITECTURE RULES:
 * 
 * ✅ DO: Write all test cases in this spec file (checkout-flow.spec.ts)
 * ❌ DON'T: Put test logic or assertions in page objects, common components, or utilities
 * 
 * STRUCTURE:
 * - Page Objects (pages/): Contains only helper methods and element locators
 *   - login.page.ts
 *   - inventory.page.ts
 *   - cart.page.ts
 *   - checkout-one.page.ts
 *   - checkout-two.page.ts
 *   - checkout-complete.page.ts
 * 
 * - Common Components (common/): Contains reusable UI components
 *   - navigation-bar.ts
 * 
 * - Spec Files (tests/): Contains ONLY test cases and test orchestration
 *   - checkout-flow.spec.ts (This file - all checkout tests go here)
 *   - seed.spec.ts (Setup/seed data)
 *   - example.spec.ts (Other test suites)
 * 
 * Page Object Methods Should:
 * - Return page instances or data
 * - Use async/await for interactions
 * - Use "expect" for setup verification only (e.g., expectCartPage())
 * 
 * Test Cases Should:
 * - Orchestrate page object methods
 * - Contain the main test flow and assertions
 * - Be specific and readable
 */

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

  test('Complete checkout with multiple items', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    
    // Add three items to cart
    await inventoryPage.addProductsToCart(3);
    await inventoryPage.expectCartBadgeCount(3);

    const cartPage = await inventoryPage.openCart();
    await cartPage.expectCartItemCount(3);

    const checkoutOnePage = await cartPage.goToCheckout();
    const checkoutTwoPage = await checkoutOnePage.fillCheckoutInformation('Jane', 'Smith', '54321');
    
    // Verify all three items are in the overview
    await checkoutTwoPage.verifyOverviewMultipleItems(3);

    const checkoutCompletePage = await checkoutTwoPage.finishPurchase();
    await checkoutCompletePage.verifyOrderComplete();
  });

  test('Review cart before checkout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    
    // Add first item to cart
    await inventoryPage.addProductsToCart(1);
    await inventoryPage.expectCartBadgeCount(1);

    const cartPage = await inventoryPage.openCart();
    await cartPage.expectCartItemCount(1);
    
    // Verify both Continue Shopping and Checkout buttons are visible
    await cartPage.expectContinueShoppingVisible();
    await cartPage.expectCheckoutVisible();

    // Remove the item from cart
    await cartPage.removeFirstItem();
    await cartPage.expectCartItemCount(0);
  });

  test('Cancel checkout from step one', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart
    await inventoryPage.addProductsToCart(1);
    await inventoryPage.expectCartBadgeCount(1);

    const cartPage = await inventoryPage.openCart();
    await cartPage.expectCartItemCount(1);

    const checkoutOnePage = await cartPage.goToCheckout();
    
    // Cancel checkout and return to cart
    const cartPageReturned = await checkoutOnePage.cancelCheckout();
    await cartPageReturned.expectCartItemCount(1);
    await cartPageReturned.expectCheckoutVisible();
  });

  test('Cancel checkout from step two', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
    
    // Add item to cart
    await inventoryPage.addProductsToCart(1);
    await inventoryPage.expectCartBadgeCount(1);

    const cartPage = await inventoryPage.openCart();
    await cartPage.expectCartItemCount(1);

    const checkoutOnePage = await cartPage.goToCheckout();
    const checkoutTwoPage = await checkoutOnePage.fillCheckoutInformation('John', 'Doe', '12345');
    
    // Verify we're on checkout step two
    await checkoutTwoPage.verifyOverview();

    // Cancel checkout and return to inventory
    const inventoryPageReturned = await checkoutTwoPage.cancelCheckout();
    await inventoryPageReturned.expectInventoryPage();
    // Cart badge should still show 1 item
    await inventoryPageReturned.expectCartBadgeCount(1);
  });
});
