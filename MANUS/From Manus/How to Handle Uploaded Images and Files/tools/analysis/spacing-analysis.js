import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🎯 SPACING ANALYSIS SYSTEM');
console.log('==========================');

// Spacing analysis checklist
const spacingChecklist = {
  topToHero: {
    description: "Spacing from top of page to hero text",
    samReference: "Should be compact but not cramped",
    ourCurrent: "Check margin-top value",
    critical: true
  },
  heroToLocation: {
    description: "Spacing between hero text and location/meta info",
    samReference: "Tight spacing, close connection",
    ourCurrent: "Check margin between elements",
    critical: true
  },
  locationToVideo: {
    description: "Spacing between location and video thumbnail",
    samReference: "Compact, professional spacing",
    ourCurrent: "Check video positioning",
    critical: true
  },
  overallVerticalRhythm: {
    description: "Overall vertical rhythm and flow",
    samReference: "Consistent, professional spacing throughout",
    ourCurrent: "Check all element positioning",
    critical: true
  }
};

console.log('\n📋 SPACING ANALYSIS CHECKLIST:');
console.log('===============================');

Object.keys(spacingChecklist).forEach(key => {
  const item = spacingChecklist[key];
  console.log(`\n🔍 ${item.description.toUpperCase()}:`);
  console.log(`   📊 Sam's Reference: ${item.samReference}`);
  console.log(`   🎯 Our Current: ${item.ourCurrent}`);
  console.log(`   ⚠️  Critical: ${item.critical ? 'YES' : 'NO'}`);
});

console.log('\n🎯 SPACING VERIFICATION RULES:');
console.log('==============================');
console.log('1. ALWAYS analyze spacing between ALL elements');
console.log('2. Compare with Sam Kolder reference BEFORE claiming success');
console.log('3. Catch spacing mismatches IMMEDIATELY, not after user feedback');
console.log('4. Goal is EXACT spacing match - no approximations');
console.log('5. If spacing looks off, it IS off - fix it immediately');

console.log('\n💡 SPACING ANALYSIS INSTRUCTIONS:');
console.log('=================================');
console.log('1. Take screenshot of current site');
console.log('2. Compare with Sam Kolder reference');
console.log('3. Analyze each spacing element:');
console.log('   - Top to hero text spacing');
console.log('   - Hero text to location spacing');
console.log('   - Location to video spacing');
console.log('   - Overall vertical rhythm');
console.log('4. If ANY spacing is off, fix it immediately');
console.log('5. Do NOT claim success until spacing is pixel-perfect');

console.log('\n🛡️ SPACING GUARDRAILS:');
console.log('======================');
console.log('✅ System must catch spacing issues automatically');
console.log('✅ No user feedback needed to identify spacing problems');
console.log('✅ Goal is EXACT match with Sam Kolder reference');
console.log('✅ Spacing analysis is CRITICAL for success');

// Function to analyze current CSS spacing
function analyzeCurrentSpacing() {
  const cssPath = path.join(__dirname, '../../src/App.css');
  
  if (!fs.existsSync(cssPath)) {
    console.log('❌ CSS file not found');
    return;
  }
  
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  console.log('\n📊 CURRENT CSS SPACING ANALYSIS:');
  console.log('================================');
  
  // Extract hero content margin
  const heroContentMatch = cssContent.match(/\.hero-content\s*\{[^}]*margin:\s*([^;]+);/);
  if (heroContentMatch) {
    console.log(`🎯 Hero Content Margin: ${heroContentMatch[1]}`);
  }
  
  // Extract hero meta margin
  const heroMetaMatch = cssContent.match(/\.hero-meta\s*\{[^}]*margin:\s*([^;]+);/);
  if (heroMetaMatch) {
    console.log(`🎯 Hero Meta Margin: ${heroMetaMatch[1]}`);
  }
  
  // Extract video positioning
  const videoMatch = cssContent.match(/\.hero-video\s*\{[^}]*top:\s*([^;]+);/);
  if (videoMatch) {
    console.log(`🎯 Video Top Position: ${videoMatch[1]}`);
  }
  
  console.log('\n💡 SPACING RECOMMENDATIONS:');
  console.log('===========================');
  console.log('1. Hero content should have compact top margin (8-12vh)');
  console.log('2. Hero meta should have tight margin (10-20px)');
  console.log('3. Video should be positioned close to location (45-50%)');
  console.log('4. Overall spacing should be compact and professional');
}

analyzeCurrentSpacing();

console.log('\n🎯 SPACING ANALYSIS SYSTEM READY!');
console.log('==================================');
console.log('✅ Use this system to catch spacing issues immediately');
console.log('✅ Goal: Pixel-perfect spacing match with Sam Kolder');
console.log('✅ No user feedback needed - system should catch issues automatically');



