# 🚀 Jeffrey Kerr Website - Deployment Guide

## 📍 What This Folder Contains
This `deploy/` folder contains the **exact code currently live on jefferykerr.com**. Everything in this folder is what visitors see when they visit the website.

### Files Structure:
```
deploy/
├── index.html          # Main website entry point
├── css/cinematic.css   # Styling for video portfolio
├── js/cinematic.js     # JavaScript functionality
├── _redirects          # Netlify redirect rules
├── favicon.png         # Website favicon
└── DEPLOYMENT-GUIDE.md # This guide
```

## 🌐 Netlify Deployment Setup

### **Repository Connection**
- **GitHub Repository**: `https://github.com/donnywonny2025/SUMMER-2025-WEBSITE.git`
- **Branch**: `main` (automatically deploys on push)
- **Domain**: `jefferykerr.com` (custom domain)

### **Netlify Build Settings**
- **Build Command**: `npm run build` (though not needed for static site)
- **Publish Directory**: `deploy/` (this folder)
- **Node Version**: Latest LTS
- **Build Status**: ✅ Active and healthy

### **Domain Configuration**
- **Primary Domain**: jefferykerr.com
- **SSL Certificate**: Automatically provisioned by Netlify
- **DNS**: Managed through Netlify DNS
- **CDN**: Global CDN enabled

## 🔄 How Deployment Works

### **Automatic Deployment Process**
1. **Make Changes**: Edit files in this `deploy/` folder
2. **Commit**: `git add . && git commit -m "Update website"`
3. **Push**: `git push origin main`
4. **Auto-Deploy**: Netlify automatically detects changes and deploys
5. **Live**: Changes appear on jefferykerr.com within 1-2 minutes

### **Manual Deployment (if needed)**
```bash
# From project root
cd deploy
# Make your changes
git add .
git commit -m "Your update message"
git push origin main
```

## ⚙️ Netlify Configuration Details

### **Redirect Rules** (`_redirects`)
```
/* /index.html 200
```
- **Purpose**: Ensures all routes serve the main index.html (SPA behavior)
- **Status Code**: 200 (success, not redirect)
- **Coverage**: All routes (`/*`) redirect to index.html

### **Build Configuration**
- **Framework**: Static HTML/CSS/JS (no build process needed)
- **Dependencies**: None required
- **Environment Variables**: None currently configured
- **Headers**: Default Netlify headers

### **Performance & Security**
- **Compression**: GZIP enabled
- **Caching**: Optimized for static assets
- **Security Headers**: Basic security headers applied
- **HTTPS**: Forced HTTPS redirect

## 🛠️ Making Updates

### **Quick Update Process**
```bash
# 1. Navigate to deploy folder
cd deploy

# 2. Edit files (HTML, CSS, JS)
# Use your favorite editor

# 3. Test locally (optional)
# Open index.html in browser

# 4. Deploy
git add .
git commit -m "Updated website content"
git push origin main
```

### **File Types You Can Edit**
- ✅ `index.html` - Main content and structure
- ✅ `css/cinematic.css` - Styling and layout
- ✅ `js/cinematic.js` - Interactive functionality
- ✅ `_redirects` - URL routing rules
- ✅ `favicon.png` - Website icon

### **What NOT to Delete**
- ❌ Don't remove `_redirects` (breaks routing)
- ❌ Don't remove `index.html` (main entry point)
- ❌ Don't modify folder structure without testing

## 🔍 Current Website Details

### **Design**
- **Theme**: Cinematic video portfolio
- **Layout**: Full-screen video backgrounds
- **Typography**: Inter font family
- **Colors**: Dark theme with professional styling

### **Content Sections**
1. **Hero** - Large Vimeo video background with branding
2. **About** - Professional experience highlights
3. **Portfolio** - Work showcase with statistics
4. **Contact** - Call-to-action with email link

### **Technical Features**
- **Responsive Design**: Mobile and desktop optimized
- **Video Integration**: Vimeo embeds with autoplay
- **Smooth Scrolling**: JavaScript-enhanced navigation
- **SEO Optimized**: Proper meta tags and structure

## 🚨 Troubleshooting

### **Deployment Issues**
- **Check Git Status**: `git status` to see uncommitted changes
- **Verify Branch**: Ensure you're on `main` branch
- **Netlify Logs**: Check Netlify dashboard for build errors
- **File Paths**: Ensure all asset paths are correct

### **Common Problems**
- **404 Errors**: Check `_redirects` file exists
- **Broken Links**: Verify file paths in HTML
- **Video Issues**: Check Vimeo embed URLs
- **Styling Problems**: Verify CSS file paths

### **Local Testing**
```bash
# Test locally before deploying
cd deploy
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

## 📊 Monitoring & Analytics

### **Netlify Dashboard**
- **URL**: https://app.netlify.com/sites/[your-site-name]
- **Build History**: View all deployments
- **Analytics**: Basic traffic and performance data
- **Forms**: Contact form submissions (if configured)

### **Performance Monitoring**
- **Lighthouse**: Run audits for performance
- **Page Speed**: Monitor loading times
- **Mobile Testing**: Verify responsive design

## 🔐 Security & Best Practices

### **File Permissions**
- Keep sensitive files out of this folder
- Never commit API keys or credentials
- Use .gitignore for sensitive content

### **Backup Strategy**
- Git history serves as automatic backup
- All changes are version controlled
- Easy rollback to previous versions

### **Maintenance**
- Regular content updates recommended
- Monitor for broken links
- Keep dependencies updated (if any)

## 📞 Support & Resources

### **Netlify Resources**
- **Documentation**: https://docs.netlify.com/
- **Status Page**: https://www.netlifystatus.com/
- **Community**: https://community.netlify.com/

### **GitHub Repository**
- **URL**: https://github.com/donnywonny2025/SUMMER-2025-WEBSITE
- **Issues**: Report problems here
- **Wiki**: Additional documentation

---

## 🎯 Quick Reference

**To update the live site:**
1. Edit files in `deploy/` folder
2. `git add . && git commit -m "Update"`
3. `git push origin main`
4. Wait 1-2 minutes for deployment

**Current live URL:** https://jefferykerr.com

**Repository:** https://github.com/donnywonny2025/SUMMER-2025-WEBSITE

---

*This guide ensures anyone can understand and maintain the deployment process without confusion.*