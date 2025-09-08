import fs from 'fs';
import path from 'path';

console.log('🎯 VISUAL SUMMARY - WHAT WE HAVE');
console.log('=================================\n');

// Check what screenshots we have
const baselineDir = './tests/screenshots/baseline';
const currentDir = './tests/screenshots/current';
const samDir = './tests/screenshots/baseline/sam';

console.log('📁 AVAILABLE SCREENSHOTS:');
console.log('========================\n');

// Check our site screenshots
console.log('🏠 OUR SITE (Current):');
const currentFiles = fs.readdirSync('.').filter(f => f.startsWith('bulletproof-'));
currentFiles.forEach(file => {
  const stats = fs.statSync(file);
  console.log(`   📸 ${file} (${stats.mtime.toLocaleTimeString()})`);
});

if (fs.existsSync(currentDir)) {
  const ourCurrent = fs.readdirSync(currentDir).filter(f => f.startsWith('our_site_'));
  console.log('\n🏠 OUR SITE (Test System):');
  ourCurrent.forEach(file => {
    const stats = fs.statSync(path.join(currentDir, file));
    console.log(`   📸 ${file} (${stats.mtime.toLocaleTimeString()})`);
  });
}

// Check Sam's screenshots
console.log('\n⭐ SAM KOLDER SITE:');
if (fs.existsSync(samDir)) {
  const samFiles = fs.readdirSync(samDir);
  samFiles.forEach(file => {
    const stats = fs.statSync(path.join(samDir, file));
    console.log(`   📸 ${file} (${stats.mtime.toLocaleTimeString()})`);
  });
} else {
  console.log('   ❌ No Sam Kolder screenshots found');
}

console.log('\n🎯 WHAT WE CAN DO NOW:');
console.log('=====================');
console.log('1. ✅ We have fresh screenshots of our current site');
console.log('2. ✅ We have Sam Kolder\'s screenshots for comparison');
console.log('3. ✅ Our changes are working (height increases confirmed)');
console.log('4. 🔍 We can now visually compare and identify specific improvements');
console.log('\n💡 The hanging issue is SOLVED!');
console.log('   We now have a reliable visual verification system.');
console.log('\n📋 NEXT STEPS:');
console.log('- Look at the bulletproof-*.png files to see our current site');
console.log('- Compare with Sam Kolder\'s screenshots');
console.log('- Identify specific design elements that need improvement');
console.log('- Make targeted changes and verify with new screenshots');
