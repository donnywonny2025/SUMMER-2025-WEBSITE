#!/usr/bin/env node

/*
================================================================================
🎯 JEFF KERR WEBSITE PROJECT - COMPREHENSIVE WORKSPACE GUIDE
================================================================================

📋 PROJECT OVERVIEW
==================
This is a sophisticated filmmaker portfolio website for Jeff Kerr, originally 
inspired by Sam Kolder's design. The project uses a context-driven, visual-first 
development workflow with mandatory verification systems.

🎬 CURRENT PROJECT STATUS
========================
- ✅ Core website structure completed
- ✅ Video cleanup phase completed (removed backgrounds, borders, fixed spacing)
- ✅ Height matching achieved across all viewports
- ✅ MorphingDialog navigation system implemented
- ✅ Tilt effects and animations integrated
- ✅ 5-video grid system with hero video
- ✅ Transform scaling (1.8x) applied to eliminate letterboxing
- 🔄 Ready for next development phase

🏗️ TECHNICAL STACK
==================
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- Motion-primitives library (custom components)
- Vimeo embeds for video content
- Playwright for visual testing

📁 WORKSPACE STRUCTURE
=====================

/src/
├── App.jsx              # Main application component
├── App.css              # Core styles
├── fonts.css            # Typography definitions
├── main.jsx             # React entry point
└── assets/              # Static assets (logos, videos)

/components/motion-primitives/
├── morphing-dialog.tsx  # Navigation overlay system
├── text-roll.tsx        # Text animation component
├── text-shimmer.tsx     # Logo shimmer effect
└── tilt.tsx            # 3D tilt hover effects

/context/
├── ai_context.md        # Core workflow rules and context
├── plan.md             # Current development plan
├── progress.md         # Progress tracking
└── research.md         # Research and analysis

/tools/
├── scripts/            # Automation and workflow scripts
│   ├── check-changes.js           # Visual verification (MANDATORY)
│   ├── bulletproof-screenshot.js  # Screenshot capture system
│   ├── mandatory-visual-analysis.js # Pre-change analysis
│   ├── mandatory-change-session.js # Change tracking
│   └── complete-visual-workflow.js # Post-change verification
└── analysis/           # Analysis and comparison tools
    ├── side-by-side-comparison.js # Visual comparison vs reference
    ├── analyze-sam-reference.js   # Reference site analysis
    └── change-effectiveness-scorer.js # Change impact scoring

/screenshots/
├── current/            # Latest screenshots across viewports
├── before-after/       # Change comparison images
├── change-sessions/    # Session-based change tracking
└── archive/           # Historical screenshots

/docs/
├── analysis/          # Design analysis and frameworks
├── design/           # Design progress documentation
└── workflow/         # Workflow reports and guides

🎯 ANTI-VIBE CODING SYSTEM
==========================
This project uses a sophisticated "Anti-Vibe Coding" system that prevents
random changes without systematic tracking. Key principles:

1. SPEC-FIRST DEVELOPMENT
   - Never make freeform code changes
   - Always update context files first
   - Follow 4-phase process: Research → Planning → Implementation → Review

2. MANDATORY VISUAL VERIFICATION
   - EVERY code change requires visual verification
   - Use `node tools/scripts/check-changes.js` after ANY change
   - Must describe exactly what's seen in comparison screenshots
   - One change at a time with verification before next change

3. CONTEXT-DRIVEN WORKFLOW
   - Only 4 context files allowed: ai_context.md, plan.md, progress.md, research.md
   - All changes must be documented and tracked
   - Complete audit trail of all modifications

🔧 CORE WORKFLOW COMMANDS
========================

BEFORE ANY CHANGES:
1. node tools/scripts/mandatory-visual-analysis.js
2. node tools/scripts/mandatory-change-session.js

AFTER ANY CHANGES:
3. node tools/scripts/check-changes.js
4. node tools/scripts/complete-visual-workflow.js

SCREENSHOT CAPTURE:
- node tools/scripts/bulletproof-screenshot.js

VISUAL COMPARISON:
- node tools/analysis/side-by-side-comparison.js

🎨 VISUAL SYSTEM COMPONENTS
===========================

1. ENHANCED VISUAL TRACKER
   - Checkpoint system for major milestones
   - Before/after comparison tracking
   - Systematic change documentation

2. BULLETPROOF SCREENSHOT SYSTEM
   - Multi-viewport capture (desktop, tablet, mobile)
   - Consistent naming and organization
   - Automated comparison generation

3. HTML SIDE-BY-SIDE COMPARISON
   - Real-time comparison vs Sam Kolder reference
   - Visual diff highlighting
   - Progress tracking against target design

🎬 VIDEO SYSTEM DETAILS
======================
- Hero video: Featured prominently at top
- Grid videos: 4 additional videos in responsive grid
- Transform scaling: All videos use scale(1.8) to eliminate letterboxing
- Autoplay: All videos autoplay immediately
- Rounded containers: Videos fill rounded corners completely
- Vimeo embeds: Professional video hosting with custom parameters

🎭 ANIMATION SYSTEM
==================
- MorphingDialog: Smooth navigation overlay transitions
- TextShimmer: Logo shimmer effect with customizable duration
- Tilt: 3D hover effects with spring animations
- All components use Framer Motion for smooth performance

📱 RESPONSIVE DESIGN
===================
- Mobile-first approach
- Tailwind CSS breakpoints
- Consistent spacing and typography
- Optimized for all viewport sizes

⚠️  CRITICAL WORKFLOW RULES
===========================
1. NEVER make changes without running mandatory analysis first
2. ALWAYS verify changes with screenshot comparison
3. ONE change at a time - no batch modifications
4. UPDATE context files before implementing changes
5. DESCRIBE exactly what you see in visual comparisons
6. FOLLOW the 4-phase development process religiously

🚀 GETTING STARTED
==================
New developers should:
1. Read this entire file
2. Review /context/ai_context.md for detailed workflow rules
3. Run initial visual analysis: node tools/scripts/mandatory-visual-analysis.js
4. Familiarize yourself with the screenshot system
5. Practice the visual verification workflow

🎯 READY TO START DEVELOPMENT?
=============================
Run the mandatory analysis first:
   node tools/scripts/mandatory-visual-analysis.js

This system will transform your visual development workflow and ensure
consistent, high-quality results with complete change tracking!

================================================================================
*/

console.log('🎯 JEFF KERR WEBSITE PROJECT');
console.log('============================');
console.log('');
console.log('📋 Welcome to the comprehensive filmmaker portfolio project!');
console.log('');
console.log('🚨 MANDATORY: Read the detailed project guide above before starting!');
console.log('');
console.log('🎯 ANTI-VIBE CODING SYSTEM - MANDATORY WORKFLOW:');
console.log('');
console.log('1. 🎯 RUN MANDATORY ANALYSIS:');
console.log('   node tools/scripts/mandatory-visual-analysis.js');
console.log('');
console.log('2. 🎯 START CHANGE SESSION:');
console.log('   node tools/scripts/mandatory-change-session.js');
console.log('');
console.log('3. 🎯 VERIFY CHANGES:');
console.log('   node tools/scripts/complete-visual-workflow.js');
console.log('');
console.log('⚠️  WARNING: Making changes without following this process');
console.log('   will result in the same problems we just solved!');
console.log('');
console.log('🎯 READY TO START? Run the mandatory analysis first:');
console.log('   node tools/scripts/mandatory-visual-analysis.js');
console.log('');
console.log('🚀 This system will transform your visual development workflow!');
