import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧠 SMART MEMORY ANALYSIS SYSTEM');
console.log('===============================\n');

// Memory file path
const memoryPath = path.join(__dirname, '../../docs/analysis/iteration-memory.json');

// Function to load existing memory
function loadMemory() {
  if (fs.existsSync(memoryPath)) {
    try {
      const data = fs.readFileSync(memoryPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { iterations: [], currentIteration: 0 };
    }
  }
  return { iterations: [], currentIteration: 0 };
}

// Function to save memory
function saveMemory(memory) {
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// Function to analyze why changes didn't work
function analyzeFailure(iteration) {
  const analysis = {
    rootCauses: [],
    alternativeApproaches: [],
    nextSteps: []
  };

  // Analyze each change that was made
  iteration.changes.forEach(change => {
    if (change.includes('video thumbnail')) {
      if (change.includes('width') || change.includes('size')) {
        analysis.rootCauses.push('Video size changes may not be addressing the real issue - could be positioning, aspect ratio, or container constraints');
        analysis.alternativeApproaches.push('Try adjusting video positioning, aspect ratio, or container dimensions instead of just width');
      }
    }
    
    if (change.includes('hero text')) {
      if (change.includes('font-size')) {
        analysis.rootCauses.push('Text size changes may not be enough - could need font-weight, line-height, or letter-spacing adjustments');
        analysis.alternativeApproaches.push('Try adjusting font-weight to be even lighter, or letter-spacing to be tighter');
      }
    }
    
    if (change.includes('showreel')) {
      if (change.includes('background') || change.includes('border') || change.includes('opacity')) {
        analysis.rootCauses.push('Showreel visibility changes may not be addressing the real issue - could be z-index, positioning, or HTML structure');
        analysis.alternativeApproaches.push('Check if showreel is actually in the DOM, verify z-index stacking, or try different positioning approach');
      }
    }
  });

  // Generate next steps based on analysis
  if (analysis.rootCauses.length > 0) {
    analysis.nextSteps.push('Focus on root causes rather than symptoms');
    analysis.nextSteps.push('Try alternative approaches for each failed change');
    analysis.nextSteps.push('Debug HTML structure and CSS relationships');
  }

  return analysis;
}

// Function to create smart recommendations
function createSmartRecommendations(iteration) {
  const memory = loadMemory();
  const previousIterations = memory.iterations.slice(-3); // Last 3 iterations
  
  const recommendations = [];
  
  // Analyze patterns in failed attempts
  const failedChanges = previousIterations.flatMap(iter => 
    iter.changes.filter(change => 
      iter.status === 'Failed' || iter.status === 'In Progress'
    )
  );
  
  // Group similar failed changes
  const videoChanges = failedChanges.filter(change => change.includes('video'));
  const textChanges = failedChanges.filter(change => change.includes('text') || change.includes('font'));
  const showreelChanges = failedChanges.filter(change => change.includes('showreel'));
  
  // Generate smart recommendations
  if (videoChanges.length >= 2) {
    recommendations.push('🚨 VIDEO THUMBNAIL: Multiple size changes failed - try different approach:');
    recommendations.push('   - Check if video container has max-width constraints');
    recommendations.push('   - Try adjusting aspect ratio instead of width');
    recommendations.push('   - Verify video positioning relative to other elements');
  }
  
  if (textChanges.length >= 2) {
    recommendations.push('🚨 HERO TEXT: Multiple size changes failed - try different approach:');
    recommendations.push('   - Check if font-family is overriding size changes');
    recommendations.push('   - Try adjusting letter-spacing and line-height together');
    recommendations.push('   - Verify text container constraints');
  }
  
  if (showreelChanges.length >= 2) {
    recommendations.push('🚨 SHOWREEL: Multiple visibility changes failed - try different approach:');
    recommendations.push('   - Check if showreel HTML element exists in DOM');
    recommendations.push('   - Verify z-index stacking order');
    recommendations.push('   - Try different positioning strategy');
  }
  
  return recommendations;
}

// Function to record smart iteration with failure analysis
function recordSmartIteration(iterationNumber, observations, changes, results, status) {
  const memory = loadMemory();
  
  const iteration = {
    number: iterationNumber,
    timestamp: new Date().toISOString(),
    observations: observations,
    changes: changes,
    results: results,
    status: status,
    screenshots: {
      current: `bulletproof-desktop-${Date.now()}.png`,
      comparison: `html-comparison-${Date.now()}.png`
    },
    failureAnalysis: null,
    smartRecommendations: []
  };
  
  // If iteration failed or is in progress, analyze why
  if (status === 'Failed' || status === 'In Progress') {
    iteration.failureAnalysis = analyzeFailure(iteration);
    iteration.smartRecommendations = createSmartRecommendations(iteration);
  }
  
  memory.iterations.push(iteration);
  memory.currentIteration = iterationNumber;
  
  saveMemory(memory);
  
  console.log(`📝 Smart iteration ${iterationNumber} recorded with failure analysis`);
  return iteration;
}

// Function to show smart analysis of previous iteration
function showSmartAnalysis() {
  const memory = loadMemory();
  const iterations = memory.iterations;
  
  if (iterations.length === 0) {
    console.log('📊 No iterations to analyze yet');
    return;
  }
  
  const lastIteration = iterations[iterations.length - 1];
  
  console.log('\n🧠 SMART ANALYSIS OF PREVIOUS ITERATION:');
  console.log('=========================================');
  console.log(`Iteration: ${lastIteration.number}`);
  console.log(`Status: ${lastIteration.status}`);
  
  if (lastIteration.failureAnalysis) {
    console.log('\n🔍 ROOT CAUSE ANALYSIS:');
    lastIteration.failureAnalysis.rootCauses.forEach((cause, index) => {
      console.log(`  ${index + 1}. ${cause}`);
    });
    
    console.log('\n💡 ALTERNATIVE APPROACHES:');
    lastIteration.failureAnalysis.alternativeApproaches.forEach((approach, index) => {
      console.log(`  ${index + 1}. ${approach}`);
    });
    
    console.log('\n🎯 NEXT STEPS:');
    lastIteration.failureAnalysis.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });
  }
  
  if (lastIteration.smartRecommendations.length > 0) {
    console.log('\n🚨 SMART RECOMMENDATIONS:');
    lastIteration.smartRecommendations.forEach((rec, index) => {
      console.log(`  ${rec}`);
    });
  }
  
  console.log('');
}

