import { PNG } from 'pngjs';
import fs from 'fs';

const viewportSizes = [320, 768, 1024, 1920];

console.log('🔍 Analyzing Screenshot Dimensions\n');

viewportSizes.forEach(viewportWidth => {
  const samPath = `tests/screenshots/baseline/sam/sam_${viewportWidth}px.png`;
  const ourPath = `tests/screenshots/baseline/home_${viewportWidth}px.png`;
  
  if (fs.existsSync(samPath) && fs.existsSync(ourPath)) {
    const samImage = PNG.sync.read(fs.readFileSync(samPath));
    const ourImage = PNG.sync.read(fs.readFileSync(ourPath));
    
    console.log(`📱 ${viewportWidth}px viewport:`);
    console.log(`   Sam Kolder: ${samImage.width}x${samImage.height} (${(fs.statSync(samPath).size / 1024).toFixed(1)}KB)`);
    console.log(`   Our Site:   ${ourImage.width}x${ourImage.height} (${(fs.statSync(ourPath).size / 1024).toFixed(1)}KB)`);
    console.log(`   Height Diff: ${ourImage.height - samImage.height}px (${((ourImage.height - samImage.height) / samImage.height * 100).toFixed(1)}% taller)`);
    console.log('');
  }
});
