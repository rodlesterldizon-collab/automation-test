# Sauce Demo Standard Checkout Flow

## Application Overview

Test plan for the standard user checkout flow on Sauce Demo, covering login, product selection, cart validation, checkout details, and order completion.

## Test Scenarios

### 1. Standard Checkout Flow

**Seed:** `tests/seed.spec.ts`

#### 1.1. Standard user can complete checkout successfully

**File:** `specs/checkout-flow.md`

**Steps:**
  1. Open the Sauce Demo login page.
    - expect: The login page is displayed with username and password fields.
  2. Enter username `standard_user` and password `secret_sauce`, then click the login button.
    - expect: The inventory/products page is displayed.
    - expect: Products are visible and the user is logged in.
  3. Select one or more products and click Add to cart for each selected product.
    - expect: The shopping cart badge count increases accordingly.
    - expect: Selected products show a Remove button.
  4. Open the shopping cart.
    - expect: The cart page loads.
    - expect: Selected product(s) are listed with correct names and prices.
    - expect: A Checkout button is visible.
  5. Click Checkout and complete the form with first name `Test`, last name `User`, and postal code `94103`.
    - expect: The checkout information page is displayed.
    - expect: The Continue button accepts valid input and advances to the overview page.
  6. Verify the checkout overview page shows the selected item(s), item total, tax, and total price.
    - expect: The chosen products and pricing summary are correct.
    - expect: A Finish button is available.
  7. Click Finish to complete the order.
    - expect: The checkout complete page is displayed.
    - expect: A confirmation message such as THANK YOU FOR YOUR ORDER appears.
    - expect: No checkout form fields remain on the confirmation page.
  8. Optionally click Back Home and verify navigation back to the inventory page.
    - expect: The user returns to the inventory/products page.

#### 1.2. Remove item from cart before checkout

**File:** `specs/checkout-flow.md`

**Steps:**
  1. Log in as `standard_user` with password `secret_sauce`.
    - expect: The inventory/products page is displayed.
  2. Add two different products to the cart.
    - expect: The cart badge shows 2 items.
    - expect: Each selected product shows a Remove button.
  3. Open the shopping cart.
    - expect: The cart page loads.
    - expect: Both products are listed.
  4. Click Remove on one of the cart items.
    - expect: The removed item disappears from the cart.
    - expect: The cart badge count updates to 1.
  5. Verify the remaining product is still present and can proceed to checkout.
    - expect: The remaining product is listed with correct details.
    - expect: A Checkout button remains visible.

#### 1.3. Attempt checkout with no cart items

**File:** `specs/checkout-flow.md`

**Steps:**
  1. Log in as `standard_user` with password `secret_sauce`.
    - expect: The inventory/products page is displayed.
  2. Open the shopping cart without adding any products.
    - expect: The cart page loads.
    - expect: The cart is empty or shows no products.
  3. Try to initiate checkout from the empty cart.
    - expect: Checkout is not permitted without items.
    - expect: The application prevents checkout or displays an empty cart warning.
  4. Verify the user is still able to return to inventory to add products.
    - expect: The Back Home or Continue Shopping option is available.
    - expect: The user can navigate back to the inventory page. 
