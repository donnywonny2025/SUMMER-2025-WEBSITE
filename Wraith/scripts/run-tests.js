const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

async function runVisualRegressionTests(environment = 'local') {
  console.log('🚀 Starting Visual Regression Testing Workflow...\n');
  
  try {
    // Step 1: Capture baseline screenshots (if they don't exist)
    const baselineDir = path.join('shots', 'baseline');
    const baselineExists = await fs.pathExists(baselineDir) && 
                          (await fs.readdir(baselineDir)).length > 0;
    
    if (!baselineExists) {
      console.log('📸 Step 1: Capturing baseline screenshots...');
      execSync(`node scripts/capture.js ${environment} baseline`, { stdio: 'inherit' });
      console.log('✅ Baseline screenshots captured!\n');
    } else {
      console.log('📸 Step 1: Baseline screenshots already exist, skipping...\n');
    }
    
    // Step 2: Capture latest screenshots
    console.log('📸 Step 2: Capturing latest screenshots...');
    execSync(`node scripts/capture.js ${environment} latest`, { stdio: 'inherit' });
    console.log('✅ Latest screenshots captured!\n');
    
    // Step 3: Compare screenshots
    console.log('🔍 Step 3: Comparing screenshots...');
    execSync('node scripts/compare.js', { stdio: 'inherit' });
    console.log('✅ Screenshot comparison completed!\n');
    
    // Step 4: Generate gallery
    console.log('🎨 Step 4: Generating visual report...');
    execSync('node scripts/generate-gallery.js', { stdio: 'inherit' });
    console.log('✅ Visual report generated!\n');
    
    // Step 5: Show results
    const resultsPath = path.join('shots', 'comparison-results.json');
    if (await fs.pathExists(resultsPath)) {
      const results = await fs.readJson(resultsPath);
      console.log('📊 Final Results:');
      console.log(`   Total Tests: ${results.total}`);
      console.log(`   Passed: ${results.passed}`);
      console.log(`   Failed: ${results.failed}`);
      
      if (results.failed > 0) {
        console.log('\n❌ Some tests failed. Check the gallery for details.');
        console.log(`🌐 Open gallery: file://${path.resolve('shots/gallery/index.html')}`);
      } else {
        console.log('\n✅ All tests passed! No visual regressions detected.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error during visual regression testing:', error.message);
    process.exit(1);
  }
}

// Command line interface
const args = process.argv.slice(2);
const environment = args[0] || 'local';

runVisualRegressionTests(environment);
