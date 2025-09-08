#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import EnhancedVisualTracker from './enhanced-visual-tracker.js';
import MeasurementExtractor from '../analysis/measurement-extractor.js';
import ChangeEffectivenessScorer from '../analysis/change-effectiveness-scorer.js';
import AutomatedSuggestions from '../analysis/automated-suggestions.js';
import ProgressTracker from '../analysis/progress-tracker.js';

class SmartVisualTracker {
  constructor() {
    this.visualTracker = new EnhancedVisualTracker();
    this.measurementExtractor = new MeasurementExtractor();
    this.effectivenessScorer = new ChangeEffectivenessScorer();
    this.suggestionGenerator = new AutomatedSuggestions();
    this.progressTracker = new ProgressTracker();
    
    this.currentSession = null;
    this.beforeMeasurements = null;
    this.afterMeasurements = null;
  }

  async startSmartSession(changeDescription, targetGoal = '') {
    console.log('🎯 STARTING SMART VISUAL TRACKING SESSION');
    console.log('=========================================\n');

    this.currentSession = await this.visualTracker.startChangeSession(changeDescription, targetGoal);
    
    console.log('✅ Smart session started with enhanced tracking capabilities!');
    console.log('📊 Features enabled:');
    console.log('   - Measurement extraction');
    console.log('   - Change effectiveness scoring');
    console.log('   - Automated suggestions');
    console.log('   - Progress tracking\n');

    return this.currentSession;
  }

  async captureBeforeState() {
    console.log('📸 CAPTURING BEFORE STATE WITH MEASUREMENTS...');
    console.log('===============================================\n');

    // Capture screenshots
    await this.visualTracker.captureBeforeState();
    
    // Extract measurements
    this.beforeMeasurements = await this.measurementExtractor.extractMeasurements();
    
    // Record measurements in session
    this.visualTracker.addNote('📊 Before measurements extracted and analyzed', 'measurements');
    
    return this.beforeMeasurements;
  }

  async captureAfterState() {
    console.log('📸 CAPTURING AFTER STATE WITH MEASUREMENTS...');
    console.log('==============================================\n');

    // Capture screenshots
    await this.visualTracker.captureAfterState();
    
    // Extract measurements
    this.afterMeasurements = await this.measurementExtractor.extractMeasurements();
    
    // Record measurements in session
    this.visualTracker.addNote('📊 After measurements extracted and analyzed', 'measurements');
    
    return this.afterMeasurements;
  }

  async analyzeChange() {
    if (!this.beforeMeasurements || !this.afterMeasurements) {
      throw new Error('Need both before and after measurements to analyze change');
    }

    console.log('🔍 ANALYZING CHANGE EFFECTIVENESS...');
    console.log('====================================\n');

    // Score the change effectiveness
    const effectivenessScore = this.effectivenessScorer.scoreChange(
      this.beforeMeasurements, 
      this.afterMeasurements
    );

    // Generate automated suggestions
    const suggestions = this.suggestionGenerator.generateSuggestions(
      this.afterMeasurements, 
      effectivenessScore
    );

    // Record analysis in session
    this.visualTracker.addNote(
      `📊 Change analysis complete - Score: ${(effectivenessScore.overallScore * 100).toFixed(1)}% - Effectiveness: ${effectivenessScore.effectiveness}`,
      'analysis'
    );

    this.visualTracker.addVisualAnalysis('change_effectiveness', 
      `Overall score: ${(effectivenessScore.overallScore * 100).toFixed(1)}%, Effectiveness: ${effectivenessScore.effectiveness}`);

    return {
      effectivenessScore,
      suggestions,
      beforeMeasurements: this.beforeMeasurements,
      afterMeasurements: this.afterMeasurements
    };
  }

  async generateSmartComparison() {
    console.log('🔄 GENERATING SMART COMPARISON...');
    console.log('=================================\n');

    // Generate enhanced comparison
    const comparison = await this.visualTracker.generateBeforeAfterComparison();
    
    // Add analysis data to comparison
    const analysis = await this.analyzeChange();
    
    // Create smart comparison HTML with analysis
    const smartHtmlPath = await this.createSmartComparisonHTML(comparison, analysis);
    
    this.visualTracker.addNote('📊 Smart comparison generated with analysis and suggestions', 'completion');
    
    return {
      ...comparison,
      smartHtmlPath,
      analysis
    };
  }

