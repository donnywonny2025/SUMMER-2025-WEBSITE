# Context-Engineered Workflow Rule

## Description
Always use the spec-first, context-engineered workflow for this project.  
Do not freeform generate code without first creating or updating the context files.

## Workflow
1. **Research Phase**
   - Summarize relevant code into `/context/research.md`.
   - Capture only file paths, line numbers, and key notes.
   - Keep summaries compact and actionable.

2. **Planning Phase**
   - Write a detailed `/context/plan.md` before coding.
   - Include every file to change, the snippets, and verification steps.
   - Never start coding until `plan.md` is approved.

3. **Implementation Phase**
   - Write code only according to `/context/plan.md`.
   - Update `/context/progress.md` after each step.
   - Keep context <40%. Reference summaries instead of reloading whole files.

4. **Review**
   - The human will review `/context/research.md` and `/context/plan.md`.
   - If corrections are made, update those files before resuming.

## File Management Rule
- **NEVER create new context files** unless it's a completely new topic that doesn't fit anywhere else
- **ALWAYS update existing files** instead of creating new ones
- **Single Source of Truth**: Only 4 context files should exist:
  - `ai_context.md` = Workflow rules only
  - `plan.md` = Project plans only  
  - `progress.md` = Progress tracking only
  - `research.md` = Research notes only
- **When encountering problems** → Update the relevant existing file
- **When learning something new** → Update `research.md`
- **When making progress** → Update `progress.md`
- **When changing approach** → Update `plan.md`
- **Clean up old files** at the end of each session

## Visual Verification Rule
- ALWAYS use the visual verification system (`node tools/scripts/check-changes.js`) after ANY code changes
- ALWAYS open and examine the generated comparison screenshot (`html-comparison-*.png`) to verify changes worked
- NEVER claim changes are complete without visually confirming them in the comparison image
- The comparison screenshot is the final authority on whether changes worked
- If visual verification fails, debug the system before proceeding
- MANDATORY: After every code change, you MUST check the comparison screenshot to confirm the change is visible

## System Reliability Rule
- Before starting any work, verify the visual verification system is working
- Test with a small change to confirm the system captures updates
- If the system is broken, fix it first before making design changes
- Document any system issues in `/context/system-status.md`

## Change Documentation Rule
- Document every change made in `/context/progress.md` with:
  - What was changed
  - Why it was changed
  - Screenshot filename of the result
  - Whether it achieved the intended goal
- Keep a running log of what works and what doesn't

## Iterative Verification Rule
- Make ONE change at a time
- Verify each change visually before making the next
- If a change doesn't work, revert it before trying something else
- Don't make multiple changes and then try to figure out which one worked

## Context File Maintenance Rule
- Update `/context/research.md` when new issues are discovered
- Update `/context/plan.md` when the approach changes
- Keep `/context/progress.md` current with actual progress
- Archive old context files when starting new phases

## Error Recovery Rule
- When something goes wrong, document it in `/context/errors.md`
- Include the error message, what was being attempted, and the fix
- Reference this file before repeating similar work
- Don't repeat the same mistakes

## Mandatory Visual Check Rule
- **CRITICAL**: After making ANY code change, you MUST:
  1. Run `node tools/scripts/check-changes.js`
  2. Open the generated comparison screenshot (`html-comparison-*.png`)
  3. **MANDATORY DESCRIPTION**: You MUST describe exactly what you see in the comparison screenshot
  4. **NO ASSUMPTIONS**: Never assume something is working - describe the actual visual state
  5. **SPECIFIC DETAILS**: Include specific text, colors, positioning, and any visual problems you observe
  6. Only then claim the change is complete
- **VIOLATION**: If you make a change without describing what you actually see in the comparison screenshot, you have failed the workflow
- **ACCOUNTABILITY**: The human will monitor for this behavior and correct it immediately

## Mandatory Screenshot Analysis Rule
- **EVERY comparison screenshot MUST include this exact format:**
  ```
  ## 📸 VISUAL ANALYSIS OF COMPARISON SCREENSHOT
  
  **What I see in the comparison:**
  - Left side (Our Site): [Describe exactly what text, colors, layout you see]
  - Right side (Sam Kolder): [Describe exactly what you see]
  - Specific issues observed: [List any problems, misalignments, wrong text, etc.]
  - Changes visible: [Yes/No - and what specific changes are visible]
  
  **Conclusion:** [Based on what I actually see, not what I assume]
  ```
- **VIOLATION**: If you don't provide this exact analysis format, you have failed the workflow
- **NO EXCEPTIONS**: This format is mandatory for every single comparison screenshot

## Design Principles Rule
- **NEVER place content directly against screen edges** - Always maintain proper margins/padding
- **ALWAYS consider breathing room** - Elements need space to breathe, not cramped against edges
- **FOLLOW professional design standards** - This is a real working environment, not a test
- **When analyzing comparisons, examine**:
  - ✅ Alignment (left/center/right positioning)
  - ✅ Spacing from edges (margins/padding)
  - ✅ Proportions and sizing
  - ✅ Overall visual balance and breathing room
- **VIOLATION**: Placing elements too close to screen edges is unacceptable in professional design
- **ACCOUNTABILITY**: The human will correct any unprofessional spacing decisions immediately

⚠️ These context files are the **source of truth**.  
⚠️ Do NOT skip steps.