#!/usr/bin/env node

class AutomatedSuggestions {
  constructor() {
    this.suggestionTemplates = {
      heroText: {
        size: {
          tooSmall: 'Increase hero text font-size from {current} to {suggested}',
          tooLarge: 'Decrease hero text font-size from {current} to {suggested}',
          perfect: 'Hero text size is optimal'
        },
        weight: {
          tooLight: 'Increase hero text font-weight from {current} to 300',
          tooBold: 'Decrease hero text font-weight from {current} to 300',
          perfect: 'Hero text weight is optimal'
        },
        spacing: {
          tooTight: 'Increase hero text line-height from {current} to 1.2',
          tooLoose: 'Decrease hero text line-height from {current} to 1.2',
          perfect: 'Hero text spacing is optimal'
        }
      },
      metaInfo: {
        size: {
          tooSmall: 'Increase meta text font-size from {current} to 0.9rem',
          tooLarge: 'Decrease meta text font-size from {current} to 0.9rem',
          perfect: 'Meta text size is optimal'
        },
        spacing: {
          tooTight: 'Increase meta margin-top from {current} to 15px',
          tooLoose: 'Decrease meta margin-top from {current} to 15px',
          perfect: 'Meta spacing is optimal'
        }
      },
      video: {
        size: {
          tooSmall: 'Increase video width from {current} to 75%',
          tooLarge: 'Decrease video width from {current} to 75%',
          perfect: 'Video size is optimal'
        },
        position: {
          tooHigh: 'Move video down by adjusting top from {current} to 52%',
          tooLow: 'Move video up by adjusting top from {current} to 52%',
          perfect: 'Video position is optimal'
        }
      },
      spacing: {
        topToHero: {
          tooTight: 'Increase top-to-hero spacing from {current} to 10vh',
          tooLoose: 'Decrease top-to-hero spacing from {current} to 10vh',
          perfect: 'Top-to-hero spacing is optimal'
        },
        heroToMeta: {
          tooTight: 'Increase hero-to-meta spacing from {current} to 15px',
          tooLoose: 'Decrease hero-to-meta spacing from {current} to 15px',
          perfect: 'Hero-to-meta spacing is optimal'
        },
        metaToVideo: {
          tooTight: 'Increase meta-to-video spacing',
          tooLoose: 'Decrease meta-to-video spacing',
          perfect: 'Meta-to-video spacing is optimal'
        }
      }
    };

    this.targetValues = {
      heroText: {
        fontSize: '1.5rem',
        fontWeight: '300',
        lineHeight: '1.2',
        letterSpacing: '-0.01em'
      },
      metaInfo: {
        fontSize: '0.9rem',
        fontWeight: '300',
        marginTop: '15px'
      },
      video: {
        width: '75%',
        maxWidth: '800px',
        top: '52%'
      },
      spacing: {
        topToHero: '10vh',
        heroToMeta: '15px',
        metaToVideo: 'compact'
      }
    };
  }

  generateSuggestions(currentMeasurements, effectivenessScore) {
    console.log('🤖 GENERATING AUTOMATED SUGGESTIONS...');
    console.log('======================================\n');

    const suggestions = [];
    const priorities = this.determinePriorities(effectivenessScore);

    // Analyze hero text
    if (currentMeasurements.heroText) {
      const heroSuggestions = this.analyzeHeroText(currentMeasurements.heroText);
      suggestions.push(...heroSuggestions);
    }

    // Analyze meta info
    if (currentMeasurements.metaInfo) {
      const metaSuggestions = this.analyzeMetaInfo(currentMeasurements.metaInfo);
      suggestions.push(...metaSuggestions);
    }

    // Analyze video
    if (currentMeasurements.video) {
      const videoSuggestions = this.analyzeVideo(currentMeasurements.video);
      suggestions.push(...videoSuggestions);
    }

    // Analyze spacing
    if (currentMeasurements.spacing) {
      const spacingSuggestions = this.analyzeSpacing(currentMeasurements.spacing);
      suggestions.push(...spacingSuggestions);
    }

    // Sort by priority
    const sortedSuggestions = this.sortByPriority(suggestions, priorities);
    
    this.logSuggestions(sortedSuggestions);
    return sortedSuggestions;
  }

