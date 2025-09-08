# Research

## Screenshot Testing Setup
- Screenshot tests live in `/tests/visual/`.
- Screenshots stored in `/tests/screenshots/baseline/`, `/current/`, `/diff/`.
- Dependencies: Playwright (for screenshots), Pixelmatch + PNGJS (for diffing).

## Design Analysis Results
- **Sam Kolder's site is our Holy Grail reference** - North Star for all design decisions
- **Our site is 10-36% shorter** than Sam's across all viewport sizes
- **Key differences**: Hero section positioning, circular showreel placement, contact info layout, overall spacing
- **Design focus areas**: Typography, spacing, element positioning, not content changes

## Current Site Structure
- Hero section with text and circular showreel element
- Video grid section with portfolio items
- Footer with contact information
- All content is correct - need design adjustments only

## Visual Verification Process
- **Issue Identified**: Screenshot commands hanging, need reliable visual verification
- **Solution**: Created `bulletproof-screenshot.js` with timeout protection and port detection
- **Workflow**: Always verify changes visually before claiming success
- **Status**: ✅ SOLVED - reliable screenshot system working perfectly

## Current Design Analysis
- **Height Matching**: Desktop -4.1%, Large +7.0%, Mobile -1.7% (much improved!)
- **Sam Kolder Reference**: Available screenshots for all viewports
- **Visual System**: Bulletproof screenshot system operational
- **Code Quality**: ✅ CLEAN - All CSS conflicts resolved, fonts consistent, DOM safety implemented
- **Workspace**: ✅ ORGANIZED - Clean structure with logical folder organization
- **Feedback Loop**: ✅ ESTABLISHED - Real-time context updates, screenshot verification, progress tracking

## Critical Visual Issues Identified
- **Typography**: Text size, weight, and spacing not matching Sam Kolder's specifications
- **Video Thumbnails**: Wrong styling, positioning, and visual treatment
- **Layout Elements**: Showreel positioning and styling needs refinement
- **Overall Aesthetic**: Missing Sam Kolder's sophisticated visual quality

## Measurement System Gap Analysis
- **ROOT CAUSE**: Making incremental guesses instead of precise measurements
- **Problem**: No pixel-perfect measurement extraction from Sam Kolder's site
- **Impact**: Tiny changes (1.8rem vs 2.4rem) instead of spot-on accuracy
- **Solution Needed**: Build comprehensive measurement extraction system

## Next Phase Requirements
- **URGENT**: Build measurement extraction system for pixel-perfect accuracy
- **Goal**: Make 90% accurate changes on first try instead of incremental guessing
- **Tools Needed**: Measurement extraction, pixel-perfect overlay, automated comparison