import { chromium } from 'playwright';
import fs from 'fs';

console.log('📸 BEFORE/AFTER SCREENSHOT SYSTEM');
console.log('=================================\n');

async function takeBeforeAfterScreenshots(changeDescription) {
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 10000,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  page.setDefaultTimeout(15000);
  
  try {
    console.log('🔍 Finding the correct dev server port...');
    
    const ports = [3000, 3001, 3002, 5173, 8080];
    let workingUrl = null;
    
    for (const port of ports) {
      try {
        const response = await page.goto(`http://localhost:${port}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 5000 
        });
        
        if (response && response.ok()) {
          workingUrl = `http://localhost:${port}`;
          console.log(`   ✅ Found working server on port ${port}`);
          break;
        }
      } catch (error) {
        console.log(`   ❌ Port ${port}: ${error.message.split('\n')[0]}`);
      }
    }
    
    if (!workingUrl) {
      console.log('❌ No working dev server found!');
      return;
    }
    
    console.log(`\n📸 Taking screenshots from ${workingUrl}...\n`);
    
    // Create organized folder structure
    const timestamp = Date.now();
    const changeFolder = changeDescription.replace(/\s+/g, '-').toLowerCase();
    const beforeFolder = `screenshots/before-after/${changeFolder}/before`;
    const afterFolder = `screenshots/before-after/${changeFolder}/after`;
    
    // Ensure directories exist
    fs.mkdirSync(beforeFolder, { recursive: true });
    fs.mkdirSync(afterFolder, { recursive: true });
    
    const viewports = [
      { name: 'mobile', width: 320, height: 568 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Taking ${viewport.name} screenshots...`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await page.waitForTimeout(2000);
      
      // Take before screenshot
      const beforeFilename = `${viewport.name}-${timestamp}.png`;
      const beforePath = `${beforeFolder}/${beforeFilename}`;
      await page.screenshot({ 
        path: beforePath,
        fullPage: true 
      });
      
      console.log(`   ✅ Before: ${beforePath}`);
      
      // Note: After screenshot would be taken after making changes
      console.log(`   📝 After: ${afterFolder}/${beforeFilename} (take after making changes)`);
    }
    
    console.log('\n🎯 BEFORE SCREENSHOTS COMPLETE!');
    console.log(`📁 Organized in: screenshots/before-after/${changeFolder}/`);
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Make your design changes');
    console.log('2. Run this script again to take after screenshots');
    console.log('3. Compare before/after screenshots');
    console.log('4. Verify changes match intended design');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Get change description from command line or use default
const changeDescription = process.argv[2] || 'design-change';
takeBeforeAfterScreenshots(changeDescription);
