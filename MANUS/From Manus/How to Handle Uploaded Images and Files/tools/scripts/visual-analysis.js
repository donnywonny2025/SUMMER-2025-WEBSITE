import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

console.log('🎯 VISUAL ANALYSIS - OUR SITE vs SAM KOLDER');
console.log('===========================================\n');

// Get the latest screenshots
const currentFiles = fs.readdirSync('.').filter(f => f.startsWith('bulletproof-') && f.endsWith('.png'));
const samDir = './tests/screenshots/baseline/sam';

console.log('📸 AVAILABLE SCREENSHOTS:');
console.log('========================\n');

console.log('🏠 OUR SITE (Latest):');
currentFiles.forEach(file => {
  const stats = fs.statSync(file);
  console.log(`   📸 ${file} (${stats.mtime.toLocaleTimeString()})`);
});

console.log('\n⭐ SAM KOLDER SITE:');
if (fs.existsSync(samDir)) {
  const samFiles = fs.readdirSync(samDir);
  samFiles.forEach(file => {
    const stats = fs.statSync(path.join(samDir, file));
    console.log(`   📸 ${file} (${stats.mtime.toLocaleTimeString()})`);
  });
} else {
  console.log('   ❌ No Sam Kolder screenshots found');
}

console.log('\n🔍 DIMENSION ANALYSIS:');
console.log('=====================\n');

// Analyze dimensions
const viewportMap = {
  'mobile': '320px',
  'desktop': '1024px', 
  'large': '1920px'
};

currentFiles.forEach(file => {
  const viewport = file.includes('mobile') ? 'mobile' : 
                   file.includes('desktop') ? 'desktop' : 'large';
  
  try {
    const ourImage = PNG.sync.read(fs.readFileSync(file));
    const samFile = path.join(samDir, `sam_${viewportMap[viewport]}.png`);
    
    if (fs.existsSync(samFile)) {
      const samImage = PNG.sync.read(fs.readFileSync(samFile));
      
      console.log(`📱 ${viewport.toUpperCase()} (${viewportMap[viewport]}):`);
      console.log(`   Our Site:  ${ourImage.width}x${ourImage.height}`);
      console.log(`   Sam Kolder: ${samImage.width}x${samImage.height}`);
      
      const heightDiff = ourImage.height - samImage.height;
      const heightPercent = ((ourImage.height - samImage.height) / samImage.height * 100).toFixed(1);
      
      if (heightDiff > 0) {
        console.log(`   Difference: +${heightDiff}px (+${heightPercent}%) - Our site is TALLER`);
      } else if (heightDiff < 0) {
        console.log(`   Difference: ${heightDiff}px (${heightPercent}%) - Our site is SHORTER`);
      } else {
        console.log(`   Difference: Same height`);
      }
      console.log('');
    }
  } catch (error) {
    console.log(`   ❌ Error analyzing ${viewport}: ${error.message}`);
  }
});

console.log('🎯 DESIGN ANALYSIS RECOMMENDATIONS:');
console.log('===================================');
console.log('1. 📏 Height Differences: Check if our site should match Sam\'s proportions');
console.log('2. 🎨 Visual Elements: Compare hero section, typography, spacing');
console.log('3. 📱 Responsive Design: Ensure consistent experience across viewports');
console.log('4. ⭐ Sam Kolder Reference: Use as Holy Grail for all design decisions');
console.log('\n💡 Next: Look at the actual screenshots to identify specific design improvements needed');
