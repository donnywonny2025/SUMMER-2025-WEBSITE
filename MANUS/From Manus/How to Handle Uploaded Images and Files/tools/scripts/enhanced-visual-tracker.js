#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

class EnhancedVisualTracker {
  constructor() {
    this.baseDir = path.join(process.cwd(), 'screenshots', 'change-sessions');
    this.currentSession = null;
    this.sessionData = {};
    this.analysisNotes = [];
    this.changeLog = [];
  }

  async startChangeSession(changeDescription, targetGoal = '') {
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
      targetGoal,
      beforeScreenshots: {},
      afterScreenshots: {},
      cssChanges: [],
      analysis: {},
      notes: [],
      changeLog: [],
      visualAnalysis: {}
    };

    // Add initial note
    this.addNote(`🎯 SESSION STARTED: ${changeDescription}`, 'session-start');
    if (targetGoal) {
      this.addNote(`🎯 TARGET GOAL: ${targetGoal}`, 'target-goal');
    }

    console.log(`🎯 STARTING ENHANCED CHANGE SESSION: ${this.currentSession}`);
    console.log(`📝 Change: ${changeDescription}`);
    if (targetGoal) console.log(`🎯 Goal: ${targetGoal}`);
    console.log(`📁 Session Dir: ${sessionDir}\n`);

