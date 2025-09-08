#!/usr/bin/env node

import VisualChangeTracker from './visual-change-tracker.js';

async function testVisualTracker() {
  console.log('🧪 TESTING VISUAL CHANGE TRACKER');
  console.log('=================================\n');

  const tracker = new VisualChangeTracker();

  try {
    // Start a change session
    await tracker.startChangeSession('Testing visual change tracking system');

    // Capture before state
    console.log('📸 Capturing before state...');
    await tracker.captureBeforeState();

    // Record a CSS change
    tracker.recordCSSChange('.hero-content h1', 'font-size', '1.2rem', '1.5rem');
    tracker.recordCSSChange('.hero-content', 'margin', '5vh auto 0', '10vh auto 0');

    // Capture after state
    console.log('📸 Capturing after state...');
    await tracker.captureAfterState();

    // Generate before/after comparison
    console.log('🔄 Generating comparison...');
    const comparison = await tracker.generateBeforeAfterComparison();

    // End session
    await tracker.endSession();

    console.log('✅ VISUAL CHANGE TRACKER TEST COMPLETE!');
    console.log('=======================================');
    console.log('🎯 The system successfully:');
    console.log('   ✅ Captured before state');
    console.log('   ✅ Recorded CSS changes');
    console.log('   ✅ Captured after state');
    console.log('   ✅ Generated before/after comparison');
    console.log('   ✅ Created session data');
    console.log(`   📸 Comparison screenshot: ${comparison.screenshotFilename}`);
    console.log('\n💡 This system could revolutionize AI design assistance!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await tracker.endSession();
  }
}

testVisualTracker();


