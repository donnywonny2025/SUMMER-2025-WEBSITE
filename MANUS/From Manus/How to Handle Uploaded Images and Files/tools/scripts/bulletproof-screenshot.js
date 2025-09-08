import { chromium } from 'playwright';
import fs from 'fs';

console.log('🎯 BULLETPROOF SCREENSHOT SYSTEM');
console.log('=================================\n');

async function takeBulletproofScreenshot() {
  // Kill any existing browser processes first
  console.log('🧹 Cleaning up any existing browser processes...');
  
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 10000,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Prevent hanging
  });
  
  const page = await browser.newPage();
  page.setDefaultTimeout(15000); // 15 second timeout
  
  try {
    console.log('🔍 Finding the correct dev server port...');
    
    // Check common ports in order
    const ports = [3000, 3001, 3002, 5173, 8080];
    let workingUrl = null;
    
    for (const port of ports) {
      try {
        console.log(`   Testing port ${port}...`);
        
        // Use a simple fetch to test the port
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
      console.log('   Please start your dev server: npm run dev');
      return;
    }
    
    console.log(`\n📸 Taking screenshots from ${workingUrl}...\n`);
    
    // Take screenshots at key viewports
    const viewports = [
      { name: 'mobile', width: 320, height: 568 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Taking ${viewport.name} screenshot...`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      // Wait for content to load
      await page.waitForTimeout(2000);
      
      const filename = `bulletproof-${viewport.name}-${Date.now()}.png`;
      const screenshotPath = `screenshots/current/${filename}`;
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`   ✅ Saved: ${screenshotPath}`);
    }
    
    console.log('\n🎯 SCREENSHOTS COMPLETE!');
    console.log('Now you can see what your site actually looks like!');
    console.log('Compare these with Sam Kolder\'s site to see what needs fixing.');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Add timeout to prevent infinite hanging
const timeout = setTimeout(() => {
  console.log('⏰ Screenshot timed out after 30 seconds - stopping');
  process.exit(1);
}, 30000);

takeBulletproofScreenshot()
  .then(() => {
    clearTimeout(timeout);
    console.log('\n✅ Done!');
  })
  .catch((error) => {
    clearTimeout(timeout);
    console.log(`❌ Failed: ${error.message}`);
    process.exit(1);
  });
