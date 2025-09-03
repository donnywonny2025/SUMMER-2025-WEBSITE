const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const SCREEN_DIR = path.join(ROOT, 'screenshots');
const NEXT_LAYOUT = path.join(ROOT, 'src', 'app', 'layout.tsx');
const NEXT_GLOBALS = path.join(ROOT, 'src', 'app', 'globals.css');
const STATIC_INDEX = path.join(ROOT, 'index.html');
const STATIC_CSS = path.join(ROOT, 'css', 'styles.css');

if (!fs.existsSync(SCREEN_DIR)) fs.mkdirSync(SCREEN_DIR, { recursive: true });

function readFileSafe(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function writeFileSafe(p, c) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, 'utf8'); }
function exists(p) { try { return fs.existsSync(p); } catch { return false; } }

async function isReachable(url) {
  try { const r = await fetch(url, { method: 'GET' }); return r.ok; } catch { return false; }
}

async function resolveTargetUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  if (await isReachable('http://localhost:3000')) return 'http://localhost:3000';
  if (exists(STATIC_INDEX)) return 'file://' + STATIC_INDEX;
  throw new Error('No target found. Start dev server (npm run dev) or create index.html');
}

async function analyzeWithPuppeteer(url) {
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000)); // Let animations settle

    // Take before screenshot
    const timestamp = Date.now();
    await page.setViewport({ width: 1440, height: 900 });
    const desktopFile = path.join(SCREEN_DIR, `before-desktop-${timestamp}.png`);
    await page.screenshot({ path: desktopFile, fullPage: true });
    
    await page.setViewport({ width: 375, height: 720 });
    const mobileFile = path.join(SCREEN_DIR, `before-mobile-${timestamp}.png`);
    await page.screenshot({ path: mobileFile, fullPage: true });

    // Analyze page issues
    const issues = await page.evaluate(() => {
      const problems = [];

      // 1. Check page title
      const title = document.title || '';
      if (title.includes('Create Next App') || title === '' || title.toLowerCase().includes('react app')) {
        problems.push({
          id: 'default_title',
          severity: 'high',
          description: `Page title is default: "${title}"`,
          fix: 'update_title'
        });
      }

      // 2. Check mobile font sizes
      const textElements = document.querySelectorAll('p, span, div:not([class*="icon"]):not([class*="svg"])');
      let smallTextCount = 0;
      textElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (el.textContent.trim().length > 10 && fontSize < 14) {
          smallTextCount++;
        }
      });
      if (smallTextCount > 3) {
        problems.push({
          id: 'small_mobile_text',
          severity: 'medium', 
          description: `Found ${smallTextCount} text elements smaller than 14px`,
          fix: 'increase_mobile_fonts'
        });
      }

      // 3. Check for horizontal overflow
      const hasOverflow = document.body.scrollWidth > window.innerWidth;
      if (hasOverflow) {
        problems.push({
          id: 'horizontal_overflow',
          severity: 'medium',
          description: `Page has horizontal overflow (${document.body.scrollWidth}px > ${window.innerWidth}px)`,
          fix: 'fix_overflow'
        });
      }

      // 4. Check missing viewport meta tag
      const hasViewport = document.querySelector('meta[name="viewport"]');
      if (!hasViewport) {
        problems.push({
          id: 'missing_viewport',
          severity: 'medium',
          description: 'Missing viewport meta tag for responsive design',
          fix: 'add_viewport'
        });
      }

      // 5. Check for missing alt text on images
      const images = document.querySelectorAll('img');
      let missingAltCount = 0;
      images.forEach(img => {
        if (!img.alt || img.alt.trim() === '') missingAltCount++;
      });
      if (missingAltCount > 0) {
        problems.push({
          id: 'missing_alt_text',
          severity: 'low',
          description: `${missingAltCount} images missing alt text`,
          fix: 'add_alt_text'
        });
      }

      // 6. Check for invisible text (common with gradients)
      const invisibleElements = [];
      textElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const text = el.textContent.trim();
        if (text.length > 5 && (
          style.color === 'transparent' || 
          style.opacity === '0' || 
          style.visibility === 'hidden'
        )) {
          invisibleElements.push(text.substring(0, 30));
        }
      });
      if (invisibleElements.length > 0) {
        problems.push({
          id: 'invisible_text',
          severity: 'critical',
          description: `Found invisible text: ${invisibleElements.join(', ')}`,
          fix: 'fix_invisible_text'
        });
      }

      return {
        url: window.location.href,
        title: document.title,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        issues: problems
      };
    });

    return { ...issues, screenshots: { desktop: desktopFile, mobile: mobileFile } };

  } finally {
    await browser.close();
  }
}

