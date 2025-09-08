import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const screenshotsDir = './tests/screenshots/baseline';

const viewports = ['mobile', 'tablet', 'desktop', 'large'];

console.log('📊 SCREENSHOT DIMENSION ANALYSIS');
console.log('================================\n');

viewports.forEach(viewport => {
  const ourSitePath = path.join(screenshotsDir, `our_site_${viewport}.png`);
  const samSitePath = path.join(screenshotsDir, `sam_${viewport}.png`);
  
  if (fs.existsSync(ourSitePath) && fs.existsSync(samSitePath)) {
    const ourSite = PNG.sync.read(fs.readFileSync(ourSitePath));
    const samSite = PNG.sync.read(fs.readFileSync(samSitePath));
    
    const ourDimensions = `${ourSite.width}x${ourSite.height}`;
    const samDimensions = `${samSite.width}x${samSite.height}`;
    
    const widthDiff = ourSite.width - samSite.width;
    const heightDiff = ourSite.height - samSite.height;
    
    const widthDiffPercent = ((ourSite.width - samSite.width) / samSite.width * 100).toFixed(1);
    const heightDiffPercent = ((ourSite.height - samSite.height) / samSite.height * 100).toFixed(1);
    
    console.log(`📱 ${viewport.toUpperCase()} (${viewport === 'mobile' ? '320px' : viewport === 'tablet' ? '768px' : viewport === 'desktop' ? '1024px' : '1920px'} width):`);
    console.log(`   Our Site:  ${ourDimensions}`);
    console.log(`   Sam's Site: ${samDimensions}`);
    console.log(`   Difference: ${widthDiff > 0 ? '+' : ''}${widthDiff}px width, ${heightDiff > 0 ? '+' : ''}${heightDiff}px height`);
    console.log(`   Percentage: ${widthDiffPercent > 0 ? '+' : ''}${widthDiffPercent}% width, ${heightDiffPercent > 0 ? '+' : ''}${heightDiffPercent}% height`);
    
    if (Math.abs(heightDiffPercent) > 10) {
      console.log(`   ⚠️  SIGNIFICANT HEIGHT DIFFERENCE - Our site is ${heightDiffPercent > 0 ? 'taller' : 'shorter'} than Sam's`);
    }
    console.log('');
  }
});

console.log('🎯 RECOMMENDATIONS:');
console.log('- Focus on height differences first (most critical for layout)');
console.log('- Sam\'s site appears to be more compact vertically');
console.log('- Consider reducing content or adjusting spacing to match Sam\'s proportions');
