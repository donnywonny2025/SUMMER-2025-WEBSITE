import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 VISUAL COMPARISON ANALYSIS');
console.log('=============================\n');

// Function to find latest screenshots
function findLatestScreenshots(directory) {
  try {
    const files = fs.readdirSync(directory);
    const screenshots = files.filter(file => file.endsWith('.png'));
    
    if (screenshots.length === 0) return {};
    
    // Group by viewport type
    const viewports = {};
    screenshots.forEach(file => {
      if (file.includes('mobile')) {
        viewports.mobile = file;
      } else if (file.includes('desktop')) {
        viewports.desktop = file;
      } else if (file.includes('large')) {
        viewports.large = file;
      }
    });
    
    return viewports;
  } catch (error) {
    return {};
  }
}

// Get current and reference screenshots
const currentDir = path.join(__dirname, '../../screenshots/current');
const samDir = path.join(__dirname, '../../screenshots/sam-reference');

console.log('📱 Current screenshots:');
const currentScreenshots = findLatestScreenshots(currentDir);
Object.keys(currentScreenshots).forEach(viewport => {
  console.log(`   ${viewport}: ${currentScreenshots[viewport]}`);
});

console.log('\n🎯 Sam Kolder reference screenshots:');
const samScreenshots = findLatestScreenshots(samDir);
Object.keys(samScreenshots).forEach(viewport => {
  console.log(`   ${viewport}: ${samScreenshots[viewport]}`);
});

console.log('\n📋 VISUAL COMPARISON CHECKLIST:');
console.log('===============================');
console.log('□ Hero text size - should be moderate, not huge');
console.log('□ Font weight - should be light (200-300), not ultra-thin');
console.log('□ Line height - should be tight but readable (1.1-1.2)');
console.log('□ Letter spacing - should be slightly negative (-0.02em)');
console.log('□ Text opacity - should be high (0.95+)');
console.log('□ Showreel positioning - should be centered in video thumbnail');
console.log('□ Video thumbnail styling - should have subtle rounded corners');
console.log('□ Overall proportions - should match Sam Kolder\'s layout');

console.log('\n🎯 COMPARISON INSTRUCTIONS:');
console.log('===========================');
console.log('1. Open both screenshots side by side');
console.log('2. Compare text size - is ours too big/small?');
console.log('3. Compare font weight - is ours too light/bold?');
console.log('4. Compare spacing - is ours too tight/loose?');
console.log('5. Compare positioning - are elements in right places?');
console.log('6. Note specific differences and required adjustments');

console.log('\n💡 TIP: Always compare with Sam Kolder reference before making changes!');



