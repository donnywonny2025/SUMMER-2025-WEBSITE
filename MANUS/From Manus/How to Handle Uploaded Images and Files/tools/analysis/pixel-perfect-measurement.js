import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

console.log('🎯 PIXEL-PERFECT MEASUREMENT SYSTEM');
console.log('====================================\n');

class PixelPerfectMeasurement {
  constructor() {
    this.browser = null;
    this.page = null;
    this.measurements = {};
  }

  async initialize() {
    this.browser = await chromium.launch({ 
      headless: true,
      timeout: 10000,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(15000);
  }

  async measureElement(selector, measurementType = 'all') {
    if (!this.page) await this.initialize();

    const measurements = await this.page.evaluate(({ sel, type }) => {
      const element = document.querySelector(sel);
      if (!element) return null;

      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);
      
      const result = {
        selector: sel,
        timestamp: new Date().toISOString(),
        position: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom)
        },
        dimensions: {
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        }
      };

      // Typography measurements
      if (type === 'all' || type === 'typography') {
        result.typography = {
          fontSize: computedStyle.fontSize,
          fontWeight: computedStyle.fontWeight,
          lineHeight: computedStyle.lineHeight,
          letterSpacing: computedStyle.letterSpacing,
          fontFamily: computedStyle.fontFamily,
          color: computedStyle.color
        };
      }

      // Spacing measurements
      if (type === 'all' || type === 'spacing') {
        result.spacing = {
          marginTop: computedStyle.marginTop,
          marginRight: computedStyle.marginRight,
          marginBottom: computedStyle.marginBottom,
          marginLeft: computedStyle.marginLeft,
          paddingTop: computedStyle.paddingTop,
          paddingRight: computedStyle.paddingRight,
          paddingBottom: computedStyle.paddingBottom,
          paddingLeft: computedStyle.paddingLeft
        };
      }

      // Visual measurements
      if (type === 'all' || type === 'visual') {
        result.visual = {
          opacity: computedStyle.opacity,
          transform: computedStyle.transform,
          border: computedStyle.border,
          borderRadius: computedStyle.borderRadius,
          boxShadow: computedStyle.boxShadow,
          background: computedStyle.background
        };
      }

      return result;
    }, { sel: selector, type: measurementType });

