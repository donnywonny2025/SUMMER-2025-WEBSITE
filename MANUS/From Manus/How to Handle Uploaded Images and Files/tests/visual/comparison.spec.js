import { test, expect } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs';

// Test configuration
const viewportSizes = [320, 768, 1024, 1920];
const videoDelay = 8000; // 8 seconds for video content loading
const additionalDelay = 3000; // 3 seconds additional buffer

// Helper function to compare images
async function compareImages(baselinePath, currentPath, diffPath) {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const current = PNG.sync.read(fs.readFileSync(currentPath));
  
  // Check if images have the same dimensions
  if (baseline.width !== current.width || baseline.height !== current.height) {
    console.log(`⚠️  Image size mismatch:`);
    console.log(`   Baseline: ${baseline.width}x${baseline.height}`);
    console.log(`   Current: ${current.width}x${current.height}`);
    console.log(`   Difference: ${current.width - baseline.width}px width, ${current.height - baseline.height}px height`);
    
    // Calculate size difference percentage
    const widthDiffPercent = ((current.width - baseline.width) / baseline.width * 100).toFixed(1);
    const heightDiffPercent = ((current.height - baseline.height) / baseline.height * 100).toFixed(1);
    
    return { 
      hasDiff: true, 
      diffPercentage: Math.max(Math.abs(widthDiffPercent), Math.abs(heightDiffPercent)),
      numDiffPixels: 'size_mismatch',
      sizeMismatch: true,
      baselineSize: `${baseline.width}x${baseline.height}`,
      currentSize: `${current.width}x${current.height}`
    };
  }
  
  const { width, height } = baseline;
  const diff = new PNG({ width, height });
  
  const numDiffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );
  
  const diffPercentage = (numDiffPixels / (width * height)) * 100;
  
  if (diffPercentage > 0) {
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    return { hasDiff: true, diffPercentage, numDiffPixels, sizeMismatch: false };
  }
  
  return { hasDiff: false, diffPercentage, numDiffPixels, sizeMismatch: false };
}

// Test for each viewport size - compare Sam's site vs our site
viewportSizes.forEach(viewportWidth => {
  test(`Sam Kolder vs Our Site Comparison - ${viewportWidth}px`, async ({ page }) => {
    // Define paths
    const samBaselinePath = `tests/screenshots/baseline/sam/sam_${viewportWidth}px.png`;
    const ourBaselinePath = `tests/screenshots/baseline/home_${viewportWidth}px.png`;
    const diffPath = `tests/screenshots/diff/sam_vs_ours_${viewportWidth}px.png`;
    
    // Check if both baseline images exist
    if (!fs.existsSync(samBaselinePath)) {
      console.log(`❌ Sam Kolder baseline not found for ${viewportWidth}px: ${samBaselinePath}`);
      return;
    }
    
    if (!fs.existsSync(ourBaselinePath)) {
      console.log(`❌ Our site baseline not found for ${viewportWidth}px: ${ourBaselinePath}`);
      return;
    }
    
    // Compare the images
    const comparison = await compareImages(samBaselinePath, ourBaselinePath, diffPath);
    
    if (comparison.hasDiff) {
      if (comparison.sizeMismatch) {
        console.log(`📏 Size differences found for ${viewportWidth}px:`);
        console.log(`   Sam's size: ${comparison.baselineSize}`);
        console.log(`   Our size: ${comparison.currentSize}`);
        console.log(`   Size difference: ${comparison.diffPercentage.toFixed(1)}%`);
      } else {
        console.log(`🔍 Visual differences found for ${viewportWidth}px:`);
        console.log(`   Diff percentage: ${comparison.diffPercentage.toFixed(2)}%`);
        console.log(`   Different pixels: ${comparison.numDiffPixels}`);
        console.log(`   Diff image saved: ${diffPath}`);
      }
      
      // This test will always pass - we're just documenting differences
      expect(comparison.diffPercentage).toBeGreaterThanOrEqual(0);
    } else {
      console.log(`✅ Perfect match for ${viewportWidth}px - no differences detected!`);
    }
  });
});
