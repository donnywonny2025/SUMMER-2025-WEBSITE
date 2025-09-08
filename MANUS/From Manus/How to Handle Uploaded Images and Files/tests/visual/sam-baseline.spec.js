import { test, expect } from '@playwright/test';

// Test configuration for Sam Kolder's site
const viewportSizes = [320, 768, 1024, 1920];
const videoDelay = 8000; // 8 seconds for video content loading
const additionalDelay = 3000; // 3 seconds additional buffer

// Test for each viewport size to capture Sam's site as baseline
viewportSizes.forEach(viewportWidth => {
  test(`Sam Kolder baseline capture - ${viewportWidth}px`, async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: viewportWidth, height: 1080 });
    
    // Navigate to Sam Kolder's site
    await page.goto('https://www.samkolder.com', { 
      waitUntil: 'domcontentloaded',
      timeout: 45000 
    });
    
    // Wait for video content to load
    await page.waitForTimeout(videoDelay);
    
    // Wait for any video elements to be ready
    try {
      await page.waitForSelector('video, iframe[src*="vimeo"], iframe[src*="youtube"]', { 
        timeout: 10000 
      });
    } catch (e) {
      console.log('No video elements found, continuing...');
    }
    
    // Additional buffer time for video content
    await page.waitForTimeout(additionalDelay);
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    
    // Take screenshot
    const screenshotPath = `tests/screenshots/baseline/sam/sam_${viewportWidth}px.png`;
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true 
    });
    
    console.log(`✅ Sam Kolder baseline captured for ${viewportWidth}px: ${screenshotPath}`);
  });
});