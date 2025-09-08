# 🎯 Deploy Cheat Sheet

## Current Live Site
**URL**: https://jefferykerr.com
**Repository**: https://github.com/donnywonny2025/SUMMER-2025-WEBSITE

## Quick Deploy Commands
```bash
cd deploy                    # Go to live site code
# Make your changes...
git add .                    # Stage all changes
git commit -m "Update site"  # Commit with message
git push origin main         # Deploy to live site
```

## What Files to Edit
- ✅ `index.html` - Main content
- ✅ `css/cinematic.css` - Styling
- ✅ `js/cinematic.js` - Functionality
- ✅ `_redirects` - URL routing

## Don't Touch
- ❌ Don't delete `_redirects`
- ❌ Don't remove `index.html`
- ❌ Don't change folder structure

## Test Locally
```bash
cd deploy
python3 -m http.server 8000
# Open http://localhost:8000
```

## Emergency Rollback
```bash
git log --oneline -5        # See recent commits
git revert HEAD            # Undo last commit
git push origin main       # Deploy rollback
```

---
**Need full details?** 📖 See `DEPLOYMENT-GUIDE.md`