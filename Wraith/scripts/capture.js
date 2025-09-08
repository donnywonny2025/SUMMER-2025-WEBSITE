const { chromium } = require('playwright');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config.json');

async function captureScreenshots(environment = 'local', outputDir = 'latest') {
  console.log(`🚀 Starting screenshot capture for ${environment} environment...`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const baseUrl = config.domains[environment];
  if (!baseUrl) {
    throw new Error(`Environment '${environment}' not found in config`);
  }
  
  const outputPath = path.join('shots', outputDir);
  await fs.ensureDir(outputPath);
  
  for (const [pathName, pathValue] of Object.entries(config.paths)) {
    console.log(`📸 Capturing ${pathName} (${pathValue})...`);
    
    for (const width of config.screen_widths) {
      await page.setViewportSize({ width, height: 1080 });
      
      const url = `${baseUrl}${pathValue}`;
      console.log(`  📱 ${width}px: ${url}`);
      
      try {
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Wait for any specified selector or delay
        if (config.options.waitForSelector) {
          await page.waitForSelector(config.options.waitForSelector);
        }
        
        if (config.options.delay) {
          await page.waitForTimeout(config.options.delay);
        }
        
        const filename = `${pathName}_${width}px.png`;
        const filepath = path.join(outputPath, filename);
        
        await page.screenshot({
          path: filepath,
          fullPage: config.options.fullPage
        });
        
        console.log(`    ✅ Saved: ${filename}`);
      } catch (error) {
        console.error(`    ❌ Error capturing ${pathName} at ${width}px:`, error.message);
      }
    }
  }
  
  await browser.close();
  console.log(`🎉 Screenshot capture completed! Files saved to: ${outputPath}`);
}

// Command line interface
const args = process.argv.slice(2);
const environment = args[0] || 'local';
const outputDir = args[1] || 'latest';

captureScreenshots(environment, outputDir).catch(console.error);
