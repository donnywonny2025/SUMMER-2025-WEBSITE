#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log(`🎯 SEE CHANGES - ONE FILE THAT WORKS`);

try {
  // Take screenshot
  console.log(`📸 Taking screenshot...`);
  execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
  
  // Get the latest screenshot file
  const files = fs.readdirSync('screenshots/current');
  const latestDesktop = files
    .filter(file => file.startsWith('bulletproof-desktop-'))
    .sort()
    .pop();
  
  // Create simple HTML comparison with latest screenshot
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Our Site vs Sam Kolder</title>
    <style>
        body { margin: 0; padding: 20px; background: #1a1a1a; color: white; font-family: monospace; }
        .container { display: flex; gap: 20px; }
        .panel { flex: 1; }
        .panel img { width: 100%; border: 2px solid #333; }
        .our-site { border-color: #4CAF50; }
        .sam-reference { border-color: #2196F3; }
        h2 { text-align: center; }
    </style>
</head>
<body>
    <h1>Our Site vs Sam Kolder</h1>
    <div class="container">
        <div class="panel our-site">
            <h2>Our Site</h2>
            <img src="${latestDesktop}" alt="Our Site">
        </div>
        <div class="panel sam-reference">
            <h2>Sam Kolder</h2>
            <img src="../sam-reference/sam-desktop.png" alt="Sam Kolder">
        </div>
    </div>
</body>
</html>`;
  
  // Write the HTML file
  fs.writeFileSync('screenshots/current/comparison.html', htmlContent);
  
  // Take screenshot of the comparison
  console.log(`📊 Creating comparison...`);
  execSync('node tools/scripts/screenshot-html-comparison.js', { stdio: 'inherit' });
  
  // Open the comparison
  const comparisonFiles = fs.readdirSync('screenshots/current');
  const latestComparison = comparisonFiles
    .filter(file => file.startsWith('html-comparison-'))
    .sort()
    .pop();
  
  if (latestComparison) {
    execSync(`open screenshots/current/${latestComparison}`, { stdio: 'inherit' });
    console.log(`✅ Done! Comparison opened.`);
  }
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
