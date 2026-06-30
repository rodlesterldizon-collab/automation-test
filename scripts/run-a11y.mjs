import { execSync } from 'node:child_process';

/**
 * Wrapper script for running accessibility tests.
 * Usage: npm run test:a11y <url1> [url2] ...
 */

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error('Error: Please provide at least one URL to test.');
  console.error('Usage: npm run test:a11y <url1> [url2] ...');
  process.exit(1);
}

// Basic validation to ensure each argument starts with http:// or https://
urls.forEach(url => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error(`Error: Invalid URL provided: ${url}. URLs must start with http:// or https://`);
    process.exit(1);
  }
});

const urlList = urls.join(',');
const command = 'npx playwright test --project=accessibility';

const options = {
  env: { ...process.env, URL_LIST: urlList },
  stdio: 'inherit' // This shows the test output in real-time
};

try {
  execSync(command, options);
} catch (error) {
  console.error('Accessibility test run failed.');
  process.exit(1);
}
