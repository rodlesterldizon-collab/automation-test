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

#### 1.3. Complete checkout with multiple items

**File:** `tests/checkout-flow.spec.ts`

**Steps:**
  1. Log in as `standard_user` with password `secret_sauce`.
    - expect: The inventory/products page is displayed.
  2. Add first item (Sauce Labs Backpack) to cart.
    - expect: Cart badge shows '1'
  3. Add second item (Sauce Labs Bike Light) to cart.
    - expect: Cart badge shows '2'
  4. Add third item (Sauce Labs Bolt T-Shirt) to cart.
    - expect: Cart badge shows '3'
  5. Open the shopping cart.
    - expect: Cart page displays all three items.
    - expect: Total items shown: 3
  6. Click 'Checkout' button.
    - expect: Checkout step one is displayed with empty form fields.
  7. Fill checkout form with valid information: First Name: 'Jane', Last Name: 'Smith', Postal Code: '54321'.
    - expect: All fields are populated correctly.
  8. Click 'Continue' button.
    - expect: Checkout step two displays all three items in the order overview.
    - expect: Item total, tax, and total are calculated correctly.
  9. Click 'Finish' button.
    - expect: Order is completed successfully.
    - expect: Confirmation page is displayed with 'THANK YOU FOR YOUR ORDER' message.

#### 1.4. Review cart before checkout

**File:** `tests/checkout-flow.spec.ts`

**Steps:**
  1. Log in as `standard_user` with password `secret_sauce`.
    - expect: The inventory/products page is displayed.
  2. Add first item (Sauce Labs Backpack) to cart.
    - expect: Cart badge shows '1'
  3. Click on the cart badge to open cart.
    - expect: Cart page displays the item with correct details.
    - expect: Total quantity is 1.
  4. Verify 'Continue Shopping' button is present.
    - expect: 'Continue Shopping' button is visible and clickable.
  5. Verify 'Checkout' button is present.
    - expect: 'Checkout' button is visible and clickable.
  6. Remove the item by clicking 'Remove' button.
    - expect: Item is removed from cart.
    - expect: Cart becomes empty.
    - expect: Cart badge should be removed or show 0.

#### 1.5. Cancel checkout from step one

**File:** `tests/checkout-flow.spec.ts`

**Steps:**
  1. Log in as `standard_user` with password `secret_sauce`.
    - expect: The inventory/products page is displayed.
  2. Add an item (Sauce Labs Backpack) to cart.
    - expect: Item is added and cart badge shows '1'.
  3. Open cart and click 'Checkout' button.
    - expect: Checkout step one form is displayed.
  4. Click the 'Cancel' button.
    - expect: User is redirected back to the cart page.
    - expect: The item is still in the cart.

#### 1.6. Cancel checkout from step two

**File:** `tests/checkout-flow.spec.ts`

**Steps:**
  1. Log in as `standard_user` with password `secret_sauce`.
    - expect: The inventory/products page is displayed.
  2. Add an item (Sauce Labs Backpack) to cart.
    - expect: Item is added and cart badge shows '1'.
  3. Open cart and click 'Checkout' button.
    - expect: Checkout step one form is displayed.
  4. Fill in the checkout form with valid data: First Name: 'John', Last Name: 'Doe', Postal Code: '12345'.
    - expect: All fields are populated correctly.
  5. Click 'Continue' button.
    - expect: Checkout step two overview is displayed.
  6. Click the 'Cancel' button.
    - expect: User is redirected back to the inventory page.
    - expect: The item is still in the cart (cart badge shows '1').
    - expect: All cart data is preserved.

#### 1.7. Attempt checkout with no cart items

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
