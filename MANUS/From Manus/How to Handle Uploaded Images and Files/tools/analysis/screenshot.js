import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.connect({
        browserURL: 'http://localhost:9222',
    });
    const page = await browser.newPage();
    await new Promise(resolve => setTimeout(resolve, 6000)); // 6-second delay
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    console.log('Screenshot saved to screenshot.png');

    await browser.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();