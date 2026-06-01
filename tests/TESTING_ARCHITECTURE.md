# Testing Architecture Guidelines

## Overview

This project follows a **Page Object Model (POM)** architecture with strict separation of concerns. All test logic resides in spec files, while page objects contain only helper methods.

## Directory Structure

```
tests/
├── checkout-flow.spec.ts       # All checkout flow tests
├── example.spec.ts              # Example/smoke tests
├── seed.spec.ts                 # Setup/seed data generation
├── pages/                        # Page Objects (NO tests here)
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   ├── checkout-one.page.ts
│   ├── checkout-two.page.ts
│   └── checkout-complete.page.ts
└── common/                       # Shared components (NO tests here)
    └── component/
        └── navigation-bar.ts
```

## Rules and Best Practices

### ✅ DO

1. **Write ALL tests in spec files** (e.g., `checkout-flow.spec.ts`)
2. **Use page objects for element interaction** only
3. **Return page instances** from navigation methods
4. **Keep methods focused** - one action per method
5. **Use expect() for verification** in page objects only for setup checks
6. **Document complex test flows** with comments

### ❌ DON'T

1. **DON'T write tests in page objects** - They should contain only helpers
2. **DON'T put assertions in navigation methods** - Return the new page object
3. **DON'T mix test logic with page objects** - Spec files orchestrate everything
4. **DON'T create page objects for components** - Use page objects instead
5. **DON'T add test data in page objects** - Keep it in test cases

## Page Object Best Practices

### Good Page Object Method

```typescript
async addProductsToCart(count = 1) {
  for (let index = 0; index < count; index++) {
    await this.addToCartButtons.nth(index).click();
  }
}

async goToCheckout() {
  await this.checkoutButton.click();
  const checkoutPage = new CheckoutOnePage(this.page);
  await checkoutPage.expectPage();
  return checkoutPage;
}
```

### Bad Page Object Method (DON'T DO THIS)

```typescript
// ❌ BAD: Test logic in page object
async addProductsAndVerify(count: number, expectedBadge: number) {
  for (let index = 0; index < count; index++) {
    await this.addToCartButtons.nth(index).click();
  }
  // ❌ Test assertion in page object
  await expect(this.cartBadge).toHaveText(`${expectedBadge}`);
  console.log(`Added ${count} products successfully`);
}
```

## Test File Best Practices

### Good Test Case

```typescript
test('Complete checkout with multiple items', async ({ page }) => {
  // Setup
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  
  // Execute
  const inventoryPage = await loginPage.login('standard_user', 'secret_sauce');
  await inventoryPage.addProductsToCart(3);
  
  // Verify
  await inventoryPage.expectCartBadgeCount(3);
  
  const cartPage = await inventoryPage.openCart();
  await cartPage.expectCartItemCount(3);
});
```

## Method Naming Conventions

### Page Object Methods

| Purpose | Prefix | Example |
|---------|--------|---------|
| Navigation | `open...()`, `go...()` | `openCart()`, `goToCheckout()` |
| Interaction | `add...()`, `remove...()`, `fill...()` | `addProductsToCart()`, `fillCheckoutInformation()` |
| Verification | `expect...()` | `expectCartPage()`, `expectCartItemCount()` |

### Test Cases

Use descriptive names that explain what is being tested:

```typescript
test('Remove item from cart before checkout', async ({ page }) => { ... })
test('Cancel checkout from step one', async ({ page }) => { ... })
test('Complete checkout with multiple items', async ({ page }) => { ... })
```

## Common Mistakes and How to Avoid Them

### Mistake 1: Mixing Test Logic in Page Objects

```typescript
// ❌ DON'T
class CartPage {
  async removeAndVerify() {
    await this.removeButton.click();
    // Test assertion - WRONG!
    expect(this.cartItems).toHaveCount(0);
  }
}

// ✅ DO
class CartPage {
  async removeFirstItem() {
    const removeBtn = this.cartItems.first().locator('button:has-text("Remove")');
    await removeBtn.click();
  }
}

// Then in test:
test('Remove item', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.removeFirstItem();
  await expect(cartPage.cartItems).toHaveCount(0);
});
```

### Mistake 2: Not Returning Page Objects

```typescript
// ❌ DON'T
async goToCheckout() {
  await this.checkoutButton.click();
  // No return - forces test to create new instance
}

// ✅ DO
async goToCheckout() {
  await this.checkoutButton.click();
  const checkoutPage = new CheckoutOnePage(this.page);
  await checkoutPage.expectPage();
  return checkoutPage;  // Return the new page
}
```

### Mistake 3: Overloading Methods with Options

```typescript
// ❌ DON'T - Too many options
async fillCheckout(firstName?: string, lastName?: string, postal?: string, verify?: boolean) {
  // Complex logic
}

// ✅ DO - Simple and focused
async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
  await this.firstNameInput.fill(firstName);
  await this.lastNameInput.fill(lastName);
  await this.postalCodeInput.fill(postalCode);
}

async verifyCheckout() {
  await expect(this.firstNameInput).toHaveValue(this.firstName);
}
```

## Running Tests

```bash
# Run all checkout flow tests
npm run test:cli -- tests/checkout-flow.spec.ts

# Run with UI mode
npx playwright test --ui

# Run with headed browser
npx playwright test --headed

# Run specific test
npx playwright test -g "Remove item from cart"
```

## Maintenance Checklist

When adding new tests:

- [ ] Test is in a spec file (not in page objects)
- [ ] Page objects only contain helper methods
- [ ] Methods return appropriate page instances
- [ ] Test follows naming convention
- [ ] No assertions in page objects (only `expect` for setup verification)
- [ ] Test data is in the test, not in page objects
- [ ] Comments explain complex test flows

## Questions?

If you're unsure about where to put test logic, ask yourself:

1. **Is this verifying behavior?** → Put it in a **test case** (spec file)
2. **Is this interacting with the UI?** → Put it in a **page object**
3. **Is this shared UI behavior?** → Put it in a **common component**

When in doubt, keep it in the spec file! It's better to duplicate a small action than to add test logic to page objects.
