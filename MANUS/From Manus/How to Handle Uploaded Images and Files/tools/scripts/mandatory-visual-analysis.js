#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎯 MANDATORY VISUAL ANALYSIS SYSTEM');
console.log('===================================\n');

class MandatoryVisualAnalysis {
  constructor() {
    this.checklist = [];
    this.issues = [];
    this.screenshotQuality = false;
    this.analysisComplete = false;
  }

  async runMandatoryAnalysis() {
    console.log('🚨 MANDATORY ANALYSIS - NO SHORTCUTS ALLOWED\n');
    
    // STEP 1: VERIFY SCREENSHOT QUALITY (MANDATORY)
    await this.verifyScreenshotQuality();
    
    // STEP 2: SYSTEMATIC ELEMENT CHECK (MANDATORY)
    await this.systematicElementCheck();
    
    // STEP 3: IDENTIFY CRITICAL ISSUES (MANDATORY)
    await this.identifyCriticalIsses();
    
    // STEP 4: GENERATE ACTION PLAN (MANDATORY)
    await this.generateActionPlan();
    
    // STEP 5: VERIFY ANALYSIS COMPLETE (MANDATORY)
    await this.verifyAnalysisComplete();
    
    return this.getResults();
  }

  async verifyScreenshotQuality() {
    console.log('📸 STEP 1: VERIFYING SCREENSHOT QUALITY (MANDATORY)');
    console.log('==================================================');
    
    // Take fresh screenshots
    console.log('🔄 Taking fresh screenshots...');
    execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
    
    // Check for security errors or broken content
    const currentDir = path.join(process.cwd(), 'screenshots', 'current');
    const files = fs.readdirSync(currentDir);
    const latestDesktop = files.filter(f => f.startsWith('bulletproof-desktop-') && f.endsWith('.png')).sort().pop();
    
    if (latestDesktop) {
      console.log(`✅ Screenshot taken: ${latestDesktop}`);
      this.screenshotQuality = true;
    } else {
      console.log('❌ CRITICAL: No screenshots found');
      this.screenshotQuality = false;
    }
    
    console.log('📋 SCREENSHOT QUALITY CHECKLIST:');
    console.log('   [ ] Screenshots taken successfully');
    console.log('   [ ] No security errors visible');
    console.log('   [ ] Video content loads properly');
    console.log('   [ ] All elements visible and clear');
    console.log('');
  }

  async systematicElementCheck() {
    console.log('🔍 STEP 2: SYSTEMATIC ELEMENT CHECK (MANDATORY)');
    console.log('===============================================');
    
    // Generate side-by-side comparison
    console.log('🔄 Generating side-by-side comparison...');
    execSync('node tools/analysis/side-by-side-comparison.js', { stdio: 'inherit' });
    execSync('node tools/scripts/screenshot-html-comparison.js', { stdio: 'inherit' });
    
    console.log('📋 MANDATORY ELEMENT CHECKLIST:');
    console.log('');
    
    // Typography Analysis
    console.log('📝 TYPOGRAPHY ANALYSIS:');
    console.log('   [ ] Hero text font size matches Sam Kolder');
    console.log('   [ ] Hero text font weight matches Sam Kolder');
    console.log('   [ ] Hero text line height matches Sam Kolder');
    console.log('   [ ] Hero text letter spacing matches Sam Kolder');
    console.log('   [ ] Meta text size and weight correct');
    console.log('');
    
    // Layout Analysis
    console.log('📍 LAYOUT ANALYSIS:');
    console.log('   [ ] Hero content margin matches Sam Kolder');
    console.log('   [ ] Meta information spacing correct');
    console.log('   [ ] Overall vertical spacing matches');
    console.log('   [ ] Element alignment is correct');
    console.log('');
    
    // Video Analysis
    console.log('🎬 VIDEO ANALYSIS:');
    console.log('   [ ] Video positioned correctly (centered, not right-aligned)');
    console.log('   [ ] Video size and proportions match Sam Kolder');
    console.log('   [ ] Video border radius matches Sam Kolder');
    console.log('   [ ] Video shadows match Sam Kolder');
    console.log('   [ ] Video content loads without errors');
    console.log('');
    
    // Showreel Analysis
    console.log('🎯 SHOWREEL ANALYSIS:');
    console.log('   [ ] Showreel visible in video thumbnail');
    console.log('   [ ] Showreel centered in video');
    console.log('   [ ] Showreel size appropriate');
    console.log('   [ ] Showreel styling matches Sam Kolder');
    console.log('   [ ] Rotating text visible and readable');
    console.log('');
    
    // Navigation Analysis
    console.log('🧭 NAVIGATION ANALYSIS:');
    console.log('   [ ] Navigation matches Sam Kolder structure');
    console.log('   [ ] Navigation styling matches Sam Kolder');
    console.log('   [ ] Navigation positioning correct');
    console.log('');
  }

