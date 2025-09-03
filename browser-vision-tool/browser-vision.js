const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

class BrowserVisionTool {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotsDir = './analysis';
    this.currentAnalysis = null;
  }

  async init() {
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
    
    this.browser = await chromium.launch({ 
      headless: false,
      devtools: true,
      args: ['--start-maximized']
    });
    
    this.page = await this.browser.newPage();
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async analyzeWebsite(url) {
    console.log(`🔍 ANALYZING WEBSITE: ${url}`);
    console.log('='.repeat(50));
    
    const timestamp = Date.now();
    
    try {
      // Navigate to the site
      console.log('📱 Loading website...');
      await this.page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Take initial screenshot
      const screenshotPath = `${this.screenshotsDir}/analysis-${timestamp}.png`;
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      
      // Extract comprehensive design data
      const designData = await this.page.evaluate(() => {
        const analysis = {
          title: document.title,
          url: window.location.href,
          viewport: { width: window.innerWidth, height: window.innerHeight },
          typography: [],
          colors: [],
          layout: {},
          elements: []
        };

        // Analyze typography
        const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
        const uniqueStyles = new Set();
        
        textElements.forEach(el => {
          if (el.offsetWidth > 0 && el.offsetHeight > 0) {
            const style = window.getComputedStyle(el);
            const styleString = `${style.fontSize}-${style.fontWeight}-${style.fontFamily}`;
            
            if (!uniqueStyles.has(styleString) && el.textContent.trim()) {
              uniqueStyles.add(styleString);
              analysis.typography.push({
                tag: el.tagName.toLowerCase(),
                text: el.textContent.trim().substring(0, 100),
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                fontFamily: style.fontFamily,
                color: style.color,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing
              });
            }
          }
        });

        // Extract color palette
        const colorSet = new Set();
        document.querySelectorAll('*').forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.color !== 'rgba(0, 0, 0, 0)') colorSet.add(style.color);
          if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') colorSet.add(style.backgroundColor);
        });
        analysis.colors = Array.from(colorSet).slice(0, 10);

        // Analyze layout structure
        analysis.layout = {
          hasHeader: !!document.querySelector('header, .header, nav'),
          hasFooter: !!document.querySelector('footer, .footer'),
          hasSidebar: !!document.querySelector('sidebar, .sidebar, aside'),
          containerWidth: document.body.scrollWidth,
          contentHeight: document.body.scrollHeight
        };

        return analysis;
      });

      // My design analysis (like what I do manually)
      const designNotes = this.generateDesignNotes(designData);
      
      // Save complete analysis
      const analysisReport = {
        timestamp,
        url,
        designData,
        designNotes,
        screenshot: screenshotPath
      };
      
      const reportPath = `${this.screenshotsDir}/report-${timestamp}.json`;
      fs.writeFileSync(reportPath, JSON.stringify(analysisReport, null, 2));
      
      // Display analysis like I do
      this.displayAnalysis(analysisReport);
      
      this.currentAnalysis = analysisReport;
      return analysisReport;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      throw error;
    }
  }

  generateDesignNotes(data) {
    const notes = {
      overall: '',
      typography: '',
      layout: '',
      colorScheme: '',
      recommendations: []
    };

    // Overall impression
    notes.overall = `Clean ${data.typography.length > 5 ? 'varied' : 'consistent'} design with ${data.colors.length} main colors. ${data.layout.hasHeader ? 'Traditional header layout' : 'Headerless design'}`;

    // Typography analysis
    const primaryFont = data.typography[0];
    if (primaryFont) {
      notes.typography = `Primary typography uses ${primaryFont.fontFamily} at ${primaryFont.fontSize} with ${primaryFont.fontWeight} weight. ${this.getFontAnalysis(primaryFont)}`;
    }

    // Layout analysis
    notes.layout = `${data.layout.containerWidth}px wide layout. ${data.layout.hasHeader ? 'Header navigation present.' : ''} ${data.layout.hasSidebar ? 'Sidebar layout detected.' : 'Single column layout.'}`;

    // Color scheme
    const dominantColors = data.colors.slice(0, 3);
    notes.colorScheme = `Color palette: ${dominantColors.join(', ')}. ${this.getColorSchemeAnalysis(dominantColors)}`;

    // Recommendations
    notes.recommendations = this.generateRecommendations(data);

    return notes;
  }

  getFontAnalysis(font) {
    const size = parseInt(font.fontSize);
    if (size < 14) return 'Small text, may need accessibility review.';
    if (size > 24) return 'Large display text, good for headings.';
    return 'Standard readable size.';
  }

  getColorSchemeAnalysis(colors) {
    const hasBlackWhite = colors.some(c => c.includes('rgb(0, 0, 0)') || c.includes('rgb(255, 255, 255)'));
    if (hasBlackWhite) return 'High contrast design with strong readability.';
    return 'Custom color scheme with moderate contrast.';
  }

  generateRecommendations(data) {
    const recs = [];
    
    if (data.typography.length > 8) {
      recs.push('Consider consolidating typography - too many font variations');
    }
    
    if (data.colors.length > 12) {
      recs.push('Color palette could be simplified for better consistency');
    }
    
    if (!data.layout.hasHeader) {
      recs.push('Consider adding navigation for better user orientation');
    }
    
    return recs;
  }

  displayAnalysis(analysis) {
    console.log('\n🎨 DESIGN ANALYSIS REPORT');
    console.log('='.repeat(40));
    console.log(`📄 Site: ${analysis.designData.title}`);
    console.log(`🔗 URL: ${analysis.url}`);
    console.log(`📸 Screenshot: ${analysis.screenshot}`);
    
    console.log('\n📝 DESIGN NOTES:');
    console.log(`Overall: ${analysis.designNotes.overall}`);
    console.log(`Typography: ${analysis.designNotes.typography}`);
    console.log(`Layout: ${analysis.designNotes.layout}`);
    console.log(`Colors: ${analysis.designNotes.colorScheme}`);
    
    if (analysis.designNotes.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      analysis.designNotes.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }
    
    console.log('\n🔤 TYPOGRAPHY DETAILS:');
    analysis.designData.typography.slice(0, 5).forEach((typo, i) => {
      console.log(`  ${i + 1}. ${typo.tag}: "${typo.text.substring(0, 30)}..."`);
      console.log(`     Font: ${typo.fontFamily} | Size: ${typo.fontSize} | Weight: ${typo.fontWeight}`);
    });
    
    console.log(`\n🎨 COLOR PALETTE (${analysis.designData.colors.length} colors):`);
    analysis.designData.colors.slice(0, 8).forEach((color, i) => {
      console.log(`  ${i + 1}. ${color}`);
    });
  }

  async copyElementStyle(targetUrl, elementSelector) {
    if (!this.currentAnalysis) {
      throw new Error('No analysis available. Run analyzeWebsite() first.');
    }
    
    console.log(`\n🎯 COPYING STYLE TO: ${targetUrl}`);
    console.log(`🎯 Target Element: ${elementSelector}`);
    
    // Navigate to target site
    await this.page.goto(targetUrl, { waitUntil: 'networkidle' });
    
    // Apply styling based on analysis
    const result = await this.page.evaluate((selector, analysisData) => {
      const element = document.querySelector(selector);
      if (!element) return { success: false, error: 'Element not found' };
      
      // Find matching typography from analysis
      const primaryTypo = analysisData.typography[0];
      if (primaryTypo) {
        element.style.fontSize = primaryTypo.fontSize;
        element.style.fontWeight = primaryTypo.fontWeight;
        element.style.fontFamily = primaryTypo.fontFamily;
        element.style.color = primaryTypo.color;
        element.style.lineHeight = primaryTypo.lineHeight;
        
        // Highlight the changed element
        element.style.border = '3px solid #00ff00';
        element.style.outline = '2px solid #fff';
      }
      
      return { success: true, appliedStyle: primaryTypo };
    }, elementSelector, this.currentAnalysis.designData);
    
    console.log('✅ Style applied:', result);
    
    // Take screenshot of result
    const resultScreenshot = `${this.screenshotsDir}/result-${Date.now()}.png`;
    await this.page.screenshot({ path: resultScreenshot, fullPage: false });
    console.log(`📸 Result screenshot: ${resultScreenshot}`);
    
    return result;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node browser-vision.js https://example.com');
    console.log('  node browser-vision.js https://example.com --copy localhost:3000 h1');
    process.exit(1);
  }
  
  const tool = new BrowserVisionTool();
  await tool.init();
  
  try {
    const url = args[0];
    
    // Analyze the reference website
    await tool.analyzeWebsite(url);
    
    // If copy command provided
    if (args[1] === '--copy' && args[2] && args[3]) {
      await tool.copyElementStyle(args[2], args[3]);
    }
    
    console.log('\n🎉 Analysis complete! Press Enter to close browser...');
    process.stdin.once('data', () => {
      tool.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await tool.close();
  }
}

if (require.main === module) {
  main();
}

module.exports = BrowserVisionTool;
