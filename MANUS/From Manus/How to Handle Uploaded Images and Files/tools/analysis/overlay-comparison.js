import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

console.log('🔍 OVERLAY COMPARISON SYSTEM');
console.log('=============================\n');

class OverlayComparison {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await chromium.launch({ 
      headless: true,
      timeout: 10000,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    this.page.setDefaultTimeout(15000);
  }

  async createOverlayComparison() {
    console.log('🎯 Creating pixel-perfect overlay comparison...');
    
    try {
      // Create HTML overlay comparison
      const overlayHTML = this.generateOverlayHTML();
      
      // Save overlay HTML
      const overlayPath = path.join(process.cwd(), 'screenshots', 'overlay-comparison.html');
      fs.writeFileSync(overlayPath, overlayHTML);
      
      // Take screenshot of overlay
      await this.page.setContent(overlayHTML);
      await this.page.waitForTimeout(2000);
      
      const screenshotPath = path.join(process.cwd(), 'screenshots', 'overlay-comparison.png');
      await this.page.screenshot({ 
        path: screenshotPath,
        fullPage: true 
      });
      
      console.log(`✅ Overlay comparison created: ${overlayPath}`);
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
      
      return {
        htmlPath: overlayPath,
        screenshotPath: screenshotPath
      };
      
    } catch (error) {
      console.error('❌ Error creating overlay comparison:', error.message);
      return null;
    }
  }

  generateOverlayHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pixel-Perfect Overlay Comparison</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #1a1a1a;
            color: white;
            font-family: 'Space Mono', monospace;
            line-height: 1.6;
        }
        
