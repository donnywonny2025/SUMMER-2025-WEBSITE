import fs from 'fs';
import path from 'path';

console.log('🔍 MEASUREMENT COMPARISON SYSTEM');
console.log('=================================\n');

class MeasurementComparison {
  constructor() {
    this.reportPath = path.join(process.cwd(), 'screenshots', 'measurement-report.json');
  }

  loadMeasurementReport() {
    try {
      if (fs.existsSync(this.reportPath)) {
        const report = JSON.parse(fs.readFileSync(this.reportPath, 'utf8'));
        console.log('✅ Measurement report loaded');
        return report;
      } else {
        console.log('❌ No measurement report found. Run pixel-perfect-measurement.js first.');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading measurement report:', error.message);
      return null;
    }
  }

  generateCSSRecommendations(report) {
    const cssChanges = [];
    
    for (const recommendation of report.recommendations) {
      const { selector, property, currentValue, targetValue } = recommendation;
      
      // Convert measurements to CSS values
      const cssValue = this.convertToCSSValue(property, targetValue);
      
      cssChanges.push({
        selector: selector,
        property: property,
        currentValue: currentValue,
        targetValue: cssValue,
        cssRule: `${selector} { ${property}: ${cssValue}; }`
      });
    }
    
    return cssChanges;
  }

  convertToCSSValue(property, value) {
    // Handle different property types
    switch (property) {
      case 'fontSize':
        // Convert px to rem if needed
        if (typeof value === 'string' && value.includes('px')) {
          const pxValue = parseFloat(value);
          return `${(pxValue / 16).toFixed(2)}rem`;
        }
        return value;
        
      case 'fontWeight':
        // Convert numeric to string if needed
        if (typeof value === 'number') {
          return value.toString();
        }
        return value;
        
      case 'lineHeight':
        // Ensure proper format
        if (typeof value === 'number') {
          return value.toString();
        }
        return value;
        
      case 'letterSpacing':
        return value;
        
      case 'width':
      case 'height':
        // Convert px to percentage or keep as px
        if (typeof value === 'number') {
          return `${value}px`;
        }
        return value;
        
      case 'marginTop':
      case 'marginRight':
      case 'marginBottom':
      case 'marginLeft':
      case 'paddingTop':
      case 'paddingRight':
      case 'paddingBottom':
      case 'paddingLeft':
        return value;
        
      default:
        return value;
    }
  }

  generatePreciseChanges(report) {
    const preciseChanges = [];
    
    for (const recommendation of report.recommendations) {
      const { selector, property, currentValue, targetValue } = recommendation;
      
      // Calculate precise change needed
      const change = this.calculatePreciseChange(property, currentValue, targetValue);
      
      preciseChanges.push({
        selector: selector,
        property: property,
        currentValue: currentValue,
        targetValue: targetValue,
        change: change,
        confidence: this.calculateConfidence(property, currentValue, targetValue)
      });
    }
    
    return preciseChanges;
  }

  calculatePreciseChange(property, current, target) {
    // Calculate the exact change needed
    if (property === 'fontSize' || property === 'width' || property === 'height') {
      const currentNum = parseFloat(current);
      const targetNum = parseFloat(target);
      const difference = targetNum - currentNum;
      const percentage = Math.round((difference / currentNum) * 100);
      
      return {
        difference: difference,
        percentage: percentage,
        direction: difference > 0 ? 'increase' : 'decrease',
        magnitude: Math.abs(percentage)
      };
    }
    
    return {
      difference: target - current,
      direction: target > current ? 'increase' : 'decrease'
    };
  }

  calculateConfidence(property, current, target) {
    // Calculate confidence level for the change
    if (property === 'fontSize' || property === 'width' || property === 'height') {
      const currentNum = parseFloat(current);
      const targetNum = parseFloat(target);
      const percentage = Math.abs((targetNum - currentNum) / currentNum) * 100;
      
      if (percentage < 5) return 'HIGH';
      if (percentage < 15) return 'MEDIUM';
      return 'LOW';
    }
    
    return 'MEDIUM';
  }

  generateActionPlan(report) {
    const actionPlan = {
      highConfidence: [],
      mediumConfidence: [],
      lowConfidence: [],
      critical: []
    };
    
    for (const recommendation of report.recommendations) {
      const { selector, property, currentValue, targetValue } = recommendation;
      const change = this.calculatePreciseChange(property, currentValue, targetValue);
      const confidence = this.calculateConfidence(property, currentValue, targetValue);
      
      const action = {
        selector: selector,
        property: property,
        currentValue: currentValue,
        targetValue: targetValue,
        change: change,
        confidence: confidence,
        priority: this.calculatePriority(selector, property, change)
      };
      
      // Categorize by confidence
      if (confidence === 'HIGH') {
        actionPlan.highConfidence.push(action);
      } else if (confidence === 'MEDIUM') {
        actionPlan.mediumConfidence.push(action);
      } else {
        actionPlan.lowConfidence.push(action);
      }
      
      // Identify critical changes
      if (this.isCriticalChange(selector, property, change)) {
        actionPlan.critical.push(action);
      }
    }
    
    return actionPlan;
  }

  calculatePriority(selector, property, change) {
    // Calculate priority based on impact
    let priority = 1;
    
    // Typography changes are high priority
    if (property === 'fontSize' || property === 'fontWeight') {
      priority += 2;
    }
    
    // Layout changes are medium priority
    if (property === 'width' || property === 'height' || property === 'marginTop') {
      priority += 1;
    }
    
    // Large changes are higher priority
    if (change.magnitude && change.magnitude > 20) {
      priority += 1;
    }
    
    return priority;
  }

  isCriticalChange(selector, property, change) {
    // Identify critical changes that need immediate attention
    if (selector.includes('hero-content h1') && property === 'fontSize') {
      return true;
    }
    
    if (selector.includes('hero-video') && (property === 'width' || property === 'height')) {
      return true;
    }
    
    if (change.magnitude && change.magnitude > 30) {
      return true;
    }
    
    return false;
  }

  generateComparisonReport() {
    const report = this.loadMeasurementReport();
    if (!report) return null;
    
    const cssRecommendations = this.generateCSSRecommendations(report);
    const preciseChanges = this.generatePreciseChanges(report);
    const actionPlan = this.generateActionPlan(report);
    
    const comparisonReport = {
      timestamp: new Date().toISOString(),
      summary: {
        totalRecommendations: report.recommendations.length,
        highConfidence: actionPlan.highConfidence.length,
        mediumConfidence: actionPlan.mediumConfidence.length,
        lowConfidence: actionPlan.lowConfidence.length,
        critical: actionPlan.critical.length
      },
      cssRecommendations: cssRecommendations,
      preciseChanges: preciseChanges,
      actionPlan: actionPlan
    };
    
    // Save comparison report
    const comparisonPath = path.join(process.cwd(), 'screenshots', 'measurement-comparison.json');
    fs.writeFileSync(comparisonPath, JSON.stringify(comparisonReport, null, 2));
    
    console.log(`✅ Comparison report saved: ${comparisonPath}`);
    return comparisonReport;
  }

  printSummary(report) {
    if (!report) return;
    
    console.log('\n🎯 MEASUREMENT COMPARISON SUMMARY');
    console.log('==================================');
    console.log(`📊 Total recommendations: ${report.summary.totalRecommendations}`);
    console.log(`🟢 High confidence: ${report.summary.highConfidence}`);
    console.log(`🟡 Medium confidence: ${report.summary.mediumConfidence}`);
    console.log(`🔴 Low confidence: ${report.summary.lowConfidence}`);
    console.log(`🚨 Critical changes: ${report.summary.critical}`);
    
    if (report.actionPlan.critical.length > 0) {
      console.log('\n🚨 CRITICAL CHANGES NEEDED:');
      report.actionPlan.critical.forEach((change, index) => {
        console.log(`${index + 1}. ${change.selector} - ${change.property}: ${change.currentValue} → ${change.targetValue}`);
      });
    }
    
    if (report.actionPlan.highConfidence.length > 0) {
      console.log('\n🟢 HIGH CONFIDENCE CHANGES:');
      report.actionPlan.highConfidence.forEach((change, index) => {
        console.log(`${index + 1}. ${change.selector} - ${change.property}: ${change.currentValue} → ${change.targetValue}`);
      });
    }
  }
}

// Main execution
async function main() {
  const comparison = new MeasurementComparison();
  
  try {
    const report = comparison.generateComparisonReport();
    comparison.printSummary(report);
    
    if (report) {
      console.log('\n✅ Measurement comparison complete!');
      console.log('📄 Full report saved to: screenshots/measurement-comparison.json');
    }
    
  } catch (error) {
    console.error('❌ Measurement comparison failed:', error.message);
  }
}

// Export for use in other scripts
export default MeasurementComparison;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
