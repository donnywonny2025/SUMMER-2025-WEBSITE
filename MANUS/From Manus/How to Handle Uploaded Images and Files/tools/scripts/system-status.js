#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🎯 VISUAL DESIGN SYSTEM STATUS');
console.log('==============================\n');

// Check if dev server is running
console.log('🌐 DEV SERVER STATUS:');
try {
  const response = await fetch('http://localhost:3000');
  if (response.ok) {
    console.log('   ✅ Dev server running on port 3000');
  } else {
    console.log('   ❌ Dev server not responding');
  }
} catch (e) {
  console.log('   ❌ Dev server not running');
}

// Check latest screenshots
console.log('\n📸 LATEST SCREENSHOTS:');
const currentDir = path.join(process.cwd(), 'screenshots', 'current');
if (fs.existsSync(currentDir)) {
  const files = fs.readdirSync(currentDir);
  const screenshots = files.filter(f => f.startsWith('bulletproof-') && f.endsWith('.png'));
  if (screenshots.length > 0) {
    const latest = screenshots.sort().pop();
    console.log(`   ✅ Latest: ${latest}`);
  } else {
    console.log('   ❌ No screenshots found');
  }
} else {
  console.log('   ❌ Screenshots directory not found');
}

// Check Sam Kolder reference
console.log('\n🎯 SAM KOLDER REFERENCE:');
const samDir = path.join(process.cwd(), 'screenshots', 'sam-reference');
if (fs.existsSync(samDir)) {
  const files = fs.readdirSync(samDir);
  const samFiles = files.filter(f => f.endsWith('.png'));
  console.log(`   ✅ Reference files: ${samFiles.join(', ')}`);
} else {
  console.log('   ❌ Sam Kolder reference not found');
}

// Check active sessions
console.log('\n🔄 ACTIVE SESSIONS:');
const sessionsDir = path.join(process.cwd(), 'screenshots', 'change-sessions');
if (fs.existsSync(sessionsDir)) {
  const sessions = fs.readdirSync(sessionsDir).filter(f => f.startsWith('session-'));
  if (sessions.length > 0) {
    console.log(`   ✅ Active sessions: ${sessions.length}`);
    sessions.forEach(session => {
      const sessionDir = path.join(sessionsDir, session);
      const dataFile = path.join(sessionDir, 'enhanced-session-data.json');
      if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        console.log(`      - ${session}: ${data.changeDescription}`);
      }
    });
  } else {
    console.log('   ❌ No active sessions');
  }
} else {
  console.log('   ❌ Sessions directory not found');
}

// Check HTML comparison
console.log('\n🔍 HTML COMPARISON:');
const htmlFile = path.join(process.cwd(), 'screenshots', 'current', 'side-by-side-comparison.html');
if (fs.existsSync(htmlFile)) {
  console.log('   ✅ HTML comparison available');
  console.log('   📄 Run: open screenshots/current/side-by-side-comparison.html');
} else {
  console.log('   ❌ HTML comparison not found');
  console.log('   🔧 Run: node tools/analysis/side-by-side-comparison.js');
}

console.log('\n🎯 QUICK COMMANDS:');
console.log('   📸 Take screenshots: node tools/scripts/bulletproof-screenshot.js');
console.log('   🔍 Generate comparison: node tools/analysis/side-by-side-comparison.js');
console.log('   📊 Visual analysis: node tools/analysis/comprehensive-visual-analysis.js');
console.log('   🎯 Start session: node -e "import EnhancedVisualTracker from \'./tools/scripts/enhanced-visual-tracker.js\'; const tracker = new EnhancedVisualTracker(); await tracker.startChangeSession(\'Description\', \'Goal\'); await tracker.captureBeforeState();"');

console.log('\n✅ SYSTEM READY FOR VISUAL DESIGN WORK!');
