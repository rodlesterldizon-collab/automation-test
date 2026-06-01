# Sauce Demo Login Flow

## Application Overview

This test plan verifies the Sauce Demo login page, accepted users, and login field validation.

## Login Scenarios

### 1. Login Flow

**File:** `tests/login.spec.ts`

**Accepted usernames:**
- `standard_user` - Standard user with no issues
- `problem_user` - Logs in but experiences UI bugs (all products show same image)
- `performance_glitch_user` - Logs in but with 5-second artificial delay
- `error_user` - Logs in but experiences intermittent errors during interactions

**Password for all users:**
- `secret_sauce`

#### 1.1. Verify login page fields

**Steps:**
  1. Open the Sauce Demo login page.
    - expect: The username field is visible.
    - expect: The password field is visible.
    - expect: The login button is visible.

#### 1.2. Successful login for accepted users

**Steps:**
  1. Log in with each accepted user (except `locked_out_user`) with password `secret_sauce`.
    - expect: The inventory page is displayed.
    - expect: Product items are visible.

**User Specific Behaviors:**
- `standard_user` - Logs in normally, no delays or issues
- `problem_user` - Logs in successfully but UI is broken (all items show dog backpack image, some add/remove buttons don't work)
- `performance_glitch_user` - Logs in successfully but with 5-second artificial delay on page load
- `error_user` - Logs in successfully but adding certain items or clicking buttons may fail intermittently

#### 1.3. Invalid credentials validation

**Steps:**
  1. Log in with an invalid username and password.
    - expect: Error message displays: "Username and password do not match any user in this service"
    - expect: The user remains on the login page.

#### 1.4. Login field validation

**Steps:**
  1. Attempt login with the username field empty and password `secret_sauce`.
    - expect: Error message displays (either "Username is required" or "Username and password do not match").
    - expect: The user remains on the login page.
  2. Attempt login with the password field empty and username `standard_user`.
    - expect: Error message displays (either "Password is required" or "Username and password do not match").
    - expect: The user remains on the login page.
