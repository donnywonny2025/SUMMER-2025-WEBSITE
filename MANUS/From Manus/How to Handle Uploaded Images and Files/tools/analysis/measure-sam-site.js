#!/usr/bin/env node

import { chromium } from 'playwright';

console.log('🎯 SAM KOLDER SITE MEASUREMENT TOOL');
console.log('===================================\n');

console.log('📊 MEASURING SAM KOLDER\'S ACTUAL VALUES:');
console.log('=========================================\n');

async function measureSamSite() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🌐 Opening Sam Kolder\'s site...');
    await page.goto('https://www.samkolder.com', { waitUntil: 'networkidle' });
    
    console.log('⏳ Waiting for page to fully load...');
    await page.waitForTimeout(3000);
    
    console.log('📏 MEASURING HERO TEXT VALUES:');
    console.log('==============================');
    
    // Measure hero text
    const heroText = await page.evaluate(() => {
      const heroElement = document.querySelector('h1, .hero h1, [class*="hero"] h1');
      if (heroElement) {
        const styles = window.getComputedStyle(heroElement);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          lineHeight: styles.lineHeight,
          letterSpacing: styles.letterSpacing,
          fontFamily: styles.fontFamily,
          color: styles.color,
          textContent: heroElement.textContent?.substring(0, 50) + '...'
        };
      }
      return null;
    });
    
    if (heroText) {
      console.log('✅ Hero Text Found:');
      console.log(`   Content: ${heroText.textContent}`);
      console.log(`   Font Size: ${heroText.fontSize}`);
      console.log(`   Font Weight: ${heroText.fontWeight}`);
      console.log(`   Line Height: ${heroText.lineHeight}`);
      console.log(`   Letter Spacing: ${heroText.letterSpacing}`);
      console.log(`   Font Family: ${heroText.fontFamily}`);
      console.log(`   Color: ${heroText.color}\n`);
    } else {
      console.log('❌ Hero text not found\n');
    }
    
    console.log('📏 MEASURING LAYOUT VALUES:');
    console.log('============================');
    
    // Measure layout
    const layout = await page.evaluate(() => {
      const heroSection = document.querySelector('.hero, [class*="hero"], main, section');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        };
      }
      return null;
    });
    
    if (layout) {
      console.log('✅ Layout Measurements:');
      console.log(`   Width: ${layout.width}px`);
      console.log(`   Height: ${layout.height}px`);
      console.log(`   Top: ${layout.top}px`);
      console.log(`   Left: ${layout.left}px\n`);
    }
    
    console.log('📏 MEASURING VIDEO THUMBNAIL:');
    console.log('==============================');
    
    // Measure video thumbnail
    const video = await page.evaluate(() => {
      const videoElement = document.querySelector('video, [class*="video"], [class*="thumbnail"]');
      if (videoElement) {
        const rect = videoElement.getBoundingClientRect();
        const styles = window.getComputedStyle(videoElement);
        return {
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow
        };
      }
      return null;
    });
    
    if (video) {
      console.log('✅ Video Thumbnail:');
      console.log(`   Width: ${video.width}px`);
      console.log(`   Height: ${video.height}px`);
      console.log(`   Top: ${video.top}px`);
      console.log(`   Left: ${video.left}px`);
      console.log(`   Border Radius: ${video.borderRadius}`);
      console.log(`   Box Shadow: ${video.boxShadow}\n`);
    }
    
    console.log('📏 MEASURING META INFORMATION:');
    console.log('===============================');
    
    // Measure meta info
    const meta = await page.evaluate(() => {
      const metaElements = document.querySelectorAll('[class*="meta"], [class*="location"], [class*="email"]');
      const results = [];
      metaElements.forEach((el, index) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        results.push({
          index,
          textContent: el.textContent?.substring(0, 30),
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          color: styles.color,
          top: rect.top,
          left: rect.left
        });
      });
      return results;
    });
    
    if (meta.length > 0) {
      console.log('✅ Meta Information:');
      meta.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.textContent}`);
        console.log(`      Font Size: ${item.fontSize}`);
        console.log(`      Font Weight: ${item.fontWeight}`);
        console.log(`      Color: ${item.color}`);
        console.log(`      Position: ${item.top}px, ${item.left}px`);
      });
      console.log('');
    }
    
    console.log('🎯 MEASUREMENT COMPLETE!');
    console.log('========================');
    console.log('✅ Now apply these EXACT values to our site');
    console.log('✅ Stop making assumptions!');
    console.log('✅ Use these measurements as the source of truth\n');
    
    // Keep browser open for manual inspection
    console.log('🔍 Browser kept open for manual inspection...');
    console.log('   Press Ctrl+C to close when done\n');
    
    // Wait for user to close
    await new Promise(() => {});
    
  } catch (error) {
    console.error('❌ Error measuring Sam\'s site:', error.message);
  } finally {
    await browser.close();
  }
}

measureSamSite().catch(console.error);



