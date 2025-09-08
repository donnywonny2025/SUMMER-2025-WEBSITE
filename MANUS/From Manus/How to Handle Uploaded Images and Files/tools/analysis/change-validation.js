import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change Validation System - Prevents destructive changes
export function validateChanges(iterationNumber, changes) {
  console.log('\n🛡️ CHANGE VALIDATION SYSTEM');
  console.log('============================');
  
  const validation = {
    safe: true,
    warnings: [],
    errors: [],
    recommendations: []
  };
  
  // Check for destructive changes
  changes.forEach(change => {
    // Check for font-size that's too extreme
    if (change.includes('font-size') && change.includes('rem')) {
      const sizeMatch = change.match(/(\d+\.?\d*)rem/);
      if (sizeMatch) {
        const size = parseFloat(sizeMatch[1]);
        if (size < 0.5 || size > 8) {
          validation.warnings.push(`⚠️ Font size ${size}rem is extreme - may break layout`);
          validation.recommendations.push('Try smaller increments (0.1-0.2rem)');
        }
      }
    }
    
    // Check for z-index that's too high
    if (change.includes('z-index')) {
      const zMatch = change.match(/z-index:\s*(\d+)/);
      if (zMatch) {
        const z = parseInt(zMatch[1]);
        if (z > 10000) {
          validation.warnings.push(`⚠️ Z-index ${z} is very high - may cause stacking issues`);
        }
      }
    }
    
    // Check for opacity that's too low
    if (change.includes('opacity')) {
      const opacityMatch = change.match(/opacity:\s*(\d+\.?\d*)/);
      if (opacityMatch) {
        const opacity = parseFloat(opacityMatch[1]);
        if (opacity < 0.1) {
          validation.warnings.push(`⚠️ Opacity ${opacity} is very low - element may be invisible`);
        }
      }
    }
    
    // Check for positioning that's too extreme
    if (change.includes('transform: translate')) {
      const translateMatch = change.match(/translate\(([^)]+)\)/);
      if (translateMatch) {
        const values = translateMatch[1].split(',').map(v => parseFloat(v.trim()));
        if (values.some(v => Math.abs(v) > 200)) {
          validation.warnings.push(`⚠️ Transform values are extreme - may move elements off-screen`);
        }
      }
    }
  });
  
  // Check if this is a repeated change pattern
  const memoryFile = path.join(__dirname, '..', '..', 'docs', 'analysis', 'iteration-memory.json');
  if (fs.existsSync(memoryFile)) {
    const memory = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
    const recentIterations = memory.slice(-3); // Last 3 iterations
    
    // Check for repeated font-size changes
    const fontSizeChanges = recentIterations.filter(iter => 
      iter.changes.some(change => change.includes('font-size'))
    );
    
    if (fontSizeChanges.length >= 2) {
      validation.warnings.push('⚠️ Multiple font-size changes in recent iterations - consider different approach');
      validation.recommendations.push('Try changing font-weight, line-height, or letter-spacing instead');
    }
    
    // Check for repeated positioning changes
    const positionChanges = recentIterations.filter(iter => 
      iter.changes.some(change => change.includes('position:') || change.includes('transform:'))
    );
    
    if (positionChanges.length >= 2) {
      validation.warnings.push('⚠️ Multiple positioning changes in recent iterations - consider structural approach');
      validation.recommendations.push('Check HTML structure or try different CSS properties');
    }
  }
  
  // Display validation results
  if (validation.warnings.length > 0) {
    console.log('⚠️ VALIDATION WARNINGS:');
    validation.warnings.forEach(warning => console.log(`   ${warning}`));
  }
  
  if (validation.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:');
    validation.recommendations.forEach(rec => console.log(`   ${rec}`));
  }
  
  if (validation.warnings.length === 0) {
    console.log('✅ All changes appear safe');
  }
  
  return validation;
}

// Function to check if changes actually worked
export function checkChangeEffectiveness(iterationNumber) {
  console.log('\n🔍 CHECKING CHANGE EFFECTIVENESS');
  console.log('=================================');
  
  const memoryFile = path.join(__dirname, '..', '..', 'docs', 'analysis', 'iteration-memory.json');
  if (!fs.existsSync(memoryFile)) {
    console.log('❌ No memory file found - cannot check effectiveness');
    return { effective: false, reason: 'No memory data' };
  }
  
  const memory = JSON.parse(fs.readFileSync(memoryFile, 'utf8'));
  const currentIteration = memory.find(iter => iter.iteration === iterationNumber);
  
  if (!currentIteration) {
    console.log('❌ Current iteration not found in memory');
    return { effective: false, reason: 'Iteration not found' };
  }
  
  // Check if observations show improvement
  const hasImprovement = currentIteration.observations.some(obs => 
    obs.includes('better') || obs.includes('improved') || obs.includes('closer') || obs.includes('fixed')
  );
  
  const hasRegression = currentIteration.observations.some(obs => 
    obs.includes('worse') || obs.includes('broken') || obs.includes('destroyed') || obs.includes('missing')
  );
  
  if (hasRegression) {
    console.log('❌ Changes caused regression - need to revert');
    return { effective: false, reason: 'Regression detected' };
  }
  
  if (hasImprovement) {
    console.log('✅ Changes show improvement');
    return { effective: true, reason: 'Improvement detected' };
  }
  
  console.log('⚠️ Changes show no clear improvement');
  return { effective: false, reason: 'No improvement detected' };
}

// Function to suggest safer alternatives
export function suggestSaferAlternatives(changes) {
  console.log('\n💡 SUGGESTING SAFER ALTERNATIVES');
  console.log('=================================');
  
  const alternatives = [];
  
  changes.forEach(change => {
    if (change.includes('font-size')) {
      alternatives.push('Try font-weight: 200-300 instead of changing size');
      alternatives.push('Try line-height: 1.1-1.2 for better spacing');
      alternatives.push('Try letter-spacing: -0.02em for tighter text');
    }
    
    if (change.includes('width') || change.includes('height')) {
      alternatives.push('Try max-width instead of fixed width');
      alternatives.push('Try aspect-ratio for consistent proportions');
      alternatives.push('Try padding/margin adjustments instead of size changes');
    }
    
    if (change.includes('position: absolute')) {
      alternatives.push('Try flexbox or grid for better layout control');
      alternatives.push('Check if parent container has proper positioning');
      alternatives.push('Try transform: translate() for precise positioning');
    }
  });
  
  if (alternatives.length > 0) {
    console.log('🔄 ALTERNATIVE APPROACHES:');
    alternatives.forEach(alt => console.log(`   ${alt}`));
  }
  
  return alternatives;
}

// Main validation function
export function runChangeValidation(iterationNumber, changes) {
  console.log(`\n🛡️ VALIDATING CHANGES FOR ITERATION ${iterationNumber}`);
  console.log('================================================');
  
  const validation = validateChanges(iterationNumber, changes);
  const effectiveness = checkChangeEffectiveness(iterationNumber);
  const alternatives = suggestSaferAlternatives(changes);
  
  return {
    validation,
    effectiveness,
    alternatives,
    shouldProceed: validation.safe && effectiveness.effective
  };
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const iterationNumber = parseInt(process.argv[2]) || 1;
  const changes = process.argv.slice(3) || [];
  
  runChangeValidation(iterationNumber, changes);
}


