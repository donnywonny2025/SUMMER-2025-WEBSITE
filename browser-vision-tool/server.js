const express = require('express');
const cors = require('cors');
const BrowserVisionTool = require('./browser-vision');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

let visionTool = null;

// Initialize the browser tool
async function initTool() {
  if (!visionTool) {
    visionTool = new BrowserVisionTool();
    await visionTool.init();
    console.log('🚀 Browser Vision Tool initialized');
  }
  return visionTool;
}

// API Routes for IDE integration
app.post('/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const tool = await initTool();
    const analysis = await tool.analyzeWebsite(url);
    
    res.json({
      success: true,
      analysis: analysis,
      message: `Successfully analyzed ${url}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/copy-style', async (req, res) => {
  try {
    const { targetUrl, elementSelector } = req.body;
    if (!targetUrl || !elementSelector) {
      return res.status(400).json({ error: 'targetUrl and elementSelector are required' });
    }

    const tool = await initTool();
    const result = await tool.copyElementStyle(targetUrl, elementSelector);
    
    res.json({
      success: true,
      result: result,
      message: `Style applied to ${elementSelector} on ${targetUrl}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/full-copy', async (req, res) => {
  try {
    const { referenceUrl, targetUrl, elementSelector } = req.body;
    
    const tool = await initTool();
    
    // First analyze the reference site
    console.log(`🔍 Analyzing reference: ${referenceUrl}`);
    const analysis = await tool.analyzeWebsite(referenceUrl);
    
    // Then apply to target site
    console.log(`🎯 Applying to target: ${targetUrl}`);
    const result = await tool.copyElementStyle(targetUrl, elementSelector);
    
    res.json({
      success: true,
      analysis: analysis,
      result: result,
      message: `Copied styling from ${referenceUrl} to ${targetUrl}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/status', (req, res) => {
  res.json({ 
    status: 'running',
    tool: visionTool ? 'initialized' : 'not initialized',
    message: 'Browser Vision Tool API is running'
  });
});

app.listen(port, () => {
  console.log(`🌐 Browser Vision API running on http://localhost:${port}`);
  console.log('📋 Available endpoints:');
  console.log('  POST /analyze - Analyze a website');
  console.log('  POST /copy-style - Copy style to target');
  console.log('  POST /full-copy - Full analysis and copy');
  console.log('  GET /status - Check API status');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Browser Vision Tool...');
  if (visionTool) {
    await visionTool.close();
  }
  process.exit(0);
});
