import puppeteer from 'puppeteer';

async function interactiveAnalysis() {
  console.log('🎬 Interactive analysis of Sam Kolder Vimeo autoplay...');

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('📱 Loading Sam Kolder website...');
  await page.goto('https://www.samkolder.com/', {waitUntil: 'networkidle2'});

  console.log('📷 Initial page screenshot...');
  await page.screenshot({path: 'sam-initial-load.png', fullPage: true});

  console.log('\n🔍 Step 1: Looking for actionable elements...');

  // Get information about clickable elements
  const interactiveAnalysis = await page.evaluate(() => {
    const videoElements = Array.from(document.querySelectorAll('video, iframe, .video, [data-video], [class*="video"], button, a'));
    const playButtons = Array.from(document.querySelectorAll('[class*="play"], [aria-label*="play"], svg'));
    const videoContainers = Array.from(document.querySelectorAll('[class*="video"], [id*="video"]'));

    return {
      totalInteractive: videoElements.length,
      totalPlayButtons: playButtons.length,
      totalVideoContainers: videoContainers.length,
      videoElements: videoElements.slice(0, 5).map(el => ({
        tag: el.tagName,
        classes: el.className,
        id: el.id,
        visible: window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden',
        hasClickHandler: !!el.onclick
      }))
    };
  });

  console.log('Interactable elements found:', interactiveAnalysis.totalInteractive);
  console.log('Play buttons found:', interactiveAnalysis.totalPlayButtons);
  console.log('Video containers found:', interactiveAnalysis.totalVideoContainers);

  // Try scrolling to trigger any lazy-loaded content
  console.log('\n🔍 Step 2: Scrolling through page to trigger videos...');
  await page.evaluate(() => {
    window.scrollTo(0, 500);
  });
  await page.waitForTimeout(1000);

  console.log('📸 Screenshot after scroll...');
  await page.screenshot({path: 'sam-after-scroll.png', fullPage: true});

  // Look for video elements after scroll
  const afterScrollAnalysis = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('iframe'));
    const playingVideos = videos.filter(v => {
      try {
        const rect = v.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      } catch {
        return false;
      }
    });

    return {
      videosAfterScroll: videos.length,
      videosInViewport: playingVideos.length,
      videoDetails: videos.slice(0, 3).map(v => ({
        src: v.getAttribute('src') || '',
        visible: v.offsetHeight > 0,
        inViewport: true
      }))
    };
  });

  console.log('Videos found after scroll:', afterScrollAnalysis.videosAfterScroll);
  console.log('Videos in viewport:', afterScrollAnalysis.videosInViewport);

  afterScrollAnalysis.videoDetails.forEach((video, i) => {
    console.log(`Video ${i + 1}:`);
    console.log(`  - Source: ${video.src}`);
    console.log(`  - Visible: ${video.visible}`);
    console.log(`  - In Viewport: ${video.inViewport}`);
  });

  // Try to find and click the first play button
  console.log('\n🔍 Step 3: Attempting to interact with play buttons...');

  const clickResult = await page.evaluate(() => {
    // Look for common play button selectors
    const selectors = [
      '.play-button',
      '[aria-label*="play"]',
      'button[class*="play"]',
      'a[class*="play"]',
      'svg[class*="play"]',
      '[onclick*="play"]' // Any element with play-related onclick
    ];

    for (let selector of selectors) {
      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        elements[0].click();
        return {
          clicked: true,
          selector: selector,
          elementCount: elements.length
        };
      }
    }

    // Look for any video-related clickable element
    const clickableElements = document.querySelectorAll('.video, [class*="video"], video, iframe');
    if (clickableElements.length > 0) {
      clickableElements[0].click();
      return {
        clicked: true,
        selector: 'video-container',
        elementCount: clickableElements.length
      };
    }

    return {
      clicked: false,
      error: 'No clickable play elements found'
    };
  });

  if (clickResult.clicked) {
    console.log(`✅ Clicked element using selector: ${clickResult.selector}`);
    console.log(`Total similar elements: ${clickResult.elementCount}`);

    // Wait for video to load/appear
    await page.waitForTimeout(3000);

    console.log('📸 Screenshot after click...');
    await page.screenshot({path: 'sam-after-click.png', fullPage: true});

    // Check video status after click
    const postClickAnalysis = await page.evaluate(() => {
      const iframes = Array.from(document.querySelectorAll('iframe'));

      return {
        iframesAfterClick: iframes.length,
        iframeDetails: iframes.slice(0, 2).map(iframe => ({
          src: iframe.getAttribute('src') || '',
          visible: iframe.offsetHeight > 0,
          srcContainsAutoplay: iframe.getAttribute('src')?.includes('autoplay=1') || false
        }))
      };
    });

    console.log('Videos found after click:', postClickAnalysis.iframesAfterClick);

    postClickAnalysis.iframeDetails.forEach((iframe, i) => {
      console.log(`Video ${i + 1} details:`);
      console.log(`  - Autoplay: ${iframe.srcContainsAutoplay}`);
      console.log(`  - Visible: ${iframe.visible}`);
      console.log(`  - Source: ${iframe.src.slice(0, 60)}...`);
    });

  } else {
    console.log('❌ Could not find playable elements to click');
    console.log(clickResult.error);
  }

  // Final analysis of autoplay parameters
  console.log('\n📊 Step 4: Final autoplay analysis...');

  const finalAnalysis = await page.evaluate(() => {
    const iframes = Array.from(document.querySelectorAll('iframe'));
    const videos = Array.from(document.querySelectorAll('video'));

    const autoplayParams = [];
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src') || '';
      if (src.includes('autoplay')) {
        autoplayParams.push({
          src: src.includes('player.vimeo.com') ? 'Vimeo' : 'Other',
          params: src.split('?')[1]?.split('&').filter(p => p.includes('autoplay') || p.includes('muted') || p.includes('background')) || []
        });
      }
    });

    return {
      totalIframes: iframes.length,
      totalVideos: videos.length,
      autoplayParams: autoplayParams.slice(0, 3),
      pageHasVideo: iframes.length > 0 || videos.length > 0
    };
  });

  console.log('\n🎯 Final Results:');
  console.log('=================');
  console.log(`Total iframes: ${finalAnalysis.totalIframes}`);
  console.log(`Total videos: ${finalAnalysis.totalVideos}`);
  console.log(`Page has video content: ${finalAnalysis.pageHasVideo}`);

  if (finalAnalysis.autoplayParams.length > 0) {
    console.log('\n🎬 Autoplay parameters found:');
    finalAnalysis.autoplayParams.forEach((param, i) => {
      console.log(`${param.src} Video ${i + 1}:`);
      param.params.forEach(p => console.log(`  - ${p}`));
    });
  }

  console.log('\n📷 Screenshots captured:');
  console.log('• sam-initial-load.png');
  console.log('• sam-after-scroll.png');
  console.log('• sam-after-click.png');

  console.log('\n🔍 Browser window remains open for manual inspection');
  console.log('Check the console for any video-related errors or success messages');

  // Keep browser open indefinitely
  await new Promise(() => {});
}

interactiveAnalysis().catch(console.error);