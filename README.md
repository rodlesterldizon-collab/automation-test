# automation-test

> 🧪 **Sauce Labs Automation Demo**
> This repository serves as an automated end-to-end testing demonstration for the Sauce Labs application (Sauce Demo), created and maintained by **Rod Dizon**.

---

## 📌 Project Overview
This project showcases a highly optimized, modern automation framework utilizing **Playwright** and **TypeScript**. Built with scalability in mind, it implements the **Page Object Model (POM)** architectural pattern and leverages free CI/CD cloud containerization to achieve lightning-fast test execution.

### 🎯 Demo Scope & Coverage
To demonstrate core user flows and framework capabilities, this suite focuses on two critical application pathways:

1. **Login Flow Verification**
   * Validates successful authentication across various user profiles (`standard_user`, `problem_user`, etc.).
   * Confirms error-handling states, performance tolerances, and session management.
   * *Specification Details:* See [specs/login.md](specs/login.md).

2. **End-to-End Checkout Flow**
   * Simulates the complete customer purchasing journey: adding items to the cart, navigating the cart inventory, filling out shipping information, and verifying financial totals.
   * Ensures data integrity and UI stability throughout the critical checkout funnel.
   * *Specification Details:* See [specs/checkout-flow.md](specs/checkout-flow.md).

---



Playwright E2E automation testing framework for Sauce Demo with optimized GitHub Actions CI/CD using Docker containers.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests locally
npx playwright test

# Run tests in UI mode
npm run test:ui

# Run tests in debug mode
npx playwright test --debug
```

---

## Git Workflow Reference

Quick command reference for branching, committing, and merging:

### Create a New Branch
```bash
git checkout -b branch-name
# Example:
git checkout -b add-login-tests
```

### Make Changes & Commit

**Stage files:**
```bash
git add .                              # Stage all changes
git add path/to/specific/file.ts      # Stage specific file
git add .github/workflows/             # Stage entire directory
```

**Commit changes:**
```bash
git commit -m "descriptive message"
# Example:
git commit -m "test: add login flow tests"
```

### Push Branch to GitHub
```bash
git push origin branch-name
# Example:
git push origin add-login-tests
```

### Merge Branch to Main

**Step 1: Switch to main**
```bash
git checkout main
```

**Step 2: Merge your branch**
```bash
git merge branch-name
# Example:
git merge add-login-tests
```

**Step 3: Push to GitHub**
```bash
git push origin main
```

### Complete Workflow Example
```bash
# 1. Create and switch to new branch
git checkout -b test-playwright-docker

# 2. Make changes to files...

# 3. Stage changes
git add .github/workflows/

# 4. Commit with descriptive message
git commit -m "fix: update playwright docker image to v1.59.1"

# 5. Push branch to GitHub
git push origin test-playwright-docker

# 6. After testing/PR approval, switch to main
git checkout main

# 7. Merge the branch
git merge test-playwright-docker

# 8. Push merged changes to main
git push origin main
```

### Useful Git Commands
```bash
# Check current branch
git branch

# List all branches (local and remote)
git branch -a

# See your uncommitted changes
git status

# See detailed diff of changes
git diff

# Delete a branch locally
git branch -d branch-name

# Delete a branch on GitHub
git push origin --delete branch-name

# View commit history
git log --oneline
```

---

## GitHub Actions CI/CD Optimization

### 🐋 Docker Container Optimization (Fastest - ~1 minute)

The GitHub Actions workflow now uses **Microsoft's free Docker container** with Playwright pre-installed. This eliminates slow browser installation steps entirely.

**What's optimized:**
- ✅ No Node setup required (Docker handles it)
- ✅ No browser installation (pre-installed in image)
- ✅ All browsers ready (Chromium, Firefox, WebKit)
- ✅ Build time: **~1 minute** (vs. 5-8 minutes before)

**Current workflow configuration:**
```yaml
container:
  image: mcr.microsoft.com/playwright:v1.59.1-jammy

env:
  HOME: /root  # Firefox sandbox permission fix

steps:
  - uses: actions/checkout@v4
  - run: npm ci
  - run: npx playwright test
```

**Playwright version compatibility:** The Docker image version (`v1.59.1`) must match your project's Playwright version in `package.json`. Update both if you upgrade Playwright.

### Browser Testing Coverage

With the Docker approach, your CI automatically tests across all browsers:
- ✅ **Chromium** - Full support
- ✅ **Firefox** - Full support (requires `HOME=/root` env var)
- ✅ **WebKit** - Full support

To test locally with all browsers:
```bash
npx playwright install
npx playwright test
```

To test with a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## Test Organization & Architecture

### Page Object Model (POM) Pattern

All tests follow the **Page Object Model** pattern for maintainability and reusability.

**Structure:**
```
tests/
├── pages/                    # Page objects only
│   ├── base.page.ts         # Base page class with common methods
│   ├── login.page.ts        # Login page helpers
│   ├── inventory.page.ts    # Inventory page helpers
│   └── ...
├── common/
│   └── component/           # Reusable component objects
│       └── navigation-bar.ts
├── helpers/                 # Shared utilities
│   └── utils.ts
└── *.spec.ts               # Test implementations (tests/ root only)

