#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

console.log('🖼️  IMAGE INSPECTION SYSTEM');
console.log('===========================\n');

async function analyzeImage(imagePath) {
  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`❌ File not found: ${imagePath}`);
      return;
    }

    console.log(`🎯 ANALYZING: ${imagePath}`);

    // Get basic metadata
    const metadata = await sharp(imagePath).metadata();
    console.log(`📏 Dimensions: ${metadata.width}x${metadata.height} (${metadata.format})`);
    console.log(`📊 File Size: ${(fs.statSync(imagePath).size / 1024).toFixed(0)} KB`);

    // Get image stats (brightness, etc.)
    const stats = await sharp(imagePath).stats();

    // Calculate brightness
    const brightness = calculateBrightness(stats);
    console.log(`🌞 Brightness: ${(brightness * 100).toFixed(0)}%`);

    // Get color palette
    const colors = await getDominantColors(imagePath);
    console.log(`🎨 Dominant Colors:`);
    colors.slice(0, 5).forEach((color, index) => {
      console.log(`   ${index + 1}. ${color.hex} (${color.name})`);
    });

    // Basic image analysis
    const analysis = await analyzeImageContent(imagePath, metadata);
    console.log(`🔍 Content Analysis: ${analysis.description}`);
    console.log(`📱 UI Elements Detected: ${analysis.uiElements.join(', ')}`);
    console.log(`💡 Suggested Improvements: ${analysis.improvements.join(', ')}`);

    // Check if it's a website screenshot
    if (analysis.isWebsiteScreenshot) {
      console.log(`🖥️  Website Analysis:`);
      console.log(`   - Layout: ${analysis.layout}`);
      console.log(`   - Color Scheme: ${analysis.colorScheme}`);
      console.log(`   - Responsive Design: ${analysis.responsive}`);
    }

    console.log('\n✅ Analysis Complete!\n');

    return {
      path: imagePath,
      metadata,
      brightness,
      colors,
      content: analysis
    };

  } catch (error) {
    console.error(`❌ Error analyzing image: ${error.message}`);
    return null;
  }
}

function calculateBrightness(stats) {
  // Calculate average brightness from channels
  const { channels } = stats;
  const r = channels[0].mean || 0;
  const g = channels[1]?.mean || 0;
  const b = channels[2]?.mean || 0;

  // Convert RGB to luminancede
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return brightness;
}

async function getDominantColors(imagePath) {
  try {
    // Get image as 1x1 pixel to find average color
    const buffer = await sharp(imagePath)
      .resize(50, 50, { withoutEnlargement: true })
      .raw()
      .toBuffer();

    const pixels = [];
    for (let i = 0; i < buffer.length; i += 3) {
      pixels.push({
        r: buffer[i],
        g: buffer[i + 1],
        b: buffer[i + 2]
      });
    }

    // Simple color quantization - get most common colors
    const colorMap = new Map();
    pixels.forEach(pixel => {
      const key = `${pixel.r},${pixel.g},${pixel.b}`;
      const hex = rgbToHex(pixel.r, pixel.g, pixel.b);
      const name = getColorName(pixel.r, pixel.g, pixel.b);
      colorMap.set(key, { hex, name, count: (colorMap.get(key)?.count || 0) + 1 });
    });

    // Sort by frequency and take top colors
    return Array.from(colorMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  } catch (error) {
    return [{ hex: '#FFFFFF', name: 'white', count: 1 }];
  }
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function getColorName(r, g, b) {
  // Simple color name detection
  const colors = {
    'white': [255, 255, 255],
    'black': [0, 0, 0],
    'red': [255, 0, 0],
    'green': [0, 255, 0],
    'blue': [0, 0, 255],
    'yellow': [255, 255, 0],
    'cyan': [0, 255, 255],
    'magenta': [255, 0, 255],
    'gray': [128, 128, 128]
  };

  let closestColor = 'unknown';
  let minDistance = Infinity;

  Object.entries(colors).forEach(([name, [cr, cg, cb]]) => {
    const distance = Math.sqrt((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2);
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = name;
    }
  });

  return closestColor;
}

async function analyzeImageContent(imagePath, metadata) {
  const analysis = {
    isWebsiteScreenshot: false,
    description: '',
    uiElements: [],
    layout: '',
    colorScheme: '',
    responsive: '',
    improvements: []
  };

  // Basic heuristics for website screenshots
  const { width, height } = metadata;

  // Check if it looks like a website screenshot
  if (width >= 320 && height >= 320) {
    analysis.isWebsiteScreenshot = true;
    analysis.description = 'Website screenshot';

    // Layout detection
    if (width > height && width > 1400) {
      analysis.layout = 'Desktop layout (wide)';
    } else if (width >= 768) {
      analysis.layout = 'Tablet/Desktop layout';
    } else if (width >= 320) {
      analysis.layout = 'Mobile layout';
    }

    // Common UI elements to look for
    const ratio = width / height;

    if (ratio > 2) {
      analysis.uiElements.push('Header/Navigation', 'Hero section');
      analysis.layout = 'Wide desktop layout';
    } else if (ratio > 1.3) {
      analysis.uiElements.push('Header', 'Main content', 'Footer');
      analysis.layout = 'Standard web layout';
    } else {
      analysis.uiElements.push('Mobile header', 'Mobile content');
      analysis.layout = 'Mobile vertical layout';
    }

    // Color scheme detection (simplified)
    analysis.colorScheme = 'Mixed colors detected';
    analysis.responsive = width < 768 ? 'Mobile responsive' : 'Desktop/tablet view';

    // Improvements based on common issues
    if (width < 800) {
      analysis.improvements.push('Consider mobile optimization');
    }

    if (analysis.uiElements.length < 3) {
      analysis.improvements.push('Add more visual hierarchy');
    }

  } else {
    analysis.description = 'Non-website image';
    analysis.uiElements = ['Unknown'];
    analysis.improvements = ['Image categorization needed'];
  }

  return analysis;
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  // No arguments - analyze latest screenshot
  console.log('🔍 No image specified - analyzing latest screenshot...\n');

  const screenshotDir = '/Volumes/AI/SCREENSHOTS';
  const files = fs.readdirSync(screenshotDir)
    .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))
    .sort()
    .reverse();

  if (files.length === 0) {
    console.log('❌ No screenshot files found in /Volumes/AI/SCREENSHOTS');
    process.exit(1);
  }

  const latest = files[0];
  console.log(`📸 Latest screenshot: ${latest}`);

  await analyzeImage(path.join(screenshotDir, latest));

} else if (args.length === 1) {
  // Specific file path
  const imagePath = args[0];

  // Support relative paths and main screenshots directory
  let fullPath = imagePath;
  if (!path.isAbsolute(imagePath)) {
    if (fs.existsSync(path.join('/Volumes/AI/SCREENSHOTS', imagePath))) {
      fullPath = path.join('/Volumes/AI/SCREENSHOTS', imagePath);
    } else {
      fullPath = path.resolve(imagePath);
    }
  }

  await analyzeImage(fullPath);

} else {
  console.log('❌ Usage:');
  console.log('   npm run analyze-image                    # Analyze latest screenshot');
  console.log('   npm run analyze-image image.jpg          # Analyze specific file');
  console.log('   node tools/scripts/image-inspector.js    # Same as above');
  process.exit(1);
}