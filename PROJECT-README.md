# Jeffrey Kerr Portfolio - Project Structure

## 📁 Clean Project Organization

### **deploy/** - Live Website Code
Contains the code currently deployed on jefferykerr.com
- `index.html` - Main website
- `css/cinematic.css` - Styling
- `js/cinematic.js` - JavaScript
- `_redirects` - Netlify redirects
- `favicon.png` - Website icon

### **working/** - Development Version
Vite + React development environment
- Active development happens here
- Run with `npm run dev`

### **versions/** - Archived Versions
Old versions of the website for reference
- `versions/old/` - Previous implementations

### **Other Folders**
- `Lucky Rabbit/` - Separate Lucky Rabbit website
- `Lottie-Animation-Ecosystem/` - Animation libraries
- `MANUS/`, `NEW/`, etc. - Various project assets

## 🚀 Deployment Process
1. Make changes in `deploy/` folder
2. Commit and push to `main` branch
3. Netlify automatically deploys to jefferykerr.com

## 🎯 Quick Reference
- **Live site**: jefferykerr.com
- **Deployed code**: `deploy/` folder
- **Development**: `working/` folder
- **Old versions**: `versions/` folder