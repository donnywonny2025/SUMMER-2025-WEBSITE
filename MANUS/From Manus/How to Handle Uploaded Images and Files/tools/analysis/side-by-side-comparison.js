import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 SIDE-BY-SIDE VISUAL COMPARISON');
console.log('==================================\n');

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

console.log('📱 CURRENT SCREENSHOTS:');
const currentScreenshots = findLatestScreenshots(currentDir);
Object.keys(currentScreenshots).forEach(viewport => {
  const fullPath = path.join(currentDir, currentScreenshots[viewport]);
  console.log(`   ${viewport}: ${currentScreenshots[viewport]}`);
  console.log(`   Path: ${fullPath}`);
});

console.log('\n🎯 SAM KOLDER REFERENCE:');
const samScreenshots = findLatestScreenshots(samDir);
Object.keys(samScreenshots).forEach(viewport => {
  const fullPath = path.join(samDir, samScreenshots[viewport]);
  console.log(`   ${viewport}: ${samScreenshots[viewport]}`);
  console.log(`   Path: ${fullPath}`);
});

console.log('\n🔍 SIDE-BY-SIDE COMPARISON INSTRUCTIONS:');
console.log('=========================================');
console.log('1. Open both screenshots in separate browser tabs');
console.log('2. Position them side by side on your screen');
console.log('3. Compare these specific elements:');
console.log('');
console.log('   📝 HERO TEXT:');
console.log('   - Size: Is our text too big/small compared to Sam\'s?');
console.log('   - Weight: Is our font too light/bold?');
console.log('   - Spacing: Is our line height too tight/loose?');
console.log('   - Position: Is our text positioned correctly?');
console.log('');
console.log('   📍 META INFORMATION:');
console.log('   - Location text: Size, weight, spacing');
console.log('   - Email text: Size, weight, spacing');
console.log('   - Icons: Size, positioning, visibility');
console.log('   - Overall spacing between elements');
console.log('');
console.log('   🎬 SHOWREEL:');
console.log('   - Position: Is it centered in the video thumbnail?');
console.log('   - Size: Is it the right size?');
console.log('   - Styling: Does it match Sam\'s aesthetic?');
console.log('');
console.log('   🎥 VIDEO THUMBNAIL:');
console.log('   - Position: Is it in the right location?');
console.log('   - Styling: Border radius, shadows, effects');
console.log('   - Size: Is it the right proportions?');
console.log('');
console.log('4. Note specific differences and what needs to be changed');
console.log('5. Report back with specific observations');

console.log('\n💡 CRITICAL: Look at the ACTUAL visual differences, not assumptions!');
console.log('   If you can\'t see clear differences, the changes may not be working.');

// Generate updated HTML comparison file
if (currentScreenshots.desktop) {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Side-by-Side Comparison: Our Site vs Sam Kolder</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: white;
            font-family: 'Space Mono', monospace;
        }
        .comparison-container {
            display: flex;
            gap: 20px;
            max-width: 100%;
            overflow-x: auto;
            min-height: 100vh;
        }
        .screenshot-panel {
            flex: 1;
            min-width: 400px;
            width: 50%;
        }
        .screenshot-panel h2 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 300;
        }
        .screenshot-panel img {
            width: 100%;
            height: auto;
            border: 2px solid #333;
            border-radius: 8px;
        }
        .our-site {
            border-color: #4CAF50;
        }
        .sam-reference {
            border-color: #2196F3;
        }
        .instructions {
            margin-bottom: 20px;
            padding: 20px;
            background: #2a2a2a;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="instructions">
        <h1>🔍 Side-by-Side Visual Comparison</h1>
        <p><strong>Left:</strong> Our Current Site | <strong>Right:</strong> Sam Kolder Reference</p>
        <p>Compare typography, spacing, alignment, and overall design quality.</p>
    </div>

    <div class="comparison-container">
        <div class="screenshot-panel our-site">
            <h2>🟢 Our Current Site</h2>
            <img src="${currentScreenshots.desktop}" alt="Our Current Site">
        </div>
        
        <div class="screenshot-panel sam-reference">
            <h2>🔵 Sam Kolder Reference</h2>
            <img src="../sam-reference/sam-desktop.png" alt="Sam Kolder Reference">
        </div>
    </div>
</body>
</html>`;

  const htmlPath = path.join(currentDir, 'side-by-side-comparison.html');
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`\n✅ HTML comparison updated with latest screenshots!`);
  console.log(`📄 File: ${htmlPath}`);
}