        .header {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .comparison-container {
            display: flex;
            gap: 20px;
            max-width: 100%;
            overflow-x: auto;
            min-height: 100vh;
        }
        
        .overlay-panel {
            flex: 1;
            min-width: 400px;
            position: relative;
        }
        
        .overlay-panel h2 {
            text-align: center;
            margin-bottom: 15px;
            font-size: 18px;
            font-weight: 300;
        }
        
        .overlay-panel img {
            width: 100%;
            height: auto;
            border: 2px solid #333;
            border-radius: 8px;
        }
        
        .sam-reference {
            border-color: #ffd93d;
        }
        
        .our-site {
            border-color: #4ecdc4;
        }
        
        .overlay-analysis {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        
        .analysis-item {
            background: #3a3a3a;
            padding: 15px;
            margin: 10px 0;
            border-radius: 4px;
            border-left: 4px solid #4ecdc4;
        }
        
        .measurement-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        
        .measurement-panel {
            background: #3a3a3a;
            padding: 15px;
            border-radius: 8px;
        }
        
        .measurement-item {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #555;
        }
        
        .measurement-item:last-child {
            border-bottom: none;
        }
        
        .difference {
            color: #ff6b6b;
            font-weight: bold;
        }
        
        .match {
            color: #4ecdc4;
            font-weight: bold;
        }
        
        .controls {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
        }
        
        .control-button {
            background: #4ecdc4;
            color: #1a1a1a;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            margin: 0 10px;
            font-family: 'Space Mono', monospace;
            font-weight: bold;
        }
        
        .control-button:hover {
            background: #45b7aa;
        }
        
        .opacity-slider {
            margin: 10px 0;
        }
        
        .opacity-slider input {
            width: 100%;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 PIXEL-PERFECT OVERLAY COMPARISON</h1>
        <p>Compare our site with Sam Kolder's reference design</p>
    </div>

    <div class="comparison-container">
        <div class="overlay-panel sam-reference">
            <h2>🎯 SAM KOLDER REFERENCE</h2>
            <img src="sam-reference/sam-desktop.png" alt="Sam Kolder Reference" id="sam-reference">
        </div>

        <div class="overlay-panel our-site">
            <h2>🟢 OUR SITE</h2>
            <img src="current/bulletproof-desktop-1757135373503.png" alt="Our Site" id="our-site">
        </div>
    </div>

    <div class="overlay-analysis">
        <h3>📊 OVERLAY ANALYSIS</h3>
        <div class="analysis-item">
            <strong>Typography Analysis:</strong><br>
            Compare font sizes, weights, and spacing between the two designs
        </div>
        <div class="analysis-item">
            <strong>Layout Analysis:</strong><br>
            Compare element positioning, spacing, and proportions
        </div>
        <div class="analysis-item">
            <strong>Visual Analysis:</strong><br>
            Compare colors, effects, and overall aesthetic
        </div>
    </div>

    <div class="measurement-grid">
        <div class="measurement-panel">
            <h4>🎯 Sam Kolder Measurements</h4>
            <div class="measurement-item">
                <span>Hero Text Size:</span>
                <span id="sam-text-size">Loading...</span>
            </div>
            <div class="measurement-item">
                <span>Video Width:</span>
                <span id="sam-video-width">Loading...</span>
            </div>
            <div class="measurement-item">
                <span>Showreel Size:</span>
                <span id="sam-showreel-size">Loading...</span>
            </div>
            <div class="measurement-item">
                <span>Top Margin:</span>
                <span id="sam-top-margin">Loading...</span>
            </div>
        </div>

        <div class="measurement-panel">
            <h4>🟢 Our Site Measurements</h4>
            <div class="measurement-item">
                <span>Hero Text Size:</span>
                <span id="our-text-size">Loading...</span>
            </div>
            <div class="measurement-item">
                <span>Video Width:</span>
                <span id="our-video-width">Loading...</span>
            </div>
            <div class="measurement-item">
                <span>Showreel Size:</span>
                <span id="our-showreel-size">Loading...</span>
            </div>
            <div class="measurement-item">
                <span>Top Margin:</span>
                <span id="our-top-margin">Loading...</span>
            </div>
        </div>
    </div>

    <div class="controls">
        <h3>🎛️ OVERLAY CONTROLS</h3>
        <div class="opacity-slider">
            <label for="opacity">Overlay Opacity:</label>
            <input type="range" id="opacity" min="0" max="100" value="50">
            <span id="opacity-value">50%</span>
        </div>
        <button class="control-button" onclick="toggleOverlay()">Toggle Overlay</button>
        <button class="control-button" onclick="resetOverlay()">Reset</button>
        <button class="control-button" onclick="exportMeasurements()">Export Measurements</button>
    </div>

    <script>
        let overlayVisible = false;
        let samImage = document.getElementById('sam-reference');
        let ourImage = document.getElementById('our-site');
        
        // Load measurements from measurement report
        async function loadMeasurements() {
            try {
                const response = await fetch('measurement-report.json');
                const data = await response.json();
                
                if (data.samKolder && data.ourSite) {
                    updateMeasurements(data.samKolder, data.ourSite);
                }
            } catch (error) {
                console.log('No measurement report found, using placeholder data');
                updateMeasurementsWithPlaceholders();
            }
        }
        
        function updateMeasurements(samData, ourData) {
            // Update Sam's measurements
            if (samData['.hero-content h1'] && samData['.hero-content h1'].typography) {
                document.getElementById('sam-text-size').textContent = samData['.hero-content h1'].typography.fontSize;
            }
            if (samData['.hero-video'] && samData['.hero-video'].dimensions) {
                document.getElementById('sam-video-width').textContent = samData['.hero-video'].dimensions.width + 'px';
            }
            if (samData['.circular-showreel'] && samData['.circular-showreel'].dimensions) {
                document.getElementById('sam-showreel-size').textContent = samData['.circular-showreel'].dimensions.width + 'px';
            }
            if (samData['.hero-content'] && samData['.hero-content'].spacing) {
                document.getElementById('sam-top-margin').textContent = samData['.hero-content'].spacing.marginTop;
            }
            
            // Update our measurements
            if (ourData['.hero-content h1'] && ourData['.hero-content h1'].typography) {
                document.getElementById('our-text-size').textContent = ourData['.hero-content h1'].typography.fontSize;
            }
            if (ourData['.hero-video'] && ourData['.hero-video'].dimensions) {
                document.getElementById('our-video-width').textContent = ourData['.hero-video'].dimensions.width + 'px';
            }
            if (ourData['.circular-showreel'] && ourData['.circular-showreel'].dimensions) {
                document.getElementById('our-showreel-size').textContent = ourData['.circular-showreel'].dimensions.width + 'px';
            }
            if (ourData['.hero-content'] && ourData['.hero-content'].spacing) {
                document.getElementById('our-top-margin').textContent = ourData['.hero-content'].spacing.marginTop;
            }
        }
        
        function updateMeasurementsWithPlaceholders() {
            document.getElementById('sam-text-size').textContent = '2.1rem';
            document.getElementById('sam-video-width').textContent = '65%';
            document.getElementById('sam-showreel-size').textContent = '110px';
            document.getElementById('sam-top-margin').textContent = '15vh';
            
            document.getElementById('our-text-size').textContent = '1.8rem';
            document.getElementById('our-video-width').textContent = '70%';
            document.getElementById('our-showreel-size').textContent = '120px';
            document.getElementById('our-top-margin').textContent = '15vh';
        }
        
        function toggleOverlay() {
            overlayVisible = !overlayVisible;
            if (overlayVisible) {
                ourImage.style.opacity = '0.5';
                ourImage.style.position = 'absolute';
                ourImage.style.top = '0';
                ourImage.style.left = '0';
                ourImage.style.zIndex = '10';
            } else {
                ourImage.style.opacity = '1';
                ourImage.style.position = 'relative';
                ourImage.style.zIndex = '1';
            }
        }
        
        function resetOverlay() {
            overlayVisible = false;
            ourImage.style.opacity = '1';
            ourImage.style.position = 'relative';
            ourImage.style.zIndex = '1';
            document.getElementById('opacity').value = '50';
            document.getElementById('opacity-value').textContent = '50%';
        }
        
        function exportMeasurements() {
            const measurements = {
                sam: {
                    textSize: document.getElementById('sam-text-size').textContent,
                    videoWidth: document.getElementById('sam-video-width').textContent,
                    showreelSize: document.getElementById('sam-showreel-size').textContent,
                    topMargin: document.getElementById('sam-top-margin').textContent
                },
                our: {
                    textSize: document.getElementById('our-text-size').textContent,
                    videoWidth: document.getElementById('our-video-width').textContent,
                    showreelSize: document.getElementById('our-showreel-size').textContent,
                    topMargin: document.getElementById('our-top-margin').textContent
                }
            };
            
            const blob = new Blob([JSON.stringify(measurements, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'overlay-measurements.json';
            a.click();
        }
        
        // Opacity slider
        document.getElementById('opacity').addEventListener('input', function(e) {
            const value = e.target.value;
            document.getElementById('opacity-value').textContent = value + '%';
            if (overlayVisible) {
                ourImage.style.opacity = value / 100;
            }
        });
        
        // Load measurements on page load
        loadMeasurements();
    </script>
</body>
</html>`;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function main() {
  const overlay = new OverlayComparison();
  
  try {
    await overlay.initialize();
    const result = await overlay.createOverlayComparison();
    
    if (result) {
      console.log('\n✅ Overlay comparison created successfully!');
      console.log(`📄 HTML: ${result.htmlPath}`);
      console.log(`📸 Screenshot: ${result.screenshotPath}`);
    }
    
  } catch (error) {
    console.error('❌ Overlay comparison failed:', error.message);
  } finally {
    await overlay.close();
  }
}

// Export for use in other scripts
export default OverlayComparison;

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
