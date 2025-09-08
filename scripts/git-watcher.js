#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_DIR = '/Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE';
const CHECK_INTERVAL = 30000; // 30 seconds

console.log('Git Auto-Commit Watcher Started');
console.log(`Monitoring: ${REPO_DIR}`);
console.log(`Check interval: ${CHECK_INTERVAL/1000} seconds`);

function checkAndCommit() {
    process.chdir(REPO_DIR);
    
    // Check for changes
    exec('git status --porcelain', (error, stdout, stderr) => {
        if (error) {
            console.error('Git status error:', error);
            return;
        }
        
        if (stdout.trim()) {
            console.log('Changes detected, auto-committing...');
            
            // Add all changes
            exec('git add -A', (addError) => {
                if (addError) {
                    console.error('Git add error:', addError);
                    return;
                }
                
                // Commit with timestamp
                const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
                exec(`git commit --no-verify -m "Auto-commit: ${timestamp}"`, (commitError) => {
                    if (commitError) {
                        console.error('Git commit error:', commitError);
                        return;
                    }
                    
                    console.log(`✓ Auto-committed at ${timestamp}`);
                });
            });
        }
    });
}

// Initial check
checkAndCommit();

// Set up interval
setInterval(checkAndCommit, CHECK_INTERVAL);

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nGit watcher stopped');
    process.exit(0);
});
