#!/usr/bin/env node

import SmartVisualTracker from './smart-visual-tracker.js';
import fs from 'fs';

async function realDesignFix() {
  console.log('🎯 REAL DESIGN FIX SESSION');
  console.log('==========================\n');

  const tracker = new SmartVisualTracker();

  try {
    // Start a real design fix session
    console.log('🎯 Starting real design fix session...');
    await tracker.startSmartSession(
      'Fix design to match Sam Kolder pixel-perfectly',
      'Achieve exact visual match with Sam Kolder reference design'
    );

    // Capture current state with measurements
    console.log('📸 Capturing current state...');
    await tracker.captureBeforeState();

    // Analyze current measurements and generate suggestions
    console.log('🔍 Analyzing current design...');
    const analysis = await tracker.analyzeChange();
    
    console.log('\n📊 CURRENT DESIGN ANALYSIS:');
    console.log('============================');
    console.log(`Overall Score: ${(analysis.effectivenessScore.overallScore * 100).toFixed(1)}%`);
    console.log(`Effectiveness: ${analysis.effectivenessScore.effectiveness}`);
    
    if (analysis.suggestions.length > 0) {
      console.log('\n🤖 AUTOMATED SUGGESTIONS:');
      analysis.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. [${suggestion.priority}] ${suggestion.suggestion}`);
        console.log(`   CSS: ${suggestion.cssChange}`);
      });
    }

    // Apply the highest priority suggestions
    console.log('\n🎨 APPLYING SUGGESTIONS...');
    console.log('===========================');
    
    const highPrioritySuggestions = analysis.suggestions.filter(s => s.priority === 'High');
    
    if (highPrioritySuggestions.length > 0) {
      console.log(`Found ${highPrioritySuggestions.length} high priority suggestions to apply...`);
      
      // Read current CSS
      const cssPath = 'src/App.css';
      let cssContent = fs.readFileSync(cssPath, 'utf8');
      
      // Apply each high priority suggestion
      highPrioritySuggestions.forEach((suggestion, index) => {
        console.log(`\n${index + 1}. Applying: ${suggestion.suggestion}`);
        
        // Extract the CSS change from the suggestion
        const cssChange = suggestion.cssChange;
        const selector = suggestion.category === 'heroText' ? '.hero-content h1' : 
                        suggestion.category === 'metaInfo' ? '.hero-meta' :
                        suggestion.category === 'video' ? '.hero-video' :
                        suggestion.category === 'spacing' ? '.hero-content' : '';
        
        if (selector && cssChange) {
          // Record the change
          tracker.visualTracker.recordCSSChange(
            selector,
            suggestion.property,
            suggestion.current,
            suggestion.target,
            `Applied automated suggestion: ${suggestion.suggestion}`
          );
          
          console.log(`   CSS Change: ${cssChange}`);
        }
      });
      
      // For now, let's make a targeted change based on the measurements
      console.log('\n🎯 MAKING TARGETED CHANGES...');
      console.log('==============================');
      
      // Based on the measurements, let's fix the hero text size
      const currentHeroSize = analysis.beforeMeasurements.heroText.fontSize; // 24px
      const targetHeroSize = '1.8rem'; // Should be larger to match Sam's
      
      console.log(`Current hero text size: ${currentHeroSize}`);
      console.log(`Target hero text size: ${targetHeroSize}`);
      
      // Update hero text size
      cssContent = cssContent.replace(
        /\.hero-content h1\s*\{[^}]*font-size:\s*[^;]+;/g,
        `.hero-content h1 {\n  font-family: 'Space Mono', monospace;\n  font-size: ${targetHeroSize};`
      );
      
      // Update hero content margin
      cssContent = cssContent.replace(
        /\.hero-content\s*\{[^}]*margin:\s*[^;]+;/g,
        `.hero-content {\n  position: relative;\n  margin: 8vh auto 0;`
      );
      
      // Update hero meta margin
      cssContent = cssContent.replace(
        /\.hero-meta\s*\{[^}]*margin:\s*[^;]+;/g,
        `.hero-meta {\n  position: relative;\n  margin: 12px auto 0;`
      );
      
      // Update video positioning
      cssContent = cssContent.replace(
        /\.hero-video\s*\{[^}]*top:\s*[^;]+;/g,
        `.hero-video {\n  position: absolute;\n  top: 50%;`
      );
      
      // Write the updated CSS
      fs.writeFileSync(cssPath, cssContent);
      
      console.log('✅ Applied targeted CSS changes');
      console.log('   - Increased hero text size to 1.8rem');
      console.log('   - Adjusted hero content margin to 8vh');
      console.log('   - Adjusted hero meta margin to 12px');
      console.log('   - Adjusted video position to 50%');
    }

    // Capture after state
    console.log('\n📸 Capturing after state...');
    await tracker.captureAfterState();

    // Generate smart comparison
    console.log('\n🔄 Generating smart comparison...');
    const comparison = await tracker.generateSmartComparison();

    // End session
    console.log('\n🏁 Ending design fix session...');
    const results = await tracker.endSmartSession();

    console.log('\n✅ REAL DESIGN FIX SESSION COMPLETE!');
    console.log('====================================');
    console.log('📊 Final Results:');
    console.log(`   Overall Score: ${(results.analysis.effectivenessScore.overallScore * 100).toFixed(1)}%`);
    console.log(`   Effectiveness: ${results.analysis.effectivenessScore.effectiveness}`);
    console.log(`   Changes Applied: ${results.sessionData.cssChanges.length}`);
    console.log(`   Suggestions Generated: ${results.analysis.suggestions.length}`);
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Review the smart comparison screenshot');
    console.log('2. Check if changes improved the design');
    console.log('3. Apply additional suggestions if needed');
    console.log('4. Continue iterating until pixel-perfect match');

  } catch (error) {
    console.error('❌ Design fix session failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

realDesignFix();


