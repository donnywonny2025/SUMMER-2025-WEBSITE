# Visual Regression Testing

This directory contains visual regression tests using Playwright and Pixelmatch to ensure our site matches Sam Kolder's design.

## Setup

The visual testing system is already configured with:
- **Playwright** for screenshot capture
- **Pixelmatch** for image comparison
- **PNGJS** for image processing

## Available Commands

### Basic Visual Testing
```bash
# Run visual regression tests
npm run test:visual

# Update baseline screenshots (use when design changes are intentional)
npm run test:visual:baseline

# View test report
npm run test:visual:report
```

### Sam Kolder Comparison
```bash
# Capture Sam Kolder's site as baseline
npm run test:sam:baseline

# Compare our site with Sam Kolder's
npm run test:compare
```

## How It Works

### 1. Baseline Creation
- First run creates baseline screenshots in `/tests/screenshots/baseline/`
- Baselines serve as the "gold standard" for visual comparison

### 2. Visual Regression Detection
- Each test run captures current screenshots in `/tests/screenshots/current/`
- Compares current screenshots with baselines using pixel-perfect matching
- Generates diff images in `/tests/screenshots/diff/` when differences are found

### 3. Viewport Testing
Tests run across multiple viewport sizes:
- **Mobile**: 320x568px
- **Tablet**: 768x1024px  
- **Desktop**: 1024x768px
- **Large**: 1920x1080px

## File Structure

```
tests/
├── visual/
│   ├── visual.spec.js          # Main test file
│   └── README.md               # This file
└── screenshots/
    ├── baseline/               # Reference images
    │   ├── our_site_mobile.png
    │   ├── our_site_tablet.png
    │   ├── our_site_desktop.png
    │   ├── our_site_large.png
    │   ├── sam_mobile.png
    │   ├── sam_tablet.png
    │   ├── sam_desktop.png
    │   └── sam_large.png
    ├── current/                # Current test screenshots
    └── diff/                   # Difference images
```

## Workflow

### Initial Setup
1. Run `npm run test:visual:baseline` to create initial baselines
2. Run `npm run test:sam:baseline` to capture Sam Kolder's site

### Development Workflow
1. Make design changes to your site
2. Run `npm run test:visual` to check for regressions
3. If tests fail, review diff images in `/tests/screenshots/diff/`
4. Either fix the design or update baselines if changes are intentional

### Sam Kolder Matching Workflow
1. Run `npm run test:compare` to see differences with Sam's site
2. Review diff images to identify specific layout issues
3. Make CSS adjustments to match Sam's positioning
4. Re-run comparison until differences are minimized

## Troubleshooting

### Tests Fail with "Baseline not found"
- Run `npm run test:visual:baseline` to create missing baselines
- This is normal on first run

### High Difference Percentages
- Check if your dev server is running on `http://localhost:3000`
- Ensure page has fully loaded before screenshots
- Review diff images to identify specific issues

### Sam Kolder Site Issues
- Sam's site may have dynamic content that affects screenshots
- Run comparison tests multiple times to get consistent results
- Focus on layout positioning rather than exact pixel matching

## Success Criteria

- **Visual Regression**: <1% difference from our baseline
- **Sam Kolder Matching**: <5% difference from Sam's site
- **All Viewports**: Consistent results across mobile, tablet, desktop, and large screens

## Tips

- Use `npm run test:visual:report` to view detailed test results
- Diff images show exactly what changed (red = removed, green = added)
- Update baselines only when design changes are intentional
- Focus on layout positioning and spacing rather than exact pixel matching


