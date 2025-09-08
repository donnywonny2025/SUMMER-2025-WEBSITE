#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log(`
🎯 ROBUST SCREENSHOT SYSTEM - NO CACHE ISSUES
=============================================
`);

// Function to clean old screenshots before taking new ones
function cleanOldScreenshots() {
  const screenshotsDir = 'screenshots/current';
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
    return;
  }
  
  const files = fs.readdirSync(screenshotsDir);
  
  // Delete all old bulletproof screenshots
  const bulletproofFiles = files.filter(file => file.startsWith('bulletproof-'));
  bulletproofFiles.forEach(file => {
    try {
      fs.unlinkSync(path.join(screenshotsDir, file));
      console.log(`🗑️  Deleted old screenshot: ${file}`);
    } catch (error) {
      console.log(`⚠️  Could not delete ${file}: ${error.message}`);
    }
  });
  
  // Delete old HTML comparisons
  const htmlFiles = files.filter(file => file.startsWith('html-comparison-'));
  htmlFiles.forEach(file => {
    try {
      fs.unlinkSync(path.join(screenshotsDir, file));
      console.log(`🗑️  Deleted old comparison: ${file}`);
    } catch (error) {
      console.log(`⚠️  Could not delete ${file}: ${error.message}`);
    }
  });
}

// Function to verify server is running
function verifyServer() {
  console.log(`🔍 Verifying dev server...`);
  
  try {
    // Test if server responds
    execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { stdio: 'pipe' });
    console.log(`✅ Server is running on port 3000`);
    return true;
  } catch (error) {
    console.log(`❌ Server not responding on port 3000`);
    return false;
  }
}

// Function to take fresh screenshots
function takeFreshScreenshots() {
  const timestamp = Date.now();
  
  console.log(`📸 Taking fresh screenshots with timestamp: ${timestamp}`);
  
  try {
    // Use the bulletproof screenshot system
    execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
    
    // Verify screenshots were created
    const screenshotsDir = 'screenshots/current';
    const files = fs.readdirSync(screenshotsDir);
    const newScreenshots = files.filter(file => file.includes(timestamp.toString()));
    
    if (newScreenshots.length === 0) {
      throw new Error('No new screenshots were created');
    }
    
    console.log(`✅ Created ${newScreenshots.length} fresh screenshots`);
    return newScreenshots;
    
  } catch (error) {
    console.error(`❌ Error taking screenshots: ${error.message}`);
    throw error;
  }
}

// Main execution
try {
  console.log(`🧹 Cleaning old screenshots...`);
  cleanOldScreenshots();
  
  console.log(`🔍 Verifying server...`);
  if (!verifyServer()) {
    throw new Error('Dev server is not running. Please start it with: npm run dev');
  }
  
  console.log(`📸 Taking fresh screenshots...`);
  const newScreenshots = takeFreshScreenshots();
  
  console.log(`
✅ ROBUST SCREENSHOTS COMPLETE!
==============================
- Old screenshots cleaned
- Server verified
- Fresh screenshots taken
- No cache issues possible

New screenshots:
${newScreenshots.map(s => `  - ${s}`).join('\n')}
`);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