  async createSmartComparisonHTML(comparison, analysis) {
    const smartHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Visual Change Analysis</title>
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
        .analysis-section {
            background: #3a3a3a;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .score-display {
            background: #4a4a4a;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            text-align: center;
        }
        .suggestions {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .suggestion-item {
            background: #3a3a3a;
            padding: 10px;
            margin: 5px 0;
            border-radius: 4px;
            border-left: 3px solid #4ecdc4;
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
        .high-priority { border-left-color: #ff6b6b; }
        .medium-priority { border-left-color: #ffa500; }
        .low-priority { border-left-color: #4ecdc4; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 Smart Visual Change Analysis</h1>
        <p><strong>Session:</strong> ${this.currentSession}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Change:</strong> ${this.visualTracker.sessionData.changeDescription}</p>
    </div>

    <div class="analysis-section">
        <h2>📊 Change Effectiveness Analysis</h2>
        <div class="score-display">
            <h3>Overall Score: ${(analysis.effectivenessScore.overallScore * 100).toFixed(1)}%</h3>
            <p>Effectiveness: ${analysis.effectivenessScore.effectiveness}</p>
        </div>
        
        <h3>Category Scores:</h3>
        ${Object.entries(analysis.effectivenessScore.scores).map(([category, scoreData]) => `
            <div>
                <strong>${category}:</strong> ${(scoreData.score * 100).toFixed(1)}%
                ${Object.entries(scoreData.details).map(([detail, status]) => `
                    <br>&nbsp;&nbsp;${detail}: ${status}
                `).join('')}
            </div>
        `).join('')}
    </div>

    <div class="suggestions">
        <h2>🤖 Automated Suggestions</h2>
        ${analysis.suggestions.length > 0 ? analysis.suggestions.map(suggestion => `
            <div class="suggestion-item ${suggestion.priority.toLowerCase()}-priority">
                <strong>[${suggestion.priority}]</strong> ${suggestion.suggestion}
                <br><code>${suggestion.cssChange}</code>
            </div>
        `).join('') : '<p>✅ No suggestions needed - design is optimal!</p>'}
    </div>

    <div class="comparison-container">
        <div class="screenshot-panel before">
            <h2>🔴 BEFORE CHANGE</h2>
            <img src="${this.visualTracker.sessionData.beforeScreenshots.desktop.filename}" alt="Before Change">
        </div>

        <div class="screenshot-panel after">
            <h2>🟢 AFTER CHANGE</h2>
            <img src="${this.visualTracker.sessionData.afterScreenshots.desktop.filename}" alt="After Change">
        </div>
    </div>
</body>
</html>`;

    const smartHtmlPath = path.join(
      path.dirname(comparison.htmlPath), 
      'smart-comparison.html'
    );
    fs.writeFileSync(smartHtmlPath, smartHtmlContent);

    // Screenshot the smart comparison
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto(`file://${smartHtmlPath}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const smartScreenshot = `smart-comparison-${Date.now()}.png`;
    const smartScreenshotPath = path.join(path.dirname(smartHtmlPath), smartScreenshot);
    
    await page.screenshot({ 
      path: smartScreenshotPath, 
      fullPage: true,
      type: 'png'
    });
    
    await browser.close();

    return smartHtmlPath;
  }

  async endSmartSession() {
    console.log('🏁 ENDING SMART VISUAL TRACKING SESSION...');
    console.log('==========================================\n');

    // Get final analysis
    const analysis = await this.analyzeChange();
    
    // Record session in progress tracker
    const sessionData = {
      ...this.visualTracker.getSessionData(),
      effectivenessScore: analysis.effectivenessScore,
      suggestions: analysis.suggestions,
      measurements: {
        before: this.beforeMeasurements,
        after: this.afterMeasurements
      },
      duration: Date.now() - this.visualTracker.sessionData.timestamp
    };

    this.progressTracker.recordSession(sessionData);

    // End visual tracker session
    await this.visualTracker.endSession();

    // Generate progress report
    this.progressTracker.generateProgressReport();

    console.log('✅ Smart session completed with full analysis!');
    console.log('📊 Session included:');
    console.log('   - Visual change tracking');
    console.log('   - Measurement extraction');
    console.log('   - Effectiveness scoring');
    console.log('   - Automated suggestions');
    console.log('   - Progress tracking\n');

    return {
      sessionData,
      analysis,
      progressSummary: this.progressTracker.getProgressSummary()
    };
  }

  getCurrentSession() {
    return this.currentSession;
  }

  getProgressSummary() {
    return this.progressTracker.getProgressSummary();
  }
}

export default SmartVisualTracker;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const tracker = new SmartVisualTracker();
  
  console.log('🤖 SMART VISUAL TRACKER');
  console.log('=======================\n');
  console.log('Usage:');
  console.log('  const tracker = new SmartVisualTracker();');
  console.log('  await tracker.startSmartSession("Description", "Goal");');
  console.log('  await tracker.captureBeforeState();');
  console.log('  // Make CSS changes here');
  console.log('  await tracker.captureAfterState();');
  console.log('  await tracker.generateSmartComparison();');
  console.log('  await tracker.endSmartSession();\n');
}


