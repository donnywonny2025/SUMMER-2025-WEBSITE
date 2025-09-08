import { chromium } from 'playwright';

async function takeQuickScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to our local site
  await page.goto('http://localhost:3001');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'current-site-screenshot.png',
    fullPage: true 
  });
  
  console.log('✅ Screenshot taken: current-site-screenshot.png');
  
  await browser.close();
}

takeQuickScreenshot().catch(console.error);
