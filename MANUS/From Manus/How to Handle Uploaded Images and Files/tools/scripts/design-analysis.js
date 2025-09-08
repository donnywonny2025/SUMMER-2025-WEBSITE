import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const screenshotsDir = './tests/screenshots/baseline';

console.log('🎨 DESIGN ANALYSIS: Our Site vs Sam Kolder');
console.log('==========================================\n');

const viewports = ['mobile', 'tablet', 'desktop', 'large'];

viewports.forEach(viewport => {
  const ourSitePath = path.join(screenshotsDir, `our_site_${viewport}.png`);
  const samSitePath = path.join(screenshotsDir, `sam_${viewport}.png`);
  
  if (fs.existsSync(ourSitePath) && fs.existsSync(samSitePath)) {
    const ourSite = PNG.sync.read(fs.readFileSync(ourSitePath));
    const samSite = PNG.sync.read(fs.readFileSync(samSitePath));
    
    console.log(`📱 ${viewport.toUpperCase()} (${viewport === 'mobile' ? '320px' : viewport === 'tablet' ? '768px' : viewport === 'desktop' ? '1024px' : '1920px'} width):`);
    console.log(`   Our Site:  ${ourSite.width}x${ourSite.height}`);
    console.log(`   Sam's Site: ${samSite.width}x${samSite.height}`);
    
    // Calculate aspect ratios
    const ourAspectRatio = (ourSite.height / ourSite.width).toFixed(3);
    const samAspectRatio = (samSite.height / samSite.width).toFixed(3);
    
    console.log(`   Aspect Ratio - Our: ${ourAspectRatio}, Sam's: ${samAspectRatio}`);
    
    // Height difference analysis
    const heightDiff = ourSite.height - samSite.height;
    const heightDiffPercent = ((ourSite.height - samSite.height) / samSite.height * 100).toFixed(1);
    
    console.log(`   Height Difference: ${heightDiff > 0 ? '+' : ''}${heightDiff}px (${heightDiffPercent > 0 ? '+' : ''}${heightDiffPercent}%)`);
    
    // Design recommendations based on viewport
    if (viewport === 'desktop' || viewport === 'large') {
      console.log(`   🎯 Design Focus: Hero section positioning, circular showreel placement`);
    } else {
      console.log(`   🎯 Design Focus: Mobile layout, text sizing, spacing adjustments`);
    }
    
    console.log('');
  }
});

console.log('🎨 DESIGN RECOMMENDATIONS:');
console.log('==========================');
console.log('1. **Hero Section**: Adjust text positioning and sizing to match Sam\'s layout');
console.log('2. **Circular Showreel**: Fine-tune placement and sizing');
console.log('3. **Contact Info**: Match positioning of location/email elements');
console.log('4. **Spacing**: Adjust vertical spacing between sections');
console.log('5. **Typography**: Match font sizes and weights');
console.log('');
console.log('🔧 Next Steps:');
console.log('- Focus on CSS adjustments, not content changes');
console.log('- Use visual testing to validate each design change');
console.log('- Target: <5% visual difference across all viewport sizes');
