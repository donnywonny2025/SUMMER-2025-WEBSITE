#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log(`
🎯 RELIABLE WORKFLOW - NO BUGS, NO CACHE ISSUES
===============================================
`);

// Function to ensure clean server state
function ensureCleanServer() {
  console.log(`🧹 Ensuring clean server state...`);
  
  try {
    // Kill any existing servers
    try {
      const pids = execSync('lsof -ti:3000', { encoding: 'utf8' }).trim();
      if (pids) {
        const pidArray = pids.split('\n').filter(pid => pid.trim());
        pidArray.forEach(pid => {
          try {
            execSync(`kill -9 ${pid}`, { stdio: 'pipe' });
          } catch (e) {
            // Ignore errors if process already dead
          }
        });
        console.log(`✅ Killed existing servers`);
      }
    } catch (error) {
      // No servers running, that's fine
      console.log(`ℹ️  No existing servers to kill`);
    }
    
    // Start fresh server
    console.log(`🚀 Starting fresh dev server...`);
    execSync('npm run dev &', { stdio: 'inherit' });
    
    // Wait for server to start
    console.log(`⏳ Waiting for server to start...`);
    execSync('sleep 3', { stdio: 'inherit' });
    
    // Verify server is running
    execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { stdio: 'pipe' });
    console.log(`✅ Server is running and responding`);
    
  } catch (error) {
    console.error(`❌ Server setup failed: ${error.message}`);
    throw error;
  }
}

// Function to take reliable screenshots
function takeReliableScreenshots() {
  console.log(`📸 Taking reliable screenshots...`);
  
  try {
    // Clean old screenshots first
    const screenshotsDir = 'screenshots/current';
    if (fs.existsSync(screenshotsDir)) {
      const files = fs.readdirSync(screenshotsDir);
      files.forEach(file => {
        if (file.startsWith('bulletproof-') || file.startsWith('html-comparison-')) {
          fs.unlinkSync(`${screenshotsDir}/${file}`);
        }
      });
      console.log(`🗑️  Cleaned old screenshots`);
    }
    
    // Take fresh screenshots
    execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
    console.log(`✅ Fresh screenshots taken`);
    
  } catch (error) {
    console.error(`❌ Screenshot failed: ${error.message}`);
    throw error;
  }
}

// Function to generate reliable comparison
function generateReliableComparison() {
  console.log(`📊 Generating reliable comparison...`);
  
  try {
    // Generate fresh comparison
    execSync('node tools/scripts/robust-comparison-generator.js', { stdio: 'inherit' });
    console.log(`✅ Reliable comparison generated`);
    
  } catch (error) {
    console.error(`❌ Comparison generation failed: ${error.message}`);
    throw error;
  }
}

// Main workflow
try {
  console.log(`🎯 Starting reliable workflow...`);
  
  ensureCleanServer();
  takeReliableScreenshots();
  generateReliableComparison();
  
  console.log(`
✅ RELIABLE WORKFLOW COMPLETE!
==============================
- Clean server state ensured
- Fresh screenshots taken
- Reliable comparison generated
- No cache issues possible
- System is ready for visual analysis

📁 Latest files:
- Screenshots: screenshots/current/bulletproof-*.png
- Comparison: screenshots/current/html-comparison-*.png
- HTML: screenshots/current/side-by-side-comparison.html
`);
  
} catch (error) {
  console.error(`❌ Workflow failed: ${error.message}`);
  process.exit(1);
}
