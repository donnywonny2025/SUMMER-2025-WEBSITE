#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

class VisualChangeTracker {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'screenshots', 'change-sessions');
    this.currentSession = null;
    this.sessionData = {};
  }

  async startChangeSession(changeDescription) {
    const timestamp = Date.now();
    this.currentSession = `session-${timestamp}`;
    const sessionDir = path.join(this.baseDir, this.currentSession);
    
    // Create session directory
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    this.sessionData = {
      timestamp,
      changeDescription,
      beforeScreenshots: {},
      afterScreenshots: {},
      cssChanges: [],
      analysis: {}
    };

    console.log(`🎯 STARTING CHANGE SESSION: ${this.currentSession}`);
    console.log(`📝 Change: ${changeDescription}`);
    console.log(`📁 Session Dir: ${sessionDir}\n`);

    return this.currentSession;
  }

  async captureBeforeState() {
    if (!this.currentSession) {
      throw new Error('No active change session. Call startChangeSession() first.');
    }

    console.log('📸 CAPTURING BEFORE STATE...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Find the dev server
      let devServerUrl = null;
      for (let port of [3000, 3001, 5173, 8080]) {
        try {
          const response = await fetch(`http://localhost:${port}`);
          if (response.ok) {
            devServerUrl = `http://localhost:${port}`;
            break;
          }
        } catch (e) {
          // Port not available
        }
      }

      if (!devServerUrl) {
        throw new Error('No dev server found on ports 3000, 3001, 5173, or 8080');
      }

      await page.goto(devServerUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Take screenshots
      const viewports = [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'large', width: 1440, height: 900 },
        { name: 'mobile', width: 375, height: 667 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(1000);
        
        const filename = `before-${viewport.name}-${Date.now()}.png`;
        const filepath = path.join(this.baseDir, this.currentSession, filename);
        
        await page.screenshot({ 
          path: filepath, 
          fullPage: true,
          type: 'png'
        });
        
        this.sessionData.beforeScreenshots[viewport.name] = {
          filename,
          filepath,
          timestamp: Date.now(),
          viewport
        };
        
        console.log(`   ✅ ${viewport.name}: ${filename}`);
      }

      await browser.close();
      
      // Save session data
      this.saveSessionData();
      
      console.log('✅ BEFORE STATE CAPTURED\n');
      return this.sessionData.beforeScreenshots;
      
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  async captureAfterState() {
    if (!this.currentSession) {
      throw new Error('No active change session. Call startChangeSession() first.');
    }

    console.log('📸 CAPTURING AFTER STATE...');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Find the dev server
      let devServerUrl = null;
      for (let port of [3000, 3001, 5173, 8080]) {
        try {
          const response = await fetch(`http://localhost:${port}`);
          if (response.ok) {
            devServerUrl = `http://localhost:${port}`;
            break;
          }
        } catch (e) {
          // Port not available
        }
      }

      if (!devServerUrl) {
        throw new Error('No dev server found on ports 3000, 3001, 5173, or 8080');
      }

      await page.goto(devServerUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Take screenshots
      const viewports = [
        { name: 'desktop', width: 1920, height: 1080 },
        { name: 'large', width: 1440, height: 900 },
        { name: 'mobile', width: 375, height: 667 }
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.waitForTimeout(1000);
        
        const filename = `after-${viewport.name}-${Date.now()}.png`;
        const filepath = path.join(this.baseDir, this.currentSession, filename);
        
        await page.screenshot({ 
          path: filepath, 
          fullPage: true,
          type: 'png'
        });
        
        this.sessionData.afterScreenshots[viewport.name] = {
          filename,
          filepath,
          timestamp: Date.now(),
          viewport
        };
        
        console.log(`   ✅ ${viewport.name}: ${filename}`);
      }

      await browser.close();
      
      // Save session data
      this.saveSessionData();
      
      console.log('✅ AFTER STATE CAPTURED\n');
      return this.sessionData.afterScreenshots;
      
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  async generateBeforeAfterComparison() {
    if (!this.currentSession || !this.sessionData.beforeScreenshots.desktop || !this.sessionData.afterScreenshots.desktop) {
      throw new Error('Need both before and after screenshots to generate comparison');
    }

    console.log('🔄 GENERATING BEFORE/AFTER COMPARISON...');

    const beforeDesktop = this.sessionData.beforeScreenshots.desktop;
    const afterDesktop = this.sessionData.afterScreenshots.desktop;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Before/After Change Comparison</title>
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
        .before {
            border-color: #ff6b6b;
        }
        .after {
            border-color: #4ecdc4;
        }
        .session-info {
            margin-bottom: 20px;
            padding: 20px;
            background: #2a2a2a;
            border-radius: 8px;
        }
        .change-description {
            background: #3a3a3a;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="session-info">
        <h1>🔄 Visual Change Progression</h1>
        <p><strong>Session:</strong> ${this.currentSession}</p>
        <p><strong>Timestamp:</strong> ${new Date(this.sessionData.timestamp).toLocaleString()}</p>
        <div class="change-description">
            <strong>Change Made:</strong> ${this.sessionData.changeDescription}
        </div>
        <p><strong>Left:</strong> Before Change | <strong>Right:</strong> After Change</p>
        <p>Analyze if the change moved us closer to or farther from the target design.</p>
    </div>

    <div class="comparison-container">
        <div class="screenshot-panel before">
            <h2>🔴 BEFORE CHANGE</h2>
            <img src="${beforeDesktop.filename}" alt="Before Change">
        </div>

        <div class="screenshot-panel after">
            <h2>🟢 AFTER CHANGE</h2>
            <img src="${afterDesktop.filename}" alt="After Change">
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.baseDir, this.currentSession, 'before-after-comparison.html');
    fs.writeFileSync(htmlPath, htmlContent);

    // Screenshot the comparison
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const comparisonScreenshot = `before-after-comparison-${Date.now()}.png`;
    const comparisonPath = path.join(this.baseDir, this.currentSession, comparisonScreenshot);
    
    await page.screenshot({ 
      path: comparisonPath, 
      fullPage: true,
      type: 'png'
    });
    
    await browser.close();

    this.sessionData.analysis.beforeAfterComparison = {
      htmlPath,
      screenshotPath: comparisonPath,
      screenshotFilename: comparisonScreenshot
    };

    this.saveSessionData();

    console.log(`✅ Before/After comparison generated`);
    console.log(`📄 HTML: ${htmlPath}`);
    console.log(`📸 Screenshot: ${comparisonPath}\n`);

    return {
      htmlPath,
      screenshotPath: comparisonPath,
      screenshotFilename: comparisonScreenshot
    };
  }

  recordCSSChange(selector, property, oldValue, newValue) {
    this.sessionData.cssChanges.push({
      timestamp: Date.now(),
      selector,
      property,
      oldValue,
      newValue
    });
    this.saveSessionData();
  }

  saveSessionData() {
    const sessionDir = path.join(this.baseDir, this.currentSession);
    const dataPath = path.join(sessionDir, 'session-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(this.sessionData, null, 2));
  }

  getSessionData() {
    return this.sessionData;
  }

  async endSession() {
    if (!this.currentSession) {
      throw new Error('No active change session');
    }

    console.log(`🏁 ENDING CHANGE SESSION: ${this.currentSession}`);
    console.log(`📊 Session Summary:`);
    console.log(`   - Change: ${this.sessionData.changeDescription}`);
    console.log(`   - CSS Changes: ${this.sessionData.cssChanges.length}`);
    console.log(`   - Before Screenshots: ${Object.keys(this.sessionData.beforeScreenshots).length}`);
    console.log(`   - After Screenshots: ${Object.keys(this.sessionData.afterScreenshots).length}`);
    console.log(`   - Session Dir: ${path.join(this.baseDir, this.currentSession)}\n`);

    this.currentSession = null;
    this.sessionData = {};
  }
}

// Export for use in other scripts
export default VisualChangeTracker;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const tracker = new VisualChangeTracker();
  
  console.log('🎯 VISUAL CHANGE TRACKER');
  console.log('========================\n');
  console.log('Usage:');
  console.log('  const tracker = new VisualChangeTracker();');
  console.log('  await tracker.startChangeSession("Description of change");');
  console.log('  await tracker.captureBeforeState();');
  console.log('  // Make CSS changes here');
  console.log('  await tracker.captureAfterState();');
  console.log('  await tracker.generateBeforeAfterComparison();');
  console.log('  await tracker.endSession();\n');
}



