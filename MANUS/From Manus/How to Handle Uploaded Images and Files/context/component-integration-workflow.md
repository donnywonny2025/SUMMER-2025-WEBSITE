# Component Integration Workflow

## Problem Identified
Adding animated components (TextRoll, ASCIIText, etc.) consistently breaks the website. Need systematic approach to prevent errors and maintain stability.

## Component Libraries in Use
1. **Motion-Primitives** (https://motion-primitives.com/)
   - Built on Framer Motion
   - CLI installation: `npx motion-primitives@latest add [component-name]`
   - Components: TextRoll, Tilt, MorphingDialog, TextShimmer

2. **ReactBits.dev** (https://reactbits.dev/)
   - Animated React components
   - Manual integration required
   - Components: ASCIIText, various text animations

## Safe Integration Checklist

### Before Adding Any Component:
1. **Research Phase**
   - Read component documentation thoroughly
   - Check dependencies required
   - Understand props and configuration options
   - Look for TypeScript requirements

2. **Dependency Check**
   - Verify all required packages are installed
   - Check for version conflicts
   - Install missing dependencies first

3. **Import Analysis**
   - Check for duplicate imports
   - Ensure proper import paths
   - Verify React imports are clean

### During Integration:
1. **Incremental Addition**
   - Add component file first
   - Test compilation
   - Add import to main file
   - Test again before using

2. **Props Validation**
   - Start with minimal props
   - Test basic functionality
   - Add advanced props incrementally

3. **Error Handling**
   - Wrap in error boundaries if needed
   - Add fallback content
   - Handle loading states

### After Integration:
1. **Visual Verification**
   - Run `node tools/scripts/check-changes.js`
   - Verify component renders correctly
   - Check for console errors
   - Test responsive behavior

2. **Performance Check**
   - Monitor for memory leaks
   - Check animation performance
   - Verify cleanup on unmount

## Common Error Patterns to Avoid

### Import Errors
- Duplicate React imports
- Missing dependency imports (ScrollTrigger, etc.)
- Incorrect relative paths

### Component Errors
- Missing required props
- Incorrect prop types
- Animation conflicts

### Integration Errors
- Z-index conflicts
- CSS conflicts
- Event handler conflicts

## Recovery Protocol
If component breaks the site:
1. Immediately revert to last working state
2. Identify specific error from console
3. Fix error systematically
4. Re-test with visual verification
5. Document solution for future reference

## Best Practices
- Always test in isolation first
- Use TypeScript for better error catching
- Keep components modular and reusable
- Document custom modifications
- Maintain component inventory
