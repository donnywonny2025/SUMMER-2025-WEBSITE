const fs = require('fs-extra');
const path = require('path');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const config = require('../config.json');

async function compareScreenshots() {
  console.log('🔍 Starting screenshot comparison...');
  
  const baselineDir = path.join('shots', 'baseline');
  const latestDir = path.join('shots', 'latest');
  const diffsDir = path.join('shots', 'diffs');
  
  await fs.ensureDir(diffsDir);
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    diffs: []
  };
  
  // Get all baseline files
  const baselineFiles = await fs.readdir(baselineDir);
  
  for (const baselineFile of baselineFiles) {
    if (!baselineFile.endsWith('.png')) continue;
    
    const baselinePath = path.join(baselineDir, baselineFile);
    const latestPath = path.join(latestDir, baselineFile);
    const diffPath = path.join(diffsDir, baselineFile);
    
    results.total++;
    
    // Check if latest file exists
    if (!await fs.pathExists(latestPath)) {
      console.log(`❌ Missing latest file: ${baselineFile}`);
      results.failed++;
      results.diffs.push({
        file: baselineFile,
        status: 'missing',
        message: 'Latest screenshot not found'
      });
      continue;
    }
    
    try {
      // Load images
      const baselineImg = PNG.sync.read(await fs.readFile(baselinePath));
      const latestImg = PNG.sync.read(await fs.readFile(latestPath));
      
      // Ensure images have same dimensions
      if (baselineImg.width !== latestImg.width || baselineImg.height !== latestImg.height) {
        console.log(`❌ Dimension mismatch: ${baselineFile}`);
        results.failed++;
        results.diffs.push({
          file: baselineFile,
          status: 'dimension_mismatch',
          message: `Dimensions differ: ${baselineImg.width}x${baselineImg.height} vs ${latestImg.width}x${latestImg.height}`
        });
        continue;
      }
      
      // Compare images
      const diff = new PNG({ width: baselineImg.width, height: baselineImg.height });
      const numDiffPixels = pixelmatch(
        baselineImg.data,
        latestImg.data,
        diff.data,
        baselineImg.width,
        baselineImg.height,
        { threshold: config.options.threshold }
      );
      
      const diffPercentage = (numDiffPixels / (baselineImg.width * baselineImg.height)) * 100;
      
      if (numDiffPixels === 0) {
        console.log(`✅ No differences: ${baselineFile}`);
        results.passed++;
        results.diffs.push({
          file: baselineFile,
          status: 'passed',
          diffPixels: 0,
          diffPercentage: 0
        });
      } else {
        console.log(`❌ Differences found: ${baselineFile} (${numDiffPixels} pixels, ${diffPercentage.toFixed(2)}%)`);
        results.failed++;
        
        // Save diff image
        await fs.writeFile(diffPath, PNG.sync.write(diff));
        
        results.diffs.push({
          file: baselineFile,
          status: 'failed',
          diffPixels: numDiffPixels,
          diffPercentage: diffPercentage
        });
      }
    } catch (error) {
      console.error(`❌ Error comparing ${baselineFile}:`, error.message);
      results.failed++;
      results.diffs.push({
        file: baselineFile,
        status: 'error',
        message: error.message
      });
    }
  }
  
  // Save results
  const resultsPath = path.join('shots', 'comparison-results.json');
  await fs.writeJson(resultsPath, results, { spaces: 2 });
  
  console.log('\n📊 Comparison Results:');
  console.log(`Total: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Results saved to: ${resultsPath}`);
  
  return results;
}

compareScreenshots().catch(console.error);
