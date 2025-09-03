const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const puppeteer = require('puppeteer');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const MAX_ATTEMPTS = 3;
const DEFAULT_URL = process.env.SITE_URL || 'http://localhost:3000';
const OPENAI_MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function waitForServer(url, timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, res => { res.destroy(); resolve(); });
        req.on('error', reject);
        req.setTimeout(3000, () => { req.destroy(new Error('timeout')); });
      });
      return true;
    } catch (e) {
      await sleep(1000);
    }
  }
  throw new Error('Server not reachable: ' + url);
}

function startDevServerIfNeeded() {
  if (process.env.SITE_URL) return { child: null, url: process.env.SITE_URL, stop: async () => {} };
  const child = spawn(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'dev'], { cwd: root, env: process.env, stdio: 'pipe' });
  child.stdout.on('data', d => { const s = d.toString(); if (s.toLowerCase().includes('ready') || s.toLowerCase().includes('started')) process.stdout.write(s); });
  child.stderr.on('data', d => process.stderr.write(d.toString()));
  return { child, url: DEFAULT_URL, stop: async () => { if (!child.killed) child.kill(); } };
}

async function takeScreenshots(page, prefix) {
  const ts = Date.now();
  const shots = {};
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await sleep(1500);
  shots.desktop = path.join(outDir, `${prefix || 'shot'}-desktop-${ts}.png`);
  await page.screenshot({ path: shots.desktop, fullPage: true });
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await sleep(800);
  shots.tablet = path.join(outDir, `${prefix || 'shot'}-tablet-${ts}.png`);
  await page.screenshot({ path: shots.tablet, fullPage: true });
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
  await sleep(800);
  shots.mobile = path.join(outDir, `${prefix || 'shot'}-mobile-${ts}.png`);
  await page.screenshot({ path: shots.mobile, fullPage: true });
  return shots;
}

function toBase64(filePath) { return fs.readFileSync(filePath).toString('base64'); }

async function analyzeWithVision({ desktopPath, mobilePath, tabletPath, meta }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return { summary: 'OpenAI key missing. Set OPENAI_API_KEY to enable AI analysis.', issues: inferIssuesWithoutAI(meta), resolved: false, raw: {} };
  }
  const { OpenAI } = require('openai');
  const client = new OpenAI({ apiKey: key });
  const system = 'You are a strict UI/UX auditor. Analyze screenshots for issues: generic titles, small text, poor contrast, layout overflow, broken hierarchy. Output concise JSON. Only include objective issues that are visible. Provide concrete, minimal code-level fixes suitable for a Next.js App Router project with Tailwind CSS. If everything looks good, return an empty issues array and set resolved true.';
  const user = [
    { type: 'text', text: `Context: ${JSON.stringify(meta)}\nTask: Identify visible issues and propose specific code changes. Return JSON with keys: summary, resolved (boolean), and issues (array of {type, severity, reason, suggestions: string[], fixHints: string[]}). Keep under 1500 chars.` },
    { type: 'image_url', image_url: { url: `data:image/png;base64,${toBase64(desktopPath)}` } },
    { type: 'image_url', image_url: { url: `data:image/png;base64,${toBase64(tabletPath)}` } },
    { type: 'image_url', image_url: { url: `data:image/png;base64,${toBase64(mobilePath)}` } }
  ];
  try {
    const resp = await client.chat.completions.create({ model: OPENAI_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.2, response_format: { type: 'json_object' } });
    const text = resp.choices?.[0]?.message?.content || '{}';
    const parsed = JSON.parse(text);
    return { ...parsed, raw: resp };
  } catch (e) {
    return { summary: 'AI analysis failed: ' + e.message, issues: inferIssuesWithoutAI(meta), resolved: false, raw: { error: e.message } };
  }
}