function updateNextTitle(title = 'Jeffrey Kerr — Creative Technologist', description = 'Creative Technologist Portfolio') {
  if (!exists(NEXT_LAYOUT)) return { changed: false, reason: 'layout_missing' };
  
  let src = readFileSafe(NEXT_LAYOUT);
  const titleRe = /(title\s*:\s*["'`]).*?(["'`])/s;
  const descRe = /(description\s*:\s*["'`]).*?(["'`])/s;
  
  let changed = false;
  if (titleRe.test(src)) {
    src = src.replace(titleRe, `$1${title}$2`);
    changed = true;
  }
  if (descRe.test(src)) {
    src = src.replace(descRe, `$1${description}$2`);
    changed = true;
  }
  
  if (changed) writeFileSafe(NEXT_LAYOUT, src);
  return { changed, file: 'src/app/layout.tsx' };
}

function updateIndexHtmlTitle(title = 'Jeffrey Kerr — Creative Technologist') {
  if (!exists(STATIC_INDEX)) return { changed: false, reason: 'index_missing' };
  
  let html = readFileSafe(STATIC_INDEX);
  let changed = false;
  
  // Update title
  const hasTitle = /<title>[\s\S]*?<\/title>/i.test(html);
  if (hasTitle) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    changed = true;
  } else {
    html = html.replace(/<head>/i, `<head>\n  <title>${title}</title>`);
    changed = true;
  }
  
  // Add viewport if missing
  if (!/name="viewport"/i.test(html)) {
    html = html.replace(/<head>/i, `<head>\n  <meta name="viewport" content="width=device-width, initial-scale=1">`);
    changed = true;
  }
  
  if (changed) writeFileSafe(STATIC_INDEX, html);
  return { changed, file: 'index.html' };
}

function increaseMobileFontSizes() {
  let changes = [];
  
  // Update Next.js globals.css
  if (exists(NEXT_GLOBALS)) {
    let css = readFileSafe(NEXT_GLOBALS);
    let changed = false;
    
    // Update existing mobile font rules
    if (css.includes('max(14px, 1rem)')) {
      css = css.replace(/max\(14px, 1rem\)/g, 'max(16px, 1rem)');
      changed = true;
    }
    
    // Add comprehensive mobile font rules if not present
    if (!css.includes('@media (max-width: 640px)') || !css.includes('font-size: max(16px')) {
      const mobileFontCSS = `
/* Enhanced mobile typography */
@media (max-width: 640px) {
  body, p, span, div {
    font-size: max(16px, 1rem) !important;
    line-height: 1.5 !important;
  }
  
  .text-xs { font-size: max(14px, 0.875rem) !important; }
  .text-sm { font-size: max(16px, 1rem) !important; }
  .text-base { font-size: max(16px, 1.125rem) !important; }
  .text-lg { font-size: max(18px, 1.25rem) !important; }
}`;
      css += mobileFontCSS;
      changed = true;
    }
    
    if (changed) {
      writeFileSafe(NEXT_GLOBALS, css);
      changes.push('src/app/globals.css');
    }
  }
  
  // Update static CSS
  if (exists(STATIC_CSS)) {
    let css = readFileSafe(STATIC_CSS);
    const mobileFontCSS = `
/* Mobile font size improvements */
@media (max-width: 640px) {
  body, p, span, div, a {
    font-size: 16px !important;
    line-height: 1.5 !important;
  }
  
  h1 { font-size: 28px !important; }
  h2 { font-size: 24px !important; }
  h3 { font-size: 20px !important; }
}`;
    css += mobileFontCSS;
    writeFileSafe(STATIC_CSS, css);
    changes.push('css/styles.css');
  }
  
  return { changed: changes.length > 0, files: changes };
}

function fixOverflowIssues() {
  let changes = [];
  
  // Add overflow fixes to CSS files
  const overflowCSS = `
/* Prevent horizontal overflow */
* {
  box-sizing: border-box;
}

body {
  overflow-x: hidden;
}

.container, .max-w-7xl, .max-w-6xl, .max-w-5xl {
  max-width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (max-width: 640px) {
  * {
    max-width: 100% !important;
  }
}`;

  if (exists(NEXT_GLOBALS)) {
    let css = readFileSafe(NEXT_GLOBALS);
    if (!css.includes('overflow-x: hidden')) {
      css += overflowCSS;
      writeFileSafe(NEXT_GLOBALS, css);
      changes.push('src/app/globals.css');
    }
  }
  
  if (exists(STATIC_CSS)) {
    let css = readFileSafe(STATIC_CSS);
    css += overflowCSS;
    writeFileSafe(STATIC_CSS, css);
    changes.push('css/styles.css');
  }
  
  return { changed: changes.length > 0, files: changes };
}

async function applyFixes(issues) {
  const applied = [];
  
  for (const issue of issues) {
    switch (issue.fix) {
      case 'update_title':
        const nextResult = updateNextTitle();
        const htmlResult = updateIndexHtmlTitle();
        if (nextResult.changed || htmlResult.changed) {
          applied.push(`Updated page title in ${[nextResult.file, htmlResult.file].filter(Boolean).join(', ')}`);
        }
        break;
        
      case 'increase_mobile_fonts':
        const fontResult = increaseMobileFontSizes();
        if (fontResult.changed) {
          applied.push(`Increased mobile font sizes in ${fontResult.files.join(', ')}`);
        }
        break;
        
      case 'fix_overflow':
        const overflowResult = fixOverflowIssues();
        if (overflowResult.changed) {
          applied.push(`Added overflow fixes in ${overflowResult.files.join(', ')}`);
        }
        break;
        
      case 'add_viewport':
        // This is handled in updateIndexHtmlTitle
        break;
        
      case 'fix_invisible_text':
        // Add basic text visibility fixes
        const textCSS = `
/* Ensure text visibility */
h1, h2, h3, h4, h5, h6, p, span, div {
  color: inherit !important;
  opacity: 1 !important;
  visibility: visible !important;
}

/* Fix gradient text issues */
.bg-clip-text {
  -webkit-text-fill-color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
}`;
        if (exists(NEXT_GLOBALS)) {
          let css = readFileSafe(NEXT_GLOBALS);
          if (!css.includes('text visibility')) {
            css += textCSS;
            writeFileSafe(NEXT_GLOBALS, css);
            applied.push('Fixed text visibility in src/app/globals.css');
          }
        }
        break;
    }
  }
  
  return applied;
}

async function takeAfterScreenshots(url, timestamp) {
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));

    await page.setViewport({ width: 1440, height: 900 });
    const desktopFile = path.join(SCREEN_DIR, `after-desktop-${timestamp}.png`);
    await page.screenshot({ path: desktopFile, fullPage: true });
    
    await page.setViewport({ width: 375, height: 720 });
    const mobileFile = path.join(SCREEN_DIR, `after-mobile-${timestamp}.png`);
    await page.screenshot({ path: mobileFile, fullPage: true });

    return { desktop: desktopFile, mobile: mobileFile };
  } finally {
    await browser.close();
  }
}

