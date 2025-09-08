import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

console.log('🚨 MANDATORY VISUAL VERIFICATION SYSTEM');
console.log('=======================================\n');

class MandatoryVisualVerification {
  constructor() {
    this.browser = null;
    this.page = null;
    this.verificationResults = {};
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

  async takeVerificationScreenshot() {
    console.log('📸 Taking mandatory verification screenshot...');
    
    try {
      await this.page.goto('http://localhost:3000', { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      await this.page.waitForTimeout(2000);
      
      const timestamp = Date.now();
      const screenshotPath = `screenshots/verification/verification-${timestamp}.png`;
      
      // Ensure verification directory exists
      const verificationDir = path.join(process.cwd(), 'screenshots', 'verification');
      if (!fs.existsSync(verificationDir)) {
        fs.mkdirSync(verificationDir, { recursive: true });
      }
      
      await this.page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ Verification screenshot saved: ${screenshotPath}`);
      return screenshotPath;
      
    } catch (error) {
      console.error('❌ Failed to take verification screenshot:', error.message);
      throw error;
    }
  }

  async generateVisualAnalysisReport(screenshotPath) {
    console.log('🔍 Generating mandatory visual analysis report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      screenshotPath: screenshotPath,
      analysis: {
        layout: await this.analyzeLayout(),
        typography: await this.analyzeTypography(),
        spacing: await this.analyzeSpacing(),
        video: await this.analyzeVideo(),
        showreel: await this.analyzeShowreel()
      },
      issues: [],
      recommendations: []
    };
    
    // Save report
    const reportPath = path.join(process.cwd(), 'screenshots', 'verification', `analysis-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`✅ Visual analysis report saved: ${reportPath}`);
    return report;
  }

  async analyzeLayout() {
    console.log('📐 Analyzing layout...');
    
    const layoutAnalysis = await this.page.evaluate(() => {
      const heroContent = document.querySelector('.hero-content');
      const heroMeta = document.querySelector('.hero-meta');
      const heroVideo = document.querySelector('.hero-video');
      
      if (!heroContent || !heroMeta || !heroVideo) {
        return { error: 'Required elements not found' };
      }
      
      const contentRect = heroContent.getBoundingClientRect();
      const metaRect = heroMeta.getBoundingClientRect();
      const videoRect = heroVideo.getBoundingClientRect();
      
      return {
        contentWidth: Math.round(contentRect.width),
        contentLeft: Math.round(contentRect.left),
        contentRight: Math.round(contentRect.right),
        metaWidth: Math.round(metaRect.width),
        metaLeft: Math.round(metaRect.left),
        videoWidth: Math.round(videoRect.width),
        videoLeft: Math.round(videoRect.left),
        videoTop: Math.round(videoRect.top),
        windowWidth: window.innerWidth
      };
    });
    
    return layoutAnalysis;
  }

  async analyzeTypography() {
    console.log('📝 Analyzing typography...');
    
    const typographyAnalysis = await this.page.evaluate(() => {
      const heroText = document.querySelector('.hero-content h1');
      
      if (!heroText) {
        return { error: 'Hero text not found' };
      }
      
      const computedStyle = window.getComputedStyle(heroText);
      const rect = heroText.getBoundingClientRect();
      
      return {
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        lineHeight: computedStyle.lineHeight,
        letterSpacing: computedStyle.letterSpacing,
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    });
    
    return typographyAnalysis;
  }

  async analyzeSpacing() {
    console.log('📏 Analyzing spacing...');
    
    const spacingAnalysis = await this.page.evaluate(() => {
      const heroContent = document.querySelector('.hero-content');
      const heroMeta = document.querySelector('.hero-meta');
      const heroVideo = document.querySelector('.hero-video');
      
      if (!heroContent || !heroMeta || !heroVideo) {
        return { error: 'Required elements not found' };
      }
      
      const contentRect = heroContent.getBoundingClientRect();
      const metaRect = heroMeta.getBoundingClientRect();
      const videoRect = heroVideo.getBoundingClientRect();
      
      return {
        contentTopMargin: Math.round(contentRect.top),
        metaTopMargin: Math.round(metaRect.top - contentRect.bottom),
        videoTopMargin: Math.round(videoRect.top - metaRect.bottom)
      };
    });
    
    return spacingAnalysis;
  }

  async analyzeVideo() {
    console.log('🎥 Analyzing video...');
    
    const videoAnalysis = await this.page.evaluate(() => {
      const heroVideo = document.querySelector('.hero-video');
      
      if (!heroVideo) {
        return { error: 'Video element not found' };
      }
      
      const rect = heroVideo.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(heroVideo);
      
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        borderRadius: computedStyle.borderRadius,
        boxShadow: computedStyle.boxShadow
      };
    });
    
    return videoAnalysis;
  }

  async analyzeShowreel() {
    console.log('🎬 Analyzing showreel...');
    
    const showreelAnalysis = await this.page.evaluate(() => {
      const showreel = document.querySelector('.circular-showreel');
      
      if (!showreel) {
        return { error: 'Showreel element not found' };
      }
      
      const rect = showreel.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(showreel);
      
      return {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        border: computedStyle.border,
        boxShadow: computedStyle.boxShadow
      };
    });
    
    return showreelAnalysis;
  }

  async compareWithSamKolder(ourAnalysis) {
    console.log('🎯 Comparing with Sam Kolder reference...');
    
    // Sam Kolder reference values (based on visual analysis)
    const samReference = {
      layout: {
        contentWidth: 1200, // Approximate
        contentLeft: 50,    // Approximate
        videoWidth: 800,    // Approximate
        videoLeft: 200      // Approximate
      },
      typography: {
        fontSize: '2.1rem',
        fontWeight: '150',
        lineHeight: '1.15'
      },
      video: {
        width: 800,
        height: 450
      },
      showreel: {
        width: 110,
        height: 110
      }
    };
    
    const comparison = {
      layout: this.compareValues(ourAnalysis.layout, samReference.layout),
      typography: this.compareValues(ourAnalysis.typography, samReference.typography),
      video: this.compareValues(ourAnalysis.video, samReference.video),
      showreel: this.compareValues(ourAnalysis.showreel, samReference.showreel)
    };
    
    return comparison;
  }

  compareValues(ours, sams) {
    const differences = {};
    
    for (const key in sams) {
      if (ours[key] !== undefined && sams[key] !== undefined) {
        const ourVal = parseFloat(ours[key]) || 0;
        const samVal = parseFloat(sams[key]) || 0;
        
        if (ourVal !== samVal) {
          const difference = ourVal - samVal;
          const percentage = samVal > 0 ? Math.round((difference / samVal) * 100) : 0;
          
          differences[key] = {
            ours: ourVal,
            sam: samVal,
            difference: difference,
            percentage: percentage,
            needsFix: Math.abs(percentage) > 5
          };
        }
      }
    }
    
    return differences;
  }

  async generateActionPlan(comparison) {
    console.log('📋 Generating action plan...');
    
    const actionPlan = [];
    
    // Check layout differences
    if (comparison.layout) {
      for (const [key, diff] of Object.entries(comparison.layout)) {
        if (diff.needsFix) {
          actionPlan.push({
            priority: 'HIGH',
            category: 'layout',
            element: key,
            current: diff.ours,
            target: diff.sam,
            action: `Fix ${key}: ${diff.ours} → ${diff.sam} (${diff.percentage}% difference)`
          });
        }
      }
    }
    
    // Check typography differences
    if (comparison.typography) {
      for (const [key, diff] of Object.entries(comparison.typography)) {
        if (diff.needsFix) {
          actionPlan.push({
            priority: 'HIGH',
            category: 'typography',
            element: key,
            current: diff.ours,
            target: diff.sam,
            action: `Fix ${key}: ${diff.ours} → ${diff.sam}`
          });
        }
      }
    }
    
    // Check video differences
    if (comparison.video) {
      for (const [key, diff] of Object.entries(comparison.video)) {
        if (diff.needsFix) {
          actionPlan.push({
            priority: 'MEDIUM',
            category: 'video',
            element: key,
            current: diff.ours,
            target: diff.sam,
            action: `Fix video ${key}: ${diff.ours} → ${diff.sam}`
          });
        }
      }
    }
    
    return actionPlan;
  }

  async runMandatoryVerification() {
    console.log('🚨 RUNNING MANDATORY VISUAL VERIFICATION');
    console.log('========================================');
    
    try {
      await this.initialize();
      
      // Step 1: Take verification screenshot
      const screenshotPath = await this.takeVerificationScreenshot();
      
      // Step 2: Generate visual analysis
      const analysis = await this.generateVisualAnalysisReport(screenshotPath);
      
      // Step 3: Compare with Sam Kolder
      const comparison = await this.compareWithSamKolder(analysis.analysis);
      
      // Step 4: Generate action plan
      const actionPlan = await this.generateActionPlan(comparison);
      
      // Step 5: Save complete verification report
      const verificationReport = {
        timestamp: new Date().toISOString(),
        screenshotPath: screenshotPath,
        analysis: analysis,
        comparison: comparison,
        actionPlan: actionPlan,
        summary: {
          totalIssues: actionPlan.length,
          highPriority: actionPlan.filter(a => a.priority === 'HIGH').length,
          mediumPriority: actionPlan.filter(a => a.priority === 'MEDIUM').length
        }
      };
      
      const reportPath = path.join(process.cwd(), 'screenshots', 'verification', `verification-report-${Date.now()}.json`);
      fs.writeFileSync(reportPath, JSON.stringify(verificationReport, null, 2));
      
      console.log('\n🎯 MANDATORY VERIFICATION RESULTS');
      console.log('=================================');
      console.log(`📊 Total issues found: ${verificationReport.summary.totalIssues}`);
      console.log(`🚨 High priority issues: ${verificationReport.summary.highPriority}`);
      console.log(`⚡ Medium priority issues: ${verificationReport.summary.mediumPriority}`);
      
      if (actionPlan.length > 0) {
        console.log('\n📋 ACTION PLAN:');
        actionPlan.forEach((action, index) => {
          console.log(`${index + 1}. [${action.priority}] ${action.action}`);
        });
      } else {
        console.log('\n✅ NO ISSUES FOUND - Design matches Sam Kolder!');
      }
      
      console.log(`\n📄 Full report saved: ${reportPath}`);
      
      return verificationReport;
      
    } catch (error) {
      console.error('❌ Mandatory verification failed:', error.message);
      throw error;
    } finally {
      await this.close();
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const verification = new MandatoryVisualVerification();
  
  try {
    const report = await verification.runMandatoryVerification();
    console.log('\n✅ MANDATORY VERIFICATION COMPLETE!');
    return report;
    
  } catch (error) {
    console.error('❌ MANDATORY VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
}

// Export for use in other scripts
export default MandatoryVisualVerification;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
