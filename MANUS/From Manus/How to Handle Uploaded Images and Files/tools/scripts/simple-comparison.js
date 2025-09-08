#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log(`📊 Generating comparison...`);

try {
  // Simple comparison - no complex logic
  execSync('node tools/scripts/screenshot-html-comparison.js', { stdio: 'inherit' });
  console.log(`✅ Comparison complete`);
} catch (error) {
  console.error(`❌ Comparison failed: ${error.message}`);
  process.exit(1);
}
