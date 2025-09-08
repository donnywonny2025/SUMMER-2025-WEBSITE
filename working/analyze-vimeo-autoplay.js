import puppeteer from 'puppeteer';

async function analyzeVideoAutoplay() {
  console.log('🎬 Analyzing Sam Kolder Vimeo autoplay mechanism...');

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('📱 Navigating to Sam Kolder website...');
  await page.goto('https://www.samkolder.com/', {waitUntil: 'networkidle2'});

  console.log('🔍 Analyzing video implementation...');

  // Get video-related elements and their configurations
  const videoAnalysis = await page.evaluate(() => {
    const videos = Array.from(document.querySelectorAll('video, iframe[src*="vimeo"], .video, [data-video]'));
    const iframes = Array.from(document.querySelectorAll('iframe'));

    const videoDetails = videos.map((video, index) => {
      const src = video.src || video.getAttribute('src') || '';
      const isVimeo = src.includes('vimeo.com');

      return {
        index,
        tagName: video.tagName,
        src: src,
        isVimeo: isVimeo,
        autoplay: src.includes('autoplay=1'),
        muted: src.includes('muted=1'),
        isPlaying: !!(video.duration) > 0 && !video.paused !== false,
        visibility: window.getComputedStyle(video).visibility,
        display: window.getComputedStyle(video).display,
        styles: window.getComputedStyle(video)
      };
    });

    // Check for any JavaScript controlling videos
    const scripts = Array.from(document.querySelectorAll('script')).filter(script => {
      const content = script.innerHTML || script.src;
      return content && (content.includes('video') || content.includes('vimeo') || content.includes('play'));
    });

    const eventHandlers = [];
    for (let el of document.querySelectorAll('*')) {
      const events = getEventListeners ? getEventListeners(el) : {};
      if (Object.keys(events).length > 0) {
        eventHandlers.push({
          selector: el.tagName + (el.className ? '.' + el.className : ''),
          events: Object.keys(events)
        });
      }
    }

    return {
      totalVideos: videos.length,
      totalIframes: iframes.length,
      videoDetails: videoDetails,
      hasScripts: scripts.length,
      scriptsInfo: scripts.map(s => ({ src: s.src, hasContent: !!s.innerHTML })),
      eventHandlers: eventHandlers.slice(0, 10), // Limit for readability
      loadEvents: window.performance.getEntriesByType('resource')
        .filter(r => r.name.includes('vimeo') || r.name.includes('video'))
    };
  });

  console.log('\n📊 Vimeo Autoplay Analysis:');
  console.log('==========================');

  console.log(`• Total videos found: ${videoAnalysis.totalVideos}`);
  console.log(`• Total iframes: ${videoAnalysis.totalIframes}`);
  console.log(`• JavaScript controlling videos: ${videoAnalysis.hasScripts}`);

  videoAnalysis.videoDetails.forEach((video, i) => {
    console.log(`\n🎥 Video ${i + 1}:`);
    console.log(`  - Type: ${video.tagName}`);
    console.log(`  - Vimeo: ${video.isVimeo ? 'Yes' : 'No'}`);
    console.log(`  - Autoplay enabled: ${video.autoplay ? 'Yes' : 'No'}`);
    console.log(`  - Muted: ${video.muted ? 'Yes' : 'No'}`);
    console.log(`  - Visibility: ${video.visibility}`);
    console.log(`  - Display: ${video.display}`);
    if (video.src) console.log(`  - Source: ${video.src.substring(0, 60)}...`);
  });

  console.log('\n🔧 Scripts found:', videoAnalysis.scriptsInfo.length);

  console.log('\n⚡ Best practices for Vimeo autoplay:');
  console.log('====================================');
  console.log('✅ autoplay=1 - Auto-start on load');
  console.log('✅ muted=1 - Must be muted for autoplay to work');
  console.log('✅ background=1 - For overlay keyboards');
  console.log('✅ autopause=0 - Continue playing on scroll');
  console.log('✅ controls=0 - Hide Vimeo controls');

  console.log('\n🎯 Browser autoplay requirements:');
  console.log('=================================');
  console.log('• User must FIRST interact with the page');
  console.log('• Video must be muted to auto-play');
  console.log('• Triggers after: click, scroll, etc.');

  // Keep browser open for inspection
  console.log('\n⏸️ Browser window open - inspect video behavior manually');
  await new Promise(() => {});
}

analyzeVideoAutoplay().catch(console.error);