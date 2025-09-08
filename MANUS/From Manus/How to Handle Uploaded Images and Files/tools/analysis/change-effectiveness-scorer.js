#!/usr/bin/env node

class ChangeEffectivenessScorer {
  constructor() {
    this.scoringCriteria = {
      heroText: {
        size: { weight: 0.3, target: '1.5rem' },
        weight: { weight: 0.2, target: '300' },
        spacing: { weight: 0.2, target: '1.2' },
        position: { weight: 0.3, target: 'centered' }
      },
      metaInfo: {
        size: { weight: 0.4, target: '0.9rem' },
        position: { weight: 0.3, target: 'aligned' },
        spacing: { weight: 0.3, target: '15px' }
      },
      video: {
        size: { weight: 0.4, target: '75%' },
        position: { weight: 0.3, target: '52%' },
        styling: { weight: 0.3, target: 'professional' }
      },
      spacing: {
        topToHero: { weight: 0.3, target: '10vh' },
        heroToMeta: { weight: 0.3, target: '15px' },
        metaToVideo: { weight: 0.4, target: 'compact' }
      }
    };
  }

  scoreChange(beforeMeasurements, afterMeasurements, targetReference = null) {
    console.log('🎯 SCORING CHANGE EFFECTIVENESS...');
    console.log('==================================\n');

    const scores = {
      heroText: this.scoreHeroText(beforeMeasurements.heroText, afterMeasurements.heroText),
      metaInfo: this.scoreMetaInfo(beforeMeasurements.metaInfo, afterMeasurements.metaInfo),
      video: this.scoreVideo(beforeMeasurements.video, afterMeasurements.video),
      spacing: this.scoreSpacing(beforeMeasurements.spacing, afterMeasurements.spacing)
    };

    const overallScore = this.calculateOverallScore(scores);
    const effectiveness = this.determineEffectiveness(overallScore);
    const recommendations = this.generateRecommendations(scores, effectiveness);

    const result = {
      scores,
      overallScore,
      effectiveness,
      recommendations,
      timestamp: Date.now()
    };

    this.logScoringResult(result);
    return result;
  }

  scoreHeroText(before, after) {
    if (!before || !after) return { score: 0, details: 'Missing data' };

    let score = 0;
    const details = {};

    // Font size scoring
    const beforeSize = this.parseSize(before.fontSize);
    const afterSize = this.parseSize(after.fontSize);
    const targetSize = this.parseSize('1.5rem');
    
    const beforeSizeDiff = Math.abs(beforeSize - targetSize);
    const afterSizeDiff = Math.abs(afterSize - targetSize);
    
    if (afterSizeDiff < beforeSizeDiff) {
      score += 0.3;
      details.fontSize = 'Improved';
    } else if (afterSizeDiff > beforeSizeDiff) {
      details.fontSize = 'Worsened';
    } else {
      details.fontSize = 'No change';
    }

    // Font weight scoring
    if (after.fontWeight === '300' && before.fontWeight !== '300') {
      score += 0.2;
      details.fontWeight = 'Improved';
    } else if (after.fontWeight !== '300' && before.fontWeight === '300') {
      details.fontWeight = 'Worsened';
    } else {
      details.fontWeight = 'No change';
    }

    // Line height scoring
    const beforeLineHeight = this.parseSize(before.lineHeight);
    const afterLineHeight = this.parseSize(after.lineHeight);
    const targetLineHeight = this.parseSize('1.2');
    
    const beforeLineHeightDiff = Math.abs(beforeLineHeight - targetLineHeight);
    const afterLineHeightDiff = Math.abs(afterLineHeight - targetLineHeight);
    
    if (afterLineHeightDiff < beforeLineHeightDiff) {
      score += 0.2;
      details.lineHeight = 'Improved';
    } else if (afterLineHeightDiff > beforeLineHeightDiff) {
      details.lineHeight = 'Worsened';
    } else {
      details.lineHeight = 'No change';
    }

    // Position scoring (simplified)
    if (after.top && before.top) {
      const beforeTopDiff = Math.abs(before.top - 200); // Target position
      const afterTopDiff = Math.abs(after.top - 200);
      
      if (afterTopDiff < beforeTopDiff) {
        score += 0.3;
        details.position = 'Improved';
      } else if (afterTopDiff > beforeTopDiff) {
        details.position = 'Worsened';
      } else {
        details.position = 'No change';
      }
    }

    return { score: Math.min(score, 1), details };
  }

