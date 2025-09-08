# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Setup (One-time)
```bash
npm run setup
```

### 2. Configure Your URLs
Edit `config.json` and update the domains:
```json
{
  "domains": {
    "local": "http://localhost:3000",
    "production": "https://yoursite.com"
  }
}
```

### 3. Run Tests
```bash
# Test your local development server
npm run test:local

# Test your production site
npm run test:production
```

## 📋 Common Commands

| Command | What it does |
|---------|-------------|
| `npm test` | Run complete visual regression workflow |
| `npm run capture:baseline` | Capture reference screenshots |
| `npm run capture:latest` | Capture current screenshots |
| `npm run compare` | Compare baseline vs latest |
| `npm run gallery` | Generate HTML report |
| `npm run clean` | Clear all screenshots |

## 🎯 Typical Workflow

1. **First time setup:**
   ```bash
   npm run setup
   # Edit config.json with your URLs
   npm run capture:baseline
   ```

2. **After making changes:**
   ```bash
   npm test
   # Review results in shots/gallery/index.html
   ```

3. **If changes are expected:**
   ```bash
   npm run capture:baseline  # Update baseline
   ```

4. **If changes are unintended:**
   ```bash
   # Fix your code, then:
   npm test
   ```

## 📊 View Results

Open `shots/gallery/index.html` in your browser to see:
- ✅ Passed tests (no visual changes)
- ❌ Failed tests (visual differences detected)
- 📊 Summary statistics
- 🖼️ Side-by-side image comparisons

## 🔧 Customize

Edit `config.json` to:
- Add more breakpoints: `"screen_widths": [320, 768, 1024, 1920]`
- Add more pages: `"paths": {"home": "/", "about": "/about"}`
- Adjust sensitivity: `"threshold": 0.1` (lower = more sensitive)
- Add delays: `"delay": 2000` (for slow-loading content)

## 🆘 Need Help?

- Check the full [README.md](README.md) for detailed documentation
- Run individual scripts for debugging: `node scripts/capture.js local latest`
- Check `shots/comparison-results.json` for detailed test results