    return this.currentSession;
  }

  addNote(note, category = 'general') {
    const timestamp = Date.now();
    const noteEntry = {
      timestamp,
      category,
      note,
      timeString: new Date(timestamp).toLocaleTimeString()
    };
    
    this.analysisNotes.push(noteEntry);
    this.sessionData.notes.push(noteEntry);
    
    console.log(`📝 [${noteEntry.timeString}] ${note}`);
    this.saveSessionData();
  }

  logChange(changeType, details) {
    const timestamp = Date.now();
    const changeEntry = {
      timestamp,
      changeType,
      details,
      timeString: new Date(timestamp).toLocaleTimeString()
    };
    
    this.changeLog.push(changeEntry);
    this.sessionData.changeLog.push(changeEntry);
    
    console.log(`🔄 [${changeEntry.timeString}] ${changeType}: ${details}`);
    this.saveSessionData();
  }

  async captureBeforeState() {
    if (!this.currentSession) {
      throw new Error('No active change session. Call startChangeSession() first.');
    }

    this.addNote('📸 CAPTURING BEFORE STATE - Taking screenshots of current site', 'screenshot');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Find the dev server
      let devServerUrl = null;
      for (let port of [3001, 3000, 5173, 8080]) {
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

      this.addNote(`🌐 Connected to dev server: ${devServerUrl}`, 'connection');
      await page.goto(devServerUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);

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
        
        this.addNote(`✅ Captured ${viewport.name} screenshot: ${filename}`, 'screenshot');
      }

      await browser.close();
      
      // Save session data
      this.saveSessionData();
      
      this.addNote('✅ BEFORE STATE CAPTURED - All viewports saved', 'completion');
      return this.sessionData.beforeScreenshots;
      
    } catch (error) {
      await browser.close();
      this.addNote(`❌ ERROR capturing before state: ${error.message}`, 'error');
      throw error;
    }
  }

  async captureAfterState() {
    if (!this.currentSession) {
      throw new Error('No active change session. Call startChangeSession() first.');
    }

    this.addNote('📸 CAPTURING AFTER STATE - Taking screenshots after changes', 'screenshot');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Find the dev server
      let devServerUrl = null;
      for (let port of [3001, 3000, 5173, 8080]) {
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

      this.addNote(`🌐 Connected to dev server: ${devServerUrl}`, 'connection');
      await page.goto(devServerUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);

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
        
        this.addNote(`✅ Captured ${viewport.name} screenshot: ${filename}`, 'screenshot');
      }

      await browser.close();
      
      // Save session data
      this.saveSessionData();
      
      this.addNote('✅ AFTER STATE CAPTURED - All viewports saved', 'completion');
      return this.sessionData.afterScreenshots;
      
    } catch (error) {
      await browser.close();
      this.addNote(`❌ ERROR capturing after state: ${error.message}`, 'error');
      throw error;
    }
  }

  recordCSSChange(selector, property, oldValue, newValue, reason = '') {
    const change = {
      timestamp: Date.now(),
      selector,
      property,
      oldValue,
      newValue,
      reason,
      timeString: new Date().toLocaleTimeString()
    };
    
    this.sessionData.cssChanges.push(change);
    this.logChange('CSS_CHANGE', `${selector} { ${property}: ${oldValue} → ${newValue} }`);
    
    if (reason) {
      this.addNote(`🎨 CSS Change: ${selector} ${property} changed from "${oldValue}" to "${newValue}" - Reason: ${reason}`, 'css-change');
    } else {
      this.addNote(`🎨 CSS Change: ${selector} ${property} changed from "${oldValue}" to "${newValue}"`, 'css-change');
    }
    
    this.saveSessionData();
  }

  async generateBeforeAfterComparison() {
    if (!this.currentSession || !this.sessionData.beforeScreenshots.desktop || !this.sessionData.afterScreenshots.desktop) {
      throw new Error('Need both before and after screenshots to generate comparison');
    }

    this.addNote('🔄 GENERATING BEFORE/AFTER COMPARISON - Creating visual analysis', 'analysis');

    const beforeDesktop = this.sessionData.beforeScreenshots.desktop;
    const afterDesktop = this.sessionData.afterScreenshots.desktop;

    // Generate detailed HTML with notes
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Before/After Change Analysis</title>
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
        .notes-section {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .note-item {
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
    </style>
</head>
<body>
    <div class="header">
        <h1>🔄 Enhanced Visual Change Analysis</h1>
        <div class="session-info">
            <p><strong>Session:</strong> ${this.currentSession}</p>
            <p><strong>Timestamp:</strong> ${new Date(this.sessionData.timestamp).toLocaleString()}</p>
            <p><strong>Duration:</strong> ${Math.round((Date.now() - this.sessionData.timestamp) / 1000)} seconds</p>
        </div>
        <div class="change-description">
            <strong>Change Made:</strong> ${this.sessionData.changeDescription}
        </div>
        ${this.sessionData.targetGoal ? `<div class="change-description"><strong>Target Goal:</strong> ${this.sessionData.targetGoal}</div>` : ''}
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

    <div class="css-changes">
        <h3>🎨 CSS Changes Made (${this.sessionData.cssChanges.length})</h3>
        ${this.sessionData.cssChanges.map(change => `
            <div class="css-change">
                <span class="timestamp">[${change.timeString}]</span><br>
                <strong>${change.selector}</strong> { <strong>${change.property}</strong>: ${change.oldValue} → ${change.newValue} }
                ${change.reason ? `<br><em>Reason: ${change.reason}</em>` : ''}
            </div>
        `).join('')}
    </div>

    <div class="notes-section">
        <h3>📝 Session Notes (${this.sessionData.notes.length})</h3>
        ${this.sessionData.notes.map(note => `
            <div class="note-item">
                <span class="timestamp">[${note.timeString}]</span> ${note.note}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    const htmlPath = path.join(this.baseDir, this.currentSession, 'enhanced-before-after-comparison.html');
    fs.writeFileSync(htmlPath, htmlContent);

    // Screenshot the comparison
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const comparisonScreenshot = `enhanced-before-after-comparison-${Date.now()}.png`;
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

    this.addNote(`✅ Enhanced comparison generated: ${comparisonScreenshot}`, 'completion');
    this.addNote(`📄 HTML analysis: ${htmlPath}`, 'file-created');
    this.addNote(`📸 Screenshot: ${comparisonPath}`, 'file-created');

    this.saveSessionData();

    return {
      htmlPath,
      screenshotPath: comparisonPath,
      screenshotFilename: comparisonScreenshot
    };
  }

  addVisualAnalysis(analysisType, findings) {
    const analysis = {
      timestamp: Date.now(),
      analysisType,
      findings,
      timeString: new Date().toLocaleTimeString()
    };
    
    this.sessionData.visualAnalysis[analysisType] = analysis;
    this.addNote(`🔍 VISUAL ANALYSIS [${analysisType}]: ${findings}`, 'analysis');
    this.saveSessionData();
  }

  saveSessionData() {
    const sessionDir = path.join(this.baseDir, this.currentSession);
    const dataPath = path.join(sessionDir, 'enhanced-session-data.json');
    fs.writeFileSync(dataPath, JSON.stringify(this.sessionData, null, 2));
  }

  getSessionData() {
    return this.sessionData;
  }

  async endSession() {
    if (!this.currentSession) {
      throw new Error('No active change session');
    }

    this.addNote(`🏁 SESSION ENDING - Generating final summary`, 'session-end');

    console.log(`🏁 ENDING ENHANCED CHANGE SESSION: ${this.currentSession}`);
    console.log(`📊 Session Summary:`);
    console.log(`   - Change: ${this.sessionData.changeDescription}`);
    console.log(`   - CSS Changes: ${this.sessionData.cssChanges.length}`);
    console.log(`   - Notes: ${this.sessionData.notes.length}`);
    console.log(`   - Before Screenshots: ${Object.keys(this.sessionData.beforeScreenshots).length}`);
    console.log(`   - After Screenshots: ${Object.keys(this.sessionData.afterScreenshots).length}`);
    console.log(`   - Session Dir: ${path.join(this.baseDir, this.currentSession)}\n`);

    // Generate final summary
    const summaryPath = path.join(this.baseDir, this.currentSession, 'session-summary.txt');
    const summary = `ENHANCED VISUAL CHANGE SESSION SUMMARY
==========================================

Session: ${this.currentSession}
Timestamp: ${new Date(this.sessionData.timestamp).toLocaleString()}
Duration: ${Math.round((Date.now() - this.sessionData.timestamp) / 1000)} seconds

CHANGE DESCRIPTION:
${this.sessionData.changeDescription}

TARGET GOAL:
${this.sessionData.targetGoal || 'Not specified'}

CSS CHANGES MADE (${this.sessionData.cssChanges.length}):
${this.sessionData.cssChanges.map(change => 
  `[${change.timeString}] ${change.selector} { ${change.property}: ${change.oldValue} → ${change.newValue} }${change.reason ? ` - ${change.reason}` : ''}`
).join('\n')}

SESSION NOTES (${this.sessionData.notes.length}):
${this.sessionData.notes.map(note => `[${note.timeString}] ${note.note}`).join('\n')}

FILES CREATED:
- Enhanced comparison HTML: enhanced-before-after-comparison.html
- Enhanced comparison screenshot: enhanced-before-after-comparison-*.png
- Session data: enhanced-session-data.json
- This summary: session-summary.txt

ANALYSIS:
This session tracked visual changes with comprehensive documentation.
All changes, notes, and analysis are preserved for future reference.
`;

    fs.writeFileSync(summaryPath, summary);
    this.addNote(`📋 Final summary generated: session-summary.txt`, 'completion');

    this.currentSession = null;
    this.sessionData = {};
    this.analysisNotes = [];
    this.changeLog = [];
  }
}

// Export for use in other scripts
export default EnhancedVisualTracker;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎯 ENHANCED VISUAL CHANGE TRACKER');
  console.log('=================================\n');
  console.log('Usage:');
  console.log('  const tracker = new EnhancedVisualTracker();');
  console.log('  await tracker.startChangeSession("Description", "Goal");');
  console.log('  await tracker.captureBeforeState();');
  console.log('  tracker.recordCSSChange(selector, property, old, new, reason);');
  console.log('  await tracker.captureAfterState();');
  console.log('  await tracker.generateBeforeAfterComparison();');
  console.log('  tracker.addVisualAnalysis("type", "findings");');
  console.log('  await tracker.endSession();\n');
}
