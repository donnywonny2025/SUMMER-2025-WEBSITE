const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function developmentWorkflow() {
  log('🚀 JEFFREY KERR PORTFOLIO - DEVELOPMENT WORKFLOW', 'cyan');
  log('=' .repeat(50), 'cyan');
  
  try {
    // 1. Check if dev server is running
    log('\n1. 🔍 Checking development server...', 'yellow');
    try {
      const response = await fetch('http://localhost:3000');
      if (response.ok) {
        log('✅ Dev server is running on http://localhost:3000', 'green');
      } else {
        log('❌ Dev server responded with error', 'red');
        return;
      }
    } catch (error) {
      log('❌ Dev server is not running. Please start with: npm run dev', 'red');
      return;
    }

    // 2. Take screenshots
    log('\n2. 📸 Capturing screenshots...', 'yellow');
    await runCommand('npm run screenshot');
    log('✅ Screenshots captured', 'green');

    // 3. Run visual analysis
    log('\n3. 🔍 Running visual analysis...', 'yellow');
    await runCommand('npm run analyze');
    log('✅ Visual analysis complete', 'green');

    // 4. Check for recent changes
    log('\n4. 📊 Recent screenshots:', 'yellow');
    const screenshotsDir = path.join(__dirname, '../screenshots');
    const files = fs.readdirSync(screenshotsDir)
      .filter(file => file.endsWith('.png'))
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(screenshotsDir, file)).mtime
      }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);

    files.forEach((file, index) => {
      const timeAgo = Math.round((Date.now() - file.time.getTime()) / 1000 / 60);
      log(`  ${index + 1}. ${file.name} (${timeAgo} min ago)`, 'blue');
    });

    // 5. Development tips
    log('\n5. 💡 Development Commands:', 'yellow');
    log('  npm run screenshot    - Quick screenshots', 'blue');
    log('  npm run analyze       - Detailed analysis', 'blue');
    log('  npm run visual-test   - Basic visual test', 'blue');
    log('  node scripts/dev-workflow.js - This workflow', 'blue');

    log('\n🎉 Workflow complete! Check screenshots folder for results.', 'green');
    
  } catch (error) {
    log(`\n❌ Workflow error: ${error.message}`, 'red');
  }
}

// Run the workflow
developmentWorkflow().catch(console.error);