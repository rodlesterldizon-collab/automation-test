
## Browser Installation Optimization

The GitHub Actions workflow is currently configured to install only **Chromium** to optimize CI/CD pipeline speed. Installing all browsers adds significant time to the build process.

### Installation Times Comparison:

- **Chromium only** - ~2-3 minutes (current)
- **All browsers** (Chromium, Firefox, WebKit) - ~5-8 minutes

### Enabling Additional Browsers

To run tests on multiple browsers, edit `.github/workflows/playwright.yml` and update the "Install Playwright Browsers" step:

#### Option 1: Install All Browsers
```yaml
run: npx playwright install --with-deps
```

#### Option 2: Install Specific Browsers

- **Chromium only** (default/current):
	```yaml
	run: npx playwright install chromium --with-deps
	```

- **Firefox only**:
	```yaml
	run: npx playwright install firefox --with-deps
	```

- **WebKit only**:
	```yaml
	run: npx playwright install webkit --with-deps
	```

- **Multiple browsers** (e.g., Chromium + Firefox):
	```yaml
	run: npx playwright install chromium firefox --with-deps
	```

### Running Tests Locally with Multiple Browsers

To run your tests locally with all browsers:
```bash
npx playwright install
npx playwright test
```

To run with a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```
# automation-test

## AI Test Healer (Disabled)

The AI Test Healer automatically fixes failing tests in CI/CD using GitHub Copilot. Currently disabled to manage costs.

### Enabling the AI Healer

To enable the automatic test healing feature, uncomment the following steps in `.github/workflows/playwright.yml`:

1. **Install Copilot CLI** - Installs the GitHub Copilot CLI tool needed for the healer
2. **Run Playwright Test Healer on Failure** - Activates the AI agent to diagnose and fix failing tests
3. **Commit and Push AI Fixes** - Automatically commits and pushes the AI-generated fixes

#### Steps to Enable:

1. Open `.github/workflows/playwright.yml`
2. Find the commented-out sections starting with `# - name: Install Copilot CLI`
3. Remove the `#` character from the beginning of each line in these three sections
4. Ensure you have a valid `COPILOT_PAT` (Personal Access Token) secret configured in your GitHub repository settings
5. Commit and push your changes

#### Requirements:

- **GitHub Copilot Subscription** - Required for API access
- **GitHub Token** (`COPILOT_PAT` secret) - Set in repository secrets with appropriate permissions
- **Sufficient API quota** - Monitor your Copilot usage to avoid unexpected costs

#### How It Works:

When tests fail in the CI pipeline:
1. The Copilot CLI is installed
2. The playwright-test-healer agent analyzes the failing tests
3. The AI diagnoses the issues and generates fixes
4. Fixed code is automatically committed and pushed to your branch

For more information, see the test specifications in `specs/` and test files in `tests/`.
