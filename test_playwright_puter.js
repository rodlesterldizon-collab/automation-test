const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('about:blank');
  await page.addScriptTag({ url: 'https://js.puter.com/v2/' });
  const response = await page.evaluate(async () => {
    return await puter.ai.chat('What is 2+2?', { model: 'deepseek/deepseek-r1-0528' });
  });
  console.log('Response:', response);
  await browser.close();
})();