  analyzeHeroText(heroText) {
    const suggestions = [];
    const target = this.targetValues.heroText;

    // Font size analysis
    const currentSize = this.parseSize(heroText.fontSize);
    const targetSize = this.parseSize(target.fontSize);
    
    if (currentSize < targetSize * 0.9) {
      suggestions.push({
        category: 'heroText',
        property: 'fontSize',
        priority: 'High',
        current: heroText.fontSize,
        target: target.fontSize,
        suggestion: this.suggestionTemplates.heroText.size.tooSmall
          .replace('{current}', heroText.fontSize)
          .replace('{suggested}', target.fontSize),
        cssChange: `.hero-content h1 { font-size: ${target.fontSize}; }`
      });
    } else if (currentSize > targetSize * 1.1) {
      suggestions.push({
        category: 'heroText',
        property: 'fontSize',
        priority: 'High',
        current: heroText.fontSize,
        target: target.fontSize,
        suggestion: this.suggestionTemplates.heroText.size.tooLarge
          .replace('{current}', heroText.fontSize)
          .replace('{suggested}', target.fontSize),
        cssChange: `.hero-content h1 { font-size: ${target.fontSize}; }`
      });
    }

    // Font weight analysis
    if (heroText.fontWeight !== target.fontWeight) {
      suggestions.push({
        category: 'heroText',
        property: 'fontWeight',
        priority: 'Medium',
        current: heroText.fontWeight,
        target: target.fontWeight,
        suggestion: this.suggestionTemplates.heroText.weight.tooLight
          .replace('{current}', heroText.fontWeight),
        cssChange: `.hero-content h1 { font-weight: ${target.fontWeight}; }`
      });
    }

    // Line height analysis
    const currentLineHeight = this.parseSize(heroText.lineHeight);
    const targetLineHeight = this.parseSize(target.lineHeight);
    
    if (currentLineHeight < targetLineHeight * 0.9) {
      suggestions.push({
        category: 'heroText',
        property: 'lineHeight',
        priority: 'Medium',
        current: heroText.lineHeight,
        target: target.lineHeight,
        suggestion: this.suggestionTemplates.heroText.spacing.tooTight
          .replace('{current}', heroText.lineHeight),
        cssChange: `.hero-content h1 { line-height: ${target.lineHeight}; }`
      });
    } else if (currentLineHeight > targetLineHeight * 1.1) {
      suggestions.push({
        category: 'heroText',
        property: 'lineHeight',
        priority: 'Medium',
        current: heroText.lineHeight,
        target: target.lineHeight,
        suggestion: this.suggestionTemplates.heroText.spacing.tooLoose
          .replace('{current}', heroText.lineHeight),
        cssChange: `.hero-content h1 { line-height: ${target.lineHeight}; }`
      });
    }

    return suggestions;
  }

