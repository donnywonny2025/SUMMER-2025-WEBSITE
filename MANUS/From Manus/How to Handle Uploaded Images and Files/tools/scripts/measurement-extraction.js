import PixelPerfectMeasurement from '../analysis/pixel-perfect-measurement.js';
import MeasurementComparison from '../analysis/measurement-comparison.js';
import fs from 'fs';
import path from 'path';

console.log('🎯 AUTOMATED MEASUREMENT EXTRACTION WORKFLOW');
console.log('=============================================\n');

class MeasurementExtractionWorkflow {
  constructor() {
    this.measurement = new PixelPerfectMeasurement();
    this.comparison = new MeasurementComparison();
    this.results = {};
  }

  async runCompleteWorkflow() {
    console.log('🚀 Starting complete measurement extraction workflow...\n');
    
    try {
      // Step 1: Extract measurements
      console.log('📏 STEP 1: Extracting measurements from both sites...');
      await this.measurement.initialize();
      const report = await this.measurement.generateMeasurementReport();
      
      if (!report) {
        throw new Error('Failed to generate measurement report');
      }
      
      // Step 2: Generate comparison
      console.log('\n🔍 STEP 2: Generating measurement comparison...');
      const comparisonReport = this.comparison.generateComparisonReport();
      
      if (!comparisonReport) {
        throw new Error('Failed to generate comparison report');
      }
      
      // Step 3: Generate actionable CSS changes
      console.log('\n🎨 STEP 3: Generating actionable CSS changes...');
      const cssChanges = this.generateActionableCSSChanges(comparisonReport);
      
      // Step 4: Create implementation plan
      console.log('\n📋 STEP 4: Creating implementation plan...');
      const implementationPlan = this.createImplementationPlan(cssChanges);
      
      // Step 5: Save all results
      console.log('\n💾 STEP 5: Saving all results...');
      this.saveResults(report, comparisonReport, cssChanges, implementationPlan);
      
      // Step 6: Print summary
      console.log('\n📊 STEP 6: Printing summary...');
      this.printWorkflowSummary(comparisonReport, cssChanges, implementationPlan);
      
      console.log('\n✅ MEASUREMENT EXTRACTION WORKFLOW COMPLETE!');
      return {
        report: report,
        comparison: comparisonReport,
        cssChanges: cssChanges,
        implementationPlan: implementationPlan
      };
      
    } catch (error) {
      console.error('❌ Measurement extraction workflow failed:', error.message);
      throw error;
    } finally {
      await this.measurement.close();
    }
  }

  generateActionableCSSChanges(comparisonReport) {
    const cssChanges = [];
    
    // Process high confidence changes first
    for (const change of comparisonReport.actionPlan.highConfidence) {
      cssChanges.push({
        priority: 'HIGH',
        confidence: 'HIGH',
        selector: change.selector,
        property: change.property,
        currentValue: change.currentValue,
        targetValue: change.targetValue,
        cssRule: `${change.selector} { ${change.property}: ${change.targetValue}; }`,
        reason: `High confidence change: ${change.change.direction} ${change.property} by ${change.change.magnitude || 'unknown'}%`
      });
    }
    
    // Process critical changes
    for (const change of comparisonReport.actionPlan.critical) {
      cssChanges.push({
        priority: 'CRITICAL',
        confidence: 'HIGH',
        selector: change.selector,
        property: change.property,
        currentValue: change.currentValue,
        targetValue: change.targetValue,
        cssRule: `${change.selector} { ${change.property}: ${change.targetValue}; }`,
        reason: `Critical change: ${change.change.direction} ${change.property} by ${change.change.magnitude || 'unknown'}%`
      });
    }
    
    // Process medium confidence changes
    for (const change of comparisonReport.actionPlan.mediumConfidence) {
      cssChanges.push({
        priority: 'MEDIUM',
        confidence: 'MEDIUM',
        selector: change.selector,
        property: change.property,
        currentValue: change.currentValue,
        targetValue: change.targetValue,
        cssRule: `${change.selector} { ${change.property}: ${change.targetValue}; }`,
        reason: `Medium confidence change: ${change.change.direction} ${change.property} by ${change.change.magnitude || 'unknown'}%`
      });
    }
    
    return cssChanges;
  }

