#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

// Check if we want solo mode or comparison mode
const mode = process.argv[2] || 'comparison';

if (mode === 'solo') {
  console.log(`
🎯 SOLO MODE - JUST OUR SITE
============================
`);
  
  try {
    // Step 1: Take screenshot of just our site
    console.log(`📸 Taking screenshot of our site...`);
    execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
    
    // Step 2: Find the latest desktop screenshot and open it directly
    console.log(`👀 Opening solo screenshot...`);
    const files = fs.readdirSync('screenshots/current');
    const latestDesktop = files
      .filter(file => file.startsWith('bulletproof-desktop-'))
      .sort()
      .pop();
    
    if (latestDesktop) {
      execSync(`open screenshots/current/${latestDesktop}`, { stdio: 'inherit' });
      console.log(`✅ Solo screenshot opened: ${latestDesktop}`);
    }
    
    console.log(`
✅ DONE!
=====
- Screenshot taken of our site
- Solo screenshot opened
- Perfect for refining animations and details
- No comparison needed - just focus on our site
`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
  
} else {
  console.log(`
🎯 COMPARISON MODE - OUR SITE vs SAM KOLDER
==========================================
`);
  
  try {
    // Step 1: Take screenshot
    console.log(`📸 Taking screenshot...`);
    execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
    
    // Step 2: Update HTML file with latest screenshot
    console.log(`🔧 Updating HTML with latest screenshot...`);
    const files = fs.readdirSync('screenshots/current');
    const latestDesktop = files
      .filter(file => file.startsWith('bulletproof-desktop-'))
      .sort()
      .pop();
    
    if (latestDesktop) {
      const htmlPath = 'screenshots/current/side-by-side-comparison.html';
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');
      htmlContent = htmlContent.replace(
        /src="bulletproof-desktop-\d+\.png"/g,
        `src="${latestDesktop}"`
      );
      fs.writeFileSync(htmlPath, htmlContent);
      console.log(`✅ Updated HTML to use: ${latestDesktop}`);
    }
    
    // Step 3: Generate comparison
    console.log(`📊 Generating comparison...`);
    execSync('node tools/scripts/screenshot-html-comparison.js', { stdio: 'inherit' });
    
    // Step 4: Open the comparison so you can see it
    console.log(`👀 Opening comparison...`);
    const comparisonFiles = fs.readdirSync('screenshots/current');
    const latestComparison = comparisonFiles
      .filter(file => file.startsWith('html-comparison-'))
      .sort()
      .pop();
    
    if (latestComparison) {
      execSync(`open screenshots/current/${latestComparison}`, { stdio: 'inherit' });
      console.log(`✅ Comparison opened: ${latestComparison}`);
    }
    
    console.log(`
✅ DONE!
=====
- Screenshot taken
- Comparison generated  
- Comparison opened
- You can now see if your changes worked
`);
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}