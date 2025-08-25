const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '../screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function analyzeVisuals() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    console.log('🚀 Connecting to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Analyze page elements
    const analysis = await page.evaluate(() => {
      const results = {
        title: document.title,
        animations: [],
        gradients: [],
        errors: [],
        performance: {}
      };

      // Check for animations
      const animatedElements = document.querySelectorAll('[class*="animate"]');
      results.animations = Array.from(animatedElements).map(el => ({
        tag: el.tagName,
        classes: el.className,
        visible: el.offsetWidth > 0 && el.offsetHeight > 0
      }));

      // Check for gradients
      const gradientElements = document.querySelectorAll('[class*="gradient"]');
      results.gradients = Array.from(gradientElements).map(el => ({
        tag: el.tagName,
        classes: el.className,
        visible: el.offsetWidth > 0 && el.offsetHeight > 0
      }));

      // Check for console errors
      results.errors = window.console.errors || [];

      // Basic performance metrics
      results.performance = {
        loadTime: performance.now(),
        domElements: document.querySelectorAll('*').length,
        images: document.querySelectorAll('img').length,
        scripts: document.querySelectorAll('script').length
      };

      return results;
    });

    // Take screenshot with timestamp
    const timestamp = Date.now();
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const screenshotPath = path.join(screenshotsDir, `analysis-${timestamp}.png`);
    await page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });

    // Save analysis report
    const reportPath = path.join(screenshotsDir, `analysis-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));

    console.log('\n🔍 VISUAL ANALYSIS REPORT');
    console.log('========================');
    console.log(`📄 Page Title: ${analysis.title}`);
    console.log(`🎬 Animations Found: ${analysis.animations.length}`);
    console.log(`🌈 Gradient Elements: ${analysis.gradients.length}`);
    console.log(`⚡ DOM Elements: ${analysis.performance.domElements}`);
    console.log(`🖼️  Images: ${analysis.performance.images}`);
    console.log(`📸 Screenshot: ${screenshotPath}`);
    console.log(`📊 Report: ${reportPath}`);
    
    if (analysis.animations.length > 0) {
      console.log('\n🎬 ANIMATIONS:');
      analysis.animations.forEach((anim, i) => {
        console.log(`  ${i + 1}. ${anim.tag} - ${anim.classes} (${anim.visible ? 'visible' : 'hidden'})`);
      });
    }
    
    if (analysis.gradients.length > 0) {
      console.log('\n🌈 GRADIENTS:');
      analysis.gradients.forEach((grad, i) => {
        console.log(`  ${i + 1}. ${grad.tag} - ${grad.classes} (${grad.visible ? 'visible' : 'hidden'})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Analysis error:', error.message);
  } finally {
    await browser.close();
  }
}

// Run the analysis
analyzeVisuals().catch(console.error);