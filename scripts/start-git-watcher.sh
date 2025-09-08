#!/bin/bash

# Start the git auto-commit watcher
REPO_DIR="/Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE"
SCRIPT_DIR="$REPO_DIR/scripts"

echo "Starting Git Auto-Commit Watcher..."
echo "Repository: $REPO_DIR"

# Kill any existing watcher processes
pkill -f "git-watcher.js" 2>/dev/null

# Start the watcher in the background
cd "$REPO_DIR"
nohup node "$SCRIPT_DIR/git-watcher.js" > "$SCRIPT_DIR/git-watcher.log" 2>&1 &

echo "Git watcher started in background (PID: $!)"
echo "Log file: $SCRIPT_DIR/git-watcher.log"
echo ""
echo "To stop the watcher, run: pkill -f git-watcher.js"
echo "To view logs, run: tail -f $SCRIPT_DIR/git-watcher.log"
