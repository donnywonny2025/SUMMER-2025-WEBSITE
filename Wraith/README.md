# Wraith Visual Regression Testing

A modern visual regression testing setup using Playwright, designed to replace the legacy Wraith framework with current, reliable tooling.

## 🎯 Purpose

This tool helps you:
- Capture baseline screenshots of your web application at multiple breakpoints
- Detect visual changes after code modifications
- Generate visual reports showing differences
- Maintain visual consistency across development iterations

## 🚀 Quick Start

### 1. Setup
```bash
npm run setup
```

### 2. Configure
Edit `config.json` to set your URLs and test paths:
```json
{
  "domains": {
    "local": "http://localhost:3000",
    "production": "https://your-site.com"
  },
  "paths": {
    "home": "/",
    "about": "/about"
  }
}
```

### 3. Run Tests
```bash
npm test
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install dependencies and Playwright browsers |
| `npm test` | Run complete visual regression test workflow |
| `npm run test:local` | Test against local development server |
| `npm run test:production` | Test against production URL |
| `npm run capture:baseline` | Capture baseline screenshots only |
| `npm run capture:latest` | Capture latest screenshots only |
| `npm run compare` | Compare baseline vs latest screenshots |
| `npm run gallery` | Generate HTML visual report |
| `npm run clean` | Clear all screenshots and reports |

## 🔧 Configuration

### config.json
```json
{
  "browser": "chromium",
  "domains": {
    "local": "http://localhost:3000",
    "production": "https://example.com"
  },
  "screen_widths": [320, 600, 768, 1024, 1280, 1920],
  "paths": {
    "home": "/",
    "about": "/about",
    "contact": "/contact"
  },
  "options": {
    "fullPage": true,
    "waitForSelector": null,
    "delay": 1000,
    "threshold": 0.1
  }
}
```

### Configuration Options

- **browser**: Browser engine to use (`chromium`, `firefox`, `webkit`)
- **domains**: Environment URLs to test against
- **screen_widths**: Responsive breakpoints to test
- **paths**: Pages/components to capture
- **options**:
  - `fullPage`: Capture full page or viewport only
  - `waitForSelector`: Wait for specific element before capture
  - `delay`: Additional delay before capture (ms)
  - `threshold`: Pixel difference threshold (0-1)

## 📁 Project Structure

```
Wraith/
├── config.json              # Configuration file
├── package.json             # Dependencies and scripts
├── scripts/
│   ├── capture.js           # Screenshot capture
│   ├── compare.js           # Image comparison
│   ├── generate-gallery.js  # HTML report generation
│   └── run-tests.js         # Complete workflow
└── shots/
    ├── baseline/            # Reference screenshots
    ├── latest/              # Current screenshots
    ├── diffs/               # Difference images
    └── gallery/             # HTML reports
```

## 🔄 Workflow

### 1. Initial Setup
```bash
# First time setup
npm run setup

# Configure your URLs in config.json
# Capture baseline screenshots
npm run capture:baseline
```

### 2. Development Workflow
```bash
# After making changes, run full test
npm test

# Or step by step:
npm run capture:latest
npm run compare
npm run gallery
```

### 3. Review Results
- Open `shots/gallery/index.html` in your browser
- Review visual differences
- If changes are expected, update baseline: `npm run capture:baseline`
- If changes are unintended, fix code and retest

## 🎨 Visual Report

The generated HTML gallery shows:
- **Summary statistics**: Total tests, passed/failed counts
- **Individual test results**: Side-by-side comparison of baseline, latest, and diff images
- **Difference metrics**: Pixel count and percentage of changes
- **Status indicators**: Clear pass/fail status for each test

## 🔧 Advanced Usage

### Custom Selectors
Wait for specific elements before capturing:
```json
{
  "options": {
    "waitForSelector": ".loading-complete"
  }
}
```

### Multiple Environments
Test against different environments:
```bash
npm run test:local      # Test local development
npm run test:production # Test production site
```

### Custom Breakpoints
Add or modify responsive breakpoints:
```json
{
  "screen_widths": [320, 480, 768, 1024, 1440, 1920]
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Screenshots not capturing**
   - Check if URLs are accessible
   - Verify browser installation: `npx playwright install`
   - Check network connectivity

2. **False positives**
   - Adjust `threshold` in config.json
   - Add delays for dynamic content
   - Use `waitForSelector` for loading states

3. **Missing dependencies**
   - Run `npm run setup` to reinstall
   - Check Node.js version (requires 14+)

### Debug Mode
Run individual scripts for debugging:
```bash
node scripts/capture.js local latest
node scripts/compare.js
node scripts/generate-gallery.js
```

## 🔄 Integration with CI/CD

Add to your CI pipeline:
```yaml
- name: Visual Regression Tests
  run: |
    cd Wraith
    npm run test:production
    # Fail build if tests fail
    if [ -f shots/comparison-results.json ]; then
      failed=$(node -p "require('./shots/comparison-results.json').failed")
      if [ "$failed" -gt 0 ]; then
        echo "Visual regression tests failed"
        exit 1
      fi
    fi
```

## 📚 Benefits Over Legacy Wraith

- ✅ **Modern browsers**: Uses current Chromium/Firefox/WebKit
- ✅ **No Ruby dependencies**: Pure Node.js solution
- ✅ **Better performance**: Faster screenshot capture
- ✅ **Active maintenance**: Playwright is actively developed
- ✅ **Cross-platform**: Works on Windows, macOS, Linux
- ✅ **Rich reporting**: Beautiful HTML gallery with detailed metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
