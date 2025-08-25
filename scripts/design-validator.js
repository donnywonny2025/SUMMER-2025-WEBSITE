const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class DesignValidator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotsDir = path.join(__dirname, '..', 'screenshots');
    this.validationResults = {
      timestamp: Date.now(),
      issues: [],
      passed: [],
      score: 0
    };
  }

  async init() {
    this.browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async validateDesign(url = 'http://localhost:3000') {
    console.log('🎨 Starting comprehensive design validation...');
    
    try {
      await this.init();
      await this.page.goto(url, { waitUntil: 'networkidle0' });
      
      // Wait for animations to settle
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Run all validation checks
      await this.checkTextVisibility();
      await this.checkContrastRatios();
      await this.checkSpacing();
      await this.checkAnimationPerformance();
      await this.checkResponsiveLayout();
      await this.checkAccessibility();
      
      // Calculate overall score
      this.calculateScore();
      
      // Generate report
      await this.generateReport();
      
      console.log(`✅ Design validation complete! Score: ${this.validationResults.score}/100`);
      
      if (this.validationResults.issues.length > 0) {
        console.log('🚨 Issues found:');
        this.validationResults.issues.forEach(issue => {
          console.log(`   ${issue.severity}: ${issue.message}`);
        });
      }
      
      return this.validationResults;
      
    } catch (error) {
      console.error('❌ Design validation failed:', error);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async checkTextVisibility() {
    console.log('🔍 Checking text visibility and contrast...');
    
    const textElements = await this.page.evaluate(() => {
      const elements = [];
      const textNodes = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
      
      textNodes.forEach(el => {
        const text = el.textContent.trim();
        if (text && text.length > 0) {
          const styles = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          
          elements.push({
            text: text.substring(0, 50),
            color: styles.color,
            backgroundColor: styles.backgroundColor,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            opacity: styles.opacity,
            visibility: styles.visibility,
            display: styles.display,
            position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
          });
        }
      });
      
      return elements;
    });
    
    // Check for invisible text (common issue with gradient text)
    textElements.forEach(el => {
      if (el.text.toLowerCase().includes('jeffrey') || el.text.toLowerCase().includes('kerr')) {
        if (el.opacity === '0' || el.visibility === 'hidden' || el.display === 'none') {
          this.addIssue('CRITICAL', `Name "${el.text}" is invisible (opacity: ${el.opacity}, visibility: ${el.visibility})`);
        } else if (el.color === 'rgba(0, 0, 0, 0)' || el.color === 'transparent') {
          this.addIssue('CRITICAL', `Name "${el.text}" has transparent color - likely gradient text issue`);
        } else {
          this.addPass(`Name "${el.text}" is visible with color: ${el.color}`);
        }
      }
    });
  }

  async checkContrastRatios() {
    console.log('🎨 Analyzing color contrast ratios...');
    
    const contrastIssues = await this.page.evaluate(() => {
      const issues = [];
      
      // Helper function to calculate luminance
      function getLuminance(r, g, b) {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      }
      
      // Helper function to calculate contrast ratio
      function getContrastRatio(color1, color2) {
        const l1 = getLuminance(...color1);
        const l2 = getLuminance(...color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
      }
      
      // Check text elements for contrast
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span');
      textElements.forEach(el => {
        const text = el.textContent.trim();
        if (text.length > 10) { // Only check substantial text
          const styles = window.getComputedStyle(el);
          const textColor = styles.color;
          const bgColor = styles.backgroundColor;
          
          // Simple contrast check (basic implementation)
          if (textColor.includes('rgb') && bgColor.includes('rgb')) {
            const textRgb = textColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
            const bgRgb = bgColor.match(/\d+/g)?.map(Number) || [255, 255, 255];
            
            const ratio = getContrastRatio(textRgb, bgRgb);
            
            if (ratio < 4.5) {
              issues.push({
                text: text.substring(0, 30),
                ratio: ratio.toFixed(2),
                textColor,
                bgColor
              });
            }
          }
        }
      });
      
      return issues;
    });
    
    contrastIssues.forEach(issue => {
      this.addIssue('HIGH', `Low contrast ratio (${issue.ratio}:1) for text: "${issue.text}"`);
    });
    
    if (contrastIssues.length === 0) {
      this.addPass('All text elements have adequate contrast ratios');
    }
  }

  async checkSpacing() {
    console.log('📏 Analyzing spacing and layout...');
    
    const spacingIssues = await this.page.evaluate(() => {
      const issues = [];
      const elements = document.querySelectorAll('h1, h2, h3, .btn, button, .card');
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const marginTop = parseInt(styles.marginTop) || 0;
        const marginBottom = parseInt(styles.marginBottom) || 0;
        const padding = parseInt(styles.padding) || 0;
        
        // Check for cramped spacing
        if (el.tagName.startsWith('H') && marginBottom < 8) {
          issues.push(`Heading "${el.textContent.substring(0, 20)}" has insufficient bottom margin (${marginBottom}px)`);
        }
        
        // Check for excessive spacing
        if (marginTop > 100 || marginBottom > 100) {
          issues.push(`Element has excessive margin: ${marginTop}px top, ${marginBottom}px bottom`);
        }
      });
      
      return issues;
    });
    
    spacingIssues.forEach(issue => {
      this.addIssue('MEDIUM', issue);
    });
    
    if (spacingIssues.length === 0) {
      this.addPass('Spacing and layout appear well-balanced');
    }
  }

  async checkAnimationPerformance() {
    console.log('⚡ Checking animation performance...');
    
    // Monitor for layout thrashing and performance issues
    const animationMetrics = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const longTasks = entries.filter(entry => entry.duration > 50);
          resolve({
            longTaskCount: longTasks.length,
            totalBlockingTime: longTasks.reduce((sum, task) => sum + task.duration, 0)
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        
        // Wait for animations to complete
        setTimeout(() => {
          observer.disconnect();
          resolve({ longTaskCount: 0, totalBlockingTime: 0 });
        }, 5000);
      });
    });
    
    if (animationMetrics.longTaskCount > 3) {
      this.addIssue('HIGH', `Too many long tasks detected (${animationMetrics.longTaskCount}) - animations may be janky`);
    } else {
      this.addPass('Animation performance appears smooth');
    }
  }

  async checkResponsiveLayout() {
    console.log('📱 Testing responsive layout...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const layoutIssues = await this.page.evaluate((viewportName) => {
        const issues = [];
        
        // Check for horizontal overflow
        const body = document.body;
        if (body.scrollWidth > window.innerWidth) {
          issues.push(`Horizontal overflow detected on ${viewportName}`);
        }
        
        // Check for text that's too small
        const textElements = document.querySelectorAll('p, span, div');
        textElements.forEach(el => {
          const styles = window.getComputedStyle(el);
          const fontSize = parseInt(styles.fontSize);
          if (fontSize < 14 && viewportName === 'Mobile') {
            issues.push(`Text too small on mobile: ${fontSize}px`);
          }
        });
        
        return issues;
      }, viewport.name);
      
      layoutIssues.forEach(issue => {
        this.addIssue('MEDIUM', issue);
      });
    }
    
    // Reset to desktop
    await this.page.setViewport({ width: 1920, height: 1080 });
    this.addPass('Responsive layout testing completed');
  }

  async checkAccessibility() {
    console.log('♿ Checking accessibility...');
    
    const a11yIssues = await this.page.evaluate(() => {
      const issues = [];
      
      // Check for missing alt text
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') {
          issues.push('Image missing alt text');
        }
      });
      
      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          issues.push(`Heading hierarchy skip: ${heading.tagName} after H${lastLevel}`);
        }
        lastLevel = level;
      });
      
      // Check for interactive elements without proper focus
      const interactive = document.querySelectorAll('button, a, input, select, textarea');
      interactive.forEach(el => {
        const styles = window.getComputedStyle(el, ':focus');
        if (!styles.outline || styles.outline === 'none') {
          // This is a simplified check
        }
      });
      
      return issues;
    });
    
    a11yIssues.forEach(issue => {
      this.addIssue('MEDIUM', issue);
    });
    
    if (a11yIssues.length === 0) {
      this.addPass('Basic accessibility checks passed');
    }
  }

  addIssue(severity, message) {
    this.validationResults.issues.push({ severity, message, timestamp: Date.now() });
  }

  addPass(message) {
    this.validationResults.passed.push({ message, timestamp: Date.now() });
  }

  calculateScore() {
    const totalChecks = this.validationResults.issues.length + this.validationResults.passed.length;
    const criticalIssues = this.validationResults.issues.filter(i => i.severity === 'CRITICAL').length;
    const highIssues = this.validationResults.issues.filter(i => i.severity === 'HIGH').length;
    const mediumIssues = this.validationResults.issues.filter(i => i.severity === 'MEDIUM').length;
    
    // Scoring: Critical = -30, High = -15, Medium = -5
    let score = 100;
    score -= (criticalIssues * 30);
    score -= (highIssues * 15);
    score -= (mediumIssues * 5);
    
    this.validationResults.score = Math.max(0, score);
  }

  async generateReport() {
    const reportPath = path.join(this.screenshotsDir, `validation-report-${this.validationResults.timestamp}.json`);
    
    const report = {
      ...this.validationResults,
      summary: {
        totalIssues: this.validationResults.issues.length,
        criticalIssues: this.validationResults.issues.filter(i => i.severity === 'CRITICAL').length,
        highIssues: this.validationResults.issues.filter(i => i.severity === 'HIGH').length,
        mediumIssues: this.validationResults.issues.filter(i => i.severity === 'MEDIUM').length,
        passedChecks: this.validationResults.passed.length
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Validation report saved: ${reportPath}`);
  }
}

// CLI usage
if (require.main === module) {
  const validator = new DesignValidator();
  validator.validateDesign().catch(console.error);
}

module.exports = DesignValidator;