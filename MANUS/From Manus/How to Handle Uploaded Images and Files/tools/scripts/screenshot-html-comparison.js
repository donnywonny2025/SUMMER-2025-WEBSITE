import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📸 SCREENSHOT HTML COMPARISON');
console.log('=============================\n');

async function screenshotHTMLComparison() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport for full page capture
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Get the absolute path to the HTML file
  const htmlPath = path.join(__dirname, '../../screenshots/current/side-by-side-comparison.html');
  const htmlUrl = `file://${htmlPath}`;
  
  console.log(`📄 Loading HTML file: ${htmlUrl}`);
  
  try {
    await page.goto(htmlUrl, { waitUntil: 'networkidle' });
    
    // Wait a bit for any images to load
    await page.waitForTimeout(2000);
    
    // Take a full page screenshot
    const timestamp = Date.now();
    const screenshotPath = path.join(__dirname, `../../screenshots/current/html-comparison-${timestamp}.png`);
    
    console.log('📸 Taking full page screenshot...');
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      type: 'png'
    });
    
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    console.log('\n🎯 Now I can visually analyze the side-by-side comparison!');
    
  } catch (error) {
    console.error('❌ Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

screenshotHTMLComparison();


