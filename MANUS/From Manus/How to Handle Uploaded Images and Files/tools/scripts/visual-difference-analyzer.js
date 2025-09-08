#!/usr/bin/env node

console.log(`
🎯 VISUAL DIFFERENCE ANALYZER
=============================

📋 VISUAL ANALYSIS CHECKLIST:
=============================

🔍 LOOK AT THE SIDE-BY-SIDE COMPARISON AND ANSWER:

1. TEXT POSITIONING:
   □ Is our text in the same relative position as Sam's?
   □ Does our text appear too high/low compared to Sam's?
   □ Is our text too far left/right compared to Sam's?

2. VIDEO POSITIONING:
   □ Is our video in the same relative position as Sam's?
   □ Does our video appear too high/low compared to Sam's?
   □ Is our video too far left/right compared to Sam's?

3. SHOWREEL POSITIONING:
   □ Is our showreel in the same relative position as Sam's?
   □ Does our showreel appear in the right area of the video?
   □ Is our showreel the right size compared to Sam's?

4. OVERALL LAYOUT:
   □ Does the overall composition look similar?
   □ Are the proportions similar?
   □ Does the spacing look similar?

5. MOST OBVIOUS DIFFERENCES:
   □ What is the most obvious thing that looks wrong?
   □ What should be fixed first?
   □ What would make the biggest visual improvement?

🎯 ACTION PLAN:
===============
Based on what you can see, identify the top 3 most obvious problems
and fix them one by one, taking screenshots after each fix.

💡 FOCUS ON VISUAL DIFFERENCES, NOT MEASUREMENTS!
`);

// Take a fresh screenshot for analysis
const { execSync } = require('child_process');
try {
  console.log('📸 Taking fresh screenshot for analysis...');
  execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
  console.log('✅ Screenshot ready for visual analysis!');
} catch (error) {
  console.log('❌ Error taking screenshot:', error.message);
}