// Function to create smart fix suggestions
function createSmartFixSuggestions() {
  const memory = loadMemory();
  const iterations = memory.iterations;
  
  if (iterations.length < 2) {
    return ['Start with initial analysis and baseline fixes'];
  }
  
  const recentIterations = iterations.slice(-3);
  const suggestions = [];
  
  // Analyze what's been tried and suggest alternatives
  const allChanges = recentIterations.flatMap(iter => iter.changes);
  
  if (allChanges.some(change => change.includes('video') && change.includes('width'))) {
    suggestions.push('🎬 VIDEO THUMBNAIL: Try positioning approach instead of size:');
    suggestions.push('   - Adjust top/left positioning');
    suggestions.push('   - Change transform values');
    suggestions.push('   - Modify container constraints');
  }
  
  if (allChanges.some(change => change.includes('text') && change.includes('font-size'))) {
    suggestions.push('📝 HERO TEXT: Try typography approach instead of size:');
    suggestions.push('   - Adjust font-weight to be even lighter');
    suggestions.push('   - Modify letter-spacing to be tighter');
    suggestions.push('   - Change line-height to be more condensed');
  }
  
  if (allChanges.some(change => change.includes('showreel') && change.includes('background'))) {
    suggestions.push('🎯 SHOWREEL: Try structural approach instead of styling:');
    suggestions.push('   - Check HTML structure and positioning');
    suggestions.push('   - Verify z-index and stacking context');
    suggestions.push('   - Try different CSS positioning strategy');
  }
  
  return suggestions;
}

// Initialize smart memory analysis
console.log('🚀 Initializing Smart Memory Analysis System...\n');

// Record current iteration with smart analysis
recordSmartIteration(5, [
  'Video thumbnail still not matching Sam Kolder proportions despite size increases',
  'Hero text still not condensed enough compared to Sam Kolder reference',
  'Showreel still not visible despite multiple visibility enhancements',
  'Overall layout proportions still don\'t match Sam\'s aesthetic'
], [
  'Increased video thumbnail width from 70% to 85%',
  'Increased max-width from 800px to 1000px',
  'Reduced hero text size from 2.0rem to 1.6rem',
  'Tightened line-height from 1.02 to 1.0',
  'Enhanced showreel visibility with stronger background (0.6 opacity)',
  'Increased showreel border from 4px to 5px',
  'Enhanced showreel glow effect significantly'
], [
  'Video thumbnail is now much larger but may still not match Sam\'s proportions',
  'Hero text is more condensed but may still need further refinement',
  'Showreel should be much more visible with enhanced styling',
  'Overall layout proportions should be closer to Sam\'s reference'
], 'In Progress - Testing major size and visibility changes');

// Show smart analysis
showSmartAnalysis();

// Show smart fix suggestions
console.log('💡 SMART FIX SUGGESTIONS:');
const suggestions = createSmartFixSuggestions();
suggestions.forEach((suggestion, index) => {
  console.log(`  ${suggestion}`);
});

console.log('\n✅ Smart Memory Analysis System Ready!');
console.log('🧠 This system analyzes WHY changes fail and suggests alternative approaches');
console.log('🎯 Use this to avoid repeating failed approaches and find root causes');
