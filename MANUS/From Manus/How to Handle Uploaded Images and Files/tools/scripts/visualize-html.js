import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('👁️ HTML VISUALIZATION TOOL');
console.log('==========================\n');

async function visualizeHTML(htmlFilePath) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set viewport for full page capture
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Convert to file URL
  const htmlUrl = `file://${path.resolve(htmlFilePath)}`;
  
  console.log(`📄 Loading HTML file: ${htmlUrl}`);
  
  try {
    await page.goto(htmlUrl, { waitUntil: 'networkidle' });
    
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Take a full page screenshot
    const timestamp = Date.now();
    const filename = path.basename(htmlFilePath, '.html');
    const screenshotPath = path.join(__dirname, `../../screenshots/current/${filename}-visual-${timestamp}.png`);
    
    console.log('📸 Taking full page screenshot...');
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      type: 'png'
    });
    
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    console.log('\n🎯 HTML file has been visualized!');
    
    return screenshotPath;
    
  } catch (error) {
    console.error('❌ Error taking screenshot:', error);
  } finally {
    await browser.close();
  }
}

// Get HTML file path from command line argument
const htmlFile = process.argv[2];
if (!htmlFile) {
  console.log('Usage: node visualize-html.js <path-to-html-file>');
  process.exit(1);
}

visualizeHTML(htmlFile);