    return measurements;
  }

  async measureMultipleElements(selectors) {
    const results = {};
    
    for (const selector of selectors) {
      console.log(`📏 Measuring: ${selector}`);
      const measurement = await this.measureElement(selector);
      if (measurement) {
        results[selector] = measurement;
      }
    }
    
    return results;
  }

  async measureSamKolderSite() {
    console.log('🎯 Measuring Sam Kolder\'s site...');
    
    try {
      await this.page.goto('https://www.samkolder.com', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for content to load
      await this.page.waitForTimeout(3000);
      
      const samMeasurements = await this.measureMultipleElements([
        '.hero-content h1',
        '.hero-meta',
        '.hero-video',
        '.circular-showreel',
        '.meta-item'
      ]);
      
      console.log('✅ Sam Kolder measurements extracted');
      return samMeasurements;
      
    } catch (error) {
      console.error('❌ Error measuring Sam Kolder site:', error.message);
      return null;
    }
  }

  async measureOurSite() {
    console.log('🎯 Measuring our site...');
    
    try {
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for content to load
      await this.page.waitForTimeout(2000);
      
      const ourMeasurements = await this.measureMultipleElements([
        '.hero-content h1',
        '.hero-meta',
        '.hero-video',
        '.circular-showreel',
        '.meta-item'
      ]);
      
      console.log('✅ Our site measurements extracted');
      return ourMeasurements;
      
    } catch (error) {
      console.error('❌ Error measuring our site:', error.message);
      return null;
    }
  }

  async generateMeasurementReport() {
    console.log('📊 Generating comprehensive measurement report...');
    
    const samMeasurements = await this.measureSamKolderSite();
    const ourMeasurements = await this.measureOurSite();
    
    if (!samMeasurements || !ourMeasurements) {
      console.error('❌ Failed to extract measurements from one or both sites');
      return null;
    }
    
    const report = {
      timestamp: new Date().toISOString(),
      samKolder: samMeasurements,
      ourSite: ourMeasurements,
      differences: this.calculateDifferences(samMeasurements, ourMeasurements),
      recommendations: this.generateRecommendations(samMeasurements, ourMeasurements)
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'screenshots', 'measurement-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Measurement report saved: ${reportPath}`);
    return report;
  }

  calculateDifferences(sam, ours) {
    const differences = {};
    
    for (const selector in sam) {
      if (ours[selector]) {
        differences[selector] = this.compareMeasurements(sam[selector], ours[selector]);
      }
    }
    
    return differences;
  }

  compareMeasurements(sam, ours) {
    const diff = {};
    
    // Compare typography
    if (sam.typography && ours.typography) {
      diff.typography = {};
      for (const prop in sam.typography) {
        if (ours.typography[prop] && sam.typography[prop] !== ours.typography[prop]) {
          diff.typography[prop] = {
            sam: sam.typography[prop],
            ours: ours.typography[prop],
            needsChange: true
          };
        }
      }
    }
    
    // Compare dimensions
    if (sam.dimensions && ours.dimensions) {
      diff.dimensions = {};
      for (const prop in sam.dimensions) {
        const samVal = sam.dimensions[prop];
        const ourVal = ours.dimensions[prop];
        const percentageDiff = Math.round(((ourVal - samVal) / samVal) * 100);
        
        diff.dimensions[prop] = {
          sam: samVal,
          ours: ourVal,
          difference: ourVal - samVal,
          percentageDiff: percentageDiff,
          needsChange: Math.abs(percentageDiff) > 5
        };
      }
    }
    
    // Compare position
    if (sam.position && ours.position) {
      diff.position = {};
      for (const prop in sam.position) {
        const samVal = sam.position[prop];
        const ourVal = ours.position[prop];
        const difference = ourVal - samVal;
        
        diff.position[prop] = {
          sam: samVal,
          ours: ourVal,
          difference: difference,
          needsChange: Math.abs(difference) > 10
        };
      }
    }
    
    return diff;
  }

  generateRecommendations(sam, ours) {
    const recommendations = [];
    
    for (const selector in sam) {
      if (ours[selector]) {
        const diff = this.compareMeasurements(sam[selector], ours[selector]);
        
        // Typography recommendations
        if (diff.typography) {
          for (const prop in diff.typography) {
            if (diff.typography[prop].needsChange) {
              recommendations.push({
                selector: selector,
                property: prop,
                currentValue: diff.typography[prop].ours,
                targetValue: diff.typography[prop].sam,
                action: `Change ${prop} from "${diff.typography[prop].ours}" to "${diff.typography[prop].sam}"`
              });
            }
          }
        }
        
        // Dimension recommendations
        if (diff.dimensions) {
          for (const prop in diff.dimensions) {
            if (diff.dimensions[prop].needsChange) {
              const targetValue = sam[selector].dimensions[prop];
              recommendations.push({
                selector: selector,
                property: prop,
                currentValue: diff.dimensions[prop].ours,
                targetValue: targetValue,
                action: `Adjust ${prop} from ${diff.dimensions[prop].ours}px to ${targetValue}px`
              });
            }
          }
        }
      }
    }
    
    return recommendations;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const measurement = new PixelPerfectMeasurement();
  
  try {
    await measurement.initialize();
    const report = await measurement.generateMeasurementReport();
    
    if (report) {
      console.log('\n🎯 MEASUREMENT REPORT SUMMARY');
      console.log('=============================');
      console.log(`📊 Total recommendations: ${report.recommendations.length}`);
      
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.selector} - ${rec.action}`);
      });
      
      console.log('\n✅ Measurement extraction complete!');
      console.log('📄 Full report saved to: screenshots/measurement-report.json');
    }
    
  } catch (error) {
    console.error('❌ Measurement extraction failed:', error.message);
  } finally {
    await measurement.close();
  }
}

// Export for use in other scripts
export default PixelPerfectMeasurement;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
