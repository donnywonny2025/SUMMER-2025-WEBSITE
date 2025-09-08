#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log(`
🎯 ROBUST COMPARISON GENERATOR - NO CACHE ISSUES
===============================================
`);

// Function to get the latest screenshot file
function getLatestScreenshot(pattern) {
  const screenshotsDir = 'screenshots/current';
  const files = fs.readdirSync(screenshotsDir);
  
  // Filter files matching the pattern and sort by modification time
  const matchingFiles = files
    .filter(file => file.includes(pattern))
    .map(file => ({
      name: file,
      path: path.join(screenshotsDir, file),
      mtime: fs.statSync(path.join(screenshotsDir, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime); // Newest first
  
  if (matchingFiles.length === 0) {
    throw new Error(`No screenshots found matching pattern: ${pattern}`);
  }
  
  return matchingFiles[0].name;
}

// Function to clean old screenshots (keep only last 3)
function cleanOldScreenshots() {
  const screenshotsDir = 'screenshots/current';
  const files = fs.readdirSync(screenshotsDir);
  
  // Get all bulletproof screenshots
  const bulletproofFiles = files
    .filter(file => file.startsWith('bulletproof-'))
    .map(file => ({
      name: file,
      path: path.join(screenshotsDir, file),
      mtime: fs.statSync(path.join(screenshotsDir, file)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime); // Newest first
  
  // Keep only the 3 most recent, delete the rest
  const filesToDelete = bulletproofFiles.slice(3);
  filesToDelete.forEach(file => {
    try {
      fs.unlinkSync(file.path);
      console.log(`🗑️  Deleted old screenshot: ${file.name}`);
    } catch (error) {
      console.log(`⚠️  Could not delete ${file.name}: ${error.message}`);
    }
  });
}

// Function to generate fresh comparison HTML
function generateComparisonHTML() {
  try {
    // Get the latest screenshots
    const latestDesktop = getLatestScreenshot('bulletproof-desktop-');
    const latestMobile = getLatestScreenshot('bulletproof-mobile-');
    const latestLarge = getLatestScreenshot('bulletproof-large-');
    
    console.log(`📸 Using latest screenshots:`);
    console.log(`   Desktop: ${latestDesktop}`);
    console.log(`   Mobile: ${latestMobile}`);
    console.log(`   Large: ${latestLarge}`);
    
    // Generate HTML with latest screenshots
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
        .timestamp {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="instructions">
        <h1>🎯 Side-by-Side Visual Comparison</h1>
        <p><strong>Left:</strong> Our Current Site | <strong>Right:</strong> Sam Kolder Reference</p>
        <p>Compare typography, spacing, alignment, and overall design quality.</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    </div>

    <div class="comparison-container">
        <div class="screenshot-panel our-site">
            <h2>🟢 Our Current Site</h2>
            <img src="${latestDesktop}" alt="Our Current Site">
        </div>
        
        <div class="screenshot-panel sam-reference">
            <h2>🔵 Sam Kolder Reference</h2>
            <img src="../sam-reference/sam-desktop.png" alt="Sam Kolder Reference">
        </div>
    </div>
    
    <div class="timestamp">
        Last updated: ${new Date().toISOString()}
    </div>
</body>
</html>`;

    // Write the HTML file
    const htmlPath = 'screenshots/current/side-by-side-comparison.html';
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`✅ Generated fresh comparison HTML: ${htmlPath}`);
    
    return htmlPath;
    
  } catch (error) {
    console.error(`❌ Error generating comparison: ${error.message}`);
    throw error;
  }
}

// Main execution
try {
  console.log(`🧹 Cleaning old screenshots...`);
  cleanOldScreenshots();
  
  console.log(`📝 Generating fresh comparison HTML...`);
  const htmlPath = generateComparisonHTML();
  
  console.log(`📸 Taking screenshot of comparison...`);
  execSync(`node tools/scripts/screenshot-html-comparison.js`, { stdio: 'inherit' });
  
  console.log(`
✅ ROBUST COMPARISON COMPLETE!
=============================
- Old screenshots cleaned
- Fresh HTML generated with latest screenshots
- Comparison screenshot taken
- No cache issues possible
`);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
