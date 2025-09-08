#!/usr/bin/env node

import EnhancedVisualTracker from './enhanced-visual-tracker.js';
import fs from 'fs';
import path from 'path';

console.log('🎯 MANDATORY CHANGE SESSION SYSTEM');
console.log('==================================\n');

class MandatoryChangeSession {
  constructor() {
    this.tracker = new EnhancedVisualTracker();
    this.sessionActive = false;
    this.beforeStateCaptured = false;
    this.changesRecorded = [];
    this.afterStateCaptured = false;
    this.comparisonGenerated = false;
  }

  async startMandatorySession(changeDescription, targetGoal) {
    console.log('🚨 STARTING MANDATORY CHANGE SESSION');
    console.log('====================================');
    console.log(`📝 Change: ${changeDescription}`);
    console.log(`🎯 Goal: ${targetGoal}\n`);
    
    // MANDATORY: Start session
    await this.tracker.startChangeSession(changeDescription, targetGoal);
    this.sessionActive = true;
    console.log('✅ Session started\n');
    
    // MANDATORY: Capture before state
    console.log('📸 MANDATORY: Capturing before state...');
    await this.tracker.captureBeforeState();
    this.beforeStateCaptured = true;
    console.log('✅ Before state captured\n');
    
    return this.tracker.currentSession;
  }

  recordMandatoryChange(selector, property, oldValue, newValue, reason) {
    if (!this.sessionActive) {
      throw new Error('❌ MANDATORY: No active session. Start session first.');
    }
    
    if (!this.beforeStateCaptured) {
      throw new Error('❌ MANDATORY: Before state not captured. Capture before state first.');
    }
    
    console.log(`🎨 RECORDING CHANGE: ${selector} { ${property}: ${oldValue} → ${newValue} }`);
    console.log(`📝 Reason: ${reason}\n`);
    
    this.tracker.recordCSSChange(selector, property, oldValue, newValue, reason);
    this.changesRecorded.push({ selector, property, oldValue, newValue, reason });
    
    console.log('✅ Change recorded\n');
  }

  async captureMandatoryAfterState() {
    if (!this.sessionActive) {
      throw new Error('❌ MANDATORY: No active session.');
    }
    
    if (!this.beforeStateCaptured) {
      throw new Error('❌ MANDATORY: Before state not captured.');
    }
    
    if (this.changesRecorded.length === 0) {
      throw new Error('❌ MANDATORY: No changes recorded. Record changes first.');
    }
    
    console.log('📸 MANDATORY: Capturing after state...');
    await this.tracker.captureAfterState();
    this.afterStateCaptured = true;
    console.log('✅ After state captured\n');
  }

  async generateMandatoryComparison() {
    if (!this.afterStateCaptured) {
      throw new Error('❌ MANDATORY: After state not captured. Capture after state first.');
    }
    
    console.log('🔄 MANDATORY: Generating before/after comparison...');
    await this.tracker.generateBeforeAfterComparison();
    this.comparisonGenerated = true;
    console.log('✅ Before/after comparison generated\n');
    
    // Generate three-way comparison with target reference
    console.log('🔄 MANDATORY: Generating three-way comparison with target reference...');
    const ThreeWayComparison = (await import('./three-way-comparison.js')).default;
    const comparator = new ThreeWayComparison();
    await comparator.generateThreeWayComparison(this.tracker.currentSession);
    console.log('✅ Three-way comparison generated\n');
  }

  async endMandatorySession() {
    if (!this.comparisonGenerated) {
      throw new Error('❌ MANDATORY: Comparison not generated. Generate comparison first.');
    }
    
    console.log('🏁 MANDATORY: Ending session...');
    await this.tracker.endSession();
    
    console.log('📊 MANDATORY SESSION SUMMARY:');
    console.log('=============================');
    console.log(`✅ Session started: ${this.sessionActive}`);
    console.log(`✅ Before state captured: ${this.beforeStateCaptured}`);
    console.log(`✅ Changes recorded: ${this.changesRecorded.length}`);
    console.log(`✅ After state captured: ${this.afterStateCaptured}`);
    console.log(`✅ Comparison generated: ${this.comparisonGenerated}`);
    console.log('');
    
    console.log('🎯 CHANGES MADE:');
    this.changesRecorded.forEach((change, index) => {
      console.log(`   ${index + 1}. ${change.selector} { ${change.property}: ${change.oldValue} → ${change.newValue} }`);
      console.log(`      Reason: ${change.reason}`);
    });
    console.log('');
    
    console.log('✅ MANDATORY SESSION COMPLETE!');
    console.log('==============================');
    console.log('All mandatory steps completed successfully.');
    console.log('Review the before/after comparison to verify changes.');
  }

  // Mandatory validation methods
  validateSession() {
    if (!this.sessionActive) {
      throw new Error('❌ MANDATORY: No active session');
    }
    if (!this.beforeStateCaptured) {
      throw new Error('❌ MANDATORY: Before state not captured');
    }
    return true;
  }

  validateChanges() {
    this.validateSession();
    if (this.changesRecorded.length === 0) {
      throw new Error('❌ MANDATORY: No changes recorded');
    }
    return true;
  }

  validateComplete() {
    this.validateChanges();
    if (!this.afterStateCaptured) {
      throw new Error('❌ MANDATORY: After state not captured');
    }
    if (!this.comparisonGenerated) {
      throw new Error('❌ MANDATORY: Comparison not generated');
    }
    return true;
  }
}

// Export for use in other scripts
export default MandatoryChangeSession;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🎯 MANDATORY CHANGE SESSION SYSTEM');
  console.log('==================================\n');
  console.log('Usage:');
  console.log('  const session = new MandatoryChangeSession();');
  console.log('  await session.startMandatorySession("Description", "Goal");');
  console.log('  session.recordMandatoryChange(selector, property, old, new, reason);');
  console.log('  await session.captureMandatoryAfterState();');
  console.log('  await session.generateMandatoryComparison();');
  console.log('  await session.endMandatorySession();\n');
  console.log('⚠️  MANDATORY: Follow the exact order - no shortcuts allowed!');
}
