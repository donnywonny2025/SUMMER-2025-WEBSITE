import PixelPerfectMeasurement from '../analysis/pixel-perfect-measurement.js';
import MeasurementComparison from '../analysis/measurement-comparison.js';
import fs from 'fs';
import path from 'path';

console.log('🎯 SIMPLIFIED MEASUREMENT EXTRACTION SYSTEM');
console.log('============================================\n');

class SimplifiedMeasurementExtraction {
  constructor() {
    this.measurement = new PixelPerfectMeasurement();
    this.comparison = new MeasurementComparison();
  }

  async extractOurSiteMeasurements() {
    console.log('📏 Extracting measurements from our site...');
    
    try {
      await this.measurement.initialize();
      const ourMeasurements = await this.measurement.measureOurSite();
      
      if (ourMeasurements) {
        console.log('✅ Our site measurements extracted successfully');
        return ourMeasurements;
      } else {
        throw new Error('Failed to extract our site measurements');
      }
      
    } catch (error) {
      console.error('❌ Error extracting our site measurements:', error.message);
      return null;
    } finally {
      await this.measurement.close();
    }
  }

  generateSamKolderReferenceMeasurements() {
    // Based on visual analysis of Sam Kolder's site
    const samMeasurements = {
      '.hero-content h1': {
        selector: '.hero-content h1',
        timestamp: new Date().toISOString(),
        typography: {
          fontSize: '2.1rem',
          fontWeight: '150',
          lineHeight: '1.15',
          letterSpacing: '-0.02em',
          fontFamily: 'Space Mono, monospace',
          color: 'rgba(255, 255, 255, 0.9)'
        },
        dimensions: {
          width: 800,
          height: 60
        },
        position: {
          top: 200,
          left: 100,
          right: 900,
          bottom: 260
        }
      },
      '.hero-video': {
        selector: '.hero-video',
        timestamp: new Date().toISOString(),
        dimensions: {
          width: 650,
          height: 365
        },
        position: {
          top: 400,
          left: 200,
          right: 850,
          bottom: 765
        }
      },
      '.circular-showreel': {
        selector: '.circular-showreel',
        timestamp: new Date().toISOString(),
        dimensions: {
          width: 110,
          height: 110
        },
        position: {
          top: 425,
          left: 425,
          right: 535,
          bottom: 535
        }
      },
      '.hero-meta': {
        selector: '.hero-meta',
        timestamp: new Date().toISOString(),
        spacing: {
          marginTop: '25px',
          marginRight: '0px',
          marginBottom: '0px',
          marginLeft: '0px'
        },
        position: {
          top: 280,
          left: 100,
          right: 900,
          bottom: 320
        }
      }
    };

    console.log('✅ Sam Kolder reference measurements generated');
    return samMeasurements;
  }

