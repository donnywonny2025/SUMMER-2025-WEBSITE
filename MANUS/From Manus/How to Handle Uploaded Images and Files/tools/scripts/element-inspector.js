#!/usr/bin/env node
import { chromium } from 'playwright';
import fs from 'fs';

console.log('🎯 INTERACTIVE CHROMIUM ELEMENT INSPECTOR');
console.log('===========================================\n');

async function createElementInspector() {
  console.log('🚀 Launching interactive Chromium...\n');

  const browser = await chromium.launch({
    headless: false,  // Non-headless for interactive use
    devtools: true,   // Enable dev tools
    args: [
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  try {
    console.log('🔍 Finding your dev server...');

    // Check common ports
    const ports = [3000, 3001, 3002, 5173, 8080];
    let workingUrl = null;

    for (const port of ports) {
      try {
        console.log(`   Testing port ${port}...`);
        const response = await page.goto(`http://localhost:${port}`, {
          waitUntil: 'networkidle',
          timeout: 5000
        });

        if (response) {
          workingUrl = `http://localhost:${port}`;
          console.log(`   ✅ Found working server on port ${port}`);
          break;
        }
      } catch (error) {
        console.log(`   ❌ Port ${port} - not responding`);
      }
    }

    if (!workingUrl) {
      console.log('\n❌ No dev server found!');
      console.log('   Please start your dev server first: npm run dev');
      await browser.close();
      process.exit(1);
    }

    console.log(`\n🌐 Opening: ${workingUrl}`);

    // Wait for page to load completely
    await page.waitForLoadState('networkidle');

    // Inject overlay and functionality
    await page.addStyleTag({ content: `
      #element-inspector-overlay {
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important;
        background: rgba(0, 0, 0, 0.95) !important;
        color: white !important;
        padding: 15px !important;
        border-radius: 8px !important;
        font-family: monospace !important;
        font-size: 12px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
        border: 2px solid #333 !important;
        pointer-events: auto !important;
      }

      #element-inspector-overlay * {
        pointer-events: auto !important;
      }

      #element-inspector-overlay:hover { background: rgba(0, 0, 0, 1) !important; }

      .inspector-highlight {
        outline: 3px solid #ff6b35 !important;
        outline-offset: 2px !important;
        background: rgba(255, 107, 53, 0.2) !important;
        box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.5) !important;
      }

      .inspector-hover {
        outline: 2px solid #4CAF50 !important;
        outline-offset: 2px !important;
        background: rgba(76, 175, 80, 0.1) !important;
        box-shadow: 0 0 0 1px rgba(76, 175, 80, 0.3) !important;
      }

      body.select-mode { cursor: crosshair !important; }
      body.select-mode * { cursor: crosshair !important; }
    ` });

    await page.evaluate(() => {
      // Add overlay
      const overlay = document.createElement('div');
      overlay.id = 'element-inspector-overlay';
      overlay.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #4CAF50; font-weight: bold; font-size: 14px;">📋 Element Inspector</h3>
        <button id="select-mode-toggle" style="
          background: #2196F3;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">🔍 ENABLE SELECT MODE</button>
        <div id="selection-info" style="
          background: #333;
          padding: 10px;
          border-radius: 4px;
          display: none;
          max-height: 300px;
          overflow-y: auto;
          font-size: 11px;
          border: 1px solid #555;
        "></div>
        <div id="instructions" style="font-size: 11px; color: #ccc; margin-top: 10px; line-height: 1.4;">
          📝 Steps:<br>
          1. Click "ENABLE SELECT MODE"<br>
          2. Hover to preview elements<br>
          3. Click to capture element info
        </div>
        <div id="debug-info" style="
          font-size: 10px;
          color: #666;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #666;
        ">
          Status: Ready
        </div>
      `;

      document.body.appendChild(overlay);
      console.log('🎯 ELEMENT INSPECTOR: Overlay added to page');

      // Add debug info after a short delay
      setTimeout(() => {
        const debugEl = document.getElementById('debug-info');
        if (debugEl) {
          const rect = overlay.getBoundingClientRect();
          const toggleBtn = document.getElementById('select-mode-toggle');
          const working = toggleBtn ? 'WORKING' : 'ISSUES';
          debugEl.textContent = `Status: ${working} (${Math.round(rect.width)}x${Math.round(rect.height)})`;
          console.log('🎯 ELEMENT INSPECTOR DEBUG: Layout check -', { width: rect.width, height: rect.height, button: !!toggleBtn });
        } else {
          console.log('🎯 ELEMENT INSPECTOR ERROR: Debug element not found');
        }
      }, 200);

      let selectMode = false;

      // Toggle selection mode
      document.getElementById('select-mode-toggle').addEventListener('click', () => {
        selectMode = !selectMode;
        const button = document.getElementById('select-mode-toggle');
        const instructions = document.getElementById('instructions');

        if (selectMode) {
          button.textContent = '❌ EXIT SELECT MODE';
          button.style.background = '#f44336';
          instructions.textContent = 'Click any element on the page to capture it';
          document.body.style.cursor = 'crosshair';
        } else {
          button.textContent = '🔍 ENABLE SELECT MODE';
          button.style.background = '#2196F3';
          instructions.textContent = 'Click SELECT MODE, then click any element you want to inspect';
          document.body.style.cursor = '';
          document.querySelectorAll('.inspector-highlight, .inspector-hover').forEach(el => {
            el.classList.remove('inspector-highlight', 'inspector-hover');
          });
        }
      });

      // Mouse movement hover effect
      document.addEventListener('mouseover', (e) => {
        if (!selectMode) return;

        // Remove previous hover effects
        document.querySelectorAll('.inspector-hover').forEach(el => {
          if (el !== e.target) el.classList.remove('inspector-hover');
        });

        e.target.classList.add('inspector-hover');
      });

      // Element selection
      document.addEventListener('click', (e) => {
        if (!selectMode) return;

        e.preventDefault();
        e.stopPropagation();

        const element = e.target;
        const info = document.getElementById('selection-info');

        // Remove previous highlights
        document.querySelectorAll('.inspector-highlight').forEach(el => {
          el.classList.remove('inspector-highlight');
        });

        element.classList.add('inspector-highlight');

        // Get element info
        const elementInfo = {
          tagName: element.tagName.toLowerCase(),
          className: element.className || '(no class)',
          id: element.id || '(no id)',
          text: element.textContent.trim().substring(0, 100),
          html: element.outerHTML.substring(0, 200),
          rect: element.getBoundingClientRect()
        };

        // Display info
        info.style.display = 'block';
        info.innerHTML = `
          <div style="color: #4CAF50; font-weight: bold;">Element Captured!</div>
          <div><strong>Tag:</strong> <${elementInfo.tagName}></div>
          <div><strong>Class:</strong> ${elementInfo.className}</div>
          <div><strong>ID:</strong> ${elementInfo.id}</div>
          <div><strong>Position:</strong> ${Math.round(elementInfo.rect.left)}x${Math.round(elementInfo.rect.top)}</div>
          <div><strong>Size:</strong> ${Math.round(elementInfo.rect.width)}x${Math.round(elementInfo.rect.height)}</div>
          <div><strong>Text:</strong> ${elementInfo.text}${elementInfo.text.length > 100 ? '...' : ''}</div>
          <div style="margin-top: 10px; color: #ccc; font-size: 10px;">
            Element info copied to console + clipboard
          </div>
        `;

        // Copy to console and clipboard
        const copyData = {
          tag: elementInfo.tagName,
          class: elementInfo.className,
          id: elementInfo.id,
          html: elementInfo.html,
          selector: elementInfo.id ? '#' + elementInfo.id : '.' + elementInfo.className.split(' ').join('.'),
          xpath: getXPath(element)
        };

        console.log('🎯 ELEMENT SELECTED:', copyData);

        if (navigator.clipboard) {
          navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
        }

        // Exit select mode after selection
        selectMode = false;
        document.getElementById('select-mode-toggle').click();
      });

      // Helper function to generate XPath
      function getXPath(element) {
        if (element.id) {
          return `//*[@id="${element.id}"]`;
        }

        const path = [];
        while (element.nodeType === Node.ELEMENT_NODE) {
          let selector = element.nodeName.toLowerCase();
          if (element.id) {
            selector += `#${element.id}`;
            path.unshift(selector);
            break;
          } else {
            let sibling = element.previousSibling;
            let index = 1;
            while (sibling) {
              if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === element.nodeName) {
                index++;
              }
              sibling = sibling.previousSibling;
            }

            selector += `:nth-child(${index})`;
          }
          path.unshift(selector);
          element = element.parentNode;
        }
        return path.length ? `/${path.join('/')}` : '';
      }
    });

    console.log('\n🎉 Interactive Inspector Ready!');
    console.log('  1. Use the blue overlay in the top-right corner');
    console.log('  2. Click "ENABLE SELECT MODE"');
    console.log('  3. Hover over elements to preview');
    console.log('  4. Click an element to capture its info');
    console.log('  5. Check console and clipboard for details\n');

    console.log('💡 The element information will be:');
    console.log('   - Copy to clipboard as JSON');
    console.log('   - Logged to browser console');
    console.log('   - Displayed in the overlay\n');

    // Keep the browser open until manually closed
    page.on('close', () => {
      console.log('\n🛑 Browser closed - inspector session ended');
      process.exit(0);
    });

    // Prevent the script from ending
    return new Promise(resolve => {
      setInterval(() => {
        // Keep alive
      }, 1000);
    });

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    await browser.close();
    process.exit(1);
  }
}

// Run the inspector
createElementInspector().catch(error => {
  console.error(`❌ Failed to start inspector: ${error.message}`);
  process.exit(1);
});