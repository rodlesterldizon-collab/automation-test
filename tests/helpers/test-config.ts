/**
 * Test Configuration and Constants
 * Centralized constants for test users, passwords, and selectors
 */

export const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

export const TEST_USERS = {
  standard: 'standard_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
};

export const ACCEPTED_USERS = [
  TEST_USERS.standard,
  TEST_USERS.problem,
  TEST_USERS.performanceGlitch,
  TEST_USERS.error,
];

export const VALID_PASSWORD = 'secret_sauce';

export const SELECTORS = {
  loginError: '[data-test="error"]',
};

/**
 * Get the login error locator selector
 */
export function getLoginError(): string {
  return SELECTORS.loginError;
}
