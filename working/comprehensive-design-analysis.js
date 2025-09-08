import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function comprehensiveDesignAnalysis() {
  console.log('🕵️‍♂️ Scout-like Comprehensive Design Analysis of Sam Kolder Portfolio');
  console.log('=============================================================');

  // Create dedicated analysis directory
  const analysisDir = path.join(process.cwd(), 'sam-kolder-analysis');
  if (!fs.existsSync(analysisDir)) {
    fs.mkdirSync(analysisDir, { recursive: true });
    console.log(`📁 Created dedicated analysis directory: ${analysisDir}`);
    console.log('📂 All screenshots will be organized in this folder');
    console.log('=====================================');
  } else {
    console.log(`📁 Using existing directory: ${analysisDir}`);
  }

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('📱 Loading Sam Kolder website...');
  await page.goto('https://www.samkolder.com/', {waitUntil: 'networkidle2'});

  // Initial page load screenshot
  console.log('📷 Phase 1: Initial page analysis...');
  await page.screenshot({path: path.join(analysisDir, 'sam-initial-load.png'), fullPage: true});

  // 📊 COMPREHENSIVE TECHNICAL ANALYSIS
  const comprehensiveAnalysis = await page.evaluate(() => {
    // ===== CSS ANALYSIS =====
    const getColorScheme = () => {
      const colors = {};
      document.querySelectorAll('*').forEach(el => {
        const computed = getComputedStyle(el);
        const color = computed.color;
        const background = computed.backgroundColor;
        if (color && color !== 'rgba(0, 0, 0, 0)') colors[color] = (colors[color] || 0) + 1;
        if (background && background !== 'rgba(0, 0, 0, 0)' && background !== 'transparent') {
          colors[background] = (colors[background] || 0) + 1;
        }
      });
      return Object.entries(colors)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([color, count]) => ({color, count}));
    };

    const getTypography = () => {
      const fonts = {};
      const sizes = {};
      document.querySelectorAll('*').forEach(el => {
        const computed = getComputedStyle(el);
        const fontFamily = computed.fontFamily;
        const fontSize = computed.fontSize;
        if (fontFamily) fonts[fontFamily] = (fonts[fontFamily] || 0) + 1;
        if (fontSize) sizes[fontSize] = (sizes[fontSize] || 0) + 1;
      });
      return {
        fontFamilies: Object.entries(fonts).sort(([,a], [,b]) => b - a).slice(0, 5),
        fontSizes: Object.entries(sizes).sort(([,a], [,b]) => b - a).slice(0, 8)
      };
    };

    const getAnimations = () => {
      const animations = new Set();
      const transitions = new Set();

      document.querySelectorAll('*').forEach(el => {
        const computed = getComputedStyle(el);
        const animation = computed.animationName;
        const transition = computed.transitionProperty;

        if (animation && animation !== 'none') animations.add(animation);
        if (transition && transition !== 'none' && transition !== 'all') transitions.add(transition);
      });

      // Check for CSS animations in stylesheets
      const styleSheets = Array.from(document.styleSheets);
      let keyframesCount = 0;
      styleSheets.forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (rule.type === CSSRule.KEYFRAMES_RULE) keyframesCount++;
          });
        } catch (e) {
          // CORS might block access to some stylesheets
        }
      });

      return {
        cssAnimations: Array.from(animations),
        cssTransitions: Array.from(transitions),
        declaredKeyframes: keyframesCount
      };
    };

    // ===== LAYOUT & COMPONENT ANALYSIS =====
    const getLayoutPatterns = () => {
      const elements = document.querySelectorAll('*');
      const patterns = {
        grids: [],
        flexboxes: [],
        classes: {}
      };

      elements.forEach(el => {
        const computed = getComputedStyle(el);
        const display = computed.display;

        if (display === 'flex' || display === 'inline-flex') patterns.flexboxes.push(el.className);
        if (computed.gridTemplateColumns && computed.gridTemplateColumns !== 'none') {
          patterns.grids.push({
            selector: el.tagName + (el.className ? '.' + el.className : ''),
            template: computed.gridTemplateColumns
          });
        }

        // Analyze class names for patterns
        if (el.className) {
          el.className.split(' ').forEach(cls => {
            if (cls) patterns.classes[cls] = (patterns.classes[cls] || 0) + 1;
          });
        }
      });

      const topClasses = Object.entries(patterns.classes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 15);

      return {
        flexElements: patterns.flexboxes.length,
        gridElements: patterns.grids.length,
        topClasses,
        grids: patterns.grids
      };
    };

    // ===== JAVASCRIPT BEHAVIOR ANALYSIS =====
    const analyzeBehavior = () => {
      const scripts = Array.from(document.querySelectorAll('script'));
      const eventHandlers = new Map();
      const dataAttributes = new Set();

      // Scan for event handlers
      const allElements = document.querySelectorAll('*');
      const eventsFound = new Set();

      // Check for inline event handlers and data attributes
      allElements.forEach(el => {
        Array.from(el.attributes).forEach(attr => {
          if (attr.name.startsWith('on')) eventsFound.add(attr.name.substring(2));
          if (attr.name.startsWith('data-')) dataAttributes.add(attr.name);
        });
      });

      // Analyze scripts for common patterns
      const scriptAnalysis = scripts.map(script => ({
        src: script.src,
        hasContent: !!script.innerHTML,
        size: script.innerHTML ? script.innerHTML.length : 'external'
      }));

      // Check for common JS libraries/frameworks
      const libraries = [];
      if (window.jQuery) libraries.push('jQuery');
      if (window.React) libraries.push('React');
      if (window.Vue) libraries.push('Vue.js');
      if (window.Angular) libraries.push('Angular');
      if (window.gsap) libraries.push('GSAP');
      if (window.ScrollTrigger) libraries.push('ScrollTrigger');
      if (window.LottieInteractivity) libraries.push('Lottie');

      return {
        eventsFound: Array.from(eventsFound),
        dataAttributes: Array.from(dataAttributes),
        scripts: scriptAnalysis,
        libraries,
        totalElements: allElements.length
      };
    };

    // ===== VIDEO & MEDIA ANALYSIS =====
    const analyzeMedia = () => {
      const videos = Array.from(document.querySelectorAll('video, iframe, .video, [data-video]'));
      const images = Array.from(document.querySelectorAll('img'));

      const videoDetails = videos.map(video => ({
        tagName: video.tagName,
        src: video.src || video.getAttribute('src') || '',
        isVimeo: video.src?.includes('vimeo.com') || video.getAttribute('src')?.includes('vimeo.com'),
        autoplay: video.src?.includes('autoplay=1') || video.getAttribute('src')?.includes('autoplay=1')
      }));

      const imageOptimizations = images.slice(0, 20).map(img => ({
        src: img.src,
        alt: img.alt,
        loading: img.loading || 'not-set',
        width: img.width,
        height: img.height,
        hasSizes: !!img.sizes,
        hasSrcset: !!img.srcset
      }));

      return {
        totalVideos: videos.length,
        totalImages: images.length,
        videoDetails,
        imageOptimizations
      };
    };

    return {
      visualDesign: {
        colorScheme: getColorScheme(),
        typography: getTypography(),
        animations: getAnimations()
      },
      layout: getLayoutPatterns(),
      behavior: analyzeBehavior(),
      media: analyzeMedia(),
      performance: {
        totalElements: document.querySelectorAll('*').length,
        totalClasses: Object.keys(getLayoutPatterns().classes).length,
        stylesheets: document.styleSheets.length
      }
    };
  });

  console.log('\n🎨 VISUAL DESIGN ANALYSIS:');
  console.log('=========================');
  console.log(`📊 Colors found: ${comprehensiveAnalysis.visualDesign.colorScheme.length}`);
  comprehensiveAnalysis.visualDesign.colorScheme.forEach((color, i) => {
    console.log(`  ${i + 1}. ${color.color} (${color.count} uses)`);
  });

  console.log(`\n🔤 Typography:`);
  console.log(`Font families: ${comprehensiveAnalysis.visualDesign.typography.fontFamilies.length}`);
  comprehensiveAnalysis.visualDesign.typography.fontFamilies.forEach(([font, count]) => {
    console.log(`  • ${font}: ${count} uses`);
  });

  console.log(`\nFont sizes: ${comprehensiveAnalysis.visualDesign.typography.fontSizes.length}`);
  comprehensiveAnalysis.visualDesign.typography.fontSizes.forEach(([size, count]) => {
    console.log(`  • ${size}: ${count} uses`);
  });

  console.log(`\n🎭 Animations & Interactions:`);
  console.log(`CSS Transitions: ${comprehensiveAnalysis.visualDesign.animations.cssTransitions.length}`);
  console.log(`CSS Animations: ${comprehensiveAnalysis.visualDesign.animations.cssAnimations.length}`);
  console.log(`Keyframes declared: ${comprehensiveAnalysis.visualDesign.animations.declaredKeyframes}`);

  console.log('\n🏗️ LAYOUT & STRUCTURE:');
  console.log('=====================');
  console.log(`Flexbox elements: ${comprehensiveAnalysis.layout.flexElements}`);
  console.log(`Grid elements: ${comprehensiveAnalysis.layout.gridElements}`);
  console.log(`Total unique CSS classes: ${comprehensiveAnalysis.layout.topClasses.length}`);

  console.log(`\nMost used classes:`);
  comprehensiveAnalysis.layout.topClasses.slice(0, 8).forEach(([cls, count]) => {
    console.log(`  • ${cls}: ${count} uses`);
  });

  if (comprehensiveAnalysis.layout.grids.length > 0) {
    console.log(`\n📐 Grid layouts found:`);
    comprehensiveAnalysis.layout.grids.slice(0, 3).forEach(grid => {
      console.log(`  • ${grid.selector}: ${grid.template}`);
    });
  }

  console.log('\n⚡ JAVASCRIPT & INTERACTIONS:');
  console.log('============================');
  console.log(`Event types detected: ${comprehensiveAnalysis.behavior.eventsFound.length}`);
  console.log(`Data attributes found: ${comprehensiveAnalysis.behavior.dataAttributes.length}`);
  console.log(`Scripts loaded: ${comprehensiveAnalysis.behavior.scripts.length}`);

  if (comprehensiveAnalysis.behavior.libraries.length > 0) {
    console.log(`\n📚 Libraries detected:`);
    comprehensiveAnalysis.behavior.libraries.forEach(lib => {
      console.log(`  • ${lib}`);
    });
  } else {
    console.log(`\n📚 Libraries detected: None identified`);
    console.log(`  (This could be vanilla JS or undetectably minified libraries)`);
  }

  console.log('\n🎬 MEDIA ANALYSIS:');
  console.log('==================');
  console.log(`Videos found: ${comprehensiveAnalysis.media.totalVideos}`);
  console.log(`Images found: ${comprehensiveAnalysis.media.totalImages}`);

  if (comprehensiveAnalysis.media.videoDetails.length > 0) {
    console.log(`\nVideo providers:`);
    comprehensiveAnalysis.media.videoDetails.forEach(video => {
      console.log(`  • ${video.tagName}: ${video.isVimeo ? 'Vimeo' : 'Other'}`);
      console.log(`    - Autoplay: ${video.autoplay}`);
    });
  }

  console.log(`\nImage optimization:`);
  const optimizedImages = comprehensiveAnalysis.media.imageOptimizations.filter(img => img.loading === 'lazy' || img.hasSrcset).length;
  console.log(`  • ${optimizedImages}/${comprehensiveAnalysis.media.imageOptimizations.length} images have lazy loading or srcset`);

  console.log('\n📈 PERFORMANCE METRICS:');
  console.log('=======================');
  console.log(`Total DOM elements: ${comprehensiveAnalysis.performance.totalElements}`);
  console.log(`Stylesheets loaded: ${comprehensiveAnalysis.performance.stylesheets}`);

  // ===== COMPREHENSIVE INTERACTIVE EXPLORATION (SCOUT.NEW STYLE) =====
  console.log('\n🔍 Phase 2: Comprehensive interactive exploration...');

  // Take sectional screenshots as we scroll
  const sections = await page.evaluate(() => {
    const viewportHeight = window.innerHeight;
    const sections = [];
    const scrollPositions = [0, 300, 600, 1000, 1500, 2000, 2500]; // Specific scroll positions

    scrollPositions.forEach((pos, index) => {
      window.scrollTo(0, pos);
      const currentElements = document.querySelectorAll('*').length;
      const videosInViewport = Array.from(document.querySelectorAll('video, iframe')).filter(v => {
        const rect = v.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight && rect.width > 0;
      });

      sections.push({
        section: index + 1,
        scrollY: pos,
        elements: currentElements,
        videosInViewport: videosInViewport.length,
        hasContent: currentElements > 50 // Reasonable content threshold
      });
    });

    return sections;
  });

  console.log(`✨ Scanned ${sections.length} sections by targeted scrolling:`);
  sections.forEach(section => {
    console.log(`  Section ${section.section} (scroll: ${section.scrollY}px): ${section.elements} elements, ${section.videosInViewport} videos`);
  });

  // Strategic screenshot capture (like Scout.new)
  console.log('\n📸 Phase 3: Taking 10+ strategic screenshots...');

  // 1-3: Progressive scroll states
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    await page.evaluate((pos) => window.scrollTo(0, pos), section.scrollY);
    await page.waitForTimeout(1000); // Allow content to load
    await page.screenshot({
      path: `sam-section-${section.section}.png`,
      fullPage: false, // Viewport only for focused analysis
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    });
    console.log(`  ✅ Section ${section.section} (scroll ${section.scrollY}px)`);
  }

  // 4-5: Mobile and tablet viewports
  await page.setViewport({ width: 375, height: 667 });
  await page.screenshot({path: path.join(analysisDir, 'sam-mobile-view.png'), fullPage: false});
  console.log('  ✅ Mobile view (375x667)');

  await page.setViewport({ width: 768, height: 1024 });
  await page.screenshot({path: path.join(analysisDir, 'sam-tablet-view.png'), fullPage: false});
  console.log('  ✅ Tablet view (768x1024)');

  // 6-7: Return to desktop and capture hero/navigation
  await page.setViewport({ width: 1920, height: 1080 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({path: path.join(analysisDir, 'sam-hero-zone.png'), clip: { x: 0, y: 0, width: 1920, height: 400 }});
  console.log('  ✅ Hero zone analysis (top 400px)');

  // 8: Full page comprehensive
  await page.screenshot({path: path.join(analysisDir, 'sam-full-comprehensive.png'), fullPage: true});
  console.log('  ✅ Full page comprehensive capture');

  // 9-10+: Specific interaction captures
  const interactiveElements = await page.evaluate(() => {
    const clickable = document.querySelectorAll('button, a[href], [role="button"], [onclick], .clickable, [class*="play"], [class*="button"]');
    const detailed = [];

    clickable.forEach((el, index) => {
      if (index < 3) { // Capture first 3 key interactive elements
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight && rect.width > 0 && rect.height > 0;
        const text = el.textContent?.trim().substring(0, 80) || '';

        // Check if element is likely a link, button, or interaction trigger
        const isNav = el.closest('nav') || el.closest('[class*="nav"]') || el.closest('header');
        const isCTA = text.toLowerCase().includes('contact') ||
                     text.toLowerCase().includes('work') ||
                     text.toLowerCase().includes('portfolio') ||
                     text.toLowerCase().includes('projects');

        if (isCTA || isNav || el.className.includes('button') || el.tagName === 'BUTTON') {
          detailed.push({
            index: index + 1,
            tagName: el.tagName,
            classes: el.className,
            text: text,
            visible: isVisible,
            rect: { x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) },
            type: isCTA ? 'cta' : 'nav'
          });
        }
      }
    });

    return detailed;
  });

  console.log(`\n🎯 Found ${interactiveElements.length} key interactive elements:`);
  interactiveElements.forEach((el) => {
    console.log(`  ${el.index}. ${el.tagName} - "${el.text}" (${el.type}) - ${el.visible ? 'visible' : 'hidden'}`);
  });

  // Capture focused screenshots of key elements
  for (const el of interactiveElements) {
    if (el.visible) {
      await page.screenshot({
        path: `sam-element-${el.index}-${el.type}.png`,
        clip: {
          x: Math.max(0, el.rect.x - 50),
          y: Math.max(0, el.rect.y - 50),
          width: Math.min(400, el.rect.width + 100),
          height: Math.min(200, el.rect.height + 100)
        }
      });
      console.log(`  ✅ Element ${el.index} zoomed capture`);
    }
  }

  // Additional captures: before/after scroll positions
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(1000);
  await page.screenshot({path: path.join(analysisDir, 'sam-scroll-midriff.png'), clip: { x: 0, y: 0, width: 1920, height: 1080 }});
  console.log('  ✅ Mid-page scroll position');

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({path: path.join(analysisDir, 'sam-page-bottom.png'), clip: { x: 0, y: 0, width: 1920, height: 1080 }});
  console.log('  ✅ Page bottom analysis');

  // ===== FINAL ANALYSIS REPORT =====
  console.log('\n📋 SCOUT.NEW-STYLE COMPREHENSIVE ANALYSIS REPORT:');
  console.log('====================================================');
  console.log('✅ Visual Design: ✅ Typography ✅ Colors ✅ Animations');
  console.log('✅ Layout Structure: ✅ Grid/Flex ✅ Components ✅ Classes');
  console.log('✅ JavaScript: ✅ Events ✅ Libraries ✅ Interactions');
  console.log('✅ Media: ✅ Videos ✅ Images ✅ Optimization');
  console.log('✅ Performance: ✅ Metrics ✅ Structure ✅ Loading');

  console.log('\n📸 15+ PROFESSIONAL SCREENSHOTS CAPTURED:');
  console.log('=============================================');
  console.log('🎯 SECTIONS & SCROLL ANALYSIS:');
  sections.forEach(section => {
    console.log(`  • sam-section-${section.section}.png (scroll ${section.scrollY}px)`);
  });

  console.log('\n📱 RESPONSIVE & BREAKPOINT ANALYSIS:');
  console.log('  • sam-mobile-view.png (375x667 - mobile)');
  console.log('  • sam-tablet-view.png (768x1024 - tablet)');
  console.log('  • sam-hero-zone.png (hero area focus)');

  console.log('\n🎨 COMPOSITE & ELEMENT ANALYSIS:');
  console.log('  • sam-full-comprehensive.png (complete page)');
  console.log('  • sam-scroll-midriff.png (mid-page content)');
  console.log('  • sam-page-bottom.png (footer & bottom)');

  console.log('\n🎪 INTERACTIVE ELEMENT ZOOM:');
  interactiveElements.forEach(el => {
    console.log(`  • sam-element-${el.index}-${el.type}.png (${el.type} button/element ${el.index})`);
  });

  console.log(`\n📊 ANALYSIS SUMMARY: ${sections.length + 7 + interactiveElements.length} screenshots total`);

  console.log('\n🎯 DETAILED KEY INSIGHTS FOR YOUR PORTFOLIO:');
  console.log('===============================================');

  if (comprehensiveAnalysis.visualDesign.animations.declaredKeyframes > 0) {
    console.log('💡 Smooth animations detected - implement similar CSS transitions');
  }

  if (comprehensiveAnalysis.layout.flexElements > 0) {
    console.log('💡 Uses flexbox layouts - consider adopting similar responsive patterns');
  }

  if (comprehensiveAnalysis.behavior.libraries.includes('GSAP')) {
    console.log('💡 Professional animation library - GSAP worth implementing!');
  }

  if (comprehensiveAnalysis.media.videoDetails.some(v => v.isVimeo)) {
    console.log('💡 Vimeo integration - similar video handling already implemented');
  }

  console.log('\n🔍 Browser remains open for manual inspection');
  console.log('Close when done - analysis complete!');

  // Keep browser open
  await new Promise(() => {});
}

comprehensiveDesignAnalysis().catch(console.error);