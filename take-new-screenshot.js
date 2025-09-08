const puppeteer = require('puppeteer');
const path = require('path');

async function takeScreenshot(url, outputPath) {
  console.log(`🚀 Taking screenshot of ${url}...`);
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Take full page screenshot
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for animations
    await page.screenshot({ 
      path: outputPath,
      fullPage: true 
    });
    console.log(`📸 Screenshot saved to ${outputPath}`);
  } catch (error) {
    console.error(`❌ Screenshot error: ${error.message} at ${url}`);
  } finally {
    await browser.close();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node take-new-screenshot.js <url> <output-path>');
  process.exit(1);
}

const url = args[0];
const outputPath = args[1];

takeScreenshot(url, outputPath);