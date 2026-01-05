# Firebase Configuration Guide

This guide explains how to set up Firebase for the MyShop application.

## Prerequisites

- A Google account
- Access to [Firebase Console](https://console.firebase.google.com)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `MyShop`
4. (Optional) Enable Google Analytics
5. Click **"Create project"** and wait for completion

## Step 2: Register Your Apps

### For Android App

1. In Firebase Console, click **"Android"** icon
2. Register app with:
   - **Package name**: `com.myshop.app`
   - **App nickname**: `MyShop Android`
3. Download `google-services.json` (save for later)
4. Skip "Add SDK" step (Expo handles this)
5. Click **"Continue to console"**

### For iOS App (Optional)

1. Click **"iOS"** icon
2. Register with:
   - **Bundle ID**: `com.myshop.app`
   - **App name**: `MyShop iOS`
3. Download `GoogleService-Info.plist`
4. Click **"Continue to console"**

### For Web App

1. Click **"Web"** icon (`</>`)
2. Register with:
   - **App name**: `MyShop Web`
3. Copy the config object

## Step 3: Get Your Firebase Config

1. Click the **Settings icon** (⚙️) in top-left
2. Select **"Project settings"**
3. Under **"Your apps"**, find your web app
4. Click **"Config"** to reveal credentials
5. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Add Credentials to Your App

1. Create `.env.local` file in project root:

```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Firebase credentials:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

**⚠️ IMPORTANT**: Never commit `.env.local` to git. It's in `.gitignore` by default.

## Step 5: Enable Authentication Methods

### Email/Password

1. In Firebase Console, go to **"Authentication"**
2. Click **"Sign-in method"**
3. Find **"Email/Password"**
4. Click the **edit icon** (pencil)
5. Enable **"Email/Password"**
6. Also enable **"Email link (passwordless sign-in)"** for convenience
7. Click **"Save"**

### Google Sign-In (For Web & Android)

1. Still in **"Sign-in method"**
2. Find **"Google"**
3. Click **edit icon**
4. Enable **"Google"**
5. Select your **Support email**
6. Click **"Save"**

### Phone Number (Optional)

1. Find **"Phone"** in Sign-in methods
2. Click **edit icon**
3. Enable **"Phone"**
4. Add the countries where you want to support phone auth
5. Click **"Save"**

Note: Phone authentication requires reCAPTCHA verification.

## Step 6: Configure OAuth Consent Screen (For Google Sign-In)

1. Go to **"Google Cloud Console"** (linked from Firebase)
2. Navigate to **"APIs & Services"** → **"OAuth consent screen"**
3. Select **"External"** (or "Internal" if GSuite)
4. Fill in required fields:
   - **App name**: MyShop
   - **User support email**: your-email@example.com
   - **Developer contact**: your-email@example.com
5. Save and continue

## Step 7: Create OAuth Credentials (For Web)

1. In Google Cloud Console, go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Select **"Web application"**
4. Add authorized redirect URIs:
   - `http://localhost:19006`
   - `http://localhost:19006/`
   - Your production domain (after deployment)
5. Click **"Create"**
6. Copy the **Client ID** (you may need this for advanced configs)
7. Click **"OK"**

## Step 8: Test Authentication

1. Start the development server:
```bash
npm start
```

2. Open the app on web:
```bash
npm run web
```

3. Test Sign Up:
   - Create a new account with email and password
   - Verify it appears in Firebase Console → Authentication

4. Test Sign In:
   - Sign out
   - Sign in with the credentials you just created

5. Verify in Firebase:
   - Go to Firebase Console
   - Click **"Authentication"**
   - You should see your test user in the Users list

## Firebase Security Rules (Firestore - For Future Use)

If you plan to use Firestore for future features, set these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own shop data
    match /shops/{shopId} {
      allow read, write: if request.auth.uid == resource.data.ownerId;
    }
    
    // Allow authenticated users to read/write their own catalog
    match /catalogs/{catalogId} {
      allow read, write: if request.auth.uid == resource.data.ownerId;
    }
  }
}
```

## Environment-Specific Configs

### Development

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EXPO_PUBLIC_FIREBASE_API_KEY=dev_key
```

### Production

```env
EXPO_PUBLIC_API_URL=https://api.myshop.com/api
EXPO_PUBLIC_FIREBASE_API_KEY=prod_key
```

## Troubleshooting

### Error: "Firebase App not initialized"

**Cause**: Missing Firebase configuration
**Solution**: Verify all `EXPO_PUBLIC_FIREBASE_*` variables are in `.env.local`

### Error: "auth/invalid-api-key"

**Cause**: Invalid API key
**Solution**: Copy Firebase config again from Project Settings

### Error: "CORS Policy Error"

**Cause**: Firebase domain not in OAuth consent screen
**Solution**: Add your domain to OAuth consent screen authorized URIs

### Error: "User's custom claims are missing"

**Cause**: Firebase user not properly configured
**Solution**: Delete and recreate the test user

### Google Sign-In Not Working

**Cause**: OAuth not configured properly
**Solution**: 
1. Verify OAuth consent screen is complete
2. Add OAuth client ID to your app config
3. Ensure `com.myshop.app` package name matches Firebase registration

## Firebase Console Important Pages

- **Authentication**: https://console.firebase.google.com/project/_/authentication/users
- **Firestore**: https://console.firebase.google.com/project/_/firestore
- **Storage**: https://console.firebase.google.com/project/_/storage
- **Analytics**: https://console.firebase.google.com/project/_/analytics
- **Project Settings**: https://console.firebase.google.com/project/_/settings/general

## Security Best Practices

1. ✅ Never expose API keys in code
2. ✅ Use environment variables for sensitive data
3. ✅ Enable reCAPTCHA for phone auth
4. ✅ Use Firestore security rules (once implemented)
5. ✅ Enable 2FA in your Google account
6. ✅ Regularly rotate keys
7. ✅ Monitor authentication logs
8. ✅ Set up email verification for users

## Next Steps

Once Firebase is configured:

1. Test the Sign Up/Sign In flow
2. Create test shop and catalog items
3. Verify QR code generation works
4. Set up backend API connection
5. Configure production Firebase project
6. Set up error tracking (Firebase Crashlytics)

## Support

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firebase Console Help](https://support.google.com/firebase)
- [React Native Firebase Guide](https://rnfirebase.io/)

---

**Note**: Keep your Firebase credentials secure. Treat `.env.local` as sensitive information.