function inferIssuesWithoutAI(meta) {
  const issues = [];
  if (/create next app/i.test(meta.pageTitle || '')) issues.push({ type: 'title', severity: 'high', reason: 'Default title detected', suggestions: ['Set a brand title'], fixHints: ['Update metadata.title in src/app/layout.tsx'] });
  if (meta.mobileFontLikelySmall) issues.push({ type: 'typography', severity: 'medium', reason: 'Mobile font sizes likely too small', suggestions: ['Increase base mobile font-size to at least 16px'], fixHints: ['Adjust @media (max-width: 640px) rules in src/app/globals.css'] });
  return issues;
}

async function computeMeta(page) {
  const pageTitle = await page.title();
  const h1 = await page.evaluate(() => {
    const el = document.querySelector('h1');
    return el ? el.textContent?.trim() || '' : '';
  });
  const mobileFontLikelySmall = await page.evaluate(() => {
    const el = document.body; const cs = window.getComputedStyle(el); const fs = parseFloat(cs.fontSize || '16'); return fs < 16;
  });
  return { pageTitle, h1, mobileFontLikelySmall };
}

function log(msg) { console.log(msg); }

function readFileSafe(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null; }
function writeFileEnsured(p, c) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, 'utf8'); }

function updateNextTitle(desiredTitle) {
  const file = path.join(root, 'src', 'app', 'layout.tsx');
  let content = readFileSafe(file);
  if (!content) return false;
  let changed = false;
  const re = /(export\s+const\s+metadata\s*:\s*Metadata\s*=\s*\{[\s\S]*?title\s*:\s*")[^"]*("[\s\S]*?\})/m;
  if (re.test(content)) {
    content = content.replace(re, (m, a, b) => { changed = true; return `${a}${desiredTitle}${b}`; });
  } else {
    const re2 = /<html[^>]*>([\s\S]*?)<\/html>/m;
    if (re2.test(content)) {
      content = content.replace(/<html([^>]*)>/, `<html$1><head><title>${desiredTitle}</title></head>`);
      changed = true;
    }
  }
  if (changed) writeFileEnsured(file, content);
  return changed;
}

function increaseMobileFontSizes() {
  const file = path.join(root, 'src', 'app', 'globals.css');
  let content = readFileSafe(file);
  if (!content) return false;
  let changed = false;
  const pairs = [
    { re: /(font-size:\s*max\()\s*14px\s*(,\s*1rem\s*\)\s*!important\s*;)/g, rep: '$116px$2' },
    { re: /(\.text-xs\s*\{[^}]*font-size:\s*max\()\s*14px\s*(,\s*0\.75rem\s*\)\s*!important\s*;)/g, rep: '$116px$2' },
    { re: /(\.text-sm\s*\{[^}]*font-size:\s*max\()\s*14px\s*(,\s*0\.875rem\s*\)\s*!important\s*;)/g, rep: '$116px$2' }
  ];
  pairs.forEach(({ re, rep }) => { if (re.test(content)) { content = content.replace(re, rep); changed = true; } });
  if (!/overflow-x:\s*hidden/.test(content)) {
    content = content.replace(/body\s*\{([\s\S]*?)\}/, (m, inner) => `body{${inner} overflow-x: hidden;}`);
    changed = true;
  }
  if (!/@media\s*\(max-width:\s*640px\)/.test(content)) {
    content += `\n@media (max-width: 640px){ html{ font-size:16px } body{ font-size:16px } }\n`;
    changed = true;
  }
  if (changed) writeFileEnsured(file, content);
  return changed;
}

function ensureViewportMeta() {
  const file = path.join(root, 'src', 'app', 'layout.tsx');
  let content = readFileSafe(file);
  if (!content) return false;
  if (/export\s+const\s+viewport\s*:?/m.test(content)) return false;
  const inject = `\nexport const viewport = { width: 'device-width', initialScale: 1 };\n`;
  content = content.replace(/export\s+const\s+metadata[\s\S]*?\};/, m => m + inject);
  writeFileEnsured(file, content);
  return true;
}

function applyFixes(meta, ai) {
  const msgs = [];
  let changedAny = false;
  const desiredTitle = /create next app/i.test(meta.pageTitle || '') ? (meta.h1 ? `${meta.h1} — Creative Technologist` : 'Website — Creative Portfolio') : meta.pageTitle;
  const aiMentionsTitle = JSON.stringify(ai.issues || []).toLowerCase().includes('title') || /create next app/i.test(JSON.stringify(ai));
  if (aiMentionsTitle) {
    if (updateNextTitle(desiredTitle)) { msgs.push(`Updated src/app/layout.tsx title to "${desiredTitle}"`); changedAny = true; }
  }
  const aiMentionsSmallText = JSON.stringify(ai.issues || []).toLowerCase().includes('small') || meta.mobileFontLikelySmall;
  if (aiMentionsSmallText) {
    if (increaseMobileFontSizes()) { msgs.push('Increased mobile font sizes and prevented horizontal overflow'); changedAny = true; }
    if (ensureViewportMeta()) { msgs.push('Added viewport metadata'); changedAny = true; }
  }
  if (!changedAny && ai.issues && ai.issues.length) {
    if (increaseMobileFontSizes()) { msgs.push('Adjusted global styles for readability'); changedAny = true; }
  }
  return { changedAny, msgs };
}

async function main() {
  log('> Starting dev server (or using SITE_URL)...');
  const server = startDevServerIfNeeded();
  await waitForServer(DEFAULT_URL);
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(DEFAULT_URL, { waitUntil: 'networkidle2', timeout: 60000 });

  let attempt = 0; let totalFixes = 0; let lastIssues = [];
  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    log('> Taking screenshot...');
    const meta = await computeMeta(page);
    const shots = await takeScreenshots(page, `attempt${attempt}`);
    const analysisPath = path.join(outDir, `analysis-${Date.now()}.json`);
    log('> Analyzing with AI...');
    const ai = await analyzeWithVision({ desktopPath: shots.desktop, tabletPath: shots.tablet, mobilePath: shots.mobile, meta });
    fs.writeFileSync(analysisPath, JSON.stringify(ai, null, 2), 'utf8');
    const brief = ai.summary || 'No summary';
    log(`> AI Analysis: ${brief}`);

    if (ai.resolved === true || (Array.isArray(ai.issues) && ai.issues.length === 0)) {
      log('> Looks good! All issues resolved.');
      break;
    }

    const { changedAny, msgs } = applyFixes(meta, ai);
    if (!changedAny) {
      if (attempt === 1 && (/create next app/i.test(meta.pageTitle) || (ai.issues || []).length)) {
        const did = updateNextTitle(meta.h1 ? `${meta.h1} — Creative Technologist` : 'My Portfolio');
        if (did) { msgs.push('Updated title'); }
      }
    }
    if (msgs.length) log('> Fixing: ' + msgs.join('; '));
    totalFixes += msgs.length;

    if (!msgs.length) {
      log('> No actionable fixes detected. Stopping.');
      break;
    }

    await sleep(1500);
    await page.reload({ waitUntil: 'networkidle2' });
    log('> Verifying: Taking new screenshot...');
    const shotsAfter = await takeScreenshots(page, `attempt${attempt}-after`);
    const aiAfter = await analyzeWithVision({ desktopPath: shotsAfter.desktop, tabletPath: shotsAfter.tablet, mobilePath: shotsAfter.mobile, meta: await computeMeta(page) });
    fs.writeFileSync(path.join(outDir, `analysis-${Date.now()}-after.json`), JSON.stringify(aiAfter, null, 2), 'utf8');
    if (aiAfter.resolved === true || (Array.isArray(aiAfter.issues) && aiAfter.issues.length === 0)) {
      log('> AI Analysis: Looks good! All issues resolved.');
      break;
    } else {
      lastIssues = aiAfter.issues || [];
      log('> AI Analysis: More improvements possible. Retrying...');
    }
  }

  await browser.close();
  await server.stop();
  log(`> Done. Fixed ${totalFixes} issue${totalFixes === 1 ? '' : 's'} in ${Math.max(0, attempt - 1)} retr${attempt - 1 === 1 ? 'y' : 'ies'}.`);
}

main().catch(async e => { console.error('❌ Error:', e.message); process.exitCode = 1; });