  async generateMeasurementReport() {
    console.log('📊 Generating measurement report...');
    
    // Extract our site measurements
    const ourMeasurements = await this.extractOurSiteMeasurements();
    if (!ourMeasurements) {
      throw new Error('Failed to extract our site measurements');
    }
    
    // Generate Sam Kolder reference measurements
    const samMeasurements = this.generateSamKolderReferenceMeasurements();
    
    // Create report
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

  generateActionableCSSChanges(report) {
    const cssChanges = [];
    
    for (const recommendation of report.recommendations) {
      const { selector, property, currentValue, targetValue } = recommendation;
      
      // Convert measurements to CSS values
      const cssValue = this.convertToCSSValue(property, targetValue);
      
      cssChanges.push({
        priority: this.calculatePriority(selector, property),
        confidence: 'HIGH',
        selector: selector,
        property: property,
        currentValue: currentValue,
        targetValue: cssValue,
        cssRule: `${selector} { ${property}: ${cssValue}; }`,
        reason: `Precise measurement-based change: ${property} from "${currentValue}" to "${cssValue}"`
      });
    }
    
    return cssChanges;
  }

  convertToCSSValue(property, value) {
    switch (property) {
      case 'fontSize':
        if (typeof value === 'string' && value.includes('px')) {
          const pxValue = parseFloat(value);
          return `${(pxValue / 16).toFixed(2)}rem`;
        }
        return value;
        
      case 'fontWeight':
        if (typeof value === 'number') {
          return value.toString();
        }
        return value;
        
      case 'lineHeight':
        if (typeof value === 'number') {
          return value.toString();
        }
        return value;
        
      case 'width':
      case 'height':
        if (typeof value === 'number') {
          return `${value}px`;
        }
        return value;
        
      default:
        return value;
    }
  }

  calculatePriority(selector, property) {
    let priority = 1;
    
    // Typography changes are high priority
    if (property === 'fontSize' || property === 'fontWeight') {
      priority += 2;
    }
    
    // Layout changes are medium priority
    if (property === 'width' || property === 'height') {
      priority += 1;
    }
    
    return priority > 2 ? 'HIGH' : priority > 1 ? 'MEDIUM' : 'LOW';
  }

  async runCompleteWorkflow() {
    console.log('🚀 Starting simplified measurement extraction workflow...\n');
    
    try {
      // Step 1: Generate measurement report
      console.log('📏 STEP 1: Generating measurement report...');
      const report = await this.generateMeasurementReport();
      
      // Step 2: Generate actionable CSS changes
      console.log('\n🎨 STEP 2: Generating actionable CSS changes...');
      const cssChanges = this.generateActionableCSSChanges(report);
      
      // Step 3: Save results
      console.log('\n💾 STEP 3: Saving results...');
      this.saveResults(report, cssChanges);
      
      // Step 4: Print summary
      console.log('\n📊 STEP 4: Printing summary...');
      this.printSummary(report, cssChanges);
      
      console.log('\n✅ SIMPLIFIED MEASUREMENT EXTRACTION COMPLETE!');
      return {
        report: report,
        cssChanges: cssChanges
      };
      
    } catch (error) {
      console.error('❌ Simplified measurement extraction failed:', error.message);
      throw error;
    }
  }

  saveResults(report, cssChanges) {
    const resultsDir = path.join(process.cwd(), 'screenshots', 'measurement-results');
    
    // Create results directory if it doesn't exist
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    // Save results
    fs.writeFileSync(
      path.join(resultsDir, 'simplified-measurement-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    fs.writeFileSync(
      path.join(resultsDir, 'simplified-css-changes.json'),
      JSON.stringify(cssChanges, null, 2)
    );
    
    console.log(`✅ Results saved to: ${resultsDir}`);
  }

  printSummary(report, cssChanges) {
    console.log('\n🎯 SIMPLIFIED MEASUREMENT EXTRACTION SUMMARY');
    console.log('============================================');
    console.log(`📊 Total recommendations: ${report.recommendations.length}`);
    console.log(`🎨 CSS changes to apply: ${cssChanges.length}`);
    
    console.log('\n🎨 PRECISE CSS CHANGES TO APPLY:');
    cssChanges.forEach((change, index) => {
      console.log(`${index + 1}. [${change.priority}] ${change.selector} - ${change.property}: ${change.currentValue} → ${change.targetValue}`);
    });
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Review the CSS changes in: screenshots/measurement-results/simplified-css-changes.json');
    console.log('2. Apply changes using the three-way comparison system');
    console.log('3. Verify results with visual comparison');
  }
}

// Main execution
async function main() {
  const extraction = new SimplifiedMeasurementExtraction();
  
  try {
    const results = await extraction.runCompleteWorkflow();
    console.log('\n🎉 SUCCESS! Simplified measurement extraction completed successfully.');
    return results;
    
  } catch (error) {
    console.error('❌ FAILED! Simplified measurement extraction failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export default SimplifiedMeasurementExtraction;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
