#!/usr/bin/env node

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`📸 SCREENSHOT HTML SOLO VIEW`);
console.log(`=============================`);

try {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport for consistent screenshots
  await page.setViewport({ 
    width: 1200, 
    height: 800,
    deviceScaleFactor: 1
  });
  
  // Load the HTML file
  const htmlPath = path.resolve(__dirname, '../../screenshots/current/solo-view.html');
  const fileUrl = `file://${htmlPath}`;
  
  console.log(`📄 Loading HTML file: ${fileUrl}`);
  await page.goto(fileUrl, { 
    waitUntil: 'networkidle0',
    timeout: 10000
  });
  
  // Wait a bit for any animations to settle
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Take screenshot
  const timestamp = Date.now();
  const screenshotPath = path.resolve(__dirname, `../../screenshots/current/solo-view-${timestamp}.png`);
  
  console.log(`📸 Taking full page screenshot...`);
  await page.screenshot({ 
    path: screenshotPath,
    fullPage: true,
    type: 'png'
  });
  
  console.log(`✅ Screenshot saved: ${screenshotPath}`);
  
  await browser.close();
  
  console.log(`🎯 Now you can visually analyze the solo view!`);
  
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
}
