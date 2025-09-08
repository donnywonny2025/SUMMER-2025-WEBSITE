import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📊 VISUAL ANALYSIS - Current vs Sam Kolder');
console.log('==========================================\n');

// Function to get image dimensions
function getImageDimensions(imagePath) {
  try {
    const data = fs.readFileSync(imagePath);
    
    // PNG signature check
    if (data[0] !== 0x89 || data[1] !== 0x50 || data[2] !== 0x4E || data[3] !== 0x47) {
      return null;
    }
    
    // Read width and height from PNG header
    const width = data.readUInt32BE(16);
    const height = data.readUInt32BE(20);
    
    return { width, height };
  } catch (error) {
    return null;
  }
}

// Function to find latest screenshots
function findLatestScreenshots(directory) {
  try {
    const files = fs.readdirSync(directory);
    const screenshots = files.filter(file => file.endsWith('.png'));
    
    if (screenshots.length === 0) return {};
    
    // Group by viewport type
    const viewports = {};
    screenshots.forEach(file => {
      if (file.includes('mobile')) {
        viewports.mobile = file;
      } else if (file.includes('desktop')) {
        viewports.desktop = file;
      } else if (file.includes('large')) {
        viewports.large = file;
      }
    });
    
    return viewports;
  } catch (error) {
    return {};
  }
}

// Get current screenshots
const currentDir = path.join(__dirname, '../../screenshots/current');
const samDir = path.join(__dirname, '../../screenshots/sam-reference');

console.log('🔍 Finding latest screenshots...');
const currentScreenshots = findLatestScreenshots(currentDir);
const samScreenshots = findLatestScreenshots(samDir);

console.log('📱 Current screenshots found:', Object.keys(currentScreenshots).length);
console.log('🎯 Sam reference screenshots found:', Object.keys(samScreenshots).length);
console.log('');

// Analyze each viewport
const viewports = ['mobile', 'desktop', 'large'];
let totalWidthDiff = 0;
let totalHeightDiff = 0;
let comparisons = 0;

viewports.forEach(viewport => {
  const currentFile = currentScreenshots[viewport];
  const samFile = samScreenshots[viewport];
  
  if (!currentFile || !samFile) {
    console.log(`⚠️  ${viewport.toUpperCase()}: Missing screenshots`);
    return;
  }
  
  const currentPath = path.join(currentDir, currentFile);
  const samPath = path.join(samDir, samFile);
  
  const currentDims = getImageDimensions(currentPath);
  const samDims = getImageDimensions(samPath);
  
  if (!currentDims || !samDims) {
    console.log(`❌ ${viewport.toUpperCase()}: Could not read dimensions`);
    return;
  }
  
  const widthDiff = ((currentDims.width - samDims.width) / samDims.width * 100);
  const heightDiff = ((currentDims.height - samDims.height) / samDims.height * 100);
  
  console.log(`📱 ${viewport.toUpperCase()}:`);
  console.log(`   Current: ${currentDims.width}x${currentDims.height}`);
  console.log(`   Sam:     ${samDims.width}x${samDims.height}`);
  console.log(`   Width:   ${widthDiff > 0 ? '+' : ''}${widthDiff.toFixed(1)}%`);
  console.log(`   Height:  ${heightDiff > 0 ? '+' : ''}${heightDiff.toFixed(1)}%`);
  console.log('');
  
  totalWidthDiff += Math.abs(widthDiff);
  totalHeightDiff += Math.abs(heightDiff);
  comparisons++;
});

if (comparisons > 0) {
  const avgWidthDiff = (totalWidthDiff / comparisons).toFixed(1);
  const avgHeightDiff = (totalHeightDiff / comparisons).toFixed(1);
  
  console.log('📊 SUMMARY:');
  console.log(`   Average width difference: ${avgWidthDiff}%`);
  console.log(`   Average height difference: ${avgHeightDiff}%`);
  console.log('');
  
  if (avgHeightDiff < 5) {
    console.log('✅ Height matching is excellent!');
  } else if (avgHeightDiff < 10) {
    console.log('🟡 Height matching is good, minor adjustments needed');
  } else {
    console.log('🔴 Height matching needs significant work');
  }
} else {
  console.log('❌ No valid comparisons could be made');
}

console.log('\n🎯 Next: Focus on visual design quality (typography, colors, effects)');