  scoreMetaInfo(before, after) {
    if (!before || !after) return { score: 0, details: 'Missing data' };

    let score = 0;
    const details = {};

    // Font size scoring
    const beforeSize = this.parseSize(before.fontSize);
    const afterSize = this.parseSize(after.fontSize);
    const targetSize = this.parseSize('0.9rem');
    
    const beforeSizeDiff = Math.abs(beforeSize - targetSize);
    const afterSizeDiff = Math.abs(afterSize - targetSize);
    
    if (afterSizeDiff < beforeSizeDiff) {
      score += 0.4;
      details.fontSize = 'Improved';
    } else if (afterSizeDiff > beforeSizeDiff) {
      details.fontSize = 'Worsened';
    } else {
      details.fontSize = 'No change';
    }

    // Position scoring
    if (after.top && before.top) {
      const beforeTopDiff = Math.abs(before.top - 300); // Target position
      const afterTopDiff = Math.abs(after.top - 300);
      
      if (afterTopDiff < beforeTopDiff) {
        score += 0.3;
        details.position = 'Improved';
      } else if (afterTopDiff > beforeTopDiff) {
        details.position = 'Worsened';
      } else {
        details.position = 'No change';
      }
    }

    // Spacing scoring
    if (after.marginTop && before.marginTop) {
      const beforeMargin = this.parseSize(before.marginTop);
      const afterMargin = this.parseSize(after.marginTop);
      const targetMargin = this.parseSize('15px');
      
      const beforeMarginDiff = Math.abs(beforeMargin - targetMargin);
      const afterMarginDiff = Math.abs(afterMargin - targetMargin);
      
      if (afterMarginDiff < beforeMarginDiff) {
        score += 0.3;
        details.spacing = 'Improved';
      } else if (afterMarginDiff > beforeMarginDiff) {
        details.spacing = 'Worsened';
      } else {
        details.spacing = 'No change';
      }
    }

    return { score: Math.min(score, 1), details };
  }

  scoreVideo(before, after) {
    if (!before || !after) return { score: 0, details: 'Missing data' };

    let score = 0;
    const details = {};

    // Size scoring
    if (after.width && before.width) {
      const beforeWidthDiff = Math.abs(before.width - 800); // Target width
      const afterWidthDiff = Math.abs(after.width - 800);
      
      if (afterWidthDiff < beforeWidthDiff) {
        score += 0.4;
        details.size = 'Improved';
      } else if (afterWidthDiff > beforeWidthDiff) {
        details.size = 'Worsened';
      } else {
        details.size = 'No change';
      }
    }

    // Position scoring
    if (after.top && before.top) {
      const beforeTopDiff = Math.abs(before.top - 400); // Target position
      const afterTopDiff = Math.abs(after.top - 400);
      
      if (afterTopDiff < beforeTopDiff) {
        score += 0.3;
        details.position = 'Improved';
      } else if (afterTopDiff > beforeTopDiff) {
        details.position = 'Worsened';
      } else {
        details.position = 'No change';
      }
    }

    // Styling scoring (simplified)
    if (after.borderRadius && before.borderRadius) {
      if (after.borderRadius === '12px' && before.borderRadius !== '12px') {
        score += 0.3;
        details.styling = 'Improved';
      } else if (after.borderRadius !== '12px' && before.borderRadius === '12px') {
        details.styling = 'Worsened';
      } else {
        details.styling = 'No change';
      }
    }

    return { score: Math.min(score, 1), details };
  }

