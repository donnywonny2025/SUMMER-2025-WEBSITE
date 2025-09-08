#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎯 THREE-WAY COMPARISON SYSTEM');
console.log('==============================\n');

class ThreeWayComparison {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'screenshots');
    this.currentDir = path.join(this.baseDir, 'current');
    this.samDir = path.join(this.baseDir, 'sam-reference');
    this.sessionsDir = path.join(this.baseDir, 'change-sessions');
  }

  async generateThreeWayComparison(sessionId) {
    console.log('🔄 GENERATING THREE-WAY COMPARISON');
    console.log('==================================');
    
    // Get session data
    const sessionDataPath = path.join(this.sessionsDir, sessionId, 'enhanced-session-data.json');
    if (!fs.existsSync(sessionDataPath)) {
      throw new Error(`Session data not found: ${sessionDataPath}`);
    }
    
    const sessionData = JSON.parse(fs.readFileSync(sessionDataPath, 'utf8'));
    
    // Get before and after screenshots
    const beforeDesktop = sessionData.beforeScreenshots.desktop;
    const afterDesktop = sessionData.afterScreenshots.desktop;
    
    if (!beforeDesktop || !afterDesktop) {
      throw new Error('Before or after screenshots not found in session data');
    }
    
    // Get Sam Kolder reference
    const samDesktop = path.join(this.samDir, 'sam-desktop.png');
    if (!fs.existsSync(samDesktop)) {
      throw new Error('Sam Kolder reference not found');
    }
    
    console.log('📸 Found screenshots:');
    console.log(`   Before: ${beforeDesktop.filename}`);
    console.log(`   After: ${afterDesktop.filename}`);
    console.log(`   Target: sam-desktop.png`);
    console.log('');
    
    // Generate three-way comparison HTML
    const htmlContent = this.generateThreeWayHTML(sessionData, beforeDesktop, afterDesktop, samDesktop);
    
    // Save HTML file
    const htmlPath = path.join(this.sessionsDir, sessionId, 'three-way-comparison.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    // Screenshot the comparison
    const browser = await import('playwright').then(m => m.chromium);
    const browserInstance = await browser.launch({ headless: true });
    const page = await browserInstance.newPage();
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const screenshotPath = path.join(this.sessionsDir, sessionId, 'three-way-comparison.png');
    await page.screenshot({ 
      path: screenshotPath, 
      fullPage: true,
      type: 'png'
    });
    
    await browserInstance.close();
    
    console.log('✅ Three-way comparison generated:');
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   Screenshot: ${screenshotPath}`);
    console.log('');
    
    return {
      htmlPath,
      screenshotPath,
      sessionData
    };
  }

  generateThreeWayHTML(sessionData, beforeDesktop, afterDesktop, samDesktop) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three-Way Comparison: Before → After → Target</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: white;
            font-family: 'Space Mono', monospace;
            line-height: 1.6;
        }
        .header {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .session-info {
            background: #3a3a3a;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .change-description {
            background: #4a4a4a;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #4ecdc4;
        }
        .comparison-container {
            display: flex;
            gap: 15px;
            max-width: 100%;
            overflow-x: auto;
            min-height: 100vh;
        }
        .screenshot-panel {
            flex: 1;
            min-width: 300px;
            width: 33.33%;
        }
        .screenshot-panel h2 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 300;
        }
        .screenshot-panel img {
            width: 100%;
            height: auto;
            border: 2px solid #333;
            border-radius: 8px;
        }
        .before {
            border-color: #ff6b6b;
        }
        .after {
            border-color: #4ecdc4;
        }
        .target {
            border-color: #ffd93d;
        }
        .analysis-section {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .analysis-item {
            background: #3a3a3a;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 3px solid #4ecdc4;
        }
        .css-changes {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .css-change {
            background: #3a3a3a;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
        }
        .timestamp {
            color: #888;
            font-size: 0.9em;
        }
        .arrow {
            text-align: center;
            font-size: 24px;
            color: #4ecdc4;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎯 THREE-WAY COMPARISON</h1>
        <div class="session-info">
            <p><strong>Session:</strong> ${sessionData.timestamp}</p>
            <p><strong>Change:</strong> ${sessionData.changeDescription}</p>
            <p><strong>Goal:</strong> ${sessionData.targetGoal}</p>
        </div>
        <div class="change-description">
            <strong>Analysis:</strong> Compare Before → After → Target to see if changes moved us closer to the goal
        </div>
    </div>

    <div class="comparison-container">
        <div class="screenshot-panel before">
            <h2>🔴 BEFORE CHANGE</h2>
            <img src="${beforeDesktop.filename}" alt="Before Change">
        </div>

        <div class="arrow">→</div>

        <div class="screenshot-panel after">
            <h2>🟢 AFTER CHANGE</h2>
            <img src="${afterDesktop.filename}" alt="After Change">
        </div>

        <div class="arrow">→</div>

        <div class="screenshot-panel target">
            <h2>🎯 TARGET (Sam Kolder)</h2>
            <img src="../../sam-reference/sam-desktop.png" alt="Target Reference">
        </div>
    </div>

    <div class="analysis-section">
        <h3>🔍 THREE-WAY ANALYSIS CHECKLIST</h3>
        <div class="analysis-item">
            <strong>1. Did the change improve the design?</strong><br>
            Compare Before vs After - did the change make things better or worse?
        </div>
        <div class="analysis-item">
            <strong>2. Are we closer to the target?</strong><br>
            Compare After vs Target - did the change move us closer to Sam Kolder's design?
        </div>
        <div class="analysis-item">
            <strong>3. What still needs to be fixed?</strong><br>
            Compare After vs Target - what elements still don't match?
        </div>
        <div class="analysis-item">
            <strong>4. Should we keep this change?</strong><br>
            Based on the three-way comparison, was this change successful?
        </div>
    </div>

    <div class="css-changes">
        <h3>🎨 CSS Changes Made (${sessionData.cssChanges.length})</h3>
        ${sessionData.cssChanges.map(change => `
            <div class="css-change">
                <span class="timestamp">[${change.timeString}]</span><br>
                <strong>${change.selector}</strong> { <strong>${change.property}</strong>: ${change.oldValue} → ${change.newValue} }
                ${change.reason ? `<br><em>Reason: ${change.reason}</em>` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }
}

// Export for use in other scripts
export default ThreeWayComparison;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const sessionId = process.argv[2];
  if (!sessionId) {
    console.log('Usage: node three-way-comparison.js <session-id>');
    process.exit(1);
  }
  
  const comparator = new ThreeWayComparison();
  comparator.generateThreeWayComparison(sessionId).then(result => {
    console.log('🎯 Three-way comparison complete!');
    console.log('Open the HTML file to see the full comparison.');
  }).catch(error => {
    console.error('❌ Error:', error.message);
  });
}
