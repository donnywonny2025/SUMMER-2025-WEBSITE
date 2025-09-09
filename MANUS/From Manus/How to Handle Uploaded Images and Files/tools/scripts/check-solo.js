#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log(`
🎯 SOLO MODE - JUST OUR SITE
============================
`);

try {
  // Step 1: Take screenshot of just our site
  console.log(`📸 Taking screenshot of our site...`);
  execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
  
  // Step 2: Create a simple HTML viewer for just our site
  console.log(`🔧 Creating solo viewer...`);
  const files = fs.readdirSync('screenshots/current');
  const latestDesktop = files
    .filter(file => file.startsWith('bulletproof-desktop-'))
    .sort()
    .pop();
  
  if (latestDesktop) {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Our Site - Solo View</title>
    <style>
        body { 
            margin: 0; 
            padding: 20px; 
            background: #f0f0f0; 
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: #333;
            color: white;
            padding: 15px 20px;
            text-align: center;
        }
        .screenshot {
            width: 100%;
            height: auto;
            display: block;
        }
        .info {
            padding: 20px;
            background: #f8f9fa;
            border-top: 1px solid #dee2e6;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Our Site - Solo View</h1>
            <p>Focus on our site for refinement work</p>
        </div>
        <img src="${latestDesktop}" alt="Our Site Screenshot" class="screenshot">
        <div class="info">
            <p><strong>Screenshot:</strong> ${latestDesktop}</p>
            <p><strong>Mode:</strong> Solo (no comparison)</p>
            <p><strong>Use this when:</strong> Refining animations, spacing, colors, or other details on our site</p>
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync('screenshots/current/solo-view.html', htmlContent);
    console.log(`✅ Created solo viewer with: ${latestDesktop}`);
  }
  
  // Step 3: Take screenshot of the HTML viewer
  console.log(`📸 Taking screenshot of solo view...`);
  execSync('node tools/scripts/screenshot-html-solo.js', { stdio: 'inherit' });
  
  // Step 4: Open the solo view
  console.log(`👀 Opening solo view...`);
  const soloFiles = fs.readdirSync('screenshots/current');
  const latestSolo = soloFiles
    .filter(file => file.startsWith('solo-view-'))
    .sort()
    .pop();
  
  if (latestSolo) {
    execSync(`open screenshots/current/${latestSolo}`, { stdio: 'inherit' });
    console.log(`✅ Solo view opened: ${latestSolo}`);
  }
  
  console.log(`
✅ DONE!
=====
- Screenshot taken of our site
- Solo viewer created
- Solo view opened
- Perfect for refining animations and details
`);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}


