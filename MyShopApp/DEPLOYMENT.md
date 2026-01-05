# MyShop App - Deployment Guide

## Project Overview

MyShop is a React Native application built with Expo that works on Android, iOS, and Web. It allows shop owners to:
- Sign up and create their shop
- Sign in using email/password or OTP
- Manage their product catalog (Add, Edit, Delete items)
- View shop details and generate/share QR codes
- Track inventory and pricing

## Technology Stack

- **Frontend**: React Native + TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Authentication**: Firebase Authentication
- **API Client**: Axios
- **Build Tool**: Expo / EAS Build
- **Deployment Target**: Google Play Store (Android), App Store (iOS), Web

## Prerequisites

1. **Node.js**: v18+
2. **Expo CLI**: `npm install -g expo-cli`
3. **EAS CLI**: `npm install -g eas-cli`
4. **Firebase Project**: Created and configured
5. **Google Play Developer Account**: For Android deployment
6. **Apple Developer Account**: For iOS deployment (optional)
7. **Git**: For version control

## Initial Setup

### 1. Environment Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase and API configuration:

```dotenv
EXPO_PUBLIC_API_URL=https://api.yourdomain.com/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# ... other Firebase config values
```

### 2. Install Dependencies

```bash
cd MyShopApp
npm install --legacy-peer-deps
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication:
   - Email/Password
   - Google OAuth (for web)
   - Phone OTP (optional)
4. Get your config from Project Settings
5. Add your app (Android, iOS, Web)

### 4. Local Testing

#### Run on Web
```bash
npm run web
```

#### Run on Android Emulator
```bash
npm run android
```

#### Run on iOS Simulator (macOS only)
```bash
npm run ios
```

## Deployment to Google Play Store

### Step 1: Generate Signing Key

Create a keystore file for signing your APK/AAB:

```bash
cd MyShopApp
eas credentials
# Follow the prompts to create/manage credentials
```

Or create manually:

```bash
keytool -genkey -v -keystore my-upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

Store this file securely - you'll need it for future updates!

### Step 2: Build with EAS

First, configure your app for EAS:

```bash
eas init
```

This will prompt you to log in to Expo and create an EAS project.

Update `app.json` with your project details:

```json
{
  "expo": {
    "name": "MyShop",
    "slug": "myshop-app",
    "version": "1.0.0",
    "android": {
      "package": "com.myshop.app",
      "versionCode": 1,
      "bundleIdentifier": "com.myshop.app"
    },
    "extra": {
      "eas": {
        "projectId": "YOUR_EAS_PROJECT_ID"
      }
    }
  }
}
```

### Step 3: Build APK/AAB

```bash
# For local testing (APK)
eas build --platform android --local

# For Google Play Store (AAB - recommended)
eas build --platform android --profile production
```

### Step 4: Submit to Google Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app with name "MyShop"
3. Fill in required information:
   - App type: App
   - Category: Business
   - Rating content: Choose appropriate rating
4. Prepare store listing:
   - App description (500 chars)
   - Screenshots (2-8 images, 1280x720 or 1440x810)
   - Feature graphic (1024x500)
   - Icon (512x512, 32-bit PNG)
   - Promotional video (optional)

### Step 5: Create Release

1. Go to **Release** → **Production**
2. Create new release
3. Upload the AAB file generated from EAS Build
4. Add release notes
5. Review content rating questionnaire
6. Set pricing (Free)
7. Confirm all details
8. Submit for review

### Step 6: App Review Process

Google Play typically reviews apps within 2-3 hours. You'll receive:
- **Approved**: App goes live
- **Rejected**: Email explaining issues to fix

Common rejection reasons:
- Missing privacy policy
- Inappropriate content
- Broken functionality
- Permission misuse

## Version Updates

When updating your app:

1. Increment version in `package.json` and `app.json`:
   ```json
   "version": "1.0.1"
   ```

2. Increment `versionCode` for Android:
   ```json
   "versionCode": 2
   ```

3. Build and submit again:
   ```bash
   eas build --platform android --profile production
   ```

## Privacy & Permissions

### Privacy Policy

Create a privacy policy (required):
- Use [PrivacyPolicyGenerator](https://www.privacypolicygenerator.info/)
- Host on your domain or GitHub Pages
- Link in app and Play Store listing

### Required Permissions

The app requests:
- **Internet**: For API calls
- **File System**: For QR code sharing
- **Camera**: (optional, for future features)

All are minimal and justified for core functionality.

## Security Considerations

1. **API Keys**: Never commit Firebase keys to git
2. **Signing Keys**: Store `.jks` files securely (encrypted backup)
3. **Tokens**: Use Secure Storage for auth tokens
4. **API Endpoint**: Use HTTPS only
5. **Environment Variables**: Use `.env.local` (gitignored)

## Troubleshooting

### Build Issues

**Issue**: "Build failed: Unable to resolve module"
```bash
npm install --legacy-peer-deps
npm start -- --clear
```

**Issue**: "Firebase initialization error"
- Verify `EXPO_PUBLIC_FIREBASE_*` env vars
- Check Firebase project is enabled

**Issue**: "Signing key not found"
```bash
eas credentials --platform android
```

### Runtime Issues

**Issue**: QR code not displaying
- Check API response includes `qr_code` field
- Verify `expo-sharing` is installed

**Issue**: API calls failing
- Check `EXPO_PUBLIC_API_URL` is correct
- Verify backend server is running
- Check network permissions

## Testing Checklist

Before deploying:

- [ ] Sign up flow works (creates shop)
- [ ] Sign in with email works
- [ ] Shop details display correctly
- [ ] Catalog CRUD operations work
- [ ] QR code generates and displays
- [ ] QR code can be shared
- [ ] Theme colors apply correctly
- [ ] No console errors
- [ ] App works offline (basic caching)
- [ ] App tested on real Android device

## Post-Launch

1. Monitor crash reports in Google Play Console
2. Track user metrics and engagement
3. Gather user feedback through Play Store reviews
4. Plan v1.1 with improvements:
   - Phone OTP authentication
   - Image uploads for products
   - Analytics dashboard
   - Push notifications

## Useful Commands

```bash
# Start development server
npm start

# Build for specific platform
eas build --platform android
eas build --platform ios
eas build --platform web

# Submit to Play Store
eas submit --platform android

# Check EAS build status
eas build:list

# View logs
eas build:view <build_id>

# Clear cache and rebuild
npm start -- --clear
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [Expo Community Forum](https://forums.expo.dev/)
3. Check [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)
4. File an issue on GitHub

---

**Last Updated**: January 2026  
**Maintained By**: Development Team

