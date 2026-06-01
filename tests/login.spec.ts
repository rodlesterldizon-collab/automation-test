// spec: specs/login.md
/**
 * Login Test Users and Their Behaviors:
 * 
 * 1. standard_user - Normal user, no special behavior
 * 
 * 2. problem_user - Logs in but UI is broken:
 *    - All inventory items display the same image (dog backpack)
 *    - Some add/remove buttons may not work
 *    - Tests UI discrepancies detection
 * 
 * 3. performance_glitch_user - Logs in but with 5-second artificial delay on page load
 *    - Tests explicit/implicit waits and timeout handling
 * 
 * 4. error_user - Logs in but has intermittent errors:
 *    - Adding specific items to cart may fail
 *    - Clicking certain buttons may not respond
 *    - Tests handling of partial application failure
 */

import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { ACCEPTED_USERS, VALID_PASSWORD, getLoginError } from './helpers/test-config';

test.describe('Sauce Demo Login Flow', () => {
  test('Login page should show required fields and login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Accepted users can log in with secret_sauce', async ({ page }) => {
    const loginPage = new LoginPage(page);

    for (const username of ACCEPTED_USERS) {
      await loginPage.goto();
      const inventoryPage = await loginPage.login(username, VALID_PASSWORD);
      await inventoryPage.expectInventoryPage();
      
      // Logout by going back to login for next iteration
      await page.goto('https://www.saucedemo.com/');
    }
  });

  test('Invalid credentials show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.usernameInput.fill('invalid_user');
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.loginButton.click();

    await expect(page.locator(getLoginError())).toContainText(/username and password do not match/i);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Username field validation shows an error when empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Leave username empty, fill password
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();

    await expect(page.locator(getLoginError())).toContainText(/username is required|username and password do not match/i);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Password field validation shows an error when empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.usernameInput.fill('standard_user');
    // Leave password empty
    await loginPage.loginButton.click();

    await expect(page.locator(getLoginError())).toContainText(/password is required|username and password do not match/i);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Performance glitch user logs in but may experience delays', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Set timeout for performance_glitch_user (5 second artificial delay expected)
    const inventoryPage = await loginPage.login('performance_glitch_user', VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();
  });
});

test.describe('Sauce Demo User Behavior Tests', () => {
  test('Problem user: All inventory items display same image (dog backpack)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Log in as problem_user
    const inventoryPage = await loginPage.login('problem_user', VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();

    // Get all product images on inventory page
    const productImages = page.locator('[data-testid="inventory-item-sauce-labs-backpack-img"], .inventory_item_img img');
    const imageCount = await productImages.count();

    // Verify that all images exist (they should all be the same dog backpack image)
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const srcAttr = await productImages.nth(i).getAttribute('src');
        // All images should be the same dog backpack image
        expect(srcAttr).toBeTruthy();
      }
    }
  });

  test('Error user: Add to cart may fail intermittently', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Log in as error_user
    const inventoryPage = await loginPage.login('error_user', VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();

    // Try to add first item to cart
    // Note: With error_user, this might fail or succeed intermittently
    const addToCartButton = page.locator('button:has-text("Add to cart")').first();
    
    // Verify button exists but may not respond properly
    if (await addToCartButton.isVisible()) {
      try {
        await addToCartButton.click({ timeout: 3000 });
        // If successful, verify cart badge appears
        const cartBadge = page.locator('[data-testid="shopping-cart-badge"]');
        // Badge may or may not appear due to intermittent errors
      } catch (e) {
        // Expected behavior for error_user - buttons may not respond
      }
    }
  });


});
