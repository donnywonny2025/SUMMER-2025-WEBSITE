#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log(`📸 Taking screenshot...`);

try {
  // Simple screenshot - no complex logic
  execSync('node tools/scripts/bulletproof-screenshot.js', { stdio: 'inherit' });
  console.log(`✅ Screenshot complete`);
} catch (error) {
  console.error(`❌ Screenshot failed: ${error.message}`);
  process.exit(1);
}