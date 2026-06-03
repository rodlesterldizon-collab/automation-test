# 🧪 Sauce Labs E2E Automation Framework

[![Playwright Tests](https://github.com/rodlesterldizon-collab/automation-test/actions/workflows/playwright.yml/badge.svg)](https://github.com/rodlesterldizon-collab/automation-test/actions/workflows/playwright.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-45BA4B?style=for-the-badge&logo=playwright&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2671E5?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A professional-grade, enterprise-ready end-to-end testing suite for the [Sauce Demo](https://www.saucedemo.com/) e-commerce platform. Created and maintained by **Rod Lester Dizon**.

---

## 🎯 The "Why"
The goal of this project is to provide a robust, scalable, and maintainable automation solution that mimics real-world user behavior. It validates critical business paths—from authentication to complex checkout funnels—ensuring UI stability and data integrity across various user personas and browser engines.

## 🛠️ Tech Stack & Patterns
- **Framework:** [Playwright](https://playwright.dev/) (Chromium, Firefox, WebKit)
- **Language:** TypeScript
- **Architecture:** Page Object Model (POM)
- **CI/CD:** GitHub Actions with Dockerized Runners
- **Reporting:** Playwright HTML Reports with Trace Viewer & Screenshot artifacts
- **Logic:** Centralized Configuration & Visual Bug Detection Utilities

## 📖 Table of Contents

- [🎯 The "Why"](#-the-why)
- [🛠️ Tech Stack & Patterns](#️-tech-stack--patterns)
  - [🖼️ Visual Preview](#️-visual-preview)
  - [🎯 Advanced Demo Scope & Coverage](#-advanced-demo-scope--coverage)
    - [Login Flow Verification](#login-flow-verification)
    - [End-to-End Checkout Flow](#end-to-end-checkout-flow)
- [🤖 GitHub Copilot Agents](#-github-copilot-agents)
  - [Available Agents](#available-agents)
  - [Using Agents in GitHub Copilot Chat](#using-agents-in-github-copilot-chat)
- [AI Test Healer (Currently Disabled)](#ai-test-healer-currently-disabled)
  - [Enabling the AI Healer](#enabling-the-ai-healer)
- [🚀 Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Git Workflow Reference](#git-workflow-reference)
  - [Create a New Branch](#create-a-new-branch)
  - [Make Changes & Commit](#make-changes--commit)
  - [Push Branch to GitHub](#push-branch-to-github)
  - [Merge Branch to Main](#merge-branch-to-main)
  - [Complete Workflow Example](#complete-workflow-example)
  - [Useful Git Commands](#useful-git-commands)
- [GitHub Actions CI/CD Optimization](#github-actions-cicd-optimization)
  - [🐋 Docker Container Optimization (Fastest - ~1 minute)](#-docker-container-optimization-fastest---1-minute)
  - [Browser Testing Coverage](#browser-testing-coverage)
- [Test Organization & Architecture](#test-organization--architecture)
  - [Page Object Model (POM) Pattern](#page-object-model-pom-pattern)
- [Browser Installation (Legacy Approach)](#browser-installation-legacy-approach)
- [Test Specifications](#test-specifications)
  - [Available Test Suites](#available-test-suites)
  - [Test Users (Sauce Demo)](#test-users-sauce-demo)
- [Testing Architecture Guide](#testing-architecture-guide)
- [📄 License](#-license)

---

## 🖼️ Visual Preview

Experience the framework in action across the core user journey.

| **1. Authentication** | **2. Product Management** | **3. Checkout Funnel** |
| :--- | :--- | :--- |
| ![Login](screenshots/login.png) | ![Inventory](screenshots/inventory.png) | ![Cart](screenshots/cart.png) |
| **Login Page:** Validates credentials and field requirements for multiple user personas. | **Product Inventory:** Dynamic product grid where the framework manages cart state and visual regression. | **Shopping Cart:** Real-time calculation of items and preparation for the secure checkout flow. |

> _Note: These visuals are captured automatically by the framework to ensure UI consistency across browser engines._

---

### 🎯 Advanced Demo Scope & Coverage

> [!NOTE]
> **Framework Showcase Note:** The number of test cases in this repository is intentionally focused on high-impact scenarios. Rather than aiming for 100% feature coverage of the Sauce Demo site, this project serves as a **technical showcase** for advanced automation patterns, scalable architecture, and modern CI/CD integrations.

To demonstrate core user flows and framework capabilities, this suite focuses on two critical application pathways:

1. **Login Flow Verification**
   * **Multi-Persona Testing**: Dedicated test cases for `standard`, `problem`, `performance_glitch`, and `error` users.
   * **Visual Regression Detection**: Utilizes a custom `compareVisuals` helper to programmatically detect UI bugs (like identical product images) by comparing image buffers and `src` attributes.
   * **Field Validation**: Robust assertions for error messages and SVG icons appearing during invalid login attempts.
   * *Specification Details:* See specs/login.md.

2. **End-to-End Checkout Flow**
   * Simulates the complete customer purchasing journey: adding items to the cart, navigating the cart inventory, filling out shipping information, and verifying financial totals.
   * Ensures data integrity and UI stability throughout the critical checkout funnel.
   * *Specification Details:* See [specs/checkout-flow.md](/specs/checkout-flow.md).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or higher)
- npm

### Installation

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
git add .                             # Stage all changes
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
│   └── checkout-*.page.ts   # Specialized checkout step pages
├── common/
│   └── component/           # Reusable UI component objects
│       └── navigation-bar.ts
├── helpers/                 # Shared utilities and configurations
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

## 🤖 The Agentic Workflow: AI-Augmented Engineering

This framework is built as an **AI-augmented engineering environment**. Rather than writing every line of boilerplate manually, this suite leverages custom GitHub Copilot Agents to manage the lifecycle of a test from discovery to self-healing.

### The "Spec-to-Code" Lifecycle
Every test in this repository follows a structured AI-assisted workflow:

| Agent | Role | Contribution to this Suite |
| :--- | :--- | :--- |
| **Planner** | **Discovery** | Analyzed the Sauce Demo site to generate the markdown specs found in `/specs`. |
| **Generator** | **Scaffolding** | Read the markdown specs and generated the initial Page Object code and `.spec.ts` files. |
| **Architecture** | **Governance** | Validated that all generated code strictly follows our POM and directory standards. |
| **Healer** | **Maintenance** | (Optional) Automatically diagnoses CI failures and pushes fixes for broken selectors. |

### Interacting with the Agents

You can trigger these agents directly within GitHub Copilot Chat to extend the framework:

```text
@playwright-test-planner     "Create a test plan for the inventory sorting flow"
@playwright-test-generator   "Implement the tests defined in specs/inventory.md"
@playwright-test-architecture "Check if my new page object follows the POM rules"
```

---

### 🛠️ Self-Healing CI (Experimental)

The project includes a **Playwright Test Healer** agent designed to fix failing tests automatically in GitHub Actions.

**How it works:**
1. A test fails in the CI pipeline (e.g., due to a changed UI selector).
2. The `playwright-test-healer` agent analyzes the failure logs and the DOM snapshot.
3. The agent generates a fix, runs the test again, and **automatically commits/pushes** the corrected code.

> [!TIP]
> **To enable the Healer:** Uncomment the "Install Copilot CLI" and "Run Playwright Test Healer" sections in `.github/workflows/playwright.yml`. Ensure a `COPILOT_PAT` is configured in your repository secrets.

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