  createImplementationPlan(cssChanges) {
    const plan = {
      timestamp: new Date().toISOString(),
      totalChanges: cssChanges.length,
      criticalChanges: cssChanges.filter(c => c.priority === 'CRITICAL').length,
      highPriorityChanges: cssChanges.filter(c => c.priority === 'HIGH').length,
      mediumPriorityChanges: cssChanges.filter(c => c.priority === 'MEDIUM').length,
      steps: []
    };
    
    // Group changes by selector for efficient implementation
    const changesBySelector = {};
    for (const change of cssChanges) {
      if (!changesBySelector[change.selector]) {
        changesBySelector[change.selector] = [];
      }
      changesBySelector[change.selector].push(change);
    }
    
    // Create implementation steps
    let stepNumber = 1;
    
    // Step 1: Critical changes
    const criticalChanges = cssChanges.filter(c => c.priority === 'CRITICAL');
    if (criticalChanges.length > 0) {
      plan.steps.push({
        step: stepNumber++,
        title: 'Critical Changes',
        priority: 'CRITICAL',
        changes: criticalChanges,
        description: 'Apply critical changes that have the biggest impact on matching Sam Kolder\'s design'
      });
    }
    
    // Step 2: High priority changes
    const highPriorityChanges = cssChanges.filter(c => c.priority === 'HIGH');
    if (highPriorityChanges.length > 0) {
      plan.steps.push({
        step: stepNumber++,
        title: 'High Priority Changes',
        priority: 'HIGH',
        changes: highPriorityChanges,
        description: 'Apply high confidence changes for typography and layout'
      });
    }
    
    // Step 3: Medium priority changes
    const mediumPriorityChanges = cssChanges.filter(c => c.priority === 'MEDIUM');
    if (mediumPriorityChanges.length > 0) {
      plan.steps.push({
        step: stepNumber++,
        title: 'Medium Priority Changes',
        priority: 'MEDIUM',
        changes: mediumPriorityChanges,
        description: 'Apply medium confidence changes for fine-tuning'
      });
    }
    
    return plan;
  }

  saveResults(report, comparisonReport, cssChanges, implementationPlan) {
    const resultsDir = path.join(process.cwd(), 'screenshots', 'measurement-results');
    
    // Create results directory if it doesn't exist
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    // Save individual results
    fs.writeFileSync(
      path.join(resultsDir, 'measurement-report.json'),
      JSON.stringify(report, null, 2)
    );
    
    fs.writeFileSync(
      path.join(resultsDir, 'comparison-report.json'),
      JSON.stringify(comparisonReport, null, 2)
    );
    
    fs.writeFileSync(
      path.join(resultsDir, 'css-changes.json'),
      JSON.stringify(cssChanges, null, 2)
    );
    
    fs.writeFileSync(
      path.join(resultsDir, 'implementation-plan.json'),
      JSON.stringify(implementationPlan, null, 2)
    );
    
    // Save combined results
    const combinedResults = {
      timestamp: new Date().toISOString(),
      report: report,
      comparison: comparisonReport,
      cssChanges: cssChanges,
      implementationPlan: implementationPlan
    };
    
    fs.writeFileSync(
      path.join(resultsDir, 'combined-results.json'),
      JSON.stringify(combinedResults, null, 2)
    );
    
    console.log(`✅ Results saved to: ${resultsDir}`);
  }

  printWorkflowSummary(comparisonReport, cssChanges, implementationPlan) {
    console.log('\n🎯 MEASUREMENT EXTRACTION WORKFLOW SUMMARY');
    console.log('==========================================');
    console.log(`📊 Total measurements analyzed: ${comparisonReport.summary.totalRecommendations}`);
    console.log(`🚨 Critical changes: ${comparisonReport.summary.critical}`);
    console.log(`🟢 High confidence changes: ${comparisonReport.summary.highConfidence}`);
    console.log(`🟡 Medium confidence changes: ${comparisonReport.summary.mediumConfidence}`);
    console.log(`📋 Implementation steps: ${implementationPlan.steps.length}`);
    
    console.log('\n🎨 CSS CHANGES TO APPLY:');
    cssChanges.forEach((change, index) => {
      console.log(`${index + 1}. [${change.priority}] ${change.selector} - ${change.property}: ${change.currentValue} → ${change.targetValue}`);
    });
    
    console.log('\n📋 IMPLEMENTATION PLAN:');
    implementationPlan.steps.forEach(step => {
      console.log(`Step ${step.step}: ${step.title} (${step.changes.length} changes)`);
    });
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Review the CSS changes in: screenshots/measurement-results/css-changes.json');
    console.log('2. Apply changes using the implementation plan');
    console.log('3. Use the three-way comparison system to verify results');
    console.log('4. Iterate based on visual feedback');
  }
}

// Main execution
async function main() {
  const workflow = new MeasurementExtractionWorkflow();
  
  try {
    const results = await workflow.runCompleteWorkflow();
    console.log('\n🎉 SUCCESS! Measurement extraction workflow completed successfully.');
    return results;
    
  } catch (error) {
    console.error('❌ FAILED! Measurement extraction workflow failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export default MeasurementExtractionWorkflow;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
