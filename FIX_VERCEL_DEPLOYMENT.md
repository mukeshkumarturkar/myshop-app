# 🚀 FIX VERCEL DEPLOYMENT - ENVIRONMENT VARIABLES

## ❌ ERROR ENCOUNTERED

```
Error: Environment Variable "EXPO_PUBLIC_API_URL" references Secret "expo_public_api_url", which does not exist.
```

This means the environment variables referenced in `vercel.json` are not configured in Vercel dashboard.

---

## ✅ SOLUTION: Configure Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
- URL: https://vercel.com/dashboard
- Find: **my-shop-app** project
- Click: **Settings**

### Step 2: Add Environment Variables
Click: **Environment Variables**

Add each variable with these exact names:

```
Name: EXPO_PUBLIC_API_URL
Value: https://api.yourdomain.com/api
(or leave empty for now: just press Save)

Name: EXPO_PUBLIC_FIREBASE_API_KEY
Value: YOUR_FIREBASE_API_KEY

Name: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: your-project.firebaseapp.com

Name: EXPO_PUBLIC_FIREBASE_PROJECT_ID
Value: your-project-id

Name: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: your-bucket.appspot.com

Name: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 123456789

Name: EXPO_PUBLIC_FIREBASE_APP_ID
Value: 1:123456789:web:abc123
```

### Step 3: Get Actual Values

**For Firebase credentials:**
1. Go to: https://console.firebase.google.com
2. Select your project
3. Click: Settings (⚙️) → Project Settings
4. Copy values from "Your apps" → "Web app" → "firebaseConfig"

**For API URL:**
- Use your backend API endpoint
- Or leave as placeholder for now

### Step 4: Save and Redeploy
1. Click: **Save** after adding each variable
2. Go to: **Deployments**
3. Click on latest deployment
4. Click: **Redeploy**

---

## ⚠️ TEMPORARY FIX (For Testing)

If you don't have Firebase configured yet, modify `vercel.json` to make variables optional:

```json
{
  "buildCommand": "npm run vercel-build",
  "outputDirectory": "public"
}
```

This removes the env variables requirement temporarily.

---

## 🔧 UPDATE VERCEL.JSON (Recommended)

Let me update your vercel.json to handle missing env variables better:

