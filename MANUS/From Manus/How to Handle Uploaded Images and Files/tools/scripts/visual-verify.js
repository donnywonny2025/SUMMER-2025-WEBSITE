import { chromium } from 'playwright';
import fs from 'fs';

async function visualVerification() {
  console.log('🔍 VISUAL VERIFICATION SYSTEM');
  console.log('=============================\n');
  
  // Check if dev server is running
  const ports = [5173, 3000, 3001, 8080]; // Vite default is 5173
  let workingPort = null;
  
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}`, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      if (response.ok) {
        workingPort = port;
        console.log(`✅ Dev server found on port ${port}`);
        break;
      }
    } catch (error) {
      console.log(`❌ Port ${port}: ${error.message}`);
    }
  }
  
  if (!workingPort) {
    console.log('❌ No dev server found. Please start the dev server first.');
    console.log('   Try: npm run dev');
    return;
  }
  
  console.log(`\n📸 Taking screenshots from http://localhost:${workingPort}...\n`);
  
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 10000 // 10 second timeout
  });
  
  const page = await browser.newPage();
  
  // Set reasonable timeout
  page.setDefaultTimeout(10000);
  
  try {
    // Navigate with timeout
    await page.goto(`http://localhost:${workingPort}`, { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    // Wait a bit for any animations
    await page.waitForTimeout(2000);
    
    // Take screenshots at different viewports
    const viewports = [
      { name: 'mobile', width: 320, height: 568 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      console.log(`📱 Taking ${viewport.name} screenshot...`);
      
      await page.setViewportSize({ 
        width: viewport.width, 
        height: viewport.height 
      });
      
      await page.waitForTimeout(1000); // Let it settle
      
      const screenshotPath = `visual-verify-${viewport.name}.png`;
      await page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`   ✅ Saved: ${screenshotPath}`);
    }
    
    console.log('\n🎯 VISUAL VERIFICATION COMPLETE!');
    console.log('Check the generated PNG files to see your current site.');
    console.log('Compare with Sam Kolder\'s screenshots to identify improvements needed.');
    
  } catch (error) {
    console.log(`❌ Error taking screenshots: ${error.message}`);
  } finally {
    await browser.close();
  }
}

// Add timeout to prevent hanging
const timeout = setTimeout(() => {
  console.log('⏰ Visual verification timed out after 30 seconds');
  process.exit(1);
}, 30000);

visualVerification()
  .then(() => {
    clearTimeout(timeout);
    console.log('\n✅ Visual verification completed successfully');
  })
  .catch((error) => {
    clearTimeout(timeout);
    console.log(`❌ Visual verification failed: ${error.message}`);
    process.exit(1);
  });