  analyzeMetaInfo(metaInfo) {
    const suggestions = [];
    const target = this.targetValues.metaInfo;

    // Font size analysis
    const currentSize = this.parseSize(metaInfo.fontSize);
    const targetSize = this.parseSize(target.fontSize);
    
    if (currentSize < targetSize * 0.9) {
      suggestions.push({
        category: 'metaInfo',
        property: 'fontSize',
        priority: 'Medium',
        current: metaInfo.fontSize,
        target: target.fontSize,
        suggestion: this.suggestionTemplates.metaInfo.size.tooSmall
          .replace('{current}', metaInfo.fontSize),
        cssChange: `.hero-meta { font-size: ${target.fontSize}; }`
      });
    } else if (currentSize > targetSize * 1.1) {
      suggestions.push({
        category: 'metaInfo',
        property: 'fontSize',
        priority: 'Medium',
        current: metaInfo.fontSize,
        target: target.fontSize,
        suggestion: this.suggestionTemplates.metaInfo.size.tooLarge
          .replace('{current}', metaInfo.fontSize),
        cssChange: `.hero-meta { font-size: ${target.fontSize}; }`
      });
    }

    // Spacing analysis
    if (metaInfo.marginTop) {
      const currentMargin = this.parseSize(metaInfo.marginTop);
      const targetMargin = this.parseSize(target.marginTop);
      
      if (currentMargin < targetMargin * 0.8) {
        suggestions.push({
          category: 'metaInfo',
          property: 'marginTop',
          priority: 'High',
          current: metaInfo.marginTop,
          target: target.marginTop,
          suggestion: this.suggestionTemplates.metaInfo.spacing.tooTight
            .replace('{current}', metaInfo.marginTop),
          cssChange: `.hero-meta { margin-top: ${target.marginTop}; }`
        });
      } else if (currentMargin > targetMargin * 1.2) {
        suggestions.push({
          category: 'metaInfo',
          property: 'marginTop',
          priority: 'High',
          current: metaInfo.marginTop,
          target: target.marginTop,
          suggestion: this.suggestionTemplates.metaInfo.spacing.tooLoose
            .replace('{current}', metaInfo.marginTop),
          cssChange: `.hero-meta { margin-top: ${target.marginTop}; }`
        });
      }
    }

    return suggestions;
  }

  analyzeVideo(video) {
    const suggestions = [];
    const target = this.targetValues.video;

    // Size analysis
    if (video.width) {
      const currentWidth = this.parseSize(video.width);
      const targetWidth = this.parseSize(target.width);
      
      if (currentWidth < targetWidth * 0.9) {
        suggestions.push({
          category: 'video',
          property: 'width',
          priority: 'High',
          current: video.width,
          target: target.width,
          suggestion: this.suggestionTemplates.video.size.tooSmall
            .replace('{current}', video.width),
          cssChange: `.hero-video { width: ${target.width}; }`
        });
      } else if (currentWidth > targetWidth * 1.1) {
        suggestions.push({
          category: 'video',
          property: 'width',
          priority: 'High',
          current: video.width,
          target: target.width,
          suggestion: this.suggestionTemplates.video.size.tooLarge
            .replace('{current}', video.width),
          cssChange: `.hero-video { width: ${target.width}; }`
        });
      }
    }

    // Position analysis
    if (video.top) {
      const currentTop = this.parseSize(video.top);
      const targetTop = this.parseSize(target.top);
      
      if (currentTop < targetTop * 0.95) {
        suggestions.push({
          category: 'video',
          property: 'top',
          priority: 'Medium',
          current: video.top,
          target: target.top,
          suggestion: this.suggestionTemplates.video.position.tooHigh
            .replace('{current}', video.top),
          cssChange: `.hero-video { top: ${target.top}; }`
        });
      } else if (currentTop > targetTop * 1.05) {
        suggestions.push({
          category: 'video',
          property: 'top',
          priority: 'Medium',
          current: video.top,
          target: target.top,
          suggestion: this.suggestionTemplates.video.position.tooLow
            .replace('{current}', video.top),
          cssChange: `.hero-video { top: ${target.top}; }`
        });
      }
    }

    return suggestions;
  }