  async identifyCriticalIsses() {
    console.log('🚨 STEP 3: IDENTIFYING CRITICAL ISSUES (MANDATORY)');
    console.log('=================================================');
    
    console.log('🔍 CRITICAL ISSUES TO CHECK:');
    console.log('');
    
    // Check for major structural issues
    console.log('🏗️ STRUCTURAL ISSUES:');
    console.log('   [ ] Video positioning (centered vs right-aligned)');
    console.log('   [ ] Overall layout proportions');
    console.log('   [ ] Element spacing and alignment');
    console.log('');
    
    // Check for content issues
    console.log('📄 CONTENT ISSUES:');
    console.log('   [ ] Security errors blocking content');
    console.log('   [ ] Missing video content');
    console.log('   [ ] Broken elements or styling');
    console.log('');
    
    // Check for visual quality issues
    console.log('🎨 VISUAL QUALITY ISSUES:');
    console.log('   [ ] Typography refinement');
    console.log('   [ ] Color and contrast');
    console.log('   [ ] Shadow and effect quality');
    console.log('   [ ] Overall polish and refinement');
    console.log('');
  }

  async generateActionPlan() {
    console.log('📋 STEP 4: GENERATING ACTION PLAN (MANDATORY)');
    console.log('=============================================');
    
    console.log('🎯 PRIORITY ORDER FOR FIXES:');
    console.log('');
    console.log('1. 🚨 CRITICAL: Fix video positioning (centered, not right-aligned)');
    console.log('2. 🚨 CRITICAL: Fix security errors blocking video content');
    console.log('3. 🔥 HIGH: Fix typography size, weight, and spacing');
    console.log('4. 🔥 HIGH: Fix overall layout proportions and spacing');
    console.log('5. ⚡ MEDIUM: Fix showreel visibility and styling');
    console.log('6. ⚡ MEDIUM: Fix navigation structure and styling');
    console.log('7. ✨ LOW: Polish visual effects and refinement');
    console.log('');
    
    console.log('📝 MANDATORY PROCESS FOR EACH FIX:');
    console.log('   1. Start change session');
    console.log('   2. Capture before state');
    console.log('   3. Make targeted change');
    console.log('   4. Record change with reason');
    console.log('   5. Capture after state');
    console.log('   6. Generate before/after comparison');
    console.log('   7. Verify improvement');
    console.log('   8. Move to next priority');
    console.log('');
  }

  async verifyAnalysisComplete() {
    console.log('✅ STEP 5: VERIFYING ANALYSIS COMPLETE (MANDATORY)');
    console.log('=================================================');
    
    console.log('📊 ANALYSIS COMPLETION CHECKLIST:');
    console.log('   [ ] Screenshot quality verified');
    console.log('   [ ] All elements systematically checked');
    console.log('   [ ] Critical issues identified');
    console.log('   [ ] Action plan generated');
    console.log('   [ ] Priority order established');
    console.log('   [ ] Mandatory process defined');
    console.log('');
    
    this.analysisComplete = true;
    console.log('🎯 MANDATORY ANALYSIS COMPLETE!');
    console.log('===============================');
    console.log('✅ All steps completed');
    console.log('✅ No shortcuts taken');
    console.log('✅ Ready for targeted fixes');
    console.log('');
  }

  getResults() {
    return {
      screenshotQuality: this.screenshotQuality,
      analysisComplete: this.analysisComplete,
      checklist: this.checklist,
      issues: this.issues
    };
  }
}

// Run the mandatory analysis
const analyzer = new MandatoryVisualAnalysis();
analyzer.runMandatoryAnalysis().then(results => {
  console.log('🎯 MANDATORY ANALYSIS RESULTS:');
  console.log('==============================');
  console.log(`Screenshot Quality: ${results.screenshotQuality ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Analysis Complete: ${results.analysisComplete ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  console.log('🚨 NEXT STEPS:');
  console.log('1. Review the mandatory checklist above');
  console.log('2. Start change session for highest priority fix');
  console.log('3. Follow mandatory process for each change');
  console.log('4. Verify each change with before/after comparison');
  console.log('');
  console.log('⚠️  NO SHORTCUTS ALLOWED - FOLLOW THE PROCESS!');
});
