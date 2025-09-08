const fs = require('fs-extra');
const path = require('path');

async function generateGallery() {
  console.log('🎨 Generating visual regression gallery...');
  
  const resultsPath = path.join('shots', 'comparison-results.json');
  const galleryPath = path.join('shots', 'gallery', 'index.html');
  
  if (!await fs.pathExists(resultsPath)) {
    console.log('❌ No comparison results found. Run comparison first.');
    return;
  }
  
  const results = await fs.readJson(resultsPath);
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visual Regression Test Results</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        .header {
            background: #fff;
            padding: 2rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .header h1 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }
        
        .stats {
            display: flex;
            gap: 2rem;
            margin-top: 1rem;
        }
        
        .stat {
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            min-width: 120px;
        }
        
        .stat.total { background: #e3f2fd; color: #1976d2; }
        .stat.passed { background: #e8f5e8; color: #2e7d32; }
        .stat.failed { background: #ffebee; color: #c62828; }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            display: block;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }
        
        .test-item {
            background: #fff;
            margin-bottom: 2rem;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .test-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .test-name {
            font-size: 1.2rem;
            font-weight: 600;
        }
        
        .test-status {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .status-passed {
            background: #e8f5e8;
            color: #2e7d32;
        }
        
        .status-failed {
            background: #ffebee;
            color: #c62828;
        }
        
        .status-missing {
            background: #fff3e0;
            color: #f57c00;
        }
        
        .status-error {
            background: #fce4ec;
            color: #ad1457;
        }
        
        .test-content {
            padding: 1.5rem;
        }
        
        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .image-container {
            text-align: center;
        }
        
        .image-container h4 {
            margin-bottom: 0.5rem;
            color: #666;
        }
        
        .image-container img {
            max-width: 100%;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .diff-info {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 4px;
            margin-top: 1rem;
        }
        
        .no-diffs {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 2rem;
        }
        
        .footer {
            text-align: center;
            padding: 2rem;
            color: #666;
            border-top: 1px solid #eee;
            margin-top: 2rem;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>Visual Regression Test Results</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
            <div class="stats">
                <div class="stat total">
                    <span class="stat-number">${results.total}</span>
                    Total Tests
                </div>
                <div class="stat passed">
                    <span class="stat-number">${results.passed}</span>
                    Passed
                </div>
                <div class="stat failed">
                    <span class="stat-number">${results.failed}</span>
                    Failed
                </div>
            </div>
        </div>
    </div>
    
    <div class="container">
        ${results.diffs.map(diff => generateTestItem(diff)).join('')}
    </div>
    
    <div class="footer">
        <p>Visual Regression Testing powered by Playwright</p>
    </div>
</body>
</html>`;

  await fs.ensureDir(path.dirname(galleryPath));
  await fs.writeFile(galleryPath, html);
  
  console.log(`✅ Gallery generated: ${galleryPath}`);
  console.log(`🌐 Open in browser: file://${path.resolve(galleryPath)}`);
}

function generateTestItem(diff) {
  const statusClass = `status-${diff.status}`;
  const statusText = diff.status.charAt(0).toUpperCase() + diff.status.slice(1);
  
  let content = '';
  
  if (diff.status === 'passed') {
    content = '<div class="no-diffs">✅ No visual differences detected</div>';
  } else if (diff.status === 'failed') {
    content = `
      <div class="diff-info">
        <strong>Differences found:</strong> ${diff.diffPixels} pixels (${diff.diffPercentage.toFixed(2)}%)
      </div>
      <div class="images-grid">
        <div class="image-container">
          <h4>Baseline</h4>
          <img src="../baseline/${diff.file}" alt="Baseline">
        </div>
        <div class="image-container">
          <h4>Latest</h4>
          <img src="../latest/${diff.file}" alt="Latest">
        </div>
        <div class="image-container">
          <h4>Difference</h4>
          <img src="../diffs/${diff.file}" alt="Difference">
        </div>
      </div>
    `;
  } else {
    content = `<div class="diff-info"><strong>Error:</strong> ${diff.message || 'Unknown error'}</div>`;
  }
  
  return `
    <div class="test-item">
      <div class="test-header">
        <div class="test-name">${diff.file}</div>
        <div class="test-status ${statusClass}">${statusText}</div>
      </div>
      <div class="test-content">
        ${content}
      </div>
    </div>
  `;
}

generateGallery().catch(console.error);