  analyzeSpacing(spacing) {
    const suggestions = [];
    const target = this.targetValues.spacing;

    // Top to hero spacing
    if (spacing.topToHero) {
      const currentSpacing = this.parseSize(spacing.topToHero);
      const targetSpacing = this.parseSize(target.topToHero);
      
      if (currentSpacing < targetSpacing * 0.8) {
        suggestions.push({
          category: 'spacing',
          property: 'topToHero',
          priority: 'High',
          current: spacing.topToHero,
          target: target.topToHero,
          suggestion: this.suggestionTemplates.spacing.topToHero.tooTight
            .replace('{current}', spacing.topToHero),
          cssChange: `.hero-content { margin-top: ${target.topToHero}; }`
        });
      } else if (currentSpacing > targetSpacing * 1.2) {
        suggestions.push({
          category: 'spacing',
          property: 'topToHero',
          priority: 'High',
          current: spacing.topToHero,
          target: target.topToHero,
          suggestion: this.suggestionTemplates.spacing.topToHero.tooLoose
            .replace('{current}', spacing.topToHero),
          cssChange: `.hero-content { margin-top: ${target.topToHero}; }`
        });
      }
    }

    // Hero to meta spacing
    if (spacing.heroToMeta) {
      const currentSpacing = this.parseSize(spacing.heroToMeta);
      const targetSpacing = this.parseSize(target.heroToMeta);
      
      if (currentSpacing < targetSpacing * 0.8) {
        suggestions.push({
          category: 'spacing',
          property: 'heroToMeta',
          priority: 'High',
          current: spacing.heroToMeta,
          target: target.heroToMeta,
          suggestion: this.suggestionTemplates.spacing.heroToMeta.tooTight
            .replace('{current}', spacing.heroToMeta),
          cssChange: `.hero-meta { margin-top: ${target.heroToMeta}; }`
        });
      } else if (currentSpacing > targetSpacing * 1.2) {
        suggestions.push({
          category: 'spacing',
          property: 'heroToMeta',
          priority: 'High',
          current: spacing.heroToMeta,
          target: target.heroToMeta,
          suggestion: this.suggestionTemplates.spacing.heroToMeta.tooLoose
            .replace('{current}', spacing.heroToMeta),
          cssChange: `.hero-meta { margin-top: ${target.heroToMeta}; }`
        });
      }
    }

    return suggestions;
  }

  determinePriorities(effectivenessScore) {
    if (effectivenessScore.overallScore < 0.3) {
      return ['High', 'Medium', 'Low'];
    } else if (effectivenessScore.overallScore < 0.6) {
      return ['High', 'Medium'];
    } else {
      return ['Medium', 'Low'];
    }
  }

  sortByPriority(suggestions, priorities) {
    return suggestions.sort((a, b) => {
      const aIndex = priorities.indexOf(a.priority);
      const bIndex = priorities.indexOf(b.priority);
      return aIndex - bIndex;
    });
  }

  parseSize(sizeString) {
    if (!sizeString || typeof sizeString !== 'string') return 0;
    const match = sizeString.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }

  logSuggestions(suggestions) {
    console.log('🤖 AUTOMATED SUGGESTIONS:');
    console.log('=========================\n');

    if (suggestions.length === 0) {
      console.log('✅ No suggestions needed - design is optimal!\n');
      return;
    }

    const groupedSuggestions = suggestions.reduce((groups, suggestion) => {
      if (!groups[suggestion.priority]) {
        groups[suggestion.priority] = [];
      }
      groups[suggestion.priority].push(suggestion);
      return groups;
    }, {});

    Object.entries(groupedSuggestions).forEach(([priority, prioritySuggestions]) => {
      console.log(`🎯 ${priority.toUpperCase()} PRIORITY:`);
      prioritySuggestions.forEach((suggestion, index) => {
        console.log(`   ${index + 1}. ${suggestion.suggestion}`);
        console.log(`      CSS: ${suggestion.cssChange}`);
      });
      console.log('');
    });

    console.log('💡 Apply these changes to improve the design!\n');
  }
}

export default AutomatedSuggestions;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const suggester = new AutomatedSuggestions();
  
  console.log('🤖 AUTOMATED SUGGESTIONS GENERATOR');
  console.log('==================================\n');
  console.log('Usage:');
  console.log('  const suggester = new AutomatedSuggestions();');
  console.log('  const suggestions = suggester.generateSuggestions(measurements, score);');
  console.log('  suggestions.forEach(s => console.log(s.cssChange));\n');
}
