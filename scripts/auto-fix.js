const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
let OpenAI;
try { OpenAI = require('openai'); } catch (_) { OpenAI = null; }

const ROOT = path.resolve(__dirname, '..');
const SCREEN_DIR = path.join(ROOT, 'screenshots');
const NEXT_LAYOUT = path.join(ROOT, 'src', 'app', 'layout.tsx');
const NEXT_GLOBALS = path.join(ROOT, 'src', 'app', 'globals.css');
const STATIC_INDEX = path.join(ROOT, 'index.html');
const STATIC_CSS = path.join(ROOT, 'css', 'styles.css');

if (!fs.existsSync(SCREEN_DIR)) fs.mkdirSync(SCREEN_DIR, { recursive: true });

function now() { return new Date().toISOString(); }
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
  return 'about:blank';
}

async function takeScreenshots(url, attempt) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const result = {};
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await new Promise(r => setTimeout(r, 2000));
    const viewports = [
      { name: 'desktop', width: 1440, height: 900 },
      { name: 'mobile', width: 375, height: 720 }
    ];
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
      await new Promise(r => setTimeout(r, 800));
      const file = path.join(SCREEN_DIR, `auto-${vp.name}-attempt-${attempt}-${Date.now()}.png`);
      await page.screenshot({ path: file, fullPage: true });
      const buf = fs.readFileSync(file);
      result[vp.name] = { file, base64: buf.toString('base64') };
    }
  } finally {
    await browser.close();
  }
  return result;
}

function fileInventory() {
  const files = [];
  if (exists(NEXT_LAYOUT)) files.push('src/app/layout.tsx');
  if (exists(NEXT_GLOBALS)) files.push('src/app/globals.css');
  if (exists(path.join(ROOT, 'src', 'app', 'page.tsx'))) files.push('src/app/page.tsx');
  if (exists(STATIC_INDEX)) files.push('index.html');
  if (exists(STATIC_CSS)) files.push('css/styles.css');
  if (exists(path.join(ROOT, 'js', 'main.js'))) files.push('js/main.js');
  return files;
}

function extractJson(s) {
  if (!s) return null;
  try { return JSON.parse(s); } catch {}
  const match = s.match(/```(?:json)?\n([\s\S]*?)\n```/);
  if (match) {
    try { return JSON.parse(match[1]); } catch {}
  }
  const brace = s.indexOf('{'); const last = s.lastIndexOf('}');
  if (brace !== -1 && last !== -1 && last > brace) {
    try { return JSON.parse(s.slice(brace, last + 1)); } catch {}
  }
  return null;
}

async function aiAnalyze(images, previousSummary) {
  if (!OpenAI || !process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not set or openai package missing');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const schema = {
    summary: 'string',
    looks_good: 'boolean',
    issues: [{ id: 'string', severity: 'low|medium|high|critical', description: 'string' }],
    edits: [{ operation: 'update_title|replace|insert_after|insert_before|append_css', file: 'string?', search: 'string?', replace_with: 'string?', anchor: 'string?', title: 'string?', description: 'string?' }]
  };
  const inv = fileInventory();
  const content = [];
  content.push({ type: 'text', text: 'You are an expert frontend QA and code fixer. Analyze the screenshots and return STRICT JSON with keys: summary, looks_good, issues, edits. Only propose concrete edits to the files in this repository.' });
  for (const key of Object.keys(images)) {
    content.push({ type: 'text', text: `Screenshot: ${key}` });
    content.push({ type: 'image_url', image_url: { url: `data:image/png;base64,${images[key].base64}` } });
  }
  content.push({ type: 'text', text: `Project files: ${inv.join(', ')}` });
  content.push({ type: 'text', text: 'Guidelines: If the title shows a default like "Create Next App", add an edit to update src/app/layout.tsx metadata.title to a branded title. If mobile text is small, add an edit to increase mobile font sizes in src/app/globals.css to at least 16px. If static index.html exists, mirror title and viewport updates there too. Keep edits minimal and safe.' });
  if (previousSummary) content.push({ type: 'text', text: `Previous attempt summary: ${previousSummary}. Prefer different edits if previous ones did not fully resolve.` });
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'Return only JSON. Do not include explanations. Be precise and propose 1-3 minimal edits.' },
      { role: 'user', content }
    ]
  });
  const text = res.choices?.[0]?.message?.content || '';
  const parsed = extractJson(text);
  if (!parsed) throw new Error('AI did not return valid JSON');
  if (!Array.isArray(parsed.issues)) parsed.issues = [];
  if (!Array.isArray(parsed.edits)) parsed.edits = [];
  parsed.looks_good = Boolean(parsed.looks_good);
  return parsed;
}

