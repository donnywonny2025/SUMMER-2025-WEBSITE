import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function scrapeLuckyRabbitWebsite() {
  console.log('🐰 Starting Lucky Rabbit Website Scraper');
  console.log('===========================================');

  const outputDir = path.join(__dirname, 'scraped-content');
  const assetsDir = path.join(outputDir, 'assets');
  const imagesDir = path.join(assetsDir, 'images');
  const cssDir = path.join(assetsDir, 'css');
  const jsDir = path.join(assetsDir, 'js');

  // Create output directories
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });
  fs.mkdirSync(cssDir, { recursive: true });
  fs.mkdirSync(jsDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Enable request interception to capture resources
  await page.setRequestInterception(true);
  
  // Store all resources
  const resources = {
    stylesheets: new Set(),
    scripts: new Set(),
    images: new Set(),
    fonts: new Set(),
    other: new Set()
  };

  page.on('request', request => {
    request.continue();
  });

  page.on('response', async response => {
    const url = response.url();
    const resourceType = response.request().resourceType();
    
    // Skip if not a successful response
    if (!response.ok()) return;
    
    try {
      if (resourceType === 'stylesheet') {
        resources.stylesheets.add(url);
      } else if (resourceType === 'script') {
        resources.scripts.add(url);
      } else if (resourceType === 'image') {
        resources.images.add(url);
      } else if (resourceType === 'font') {
        resources.fonts.add(url);
      } else {
        resources.other.add(url);
      }
    } catch (error) {
      console.error(`Error processing ${resourceType} at ${url}:`, error);
    }
  });

  console.log('🌐 Loading Lucky Rabbit website...');
  await page.goto('https://www.luckyrabbit.tech/', { waitUntil: 'networkidle2' });

  // Take a screenshot of the initial page load
  console.log('📷 Capturing full page screenshot...');
  await page.screenshot({ path: path.join(outputDir, 'lucky-rabbit-full-page.png'), fullPage: true });

  // Extract page content
  console.log('📝 Extracting page content...');
  const pageContent = await page.content();
  fs.writeFileSync(path.join(outputDir, 'index.html'), pageContent);

  // Extract page metadata
  const metadata = await page.evaluate(() => {
    return {
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      ogTags: Array.from(document.querySelectorAll('meta[property^="og:"]')).map(el => ({
        property: el.getAttribute('property'),
        content: el.getAttribute('content')
      })),
      links: Array.from(document.querySelectorAll('a')).map(a => ({
        text: a.innerText.trim(),
        href: a.href,
        isExternal: a.hostname !== window.location.hostname
      }))
    };
  });

  // Save metadata
  fs.writeFileSync(
    path.join(outputDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  // Extract design elements
  console.log('🎨 Analyzing design elements...');
  const designAnalysis = await page.evaluate(() => {
    // Color scheme analysis
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

    // Typography analysis
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

    // Layout analysis
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

        if (display === 'grid') patterns.grids.push(el.className || el.tagName);
        if (display === 'flex' || display === 'inline-flex') patterns.flexboxes.push(el.className || el.tagName);
        
        // Collect class names for component analysis
        if (el.className && typeof el.className === 'string') {
          el.className.split(' ').forEach(cls => {
            if (cls) patterns.classes[cls] = (patterns.classes[cls] || 0) + 1;
          });
        } else if (el.classList && el.classList.length) {
          Array.from(el.classList).forEach(cls => {
            if (cls) patterns.classes[cls] = (patterns.classes[cls] || 0) + 1;
          });
        }
      });

      return {
        gridLayouts: patterns.grids.slice(0, 10),
        flexboxLayouts: patterns.flexboxes.slice(0, 10),
        commonClasses: Object.entries(patterns.classes)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 20)
          .map(([cls, count]) => ({class: cls, count}))
      };
    };

    return {
      colorScheme: getColorScheme(),
      typography: getTypography(),
      layoutPatterns: getLayoutPatterns(),
      pageStructure: {
        sections: Array.from(document.querySelectorAll('section, header, footer, main, nav')).map(section => ({
          type: section.tagName.toLowerCase(),
          id: section.id,
          classes: section.className,
          childrenCount: section.children.length
        }))
      }
    };
  });

  // Save design analysis
  fs.writeFileSync(
    path.join(outputDir, 'design-analysis.json'),
    JSON.stringify(designAnalysis, null, 2)
  );

  // Download resources
  console.log('📥 Downloading resources...');
  
  // Download stylesheets
  for (const url of resources.stylesheets) {
    try {
      const cssResponse = await fetch(url);
      const cssContent = await cssResponse.text();
      const fileName = path.basename(new URL(url).pathname);
      fs.writeFileSync(path.join(cssDir, fileName), cssContent);
      console.log(`✅ Downloaded CSS: ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to download CSS from ${url}:`, error);
    }
  }

  // Download scripts
  for (const url of resources.scripts) {
    try {
      const jsResponse = await fetch(url);
      const jsContent = await jsResponse.text();
      const fileName = path.basename(new URL(url).pathname);
      fs.writeFileSync(path.join(jsDir, fileName), jsContent);
      console.log(`✅ Downloaded JS: ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to download JS from ${url}:`, error);
    }
  }

  // Download images
  for (const url of resources.images) {
    try {
      const imgResponse = await fetch(url);
      const buffer = await imgResponse.arrayBuffer();
      const fileName = path.basename(new URL(url).pathname);
      fs.writeFileSync(path.join(imagesDir, fileName), Buffer.from(buffer));
      console.log(`✅ Downloaded image: ${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to download image from ${url}:`, error);
    }
  }

  // Save resource list
  fs.writeFileSync(
    path.join(outputDir, 'resources.json'),
    JSON.stringify({
      stylesheets: Array.from(resources.stylesheets),
      scripts: Array.from(resources.scripts),
      images: Array.from(resources.images),
      fonts: Array.from(resources.fonts),
      other: Array.from(resources.other)
    }, null, 2)
  );

  // Extract all text content
  console.log('📄 Extracting text content...');
  const textContent = await page.evaluate(() => {
    const extractTextFromElement = (element) => {
      const children = Array.from(element.childNodes);
      let text = '';
      
      children.forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const trimmed = child.textContent.trim();
          if (trimmed) text += trimmed + ' ';
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          // Skip script and style elements
          if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            text += extractTextFromElement(child) + ' ';
          }
        }
      });
      
      return text.trim();
    };
    
    return extractTextFromElement(document.body);
  });

  fs.writeFileSync(path.join(outputDir, 'text-content.txt'), textContent);

  // Extract all images
  console.log('🖼️ Cataloging images...');
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
      className: img.className
    }));
  });

  fs.writeFileSync(
    path.join(outputDir, 'images.json'),
    JSON.stringify(images, null, 2)
  );

  // Capture mobile view
  console.log('📱 Capturing mobile view...');
  await page.setViewport({ width: 375, height: 812 });
  await page.reload({ waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(outputDir, 'lucky-rabbit-mobile.png'), fullPage: true });

  console.log('✅ Website scraping completed!');
  console.log(`📁 All content saved to: ${outputDir}`);

  await browser.close();
}

scrapeLuckyRabbitWebsite().catch(error => {
  console.error('❌ Scraping failed:', error);
  process.exit(1);
});