  scoreSpacing(before, after) {
    if (!before || !after) return { score: 0, details: 'Missing data' };

    let score = 0;
    const details = {};

    // Top to hero spacing
    if (after.topToHero && before.topToHero) {
      const beforeTopDiff = Math.abs(before.topToHero - 200); // Target spacing
      const afterTopDiff = Math.abs(after.topToHero - 200);
      
      if (afterTopDiff < beforeTopDiff) {
        score += 0.3;
        details.topToHero = 'Improved';
      } else if (afterTopDiff > beforeTopDiff) {
        details.topToHero = 'Worsened';
      } else {
        details.topToHero = 'No change';
      }
    }

    // Hero to meta spacing
    if (after.heroToMeta && before.heroToMeta) {
      const beforeMetaDiff = Math.abs(before.heroToMeta - 15); // Target spacing
      const afterMetaDiff = Math.abs(after.heroToMeta - 15);
      
      if (afterMetaDiff < beforeMetaDiff) {
        score += 0.3;
        details.heroToMeta = 'Improved';
      } else if (afterMetaDiff > beforeMetaDiff) {
        details.heroToMeta = 'Worsened';
      } else {
        details.heroToMeta = 'No change';
      }
    }

    // Meta to video spacing
    if (after.metaToVideo && before.metaToVideo) {
      const beforeVideoDiff = Math.abs(before.metaToVideo - 50); // Target spacing
      const afterVideoDiff = Math.abs(after.metaToVideo - 50);
      
      if (afterVideoDiff < beforeVideoDiff) {
        score += 0.4;
        details.metaToVideo = 'Improved';
      } else if (afterVideoDiff > beforeVideoDiff) {
        details.metaToVideo = 'Worsened';
      } else {
        details.metaToVideo = 'No change';
      }
    }

    return { score: Math.min(score, 1), details };
  }

  calculateOverallScore(scores) {
    const weights = {
      heroText: 0.3,
      metaInfo: 0.2,
      video: 0.3,
      spacing: 0.2
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(scores).forEach(([category, scoreData]) => {
      if (scoreData.score !== undefined) {
        totalScore += scoreData.score * weights[category];
        totalWeight += weights[category];
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  determineEffectiveness(overallScore) {
    if (overallScore >= 0.8) return 'Excellent';
    if (overallScore >= 0.6) return 'Good';
    if (overallScore >= 0.4) return 'Fair';
    if (overallScore >= 0.2) return 'Poor';
    return 'Very Poor';
  }

  generateRecommendations(scores, effectiveness) {
    const recommendations = [];

    Object.entries(scores).forEach(([category, scoreData]) => {
      if (scoreData.score < 0.5) {
        recommendations.push({
          category,
          priority: 'High',
          suggestion: `Focus on improving ${category} - current score: ${(scoreData.score * 100).toFixed(1)}%`
        });
      } else if (scoreData.score < 0.7) {
        recommendations.push({
          category,
          priority: 'Medium',
          suggestion: `Fine-tune ${category} - current score: ${(scoreData.score * 100).toFixed(1)}%`
        });
      }
    });

    if (effectiveness === 'Very Poor' || effectiveness === 'Poor') {
      recommendations.push({
        category: 'Overall',
        priority: 'Critical',
        suggestion: 'Consider reverting changes and trying a different approach'
      });
    }

    return recommendations;
  }

  parseSize(sizeString) {
    if (!sizeString) return 0;
    const match = sizeString.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  logScoringResult(result) {
    console.log('📊 CHANGE EFFECTIVENESS SCORING:');
    console.log('================================\n');

    console.log(`🎯 OVERALL SCORE: ${(result.overallScore * 100).toFixed(1)}%`);
    console.log(`📈 EFFECTIVENESS: ${result.effectiveness}\n`);

    console.log('📋 CATEGORY SCORES:');
    Object.entries(result.scores).forEach(([category, scoreData]) => {
      if (scoreData.score !== undefined) {
        console.log(`   ${category}: ${(scoreData.score * 100).toFixed(1)}%`);
        Object.entries(scoreData.details).forEach(([detail, status]) => {
          console.log(`     ${detail}: ${status}`);
        });
      }
    });

    if (result.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      result.recommendations.forEach(rec => {
        console.log(`   [${rec.priority}] ${rec.suggestion}`);
      });
    }

    console.log('\n✅ SCORING COMPLETE!\n');
  }
}

export default ChangeEffectivenessScorer;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const scorer = new ChangeEffectivenessScorer();
  
  console.log('🎯 CHANGE EFFECTIVENESS SCORER');
  console.log('==============================\n');
  console.log('Usage:');
  console.log('  const scorer = new ChangeEffectivenessScorer();');
  console.log('  const result = scorer.scoreChange(before, after);');
  console.log('  console.log(result.effectiveness); // "Good", "Poor", etc.\n');
}


