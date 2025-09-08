#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🎯 COMPLETE VISUAL DESIGN WORKFLOW');
console.log('==================================\n');

async function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    const result = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
    console.log(`✅ ${description} completed`);
    return result;
  } catch (error) {
    console.log(`❌ ${description} failed: ${error.message}`);
    throw error;
  }
}

async function openFile(filePath) {
  console.log(`📂 Opening: ${filePath}`);
  try {
    execSync(`open "${filePath}"`, { cwd: process.cwd() });
    console.log(`✅ Opened: ${filePath}`);
  } catch (error) {
    console.log(`❌ Failed to open: ${filePath}`);
  }
}

async function main() {
  try {
    // Step 1: Take fresh screenshots
    await runCommand('node tools/scripts/bulletproof-screenshot.js', 'Taking fresh screenshots');
    
    // Step 2: Generate side-by-side comparison
    await runCommand('node tools/analysis/side-by-side-comparison.js', 'Generating side-by-side comparison');
    
    // Step 3: Screenshot the HTML comparison
    await runCommand('node tools/scripts/screenshot-html-comparison.js', 'Screenshotting HTML comparison');
    
    // Step 4: Run comprehensive visual analysis
    await runCommand('node tools/analysis/comprehensive-visual-analysis.js', 'Running comprehensive visual analysis');
    
    // Step 5: Open all visual tools
    const currentDir = path.join(process.cwd(), 'screenshots', 'current');
    
    // Open HTML comparison
    const htmlFile = path.join(currentDir, 'side-by-side-comparison.html');
    if (fs.existsSync(htmlFile)) {
      await openFile(htmlFile);
    }
    
    // Open latest screenshots
    const files = fs.readdirSync(currentDir);
    const latestDesktop = files.filter(f => f.startsWith('bulletproof-desktop-') && f.endsWith('.png')).sort().pop();
    if (latestDesktop) {
      await openFile(path.join(currentDir, latestDesktop));
    }
    
    // Open Sam Kolder reference
    const samFile = path.join(process.cwd(), 'screenshots', 'sam-reference', 'sam-desktop.png');
    if (fs.existsSync(samFile)) {
      await openFile(samFile);
    }
    
    // Open latest HTML comparison screenshot
    const latestComparison = files.filter(f => f.startsWith('html-comparison-') && f.endsWith('.png')).sort().pop();
    if (latestComparison) {
      await openFile(path.join(currentDir, latestComparison));
    }
    
    console.log('\n🎯 COMPLETE VISUAL WORKFLOW FINISHED!');
    console.log('=====================================');
    console.log('✅ All screenshots taken');
    console.log('✅ Side-by-side comparison generated');
    console.log('✅ HTML comparison screenshot taken');
    console.log('✅ Comprehensive analysis completed');
    console.log('✅ All visual tools opened');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Analyze the visual comparison');
    console.log('2. Identify specific issues to fix');
    console.log('3. Start a change session');
    console.log('4. Make targeted changes');
    console.log('5. Verify with before/after comparison');
    
  } catch (error) {
    console.log(`\n❌ WORKFLOW FAILED: ${error.message}`);
    console.log('Check the error above and try again.');
  }
}

main();
