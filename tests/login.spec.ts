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
import { TEST_USERS, VALID_PASSWORD, getLoginError, BASE_URL } from './helpers/test-config';
import { compareVisuals } from './helpers/utils';

test.describe('Authentication State & Visual Regression Matrix', () => {
  test('Login page should show required fields and login button', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('Empty credentials should show a validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.loginButton.click();

    await expect(loginPage.errorIcons).toHaveCount(2);
    await expect(page.locator(getLoginError())).toBeVisible();
    await expect(page.locator(getLoginError())).toContainText(/Epic sadface: Username is required/i);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('Standard user should be able to log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const inventoryPage = await loginPage.login(TEST_USERS.standard, VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();
  });

  test('Problem user should be able to log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const inventoryPage = await loginPage.login(TEST_USERS.problem, VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();
  });

  test('Performance glitch user should be able to log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const inventoryPage = await loginPage.login(TEST_USERS.performanceGlitch, VALID_PASSWORD);
    await inventoryPage.expectInventoryPage(); 
  });

  test('Error user should be able to log in successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    const inventoryPage = await loginPage.login(TEST_USERS.error, VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();
  });

  test('Invalid credentials show an error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.usernameInput.fill('invalid_user');
    await loginPage.passwordInput.fill('wrong_password');
    await loginPage.loginButton.click();

    await expect(loginPage.errorIcons).toHaveCount(2);
    await expect(page.locator(getLoginError())).toContainText(/username and password do not match/i);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('Username field validation shows an error when empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Leave username empty, fill password
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.loginButton.click();

    await expect(loginPage.errorIcons).toHaveCount(2);
    await expect(page.locator(getLoginError())).toContainText(/username is required|username and password do not match/i);
    await expect(page).toHaveURL(BASE_URL);
  });

  test('Password field validation shows an error when empty', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.usernameInput.fill(TEST_USERS.standard);
    // Leave password empty
    await loginPage.loginButton.click();

    await expect(loginPage.errorIcons).toHaveCount(2);
    await expect(page.locator(getLoginError())).toContainText(/password is required|username and password do not match/i);
    await expect(page).toHaveURL(BASE_URL);
  });
});

test.describe('Sauce Demo User Behavior Tests', () => {
  test('Problem user: UI Bug - Multiple items show identical product images', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Log in as problem_user
    const inventoryPage = await loginPage.login(TEST_USERS.problem, VALID_PASSWORD);
    await inventoryPage.expectInventoryPage();

    const productImages = page.locator('.inventory_item_img img');
    
    const comparison = await compareVisuals(productImages.nth(0), productImages.nth(1));
    
    // Use isSrcMatch as the primary indicator for the problem_user bug
    expect(comparison.isSrcMatch).toBe(true);
  });

});
