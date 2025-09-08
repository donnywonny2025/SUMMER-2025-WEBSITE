import puppeteer from 'puppeteer';

async function analyzeWebsite() {
  console.log('🚀 Starting website analysis...');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport to desktop size
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📱 Navigating to Sam Kolder website...');
    await page.goto('https://www.samkolder.com/', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('📸 Taking initial screenshot...');
    await page.screenshot({
      path: 'sam-kolder-full.png',
      fullPage: true
    });

    console.log('🔍 Analyzing page structure...');

    // Get page title and meta information
    const pageTitle = await page.title();
    console.log('📄 Page Title:', pageTitle);

    // Analyze CSS and JavaScript
    const analysis = await page.evaluate(() => {
      // Get all CSS styles
      const stylesheets = Array.from(document.styleSheets)
        .filter(sheet => {
          try {
            return sheet.cssRules;
          } catch {
            return false;
          }
        })
        .map(sheet => ({
          href: sheet.href,
          rules: Array.from(sheet.cssRules).length
        }));

      // Get scroll-based animations/effects
      const scrollElements = Array.from(document.querySelectorAll('*'))
        .filter(el => {
          const style = window.getComputedStyle(el);
          return style.transition !== 'all 0s ease 0s' &&
                 style.transition !== 'none' &&
                 style.transform !== 'none';
        })
        .map(el => ({
          tag: el.tagName,
          class: el.className,
          transform: window.getComputedStyle(el).transform,
          transition: window.getComputedStyle(el).transition
        }));

      // Get video elements and their effects
      const videoElements = Array.from(document.querySelectorAll('video, .video, [data-video], .video-container'))
        .map(el => ({
          tag: el.tagName,
          classes: el.className,
          styles: window.getComputedStyle(el),
          transform: window.getComputedStyle(el).transform,
          filter: window.getComputedStyle(el).filter
        }));

      // Get geometric/line elements
      const lineElements = Array.from(document.querySelectorAll('svg, .line, .divider, hr, .border'))
        .map(el => ({
          tag: el.tagName,
          classes: el.className,
          styles: window.getComputedStyle(el)
        }));

      // Get all work/portfolio items
      const workItems = Array.from(document.querySelectorAll('.work, .project, .item, .case'))
        .map(el => ({
          tag: el.tagName,
          classes: el.className,
          text: el.textContent?.slice(0, 100) || ''
        }));

      // Analyze scroll effects
      let scrollEffects = [];
      try {
        // Scroll and capture transformations
        const scrollPositions = [0, 500, 1000, 1500];

        // Define async function for scroll analysis
        const analyzeScrolls = async () => {
          for (const scrollPos of scrollPositions) {
            window.scrollTo(0, scrollPos);

            // Wait for any scroll handlers to run
            await new Promise(resolve => setTimeout(resolve, 100));

            const visibleImages = Array.from(document.querySelectorAll('img, video'))
              .filter(el => {
                const rect = el.getBoundingClientRect();
                return rect.top >= 0 && rect.bottom <= window.innerHeight;
              })
              .map(el => ({
                tag: el.tagName,
                classes: el.className,
                transform: window.getComputedStyle(el).transform,
                filter: window.getComputedStyle(el).filter,
                opacity: window.getComputedStyle(el).opacity,
                position: scrollPos
              }));

            scrollEffects.push({
              scrollPosition: scrollPos,
              visibleImages: visibleImages
            });
          }
        };

        // Execute async scroll analysis
        analyzeScrolls();
      } catch (error) {
        console.log('Scroll analysis failed:', error.message);
      }

      return {
        stylesheets,
        scrollElements: scrollElements.length,
        videoElements,
        lineElements,
        workItems: workItems.length,
        scrollEffects,
        totalElements: document.body.querySelectorAll('*').length,
        metaDescription: document.querySelector('meta[name="description"]')?.content || '',
        bodyClasses: document.body.className
      };
    });

    console.log('\n📊 Analysis Results:');
    console.log('==================');
    console.log('• Title:', pageTitle);
    console.log('• Description:', analysis.metaDescription);
    console.log('• Total Elements:', analysis.totalElements);
    console.log('• Stylesheets:', analysis.stylesheets.length);
    console.log('• Work/Portfolio Items:', analysis.workItems);
    console.log('• Video Elements:', analysis.videoElements.length);
    console.log('• Scroll Elements:', analysis.scrollElements);
    console.log('• Line Elements:', analysis.lineElements.length);

    console.log('\n🎨 Visual Design Notes:');
    console.log('======================');

    if (analysis.videoElements.length > 0) {
      console.log('• Found video elements with potential effects:');
      analysis.videoElements.forEach((video, i) => {
        console.log(`  ${i + 1}. ${video.tag}.${video.classes}`);
        console.log(`     - Transform: ${video.transform}`);
        console.log(`     - Filter: ${video.filter}`);
      });
    }

    if (analysis.lineElements.length > 0) {
      console.log('• Found geometric/line elements:');
      analysis.lineElements.forEach((line, i) => {
        console.log(`  ${i + 1}. ${line.tag}.${line.classes}`);
      });
    }

    if (analysis.scrollEffects.length > 0) {
      console.log('• Scroll-based effects:');
      analysis.scrollEffects.forEach(effect => {
        console.log(`  At scroll ${effect.scrollPosition}px:`);
        effect.visibleImages.forEach(img => {
          console.log(`    - ${img.tag}: transform=${img.transform}, filter=${img.filter}, opacity=${img.opacity}`);
        });
      });
    }

    // Take additional focused screenshots
    console.log('\n📸 Taking focused screenshots...');

    // Screenshot of video/portfolio section
    await page.screenshot({
      path: 'sam-kolder-portfolio-section.png',
      clip: { x: 0, y: 300, width: 1920, height: 800 }
    });

    // Screenshot of header/hero area
    await page.screenshot({
      path: 'sam-kolder-hero.png',
      clip: { x: 0, y: 0, width: 1920, height: 600 }
    });

    console.log('✅ Screenshots saved:');
    console.log('• sam-kolder-full.png (full page)');
    console.log('• sam-kolder-portfolio-section.png (work section)');
    console.log('• sam-kolder-hero.png (hero area)');

  } catch (error) {
    console.error('❌ Error analyzing website:', error.message);
  } finally {
    await browser.close();
  }

  console.log('\n🎯 Analysis complete! Files saved to working directory.');
}

analyzeWebsite().catch(console.error);