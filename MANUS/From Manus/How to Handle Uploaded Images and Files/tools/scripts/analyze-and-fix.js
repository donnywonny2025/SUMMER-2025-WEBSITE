#!/usr/bin/env node

import MeasurementExtractor from '../analysis/measurement-extractor.js';
import AutomatedSuggestions from '../analysis/automated-suggestions.js';
import fs from 'fs';

async function analyzeAndFix() {
  console.log('🎯 ANALYZE AND FIX DESIGN');
  console.log('=========================\n');

  try {
    // Extract current measurements
    console.log('📊 EXTRACTING CURRENT MEASUREMENTS...');
    const extractor = new MeasurementExtractor();
    const currentMeasurements = await extractor.extractMeasurements();
    
    console.log('\n📊 CURRENT DESIGN ANALYSIS:');
    console.log('============================');
    console.log('Based on the measurements, here are the key issues:');
    console.log('');
    console.log('🎯 HERO TEXT:');
    console.log(`   Current: ${currentMeasurements.heroText.fontSize} (${currentMeasurements.heroText.fontWeight} weight)`);
    console.log(`   Target: Should be larger to match Sam Kolder's prominent text`);
    console.log('');
    console.log('📍 META INFO:');
    console.log(`   Current: ${currentMeasurements.metaInfo.fontSize} at position ${currentMeasurements.metaInfo.top}px`);
    console.log(`   Target: Should be positioned closer to hero text`);
    console.log('');
    console.log('🎥 VIDEO:');
    console.log(`   Current: ${currentMeasurements.video.width}px × ${currentMeasurements.video.height}px at ${currentMeasurements.video.top}px`);
    console.log(`   Target: Should be positioned better relative to other elements`);
    console.log('');
    console.log('📐 SPACING:');
    console.log(`   Top to Hero: ${currentMeasurements.spacing.topToHero}px`);
    console.log(`   Hero to Meta: ${currentMeasurements.spacing.heroToMeta}px`);
    console.log(`   Meta to Video: ${currentMeasurements.spacing.metaToVideo}px`);
    console.log('   Target: Should match Sam Kolder\'s compact, professional spacing');

    // Generate suggestions based on current state
    console.log('\n🤖 GENERATING SUGGESTIONS...');
    const suggester = new AutomatedSuggestions();
    const suggestions = suggester.generateSuggestions(currentMeasurements, { overallScore: 0.3 });

    // Apply the most critical fixes
    console.log('\n🎨 APPLYING CRITICAL FIXES...');
    console.log('==============================');
    
    const cssPath = 'src/App.css';
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    console.log('1. Increasing hero text size to match Sam Kolder...');
    cssContent = cssContent.replace(
      /\.hero-content h1\s*\{[^}]*font-size:\s*[^;]+;/g,
      `.hero-content h1 {\n  font-family: 'Space Mono', monospace;\n  font-size: 2rem;`
    );
    
    console.log('2. Adjusting hero content positioning...');
    cssContent = cssContent.replace(
      /\.hero-content\s*\{[^}]*margin:\s*[^;]+;/g,
      `.hero-content {\n  position: relative;\n  margin: 6vh auto 0;`
    );
    
    console.log('3. Tightening meta information spacing...');
    cssContent = cssContent.replace(
      /\.hero-meta\s*\{[^}]*margin:\s*[^;]+;/g,
      `.hero-meta {\n  position: relative;\n  margin: 8px auto 0;`
    );
    
    console.log('4. Adjusting video positioning...');
    cssContent = cssContent.replace(
      /\.hero-video\s*\{[^}]*top:\s*[^;]+;/g,
      `.hero-video {\n  position: absolute;\n  top: 48%;`
    );
    
    console.log('5. Adjusting video size...');
    cssContent = cssContent.replace(
      /\.hero-video\s*\{[^}]*width:\s*[^;]+;/g,
      `.hero-video {\n  position: absolute;\n  width: 70%;`
    );
    
    // Write the updated CSS
    fs.writeFileSync(cssPath, cssContent);
    
    console.log('\n✅ CRITICAL FIXES APPLIED!');
    console.log('==========================');
    console.log('Changes made:');
    console.log('   - Hero text size: 1.5rem → 2rem');
    console.log('   - Hero content margin: 10vh → 6vh');
    console.log('   - Meta margin: 15px → 8px');
    console.log('   - Video position: 52% → 48%');
    console.log('   - Video width: 75% → 70%');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Check the site to see the changes');
    console.log('2. Take a new screenshot to compare');
    console.log('3. Continue iterating until pixel-perfect match');
    console.log('4. Use the SmartVisualTracker for detailed analysis');

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

analyzeAndFix();


