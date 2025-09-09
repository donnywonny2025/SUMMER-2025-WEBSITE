# Website Debug Commands

Please run these commands in your terminal to help diagnose the issue:

## 1. Kill all processes and clean restart
```bash
# Kill any running dev servers
pkill -f "vite"
pkill -f "node"

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules
rm -rf package-lock.json
npm install
```

## 2. Check for compilation errors
```bash
# Try building the project
npm run build

# If build fails, check specific errors
npm run dev 2>&1 | tee debug.log
```

## 3. Check browser console
Open browser dev tools (F12) and look for:
- JavaScript errors in Console tab
- Network tab for failed requests
- Any red error messages

## 4. Test basic React app
```bash
# Create a minimal test file to verify React works
echo 'import React from "react"; export default function Test() { return <div>TEST WORKS</div>; }' > src/Test.jsx
```

## 5. Check dependencies
```bash
# Verify all packages are installed correctly
npm list --depth=0
npm audit
```

## 6. Alternative: Start fresh dev server
```bash
# Navigate to project directory
cd "/Volumes/AI/WORK 2025/SUMMER 2025 WEBSITE/MANUS/From Manus/How to Handle Uploaded Images and Files"

# Start dev server with verbose output
npm run dev -- --host --debug
```

## 7. Check what's actually running
```bash
# Check if anything is on port 3000
lsof -i :3000

# Check if Vite is working
curl http://localhost:3000
```

Please run these commands and paste any error messages you see. This will help me identify exactly what's breaking the website.
