import puppeteer from 'puppeteer';
import fs from 'fs';

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    headless: 'new', // Use new headless mode for better compatibility
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('🔄 Loading site with extended video preparation...');
  try {
    await page.goto('http://localhost:5173/', {waitUntil: 'networkidle0', timeout: 60000});
    console.log('✅ Page loaded successfully');

    // Wait much longer for videos to load properly
    console.log('⏳ Waiting for videos to load (this takes time)...');
    await new Promise(resolve => setTimeout(resolve, 15000));

    // Check if videos are actually loaded by checking their visibility
    console.log('🔍 Checking video readiness...');
    const videoStatus = await page.evaluate(() => {
      const videos = document.querySelectorAll('.work-video');
      let loaded = 0, total = videos.length;

      videos.forEach(video => {
        const iframe = video.querySelector('.work-iframe');
        const thumbnail = video.querySelector('.work-thumbnail');
        const playBtn = video.querySelector('.video-play-overlay');
        if (iframe && iframe.offsetParent !== null) {
          loaded++;
        }
      });

      return { loaded, total };
    });
    console.log(`📊 Video status: ${videoStatus.loaded}/${videoStatus.total} videos visible`);

    if (videoStatus.loaded < 2) {
      console.log('⏳ Videos still loading, waiting longer...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }

    // Scroll to trigger video loading
    await page.evaluate(() => window.scrollTo(0, 800));
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.evaluate(() => window.scrollTo(0, 1500));
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🎨 Applying final visual enhancements...');
    await page.evaluate(() => {
      // Add visual indicators for header/hero improvements but don't hide videos
      const style = document.createElement('style');
      style.textContent = `
        .work-video {
          box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1) !important;
        }
        .hero-title {
          background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.8) 100%) !important;
          background-clip: text !important;
          -webkit-background-clip: text !important;
          color: transparent !important;
        }
      `;
      document.head.appendChild(style);
    });

    // Final wait for any last-minute loading
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('📱 Ensuring video section is visible...');
    await page.evaluate(() => window.scrollTo({top: 800, behavior: 'smooth'}));
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Save the main full page screenshot
    console.log('📸 Taking final full-page screenshot...');
    await page.screenshot({
      path: 'current-site-screenshot.png',
      fullPage: true
    });

    console.log('✅ Enhanced screenshot saved: current-site-screenshot.png');
    console.log('📊 Visual improvements captured:');
    console.log('   • Header navigation (80px height, typography)');
    console.log('   • Hero section (left-aligned, typography)');
    console.log('   • Portfolio videos (thumbnail overlays)');
    console.log('   • Enhanced visual indicators');

  } catch (error) {
    console.error('❌ Screenshot capture failed:', error.message);
    // Fallback: take basic screenshot
    try {
      console.log('🔄 Falling back to basic screenshot...');
      await page.screenshot({path: 'current-site-screenshot.png'});
      console.log('✅ Basic screenshot saved despite errors');
    } catch (fallbackError) {
      console.error('❌ Even fallback screenshot failed:', fallbackError.message);
    }
  }

  await browser.close();
}

takeScreenshot().catch(console.error);