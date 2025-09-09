import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 ENHANCED ITERATION CYCLE WITH MEMORY');
console.log('=======================================\n');

// Load memory system
const memoryPath = path.join(__dirname, '../../docs/analysis/iteration-memory.json');

function loadMemory() {
  if (fs.existsSync(memoryPath)) {
    try {
      const data = fs.readFileSync(memoryPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { iterations: [], currentIteration: 0 };
    }
  }
  return { iterations: [], currentIteration: 0 };
}

function saveMemory(memory) {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

function recordIteration(iterationNumber, observations, changes, results, status) {
  const memory = loadMemory();
  
  const iteration = {
    number: iterationNumber,
    timestamp: new Date().toISOString(),
    observations: observations,
    changes: changes,
    results: results,
    status: status,
    screenshots: {
      current: `bulletproof-desktop-${Date.now()}.png`,
      comparison: `html-comparison-${Date.now()}.png`
    }
  };
  
  memory.iterations.push(iteration);
  memory.currentIteration = iterationNumber;
  
  saveMemory(memory);
  
  console.log(`📝 Iteration ${iterationNumber} recorded in memory`);
  return iteration;
}

function getPreviousIteration() {
  const memory = loadMemory();
  if (memory.iterations.length > 0) {
    return memory.iterations[memory.iterations.length - 1];
  }
  return null;
}

function showPreviousIteration() {
  const previous = getPreviousIteration();
  if (previous) {
    console.log('\n🧠 PREVIOUS ITERATION MEMORY:');
    console.log('=============================');
    console.log(`Iteration: ${previous.number}`);
    console.log(`Status: ${previous.status}`);
    console.log('\n🔍 Previous Observations:');
    previous.observations.forEach((obs, index) => {
      console.log(`  ${index + 1}. ${obs}`);
    });
    console.log('\n🔧 Previous Changes:');
    previous.changes.forEach((change, index) => {
      console.log(`  ${index + 1}. ${change}`);
    });
    console.log('\n📊 Previous Results:');
    previous.results.forEach((result, index) => {
      console.log(`  ${index + 1}. ${result}`);
    });
    console.log('');
  }
}

async function runEnhancedIterationCycle(iterationNumber = 1) {
  const timestamp = Date.now();
  
  console.log(`🎯 Starting Enhanced Iteration ${iterationNumber}`);
  console.log('===============================================\n');
  
  // Show previous iteration memory
  showPreviousIteration();
  
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
    
    // Step 6: Open HTML comparison for visual analysis
    console.log('👁️ Step 4: Opening HTML comparison for visual analysis...');
    execSync('open screenshots/current/side-by-side-comparison.html', { stdio: 'inherit' });
    
    // Step 7: Create analysis summary with memory integration
    const analysisSummary = `
## 🧠 ENHANCED ITERATION ${iterationNumber} ANALYSIS

### 📸 Screenshots Generated:
- Current Site: ${latestScreenshot}
- HTML Comparison: ${htmlComparisonFiles}

### 🧠 Memory Context:
${getPreviousIteration() ? `Previous Iteration: ${getPreviousIteration().number} (${getPreviousIteration().status})` : 'First iteration'}

### 🎯 Visual Analysis Instructions:
1. **OPEN HTML COMPARISON**: The side-by-side comparison should now be open
2. **ANALYZE DIFFERENCES**: Compare our site (left) with Sam Kolder's reference (right)
3. **IDENTIFY ISSUES**: Note specific problems that need fixing
4. **RECORD OBSERVATIONS**: Document what you see
5. **MAKE TARGETED FIXES**: Apply specific changes based on analysis
6. **RECORD IN MEMORY**: Save this iteration's results for next time

### 📋 Analysis Checklist:
- [ ] Hero text size and condensation vs Sam's
- [ ] Video thumbnail size and positioning vs Sam's
- [ ] Showreel visibility and centering vs Sam's
- [ ] Meta information spacing and styling vs Sam's
- [ ] Overall aesthetic and proportions vs Sam's

### 🔄 To Run Next Iteration:
\`\`\`bash
node tools/scripts/enhanced-iteration-cycle.js ${iterationNumber + 1}
\`\`\`

### 🧠 Memory Integration:
- Previous iterations are automatically loaded
- Changes and results are tracked
- Avoid repeating failed approaches
- Build on successful changes
`;

    // Save analysis summary
    const summaryPath = path.join(__dirname, `../../docs/analysis/enhanced-iteration-${iterationNumber}-summary.md`);
    fs.writeFileSync(summaryPath, analysisSummary);
    
    console.log('✅ Enhanced iteration cycle complete!');
    console.log(`📝 Analysis summary saved: enhanced-iteration-${iterationNumber}-summary.md`);
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Analyze the HTML comparison (should be open)');
    console.log('2. Identify specific issues that need fixing');
    console.log('3. Make targeted changes based on what you see');
    console.log('4. Record observations and results in memory');
    console.log('5. Run next iteration when ready');
    console.log(`\n🔄 To run next iteration: node tools/scripts/enhanced-iteration-cycle.js ${iterationNumber + 1}`);
    
  } catch (error) {
    console.error('❌ Error in enhanced iteration cycle:', error);
  }
}

// Get iteration number from command line or default to 1
const iterationNumber = parseInt(process.argv[2]) || 1;
runEnhancedIterationCycle(iterationNumber);