specs/                       # Test specifications
├── login.md
├── checkout-flow.md
└── README.md
```

**Architecture Rules:**
- ✅ **DO**: Put page helpers and navigation in `tests/pages/*.ts`
- ✅ **DO**: Put tests in `tests/*.spec.ts`
- ✅ **DO**: Put utilities in `tests/helpers/`
- ❌ **DON'T**: Put test logic in page objects
- ❌ **DON'T**: Create page object files in `tests/` root or subdirectories

See [TESTING_ARCHITECTURE.md](/tests/TESTING_ARCHITECTURE.md) for detailed guidelines.

---

## GitHub Copilot Agents

The project includes AI agents for test automation, powered by GitHub Copilot. These agents are configured in `.github/agents/` and help with:

### Available Agents

1. **playwright-test-planner** - Creates comprehensive test plans
   - Analyzes application features
   - Generates test scenarios and specs
   - Creates markdown test plans with step-by-step instructions

2. **playwright-test-generator** - Generates test code from plans
   - Creates test files from specifications
   - Follows Page Object Model pattern
   - Generates proper Playwright syntax

3. **playwright-test-healer** - Fixes failing tests automatically
   - Diagnoses test failures
   - Generates code fixes
   - Currently disabled (see "AI Test Healer" section below)

4. **playwright-test-architecture** - Enforces POM rules
   - Validates test structure
   - Ensures proper separation of concerns
   - Prevents test logic in page objects

### Using Agents in GitHub Copilot Chat

```
@playwright-test-planner Create a test plan for the login flow
@playwright-test-generator Generate tests from the login.md spec
@playwright-test-architecture Review the test structure for compliance
```

**Agent best practices:**
- Use the **planner** first to create specs in `specs/` folder
- Use the **generator** to implement tests from specs
- Use the **architecture** agent for code reviews
- Reference [TESTING_ARCHITECTURE.md](/tests/TESTING_ARCHITECTURE.md) in prompts

---

## AI Test Healer (Currently Disabled)

The AI Test Healer automatically fixes failing tests using GitHub Copilot. It's disabled by default to manage costs.

### Enabling the AI Healer

To activate automatic test healing:

1. Open `.github/workflows/playwright.yml`
2. Find the commented sections starting with `# - name: Install Copilot CLI`
3. Uncomment all three healing sections:
   - `Install Copilot CLI`
   - `Run Playwright Test Healer on Failure`
   - `Commit and Push AI Fixes`
4. Ensure you have `COPILOT_PAT` secret configured in repository settings
5. Push your changes

**Requirements:**
- Active GitHub Copilot subscription
- `COPILOT_PAT` token with `repo` and `workflow` scopes
- Monitor API usage to avoid unexpected costs

**How it works:**
1. Tests fail in CI
2. Copilot CLI installs automatically
3. AI analyzes failures and generates fixes
4. Fixed code auto-commits and pushes to your branch

---

## Browser Installation (Legacy Approach)

> **Note:** This section describes the previous approach before Docker optimization. The current `.github/workflows/playwright.yml` uses Docker, which is faster.

If you prefer manual browser installation instead of Docker, you can:

1. Remove the `container:` section from workflow
2. Add `- uses: actions/setup-node@v4` back
3. Run manual installation:
   ```yaml
   run: npx playwright install chromium --with-deps
   ```

**Installation times (legacy):**
- Chromium only: ~2-3 minutes
- All browsers: ~5-8 minutes

---

## Test Specifications

### Available Test Suites

- **[specs/login.md](/specs/login.md)** - Login flow tests (4 users, 5 scenarios)
- **[specs/checkout-flow.md](/specs/checkout-flow.md)** - Checkout flow tests (6 scenarios)

### Test Users (Sauce Demo)

The login tests validate behavior across different user types:

- `standard_user` - Normal user, no issues
- `problem_user` - Logs in but UI is broken (all items show same image)
- `performance_glitch_user` - Logs in with 5-second artificial delay
- `error_user` - Logs in but has intermittent button failures

All users use password: `secret_sauce`

---

## Testing Architecture Guide

Complete guide: [TESTING_ARCHITECTURE.md](/tests/TESTING_ARCHITECTURE.md)

**Key sections:**
- Directory structure and file organization
- DO / DON'T patterns
- Page Object best practices with examples
- Test case structure guidelines
- Method naming conventions
- Common mistakes and corrections

**Quick reference - Method naming:**
- `goto()` / `go*()` - Navigation (returns new page)
- `add*()` / `remove*()` - User interactions
- `expect*()` - Verifications (uses Playwright expect)
- `fill*()` - Form filling

---


