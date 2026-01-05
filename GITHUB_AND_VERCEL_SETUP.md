# 🚀 GitHub & Vercel Deployment Guide

## Step 1: Create GitHub Repository

### 1.1 Create Repository on GitHub
1. Go to https://github.com/new
2. **Repository name**: `MyShop` or `myshop-app`
3. **Description**: "React Native shop management app with cross-platform support"
4. **Visibility**: Public (for Vercel free tier) or Private
5. Click **Create repository**

### 1.2 Add Remote and Push Code

```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop

# Add remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/myshop-app.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace:**
- `YOUR_USERNAME` with your GitHub username
- `REPO_NAME` with your repository name

### 1.3 Verify Push
```bash
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/myshop-app.git (fetch)
# origin  https://github.com/YOUR_USERNAME/myshop-app.git (push)
```

---

## Step 2: Prepare for Vercel Deployment

### 2.1 Update package.json for Web Deployment

The app is built with Expo, which supports web. However, we need to configure it properly for Vercel.

Add this build script to `MyShopApp/package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "web": "expo start --web",
    "build": "expo export --platform web",
    "vercel-build": "expo export --platform web --output-dir public"
  }
}
```

### 2.2 Create Vercel Configuration

Create `MyShopApp/vercel.json`:

```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "public",
  "env": {
    "EXPO_PUBLIC_API_URL": "@expo_public_api_url",
    "EXPO_PUBLIC_FIREBASE_API_KEY": "@expo_public_firebase_api_key",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN": "@expo_public_firebase_auth_domain",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID": "@expo_public_firebase_project_id",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET": "@expo_public_firebase_storage_bucket",
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "@expo_public_firebase_messaging_sender_id",
    "EXPO_PUBLIC_FIREBASE_APP_ID": "@expo_public_firebase_app_id"
  },
  "functions": {
    "api/**": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

### 2.3 Create .vercelignore

Create `MyShopApp/.vercelignore`:

```
node_modules
.env
.env.local
.env.*.local
.git
.gitignore
README.md
npm-debug.log*
.DS_Store
```

---

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
# Opens browser, login with GitHub account
```

### 3.3 Deploy from GitHub (Recommended)

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository** and select your GitHub repo
4. Configure project:
   - **Framework**: Expo (or "Other")
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `public`
5. Add Environment Variables (see next section)
6. Click **Deploy**

**Option B: Via CLI**

```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp
vercel --prod
```

---

## Step 4: Configure Environment Variables in Vercel

### In Vercel Dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables:

```
EXPO_PUBLIC_API_URL = http://localhost:8080/api  (or your API URL)
EXPO_PUBLIC_FIREBASE_API_KEY = YOUR_FIREBASE_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN = YOUR_FIREBASE_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID = YOUR_FIREBASE_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET = YOUR_FIREBASE_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = YOUR_FIREBASE_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID = YOUR_FIREBASE_APP_ID
```

3. Click **Save**
4. Trigger a new deployment

---

## Step 5: Enable GitHub Integration

### Automatic Deployments
1. In Vercel Dashboard → **Settings** → **Git**
2. Enable:
   - **Deploy on Push** - Auto deploy on git push
   - **Comments on PRs** - Show deployment status
   - **Preview Deployments** - Deploy pull requests

3. Every push to `main` will automatically deploy!

---

## Complete Instructions Summary

### Push to GitHub
```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop

# Configure git (if not done)
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/myshop-app.git

# Push
git push -u origin main
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project folder
cd MyShopApp
vercel --prod
```

### Or Use GitHub Integration
1. Create GitHub repo
2. Push code
3. Go to vercel.com/new
4. Import GitHub repo
5. Add environment variables
6. Deploy!

---

## 🚀 After Deployment

### Access Your App
- **URL**: `https://myshop.vercel.app` (or your custom domain)
- Share the link for testing

### Monitor Deployments
- Vercel Dashboard shows all deployments
- View logs in **Deployments** tab
- Roll back if needed

### Update and Redeploy
```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically redeploys!
# Or manually trigger in Vercel Dashboard
```

---

## ⚠️ Important Notes

### Environment Variables
- **Never commit** `.env.local` - it's in `.gitignore`
- **Always use** Vercel environment variables for secrets
- Firebase credentials are safe (they're restricted by domain)

### API Connection
- Update `EXPO_PUBLIC_API_URL` to your backend API
- Backend must have CORS enabled
- Test API calls before deploying

### Vercel Limitations
- Build time limit: 45 minutes (usually takes 5-10 min)
- Storage: Stateless (no file persistence)
- Functions: 10 concurrent invocations
- For production, may need paid plan

### Web vs Native
- **Web on Vercel**: Works perfectly
- **Android/iOS**: Requires Play Store/App Store deployment
- Test web first, then mobile stores

---

## 🎯 Next Steps

1. **Create GitHub Repository** (5 min)
2. **Push Your Code** (2 min)
3. **Deploy to Vercel** (5 min)
4. **Test Web Version** (20 min)
5. **Fix Any Issues** (varies)
6. **Proceed to Play Store** (when ready)

---

## 📞 Helpful Links

- GitHub: https://github.com/new
- Vercel: https://vercel.com
- Vercel Docs: https://vercel.com/docs
- Expo Web: https://docs.expo.dev/workflow/web/

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Vercel project created
- [ ] Environment variables added
- [ ] Firebase credentials set
- [ ] Build successful
- [ ] Web app accessible
- [ ] Features working
- [ ] Ready for Play Store deployment

---

**Happy deploying! 🚀**

