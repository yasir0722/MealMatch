# 🚀 GitHub Pages Deployment Guide

## Your Site URL
**https://yasir0722.github.io/MealMatch/**

## What's Been Configured

### 1. ✅ Vite Configuration (`vite.config.js`)
```javascript
base: '/MealMatch/' // GitHub Pages base path
build: {
  outDir: 'docs', // GitHub Pages uses /docs folder
  emptyOutDir: true
}
```

### 2. ✅ Router Configuration (`src/router/index.js`)
Changed from `createWebHistory` to `createWebHashHistory` for GitHub Pages compatibility.

### 3. ✅ Package.json Scripts
```json
"predeploy": "npm run build",
"deploy": "npm run build"
```

### 4. ✅ GitHub Pages Files
- `.nojekyll` - Prevents Jekyll processing
- `404.html` - Handles SPA routing

## 📋 Deployment Steps

### Step 1: Build the Project
```bash
npm run build
```
This creates the `/docs` folder with your production-ready app.

### Step 2: Commit and Push to GitHub
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

### Step 3: Configure GitHub Pages Settings
1. Go to your GitHub repository: **https://github.com/yasir0722/MealMatch**
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select:
   - **Branch:** `main`
   - **Folder:** `/docs`
5. Click **Save**

### Step 4: Wait for Deployment
- GitHub will automatically build and deploy your site
- Check the **Actions** tab to see deployment progress
- Usually takes 1-2 minutes

### Step 5: Visit Your Site
**https://yasir0722.github.io/MealMatch/**

## 🔄 How to Update Your Site

Every time you want to update your deployed site:

```bash
# 1. Make your changes to the code
# 2. Build the production version
npm run build

# 3. Commit and push
git add .
git commit -m "Update site"
git push origin main

# 4. GitHub Pages will automatically redeploy
```

## ⚠️ Important Notes

### Backend API Limitation
The backend scraper (`server/index.js`) **cannot run on GitHub Pages** because:
- GitHub Pages only serves static files
- It doesn't support Node.js server execution
- No backend API endpoints

### Solutions:

#### Option 1: Use Sample Data (Recommended for Demo)
The app will automatically use sample/fallback recipes when the API is unavailable.

#### Option 2: Deploy Backend Separately
Deploy the backend to:
- **Vercel**: https://vercel.com (Free tier available)
- **Heroku**: https://heroku.com (Free tier available)
- **Render**: https://render.com (Free tier available)
- **Railway**: https://railway.app (Free tier available)

Then update the API endpoint in your code to point to the deployed backend.

#### Option 3: Use Vercel for Full Stack
Deploy the entire app (frontend + backend) to Vercel:
```bash
npm install -g vercel
vercel
```

### What Works on GitHub Pages:
✅ Vue.js frontend
✅ Client-side routing
✅ Ingredient management (localStorage)
✅ Recipe display
✅ Beautiful UI/UX
✅ SweetAlert2 notifications

### What Doesn't Work:
❌ Backend API (`/api/recipes`)
❌ Web scraping functionality
❌ Real-time recipe fetching from Cookpad

## 🎨 Current Setup Status

Your site is configured to work perfectly as a **static demo** with:
- Sample recipes
- Full ingredient management
- Recipe matching algorithm
- Beautiful interface

## 📱 Testing Locally After Build

To test the production build locally:
```bash
npm run preview
```

This serves the `/docs` folder at http://localhost:4173

## 🔧 Troubleshooting

### Issue: Blank page after deployment
**Solution:** Make sure the `base` path in `vite.config.js` matches your repo name.

### Issue: Routes not working (404 errors)
**Solution:** Hash routing is already configured. URLs will use `#` (e.g., `/#/recipes`)

### Issue: Images not loading
**Solution:** Use absolute URLs or ensure images are in the `/public` folder.

### Issue: CSS not applied
**Solution:** Build again with `npm run build` and verify the `/docs` folder is committed.

## 📊 Deployment Checklist

- [x] Configure vite.config.js with base path
- [x] Change router to hash history mode
- [x] Add .nojekyll file
- [x] Add 404.html for SPA routing
- [x] Update .gitignore to allow /docs folder
- [x] Add build scripts to package.json

## 🎯 Next Steps

1. **Build the project:** `npm run build`
2. **Commit to GitHub:** `git add . && git commit -m "Deploy" && git push`
3. **Configure GitHub Pages:** Settings > Pages > Source: main branch, /docs folder
4. **Wait 1-2 minutes** for deployment
5. **Visit:** https://yasir0722.github.io/MealMatch/

Your MealMatch app is ready to be deployed! 🎉
