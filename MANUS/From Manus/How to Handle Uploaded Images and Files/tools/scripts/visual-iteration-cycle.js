import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 VISUAL ITERATION CYCLE');
console.log('=========================\n');

async function runVisualIterationCycle(iterationNumber = 1) {
  const timestamp = Date.now();
  
  console.log(`🎯 Starting Iteration ${iterationNumber}`);
  console.log('=====================================\n');
  
  try {
    // Step 1: Take screenshot of current site
    console.log('📸 Step 1: Taking screenshot of current site...');
    execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
    
    // Step 2: Get the latest screenshot filename
    const currentDir = path.join(__dirname, '../../screenshots/current');
    const files = fs.readdirSync(currentDir);
    const latestScreenshot = files
      .filter(file => file.startsWith('bulletproof-desktop-') && file.endsWith('.png'))
      .sort()
      .pop();
    
    console.log(`✅ Latest screenshot: ${latestScreenshot}\n`);
    
    // Step 3: Update side-by-side comparison HTML
    console.log('🔄 Step 2: Updating side-by-side comparison...');
    const htmlPath = path.join(currentDir, 'side-by-side-comparison.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Update the screenshot reference
    htmlContent = htmlContent.replace(
      /src="bulletproof-desktop-\d+\.png"/,
      `src="${latestScreenshot}"`
    );
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log('✅ Side-by-side comparison updated\n');
    
    // Step 4: Screenshot the HTML comparison
    console.log('📸 Step 3: Screenshotting HTML comparison...');
    execSync('node tools/scripts/screenshot-html-comparison.js', { stdio: 'inherit' });
    
    // Step 5: Get the latest HTML comparison screenshot
    const htmlComparisonFiles = files
      .filter(file => file.startsWith('html-comparison-') && file.endsWith('.png'))
      .sort()
      .pop();
    
    console.log(`✅ HTML comparison screenshot: ${htmlComparisonFiles}\n`);
    
    // Step 6: Create analysis summary
    const analysisSummary = `
## 🔍 ITERATION ${iterationNumber} ANALYSIS

### 📸 Screenshots Generated:
- Current Site: ${latestScreenshot}
- HTML Comparison: ${htmlComparisonFiles}

### 🎯 Next Steps:
1. **VISUAL ANALYSIS**: Open the HTML comparison screenshot
2. **USE CHECKLIST**: Follow the comparison checklist
3. **LOG OBSERVATIONS**: Note what needs to be fixed
4. **APPLY FIXES**: Make targeted CSS/HTML changes
5. **RUN NEXT ITERATION**: Execute this script again

### 📋 Analysis Checklist:
- [ ] Hero text size and condensation
- [ ] Video thumbnail styling and positioning
- [ ] Showreel visibility and centering
- [ ] Meta information spacing
- [ ] Overall aesthetic matching

### 🔄 To Run Next Iteration:
\`\`\`bash
node tools/scripts/visual-iteration-cycle.js ${iterationNumber + 1}
\`\`\`
`;

    // Save analysis summary
    const summaryPath = path.join(__dirname, `../../docs/analysis/iteration-${iterationNumber}-summary.md`);
    fs.writeFileSync(summaryPath, analysisSummary);
    
    console.log('✅ Iteration cycle complete!');
    console.log(`📝 Analysis summary saved: iteration-${iterationNumber}-summary.md`);
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Open the HTML comparison screenshot');
    console.log('2. Analyze using the checklist');
    console.log('3. Make targeted fixes');
    console.log('4. Run next iteration when ready');
    console.log(`\n🔄 To run next iteration: node tools/scripts/visual-iteration-cycle.js ${iterationNumber + 1}`);
    
  } catch (error) {
    console.error('❌ Error in iteration cycle:', error);
  }
}

// Get iteration number from command line or default to 1
const iterationNumber = parseInt(process.argv[2]) || 1;
runVisualIterationCycle(iterationNumber);



