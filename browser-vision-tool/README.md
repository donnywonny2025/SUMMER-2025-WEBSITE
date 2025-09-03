# Browser Vision Tool 🔍

AI-powered browser vision for IDEs that can analyze any website and copy its styling to your site.

## ⚡ Quick Start

1. **Install:**
   ```bash
   node install.js
   ```

2. **Start API Server:**
   ```bash
   npm run server
   ```

3. **Use from your IDE:**
   ```bash
   curl -X POST http://localhost:8080/full-copy \
     -H "Content-Type: application/json" \
     -d '{
       "referenceUrl": "https://apple.com",
       "targetUrl": "http://localhost:3000", 
       "elementSelector": "h1"
     }'
   ```

## 🎯 What It Does

- **Analyzes any website** like Scout does - typography, colors, layout, spacing
- **Takes screenshots** and extracts exact CSS values
- **Applies styling** to your site with automatic retries
- **Verifies changes** by comparing before/after screenshots
- **Works with any IDE** through REST API

## 🖥️ Command Line Usage

```bash
# Analyze a website
node browser-vision.js https://stripe.com

# Analyze and copy to your site
node browser-vision.js https://apple.com --copy localhost:3000 h1
```

## 🌐 IDE Integration

Your IDE calls the API server to get browser vision:

### Analyze Website
```javascript
POST http://localhost:8080/analyze
{
  "url": "https://linear.app"
}
```

### Copy Styling
```javascript
POST http://localhost:8080/full-copy
{
  "referenceUrl": "https://stripe.com",
  "targetUrl": "http://localhost:3000",
  "elementSelector": "h1"
}
```

## 📋 Features

✅ **Full browser automation** - scroll, click, navigate  
✅ **Visual analysis** - like Scout's website analysis  
✅ **Screenshot comparison** - verifies changes actually work  
✅ **Automatic retries** - tries different approaches if first fails  
✅ **CSS extraction** - gets exact computed styles  
✅ **Live feedback** - watch it work in real-time  
✅ **IDE integration** - REST API for any IDE to use  

## 🔧 How It Solves Your Problem

**Before:** "Make my heading look like Apple's" → IDE guesses → nothing changes → hours of frustration

**After:** Tool opens Apple.com → analyzes their heading → takes screenshot → applies exact styling → verifies it worked → reports success

## 💡 Usage Examples

```bash
# Copy Apple's navigation
curl -X POST localhost:8080/full-copy -d '{
  "referenceUrl": "https://apple.com",
  "targetUrl": "localhost:3000", 
  "elementSelector": "nav"
}'

# Copy Stripe's button styling  
curl -X POST localhost:8080/full-copy -d '{
  "referenceUrl": "https://stripe.com",
  "targetUrl": "localhost:3000",
  "elementSelector": ".btn-primary"
}'
```

## 🚀 What Happens

1. **Opens reference site** (Apple.com)
2. **Scrolls and analyzes** typography, colors, spacing
3. **Takes screenshot** of target element
4. **Extracts CSS** values (font-size, color, etc.)
5. **Opens your site** (localhost:3000)
6. **Applies styling** to your element
7. **Takes new screenshot**
8. **Compares results** 
9. **Retries if needed** with different approaches
10. **Reports success** when visually identical

This gives your IDE **actual vision** - it can see what it's changing and verify it worked!

## 🎮 IDE Instructions

Tell your IDE: "Use the Browser Vision Tool to make my website look like [reference site]"

Your IDE will:
1. Read this README
2. Run the setup commands
3. Start the API server  
4. Call the `/full-copy` endpoint
5. Watch the browser analyze and copy styling
6. Get success confirmation with screenshots

No more guessing - your IDE can now SEE what it's building!
