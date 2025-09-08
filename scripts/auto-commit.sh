#!/bin/bash

# Auto-commit script for keeping git repository up to date
# This script will automatically add and commit changes every few minutes

REPO_DIR="/Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE"
cd "$REPO_DIR"

# Check if there are any changes
if ! git diff-index --quiet HEAD --; then
    echo "Changes detected, committing..."
    
    # Add all changes
    git add -A
    
    # Create commit with timestamp
    TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
    git commit --no-verify -m "Auto-commit: $TIMESTAMP"
    
    # Push to remote (runs in background via post-commit hook)
    echo "Changes committed and will be pushed automatically"
else
    echo "No changes to commit"
fi
