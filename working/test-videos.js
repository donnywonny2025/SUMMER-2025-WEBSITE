import puppeteer from 'puppeteer';

async function openAndTest() {
  console.log('🔍 Opening portfolio website and testing Vimeo videos...');

  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('📱 Navigating to localhost:5173...');
  await page.goto('http://localhost:5173/', {waitUntil: 'networkidle2'});

  console.log('📸 Taking screenshot before testing videos...');
  await page.screenshot({path: 'before-video-test.png', fullPage: true});

  console.log('🎯 Looking for video play buttons...');
  const playButtons = await page.$$('.play-button');
  console.log('Found ' + playButtons.length + ' play buttons');

  if (playButtons.length > 0) {
    console.log('🖱️ Clicking first play button...');
    await playButtons[0].click();

    // Wait a moment for the video to load
    await page.waitForTimeout(3000);

    console.log('📸 Taking screenshot after clicking play...');
    await page.screenshot({path: 'after-video-click.png', fullPage: true});

    // Check if video iframe appeared
    const iframe = await page.$('.work_iframe');
    if (iframe) {
      console.log('✅ Video iframe found!');

      // Wait a bit more for the video to actually start
      await page.waitForTimeout(2000);

      console.log('📸 Taking screenshot of video playing...');
      await page.screenshot({path: 'video-playing.png', fullPage: true});
    } else {
      console.log('❌ No video iframe found after clicking play');
    }
  }

  console.log('🎯 Browser window is now open. Check for video working!');
  console.log('Screenshots saved: before-video-test.png, after-video-click.png, video-playing.png');

  // Don't close browser, keep it open for inspection
  console.log('⏸️ Browser window open - inspect videos manually');
  console.log('Press Ctrl+C in terminal to close when done');

  // Keep browser open indefinitely
  await new Promise(() => {});
}

openAndTest().catch(console.error);