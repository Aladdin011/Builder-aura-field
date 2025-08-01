# 🚀 Quick Deployment Guide - JD Marc Construction

## ❗ Build Folder Missing in Download?

If you downloaded the project zip and the `dist/` build folder is missing, this is normal! The build folder is not included in the source code repository. You need to generate it yourself.

## 🔧 How to Get the Build Folder

### Option 1: Simple Build (Recommended)
```bash
# 1. Open terminal in the project folder
# 2. Install dependencies
npm install

# 3. Generate the build folder
npm run build
```

After running these commands, you'll find the `dist/` folder with all your production files!

### Option 2: Complete Build with Package Info
```bash
# This creates the build AND generates deployment instructions
npm run build:package
```

This will create:
- ✅ `dist/` folder with production files
- 📄 `build-info.json` with build statistics  
- 📋 `DEPLOYMENT_READY.md` with deployment instructions

## 📁 What You'll Get in the `dist/` Folder

```
dist/
├── index.html              # Main app file
├── favicon.ico             # Site icon
���── robots.txt              # SEO file
├── placeholder.svg         # Image assets
├── assets/                 # Optimized CSS & JS
│   ├── index-[hash].css    # Compiled styles (~157KB)
│   └── index-[hash].js     # App bundle (~1.9MB)
└── images/                 # Image assets
    └── placeholder.jpg
```

## 🌐 Deployment Options

### 1. Drag & Drop Hosting (Easiest)
- **Netlify**: Just drag the `dist/` folder to netlify.com
- **Vercel**: Upload via vercel.com dashboard
- **Surge.sh**: `npm install -g surge && surge dist/`

### 2. Traditional Web Hosting
1. Upload everything from `dist/` to your web server
2. ⚠️ **Important**: Configure your server to serve `index.html` for all routes

### 3. GitHub Pages
```bash
# Install gh-pages package
npm install -g gh-pages

# Deploy to GitHub Pages
gh-pages -d dist
```

## ⚙️ Server Configuration (IMPORTANT!)

Your web server MUST be configured for Single Page Application (SPA) routing:

### Netlify (_redirects file)
Create `dist/_redirects`:
```
/*    /index.html   200
```

### Apache (.htaccess file)
Create `dist/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## ✅ Deployment Checklist

After deployment, verify:
- [ ] Homepage loads correctly
- [ ] Navigation works (About, Services, Projects, Contact)
- [ ] Contact form functions properly
- [ ] Responsive design works on mobile
- [ ] All images and assets load
- [ ] HTTPS is enabled

## 🆘 Troubleshooting

### "Page Not Found" on Direct Links
**Problem**: Visiting `/about` directly shows 404  
**Solution**: Configure SPA routing (see server configuration above)

### "White Screen" or Blank Page
**Problem**: App not loading  
**Solution**: Check browser console for errors, verify server configuration

### Assets Not Loading
**Problem**: CSS/JS files return 404  
**Solution**: Ensure all files from `dist/` are uploaded, check file paths

## 📞 Need Help?

1. Check the browser console for error messages
2. Verify your server supports SPA routing
3. Ensure all files from `dist/` are uploaded correctly
4. Test locally first with `npm run preview`

---

**🎯 Remember**: Always run `npm run build` after downloading the project to generate the `dist/` folder!
