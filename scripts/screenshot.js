const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Wait for the dev server to be ready
    console.log('🚀 Connecting to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Desktop screenshot
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
    await page.screenshot({ 
      path: path.join(screenshotsDir, `desktop-${Date.now()}.png`),
      fullPage: true 
    });
    console.log('📸 Desktop screenshot captured!');

    // Tablet screenshot
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, `tablet-${Date.now()}.png`),
      fullPage: true 
    });
    console.log('📱 Tablet screenshot captured!');

    // Mobile screenshot
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.screenshot({ 
      path: path.join(screenshotsDir, `mobile-${Date.now()}.png`),
      fullPage: true 
    });
    console.log('📱 Mobile screenshot captured!');

    console.log('✅ All screenshots saved to:', screenshotsDir);
    
  } catch (error) {
    console.error('❌ Screenshot error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the screenshot function
takeScreenshots().catch(console.error);