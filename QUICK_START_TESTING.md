# Quick Start Guide - Testing & Deployment

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- Git configured
- API server running (https://api.soanch.com/api)

### Installation

```bash
# Navigate to project
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp

# Install dependencies
npm install

# Ensure all packages are updated
npm update
```

---

## 🧪 Testing the App Locally

### Start Development Server

```bash
# Start Metro bundler
npm start

# Choose platform:
# w - Web browser (http://localhost:8081 or 8082)
# a - Android
# i - iOS simulator
```

### Test Sign Up Flow

1. **Open app in web browser** (http://localhost:8081)
2. **Navigate to Sign Up**
3. **Fill Shop Details (Step 1):**
   - Shop Name: `Test Pizza Place`
   - Owner Name: `Test Owner`
   - Email: `test@testshop.com`
   - Address: `123 Test Street, Test City`
   - Mobile Country Code: `91`
   - Mobile Number: `9876543210`
   - Menu: `Italian pizza and pasta`
   - Look & Feel: `Modern restaurant style`

4. **Click "Continue to Account Setup"**
5. **Fill User Details (Step 2):**
   - Password: `TestPass@123`
   - Confirm: `TestPass@123`

6. **Click "Create Account"**
7. **Expect:** Success alert, redirect to Sign In

### Test Sign In Flow

1. **On Sign In Screen**
2. **Ensure "Email & Password" tab is selected**
3. **Enter credentials:**
   - Email: `test@testshop.com`
   - Password: `TestPass@123`

4. **Click "Sign In"**
5. **Expect:** Loading spinner, success alert, redirect to MainApp

### Test User Management

1. **After successful login, navigate to Manage Users**
2. **Should see owner account listed with 👑 badge**
3. **Click "+ Add New User"**
4. **Enter new user details:**
   - Country Code: `91`
   - Mobile Number: `9999999999`
   - Password: `StaffPass@123`
   - Confirm: `StaffPass@123`

5. **Click "Create User"**
6. **Expect:** New user appears in list, success message

### Test Session Persistence

1. **While logged in, close app completely**
2. **Reopen app in browser**
3. **Expect:** User still logged in (token persisted)

---

## 🔍 Debugging & Logs

### Console Logs to Look For

**Sign Up Success:**
```
🔴 SignUp: Starting shop creation...
🔴 SignUp: Shop created successfully: {shopId}
🔴 SignUp: Creating user account for shop: {shopId}
🔴 SignUp: User account created successfully
```

**Sign In Success:**
```
🔴 SignIn: Attempting email/password authentication...
🔴 SignIn: Authentication successful
```

### Check Browser Console

1. **Open DevTools:** F12 or Cmd+Option+I
2. **Go to Console tab**
3. **Look for 🔴 prefixed logs**
4. **Check for any red errors**

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "API Base URL not found" | Environment variable not set | Set `EXPO_PUBLIC_API_URL` |
| "Cannot connect to API" | Server not running | Verify https://api.soanch.com/api |
| "Token not saving" | AsyncStorage issue | Clear app data and retry |
| "Form validation fails" | Invalid input data | Check field requirements |
| "Navigation error" | Screen not registered | Check RootNavigator.tsx |

---

## 📱 Testing on Physical Devices

### Android Phone

```bash
# Start server
npm start

# Select "a" for Android
# Scan QR code with Expo Go app
# Or use: expo send -s your-email@example.com
```

### iOS Phone

```bash
# Start server
npm start

# Select "i" for iOS simulator
# Or scan QR code with Camera app
```

---

## 🌐 Web Deployment (Vercel)

### Prerequisites for Vercel Deployment
- GitHub account with repository
- Vercel account (free)
- Project pushed to GitHub

### Deployment Steps

1. **Push to GitHub:**
```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop
git add -A
git commit -m "Ready for deployment"
git push origin main
```

2. **Link to Vercel:**
```bash
cd MyShopApp
vercel --prod
```

3. **Configure Environment Variables:**
   - Set `EXPO_PUBLIC_API_URL` = `https://api.soanch.com/api`
   - Save and redeploy

4. **Access deployed app:**
   - URL will be provided by Vercel
   - Example: `https://myshop.vercel.app`

### Verify Deployment

1. **Open deployment URL**
2. **Test Sign Up flow**
3. **Test Sign In flow**
4. **Check browser console for errors**

---

## 📦 Building for Google Play Store

### Prerequisites
- Android Studio installed
- JDK 11 or higher
- Android SDK configured
- Google Play Console account
- Signing key generated

### Build Steps

1. **Build APK/AAB:**
```bash
cd MyShopApp

# Build APK (for testing)
eas build --platform android --local

# Build AAB (for Play Store)
eas build --platform android --local
```

2. **Generate Signing Key:**
```bash
eas credentials
# Follow prompts to create signing key
```

3. **Upload to Play Store:**
   - Go to Google Play Console
   - Create new app
   - Upload AAB file
   - Fill store listing details
   - Submit for review

### Required Play Store Information

**App Title:** MyShop
**Description:** Manage your shop menu and QR codes
**Category:** Business
**Content Rating:** Appropriate for all ages
**Screenshots:** 4-8 images required
**Icon:** 512x512 PNG
**Feature Graphic:** 1024x500 PNG

---

## 🍎 Building for iOS App Store

### Prerequisites
- macOS required
- Xcode 12+
- Apple Developer account
- Signing certificates

### Build Steps

1. **Build IPA:**
```bash
cd MyShopApp

# Build for App Store
eas build --platform ios
```

2. **Generate Signing Certificate:**
```bash
eas credentials
# Follow prompts for iOS
```

3. **Upload to App Store:**
   - Go to App Store Connect
   - Create new app
   - Upload IPA file
   - Fill app information
   - Submit for review

### Required App Store Information

**App Name:** MyShop
**Description:** Similar to Play Store
**Category:** Business
**Rating:** Fill content rating form
**Screenshots:** 2-5 sets required
**Icon:** 1024x1024 PNG
**Category:** Business

---

## 🔐 Pre-Launch Security Checklist

- [ ] No hardcoded credentials in code
- [ ] Environment variables configured
- [ ] API URL pointing to production
- [ ] HTTPS enabled everywhere
- [ ] Tokens stored securely
- [ ] Passwords never logged
- [ ] Error messages user-friendly
- [ ] Input validation working
- [ ] SQL injection prevention
- [ ] CORS properly configured

---

## 📊 Performance Optimization

### Before Deployment

1. **Bundle Size Check:**
```bash
npm run build
# Check output size
```

2. **Performance Testing:**
   - Sign up: < 2 seconds
   - Sign in: < 1 second
   - Add user: < 1 second

3. **Memory Leak Check:**
   - Monitor DevTools
   - Look for increasing memory
   - Close unused connections

### Optimization Tips
- Minimize bundle size
- Use code splitting
- Lazy load screens
- Optimize images
- Cache API responses

---

## 🚨 Monitoring & Support

### After Deployment

1. **Monitor Errors:**
   - Check Vercel dashboard
   - Monitor Play Store console
   - Review user feedback

2. **Collect Metrics:**
   - User sign-ups
   - Login success rate
   - Error rates
   - Performance metrics

3. **User Support:**
   - Email support: support@example.com
   - In-app help
   - FAQ documentation

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 6, 2026 | Initial release with auth system |
| 1.0.1 | - | Bug fixes (if needed) |
| 1.1.0 | - | OTP integration |
| 1.2.0 | - | Google Sign-In |

---

## 🎯 Success Criteria

✅ Sign up creates shop and user account
✅ Sign in authenticates successfully
✅ Token persists across sessions
✅ Users can be added/managed
✅ No console errors
✅ Forms validate correctly
✅ API calls complete in <2 seconds
✅ UI responsive on all devices
✅ Deployment successful
✅ User feedback positive

---

## 📞 Support & Resources

- **API Docs:** https://api.soanch.com
- **Expo Docs:** https://docs.expo.dev
- **React Native:** https://reactnative.dev
- **Redux:** https://redux.js.org
- **TypeScript:** https://www.typescriptlang.org

---

## ✅ Deployment Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Proper error handling
- [ ] All tests passing
- [ ] Code review completed

### Testing
- [ ] Sign up tested
- [ ] Sign in tested
- [ ] User management tested
- [ ] Session persistence verified
- [ ] Mobile tested
- [ ] Web tested

### Security
- [ ] Credentials secured
- [ ] API keys configured
- [ ] HTTPS enabled
- [ ] Input validation works
- [ ] No sensitive data logged

### Deployment
- [ ] Code pushed to GitHub
- [ ] Environment variables set
- [ ] Build successful
- [ ] Deployment verified
- [ ] Monitoring setup

### Post-Deployment
- [ ] User feedback monitored
- [ ] Error tracking active
- [ ] Performance monitored
- [ ] Support plan ready

---

**Ready to Deploy! 🚀**

All systems are go. Test locally, verify on Vercel, then launch on app stores!

---

**Version:** 1.0.0
**Last Updated:** January 6, 2026
**Status:** Ready for Testing & Deployment