async function run() {
  console.log('🔧 Starting auto-fix analysis...');
  
  const url = await resolveTargetUrl();
  console.log(`📍 Analyzing: ${url}`);
  
  let attempt = 1;
  const maxAttempts = 3;
  
  while (attempt <= maxAttempts) {
    console.log(`\n📸 Taking screenshots (attempt ${attempt})...`);
    
    const analysis = await analyzeWithPuppeteer(url);
    const timestamp = Date.now();
    
    // Save analysis report
    const reportPath = path.join(SCREEN_DIR, `analysis-${timestamp}.json`);
    writeFileSafe(reportPath, JSON.stringify(analysis, null, 2));
    
    console.log(`📊 Found ${analysis.issues.length} issues:`);
    analysis.issues.forEach(issue => {
      console.log(`   ${issue.severity.toUpperCase()}: ${issue.description}`);
    });
    
    if (analysis.issues.length === 0) {
      console.log('✅ No issues found! Site looks good.');
      break;
    }
    
    console.log('\n🔨 Applying fixes...');
    const appliedFixes = await applyFixes(analysis.issues);
    
    if (appliedFixes.length === 0) {
      console.log('⚠️  No fixes could be applied automatically.');
      break;
    }
    
    appliedFixes.forEach(fix => {
      console.log(`   ✓ ${fix}`);
    });
    
    console.log('\n📸 Taking verification screenshots...');
    const afterScreenshots = await takeAfterScreenshots(url, timestamp);
    
    // Quick re-analysis to check if issues are resolved
    const verification = await analyzeWithPuppeteer(url);
    const remainingIssues = verification.issues.length;
    
    if (remainingIssues === 0) {
      console.log(`\n🎉 All issues resolved! Applied ${appliedFixes.length} fixes in ${attempt} attempt${attempt === 1 ? '' : 's'}.`);
      console.log(`📸 Before: ${analysis.screenshots.desktop}`);
      console.log(`📸 After:  ${afterScreenshots.desktop}`);
      break;
    } else if (remainingIssues < analysis.issues.length) {
      console.log(`\n📈 Progress: ${analysis.issues.length - remainingIssues} issues resolved, ${remainingIssues} remaining.`);
    } else {
      console.log(`\n⚠️  Issues persist. Trying different approach...`);
    }
    
    attempt++;
    if (attempt <= maxAttempts) {
      await new Promise(r => setTimeout(r, 1000)); // Brief pause
    }
  }
  
  console.log(`\n📋 Analysis complete. Reports saved to: ${SCREEN_DIR}`);
}

if (require.main === module) {
  run().catch(err => {
    console.error('❌ Auto-fix failed:', err.message);
    process.exit(1);
  });
}

module.exports = { run };