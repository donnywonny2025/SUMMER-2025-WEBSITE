#!/usr/bin/env node

import { chromium } from 'playwright';

class MeasurementExtractor {
  constructor() {
    this.measurements = {};
  }

  async extractMeasurements(screenshotPath) {
    console.log('🔍 EXTRACTING MEASUREMENTS FROM SCREENSHOT...');
    console.log(`📸 Analyzing: ${screenshotPath}\n`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
      // Find the dev server
      let devServerUrl = null;
      for (let port of [3001, 3000, 5173, 8080]) {
        try {
          const response = await fetch(`http://localhost:${port}`);
          if (response.ok) {
            devServerUrl = `http://localhost:${port}`;
            break;
          }
        } catch (e) {
          // Port not available
        }
      }

      if (!devServerUrl) {
        throw new Error('No dev server found on ports 3000, 3001, 5173, or 8080');
      }

      await page.goto(devServerUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
      await page.waitForTimeout(3000);

      // Extract measurements using browser dev tools
      const measurements = await page.evaluate(() => {
        const results = {
          heroText: {},
          metaInfo: {},
          video: {},
          layout: {},
          spacing: {}
        };

        // Hero text measurements
        const heroText = document.querySelector('.hero-content h1, h1');
        if (heroText) {
          const rect = heroText.getBoundingClientRect();
          const styles = window.getComputedStyle(heroText);
          results.heroText = {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            lineHeight: styles.lineHeight,
            letterSpacing: styles.letterSpacing,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            textContent: heroText.textContent?.substring(0, 50) + '...'
          };
        }

        // Meta information measurements
        const metaInfo = document.querySelector('.hero-meta, [class*="meta"]');
        if (metaInfo) {
          const rect = metaInfo.getBoundingClientRect();
          const styles = window.getComputedStyle(metaInfo);
          results.metaInfo = {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            marginTop: styles.marginTop
          };
        }

        // Video measurements
        const video = document.querySelector('.hero-video, video, [class*="video"]');
        if (video) {
          const rect = video.getBoundingClientRect();
          const styles = window.getComputedStyle(video);
          results.video = {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            borderRadius: styles.borderRadius,
            boxShadow: styles.boxShadow
          };
        }

        // Layout measurements
        const heroSection = document.querySelector('.hero, main, section');
        if (heroSection) {
          const rect = heroSection.getBoundingClientRect();
          results.layout = {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
          };
        }

        // Spacing calculations
        if (results.heroText.top && results.metaInfo.top) {
          results.spacing.heroToMeta = Math.abs(results.metaInfo.top - (results.heroText.top + results.heroText.height));
        }
        if (results.metaInfo.top && results.video.top) {
          results.spacing.metaToVideo = Math.abs(results.video.top - (results.metaInfo.top + results.metaInfo.height));
        }
        if (results.heroText.top) {
          results.spacing.topToHero = results.heroText.top;
        }

        return results;
      });

      await browser.close();

      this.measurements = measurements;
      this.logMeasurements(measurements);

      return measurements;

    } catch (error) {
      await browser.close();
      console.error('❌ Error extracting measurements:', error.message);
      throw error;
    }
  }

  logMeasurements(measurements) {
    console.log('📊 EXTRACTED MEASUREMENTS:');
    console.log('==========================\n');

    if (measurements.heroText.fontSize) {
      console.log('📝 HERO TEXT:');
      console.log(`   Font Size: ${measurements.heroText.fontSize}`);
      console.log(`   Font Weight: ${measurements.heroText.fontWeight}`);
      console.log(`   Line Height: ${measurements.heroText.lineHeight}`);
      console.log(`   Letter Spacing: ${measurements.heroText.letterSpacing}`);
      console.log(`   Position: ${measurements.heroText.top}px, ${measurements.heroText.left}px`);
      console.log(`   Size: ${measurements.heroText.width}px × ${measurements.heroText.height}px\n`);
    }

    if (measurements.metaInfo.fontSize) {
      console.log('📍 META INFO:');
      console.log(`   Font Size: ${measurements.metaInfo.fontSize}`);
      console.log(`   Font Weight: ${measurements.metaInfo.fontWeight}`);
      console.log(`   Position: ${measurements.metaInfo.top}px, ${measurements.metaInfo.left}px`);
      console.log(`   Size: ${measurements.metaInfo.width}px × ${measurements.metaInfo.height}px\n`);
    }

    if (measurements.video.width) {
      console.log('🎥 VIDEO:');
      console.log(`   Size: ${measurements.video.width}px × ${measurements.video.height}px`);
      console.log(`   Position: ${measurements.video.top}px, ${measurements.video.left}px`);
      console.log(`   Border Radius: ${measurements.video.borderRadius}\n`);
    }

    if (Object.keys(measurements.spacing).length > 0) {
      console.log('📐 SPACING:');
      Object.entries(measurements.spacing).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}px`);
      });
      console.log('');
    }

    console.log('✅ MEASUREMENTS EXTRACTED SUCCESSFULLY!\n');
  }

  compareMeasurements(before, after) {
    console.log('🔄 COMPARING MEASUREMENTS:');
    console.log('==========================\n');

    const changes = {};

    // Compare hero text
    if (before.heroText && after.heroText) {
      changes.heroText = {};
      Object.keys(before.heroText).forEach(key => {
        if (before.heroText[key] !== after.heroText[key]) {
          changes.heroText[key] = {
            before: before.heroText[key],
            after: after.heroText[key]
          };
        }
      });
    }

    // Compare meta info
    if (before.metaInfo && after.metaInfo) {
      changes.metaInfo = {};
      Object.keys(before.metaInfo).forEach(key => {
        if (before.metaInfo[key] !== after.metaInfo[key]) {
          changes.metaInfo[key] = {
            before: before.metaInfo[key],
            after: after.metaInfo[key]
          };
        }
      });
    }

    // Compare video
    if (before.video && after.video) {
      changes.video = {};
      Object.keys(before.video).forEach(key => {
        if (before.video[key] !== after.video[key]) {
          changes.video[key] = {
            before: before.video[key],
            after: after.video[key]
          };
        }
      });
    }

    // Compare spacing
    if (before.spacing && after.spacing) {
      changes.spacing = {};
      Object.keys(before.spacing).forEach(key => {
        if (before.spacing[key] !== after.spacing[key]) {
          changes.spacing[key] = {
            before: before.spacing[key],
            after: after.spacing[key]
          };
        }
      });
    }

    this.logChanges(changes);
    return changes;
  }

  logChanges(changes) {
    console.log('📊 MEASUREMENT CHANGES DETECTED:');
    console.log('================================\n');

    Object.entries(changes).forEach(([category, categoryChanges]) => {
      if (Object.keys(categoryChanges).length > 0) {
        console.log(`🎯 ${category.toUpperCase()}:`);
        Object.entries(categoryChanges).forEach(([property, change]) => {
          console.log(`   ${property}: ${change.before} → ${change.after}`);
        });
        console.log('');
      }
    });

    if (Object.keys(changes).length === 0) {
      console.log('ℹ️  No measurement changes detected\n');
    }
  }

  getMeasurements() {
    return this.measurements;
  }
}

export default MeasurementExtractor;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new MeasurementExtractor();
  
  console.log('🔍 MEASUREMENT EXTRACTOR');
  console.log('========================\n');
  console.log('Usage:');
  console.log('  const extractor = new MeasurementExtractor();');
  console.log('  const measurements = await extractor.extractMeasurements(screenshotPath);');
  console.log('  const changes = extractor.compareMeasurements(before, after);\n');
}