function applyGenericReplace(file, search, replaceWith) {
  const abs = path.join(ROOT, file);
  let content = readFileSafe(abs);
  if (content == null) return { file, changed: false, reason: 'file_not_found' };
  const idx = content.indexOf(search);
  if (idx === -1) return { file, changed: false, reason: 'target_not_found' };
  const updated = content.replace(search, replaceWith);
  if (updated === content) return { file, changed: false, reason: 'no_change' };
  writeFileSafe(abs, updated);
  return { file, changed: true };
}

function insertRelative(file, anchor, insert, before) {
  const abs = path.join(ROOT, file);
  let content = readFileSafe(abs);
  if (content == null) return { file, changed: false, reason: 'file_not_found' };
  const idx = content.indexOf(anchor);
  if (idx === -1) return { file, changed: false, reason: 'anchor_not_found' };
  const pos = before ? idx : idx + anchor.length;
  const updated = content.slice(0, pos) + insert + content.slice(pos);
  writeFileSafe(abs, updated);
  return { file, changed: true };
}

function appendCss(file, css) {
  const abs = path.join(ROOT, file);
  const prev = readFileSafe(abs) ?? '';
  const updated = prev.endsWith('\n') ? prev + css + '\n' : prev + '\n' + css + '\n';
  writeFileSafe(abs, updated);
  return { file, changed: true };
}

function updateNextTitle(title, description) {
  if (!exists(NEXT_LAYOUT)) return { changed: false, reason: 'layout_missing' };
  let src = readFileSafe(NEXT_LAYOUT);
  const titleRe = /(title\s*:\s*["'`]).*?(["'`])/s;
  const descRe = /(description\s*:\s*["'`]).*?(["'`])/s;
  let changed = false;
  if (title) {
    if (titleRe.test(src)) { src = src.replace(titleRe, `$1${title}$2`); changed = true; }
  }
  if (description) {
    if (descRe.test(src)) { src = src.replace(descRe, `$1${description}$2`); changed = true; }
  }
  if (changed) writeFileSafe(NEXT_LAYOUT, src);
  return { changed };
}

function updateIndexHtmlTitle(title) {
  if (!exists(STATIC_INDEX)) return { changed: false, reason: 'index_missing' };
  let html = readFileSafe(STATIC_INDEX);
  const hasTitle = /<title>[\s\S]*?<\/title>/i.test(html);
  if (hasTitle) html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
  else html = html.replace(/<head>/i, `<head>\n<title>${title}</title>`);
  if (!/name="viewport"/i.test(html)) html = html.replace(/<head>/i, `<head>\n<meta name="viewport" content="width=device-width, initial-scale=1">`);
  writeFileSafe(STATIC_INDEX, html);
  return { changed: true };
}

function bumpMobileFontSize(px) {
  let total = 0;
  if (exists(NEXT_GLOBALS)) {
    let css = readFileSafe(NEXT_GLOBALS);
    css = css.replace(/max\(\s*14px\s*,\s*1rem\s*\)/g, `max(${px}px, 1rem)`);
    css = css.replace(/text-xs\s*\{[^}]*font-size:\s*max\(\s*14px[^}]*\}/g, (m)=>m.replace(/14px/g, String(px)));
    css = css.replace(/text-sm\s*\{[^}]*font-size:\s*max\(\s*14px[^}]*\}/g, (m)=>m.replace(/14px/g, String(px)));
    writeFileSafe(NEXT_GLOBALS, css); total++; }
  if (exists(STATIC_CSS)) {
    const add = `@media (max-width: 640px){ body, p, span, div { font-size: ${px}px !important; } }`;
    appendCss('css/styles.css', add); total++; }
  return { changed: total > 0 };
}

async function run() {
  console.log('> Starting auto-fix');
  const url = await resolveTargetUrl();
  if (url === 'about:blank') throw new Error('No target to analyze. Start a dev server or add index.html.');
  let attempt = 1;
  let totalIssuesFixed = 0;
  let appliedEditsTotal = 0;
  let prevSummary = '';
  while (attempt <= 3) {
    console.log('> Taking screenshot...');
    const shots = await takeScreenshots(url, attempt);
    console.log('> Analyzing with AI...');
    const analysis = await aiAnalyze(shots, prevSummary);
    const reportPath = path.join(SCREEN_DIR, `auto-fix-analysis-attempt-${attempt}-${Date.now()}.json`);
    writeFileSafe(reportPath, JSON.stringify(analysis, null, 2));
    console.log(`> AI Analysis: ${analysis.summary}`);
    if (analysis.looks_good || analysis.issues.length === 0) {
      console.log('> Looks good. No fixes required.');
      break;
    }
    let appliedEdits = 0;
    const appliedLogs = [];
    for (const e of analysis.edits) {
      if (!e || typeof e !== 'object') continue;
      if (e.operation === 'update_title' && e.title) {
        const n1 = updateNextTitle(e.title, e.description).changed;
        const n2 = updateIndexHtmlTitle(e.title).changed;
        if (n1 || n2) { appliedEdits++; appliedLogs.push(`Updated titles${n1? ' (Next)': ''}${n2? ' (HTML)': ''}`); }
        continue;
      }
      if (e.operation === 'replace' && e.file && e.search != null && e.replace_with != null) {
        const out = applyGenericReplace(e.file, e.search, e.replace_with);
        if (out.changed) { appliedEdits++; appliedLogs.push(`Replaced in ${e.file}`); }
        continue;
      }
      if (e.operation === 'insert_after' && e.file && e.anchor && e.replace_with != null) {
        const out = insertRelative(e.file, e.anchor, e.replace_with, false);
        if (out.changed) { appliedEdits++; appliedLogs.push(`Inserted after in ${e.file}`); }
        continue;
      }
      if (e.operation === 'insert_before' && e.file && e.anchor && e.replace_with != null) {
        const out = insertRelative(e.file, e.anchor, e.replace_with, true);
        if (out.changed) { appliedEdits++; appliedLogs.push(`Inserted before in ${e.file}`); }
        continue;
      }
      if (e.operation === 'append_css' && e.file && e.replace_with) {
        const out = appendCss(e.file, e.replace_with);
        if (out.changed) { appliedEdits++; appliedLogs.push(`Appended CSS in ${e.file}`); }
        continue;
      }
    }
    if (analysis.issues.some(i => /title/i.test(i.description || ''))) {
      const curTitle = 'Jeffrey Kerr — Creative Technologist';
      if (updateNextTitle(curTitle, 'Creative Technologist Portfolio').changed) { appliedEdits++; appliedLogs.push('Updated Next.js metadata'); }
      if (updateIndexHtmlTitle(curTitle).changed) { appliedEdits++; appliedLogs.push('Updated index.html title'); }
    }
    if (analysis.issues.some(i => /small|mobile|font/i.test((i.description||'') + ' ' + (i.id||'')))) {
      if (bumpMobileFontSize(16).changed) { appliedEdits++; appliedLogs.push('Increased mobile font sizes'); }
    }
    if (appliedEdits === 0) {
      console.log('> No actionable edits produced. Stopping.');
      break;
    }
    appliedEditsTotal += appliedEdits;
    totalIssuesFixed += Math.max(1, Math.min(analysis.issues.length, appliedEdits));
    console.log('> Fixing: ' + appliedLogs.join('; '));
    console.log('> Verifying: Taking new screenshot...');
    const verifyShots = await takeScreenshots(url, attempt + 1000);
    const verify = await aiAnalyze(verifyShots, analysis.summary);
    writeFileSafe(path.join(SCREEN_DIR, `auto-fix-verify-attempt-${attempt}-${Date.now()}.json`), JSON.stringify(verify, null, 2));
    console.log(`> AI Analysis: ${verify.summary}`);
    if (verify.looks_good || verify.issues.length === 0) {
      console.log(`> Done. Fixed ${totalIssuesFixed} issues in ${attempt} ${attempt === 1 ? 'retry' : 'retries'}.`);
      return;
    }
    prevSummary = verify.summary || analysis.summary || '';
    attempt++;
  }
  console.log(`> Finished. Applied ${appliedEditsTotal} edits across ${attempt-1} attempt(s).`);
}

if (require.main === module) {
  run().catch(err => { console.error('> Error:', err.message); process.exit(1); });
}
