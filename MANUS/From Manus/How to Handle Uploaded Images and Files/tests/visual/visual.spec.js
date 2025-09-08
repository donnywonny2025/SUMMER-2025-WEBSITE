import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Viewport configurations for different screen sizes
const viewports = [
  { name: 'mobile', width: 320, height: 568 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1024, height: 768 },
  { name: 'large', width: 1920, height: 1080 }
];

// Helper function to ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper function to capture screenshot
async function captureScreenshot(page, viewport, filename) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  
  // Wait for page to load completely
  await page.waitForLoadState('networkidle');
  
  // Additional wait for any animations or dynamic content
  await page.waitForTimeout(2000);
  
  const screenshotPath = path.join(__dirname, '..', 'screenshots', filename);
  await page.screenshot({ 
    path: screenshotPath,
    fullPage: true,
    animations: 'disabled'
  });
  
  return screenshotPath;
}

// Helper function to compare images
function compareImages(baselinePath, currentPath, diffPath) {
  try {
    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    
    const { width, height } = baseline;
    const diff = new PNG({ width, height });
    
    const numDiffPixels = pixelmatch(
      baseline.data, 
      current.data, 
      diff.data, 
      width, 
      height, 
      {
        threshold: 0.1,
        alpha: 0.1,
        diffColor: [255, 0, 0],
        diffColorAlt: [0, 255, 0]
      }
    );
    
    // Save diff image if there are differences
    if (numDiffPixels > 0) {
      ensureDir(path.dirname(diffPath));
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }
    
    return {
      numDiffPixels,
      totalPixels: width * height,
      diffPercentage: (numDiffPixels / (width * height)) * 100
    };
  } catch (error) {
    console.error('Error comparing images:', error);
    return null;
  }
}

// Test for our local site
test.describe('Visual Regression Tests - Our Site', () => {
  viewports.forEach(viewport => {
    test(`should match baseline for ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      // Navigate to our local site
      await page.goto('/');
      
      const baselinePath = path.join(__dirname, '..', 'screenshots', 'baseline', `our_site_${viewport.name}.png`);
      const currentPath = path.join(__dirname, '..', 'screenshots', 'current', `our_site_${viewport.name}.png`);
      const diffPath = path.join(__dirname, '..', 'screenshots', 'diff', `our_site_${viewport.name}.png`);
      
      // Ensure directories exist
      ensureDir(path.dirname(baselinePath));
      ensureDir(path.dirname(currentPath));
      
      // Capture current screenshot
      await captureScreenshot(page, viewport, `current/our_site_${viewport.name}.png`);
      
      // Check if baseline exists
      if (!fs.existsSync(baselinePath)) {
        console.log(`Baseline not found for ${viewport.name}. Creating baseline...`);
        fs.copyFileSync(currentPath, baselinePath);
        test.skip(`Baseline created for ${viewport.name}. Run test again to compare.`);
        return;
      }
      
      // Compare images
      const comparison = compareImages(baselinePath, currentPath, diffPath);
      
      if (comparison) {
        console.log(`${viewport.name}: ${comparison.numDiffPixels} different pixels (${comparison.diffPercentage.toFixed(2)}%)`);
        
        // Fail if difference is too large (more than 1% of pixels)
        if (comparison.diffPercentage > 1) {
          throw new Error(`Visual regression detected for ${viewport.name}: ${comparison.diffPercentage.toFixed(2)}% difference (${comparison.numDiffPixels} pixels). Diff saved to ${diffPath}`);
        }
      }
    });
  });
});

// Test for Sam Kolder's site comparison
test.describe('Visual Comparison Tests - Sam Kolder vs Our Site', () => {
  viewports.forEach(viewport => {
    test(`should compare with Sam Kolder's site for ${viewport.name}`, async ({ page }) => {
      // First, capture Sam Kolder's site
      await page.goto('https://www.samkolder.com');
      
      const samBaselinePath = path.join(__dirname, '..', 'screenshots', 'baseline', `sam_${viewport.name}.png`);
      const samCurrentPath = path.join(__dirname, '..', 'screenshots', 'current', `sam_${viewport.name}.png`);
      
      ensureDir(path.dirname(samBaselinePath));
      ensureDir(path.dirname(samCurrentPath));
      
      // Capture Sam's site
      await captureScreenshot(page, viewport, `current/sam_${viewport.name}.png`);
      
      // Check if Sam's baseline exists
      if (!fs.existsSync(samBaselinePath)) {
        console.log(`Sam's baseline not found for ${viewport.name}. Creating baseline...`);
        fs.copyFileSync(samCurrentPath, samBaselinePath);
        test.skip(`Sam's baseline created for ${viewport.name}. Run test again to compare.`);
        return;
      }
      
      // Now capture our site
      await page.goto('/');
      const ourCurrentPath = path.join(__dirname, '..', 'screenshots', 'current', `our_site_${viewport.name}.png`);
      await captureScreenshot(page, viewport, `current/our_site_${viewport.name}.png`);
      
      // Compare Sam's baseline with our current site
      const comparisonPath = path.join(__dirname, '..', 'screenshots', 'diff', `sam_vs_our_${viewport.name}.png`);
      const comparison = compareImages(samBaselinePath, ourCurrentPath, comparisonPath);
      
      if (comparison) {
        console.log(`Sam vs Our (${viewport.name}): ${comparison.numDiffPixels} different pixels (${comparison.diffPercentage.toFixed(2)}%)`);
        
        // Log the comparison but don't fail the test - this is for analysis
        expect(comparison.diffPercentage).toBeLessThan(100); // Just ensure comparison worked
      }
    });
  });
});