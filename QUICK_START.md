# Quick Start Guide - MyShop App Setup

## 🎯 Get Started in 5 Minutes

### Step 1: Configure Environment (1 minute)

```bash
cd MyShop/MyShopApp

# Create environment file
cp .env.example .env

# Verify .env contains:
# EXPO_PUBLIC_API_URL=https://api.soanch.com/api
```

### Step 2: Install Dependencies (2 minutes)

```bash
npm install
# or
yarn install
```

### Step 3: Start Development Server (1 minute)

```bash
npm start
# or
yarn start

# Press 'w' for web
# or scan QR code with Expo Go app (mobile)
```

### Step 4: Verify API Configuration (1 minute)

Look for this message in console:
```
🔴 API Client: Base URL = https://api.soanch.com/api
```

---

## ✅ What to Test

### Test Sign Up
1. Click "Sign Up" on home screen
2. Fill in shop details:
   - Shop Name: Test Pizza
   - Owner Name: John Doe
   - Email: john@example.com
   - Password: test123456
   - Address: 123 Main St
   - Mobile: 9876543210
3. Click "Create Shop"
4. Should redirect to Sign In

### Test Sign In
1. Enter email: john@example.com
2. Enter password: test123456
3. Click "Sign In"
4. Should see MainApp with tabs

---

## 🔧 Configuration Files

### .env File (Create in MyShopApp/)
```env
# API Configuration - All APIs hosted on api.soanch.com
EXPO_PUBLIC_API_URL=https://api.soanch.com/api

# For local development, use:
# EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

### Key Files Updated
- `src/services/api.ts` - API client configured
- `src/screens/SignInScreen.tsx` - Login implementation
- `src/screens/SignUpScreen.tsx` - Registration implementation
- `src/store/authSlice.ts` - Redux auth state
- `src/navigation/RootNavigator.tsx` - Navigation setup

---

## 📚 Documentation

### Must Read
1. **DOCUMENTATION_INDEX.md** - Overview of all docs
2. **API_CONFIGURATION_SUMMARY.md** - API setup overview
3. **QUICK_REFERENCE.md** - Code examples

### For Deep Dive
1. **AUTHENTICATION_GUIDE.md** - Complete auth flow
2. **API_REFERENCE.md** - All endpoints documented
3. **ENV_CONFIGURATION.md** - Environment setup details

---

## 🔍 Verify Setup

### Check API URL
```javascript
// In browser console
console.log(process.env.EXPO_PUBLIC_API_URL)
// Should output: https://api.soanch.com/api
```

### Check Console Logs
Look for messages starting with 🔴:
```
🔴 API Client: Base URL = https://api.soanch.com/api
🔴 SignUp: Starting shop creation...
🔴 SignIn: Attempting email/password authentication...
```

### Monitor Network Requests
Open DevTools Network tab:
- All requests should go to `api.soanch.com`
- All should use HTTPS
- Status should be 2xx or 4xx (not 5xx)

---

## 🚀 Development Commands

```bash
# Start development server
npm start

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Export for web
expo export --platform web

# Run tests
npm test

# Lint code
npm run lint
```

---

## 🆘 Common Issues

### "API calls failing"
- [ ] Check `.env` file exists in MyShopApp/
- [ ] Verify `EXPO_PUBLIC_API_URL=https://api.soanch.com/api`
- [ ] Restart Metro Bundler
- [ ] Check console for API Base URL message

### "Sign Up not working"
- [ ] Check network tab for API errors
- [ ] Verify api.soanch.com is accessible
- [ ] Check form validation (all fields required)
- [ ] Look for 400/401/500 errors in network tab

### "Sign In not working"
- [ ] Verify account was created via Sign Up
- [ ] Check credentials are correct
- [ ] Look for 401 Unauthorized in network tab
- [ ] Verify API is responding

### "Wrong API URL being used"
- [ ] Check console: `🔴 API Client: Base URL = ...`
- [ ] If showing localhost, restart Metro Bundler
- [ ] Delete node_modules and reinstall
- [ ] Clear cache: `npm start -- --reset-cache`

---

## 📊 Project Structure

```
MyShop/
├── DOCUMENTATION_INDEX.md          ← Read this first
├── API_CONFIGURATION_SUMMARY.md    ← API setup overview
├── API_REFERENCE.md                ← Complete API docs
├── AUTHENTICATION_GUIDE.md         ← Auth flow details
├── ENV_CONFIGURATION.md            ← Environment setup
├── QUICK_REFERENCE.md              ← Code examples
│
└── MyShopApp/
    ├── .env.example                ← Copy to .env
    ├── package.json
    ├── src/
    │   ├── screens/
    │   │   ├── SignInScreen.tsx     ← Login
    │   │   └── SignUpScreen.tsx     ← Register
    │   ├── services/
    │   │   └── api.ts              ← API client
    │   ├── store/
    │   │   └── authSlice.ts        ← Redux state
    │   └── navigation/
    │       └── RootNavigator.tsx   ← Navigation
    └── node_modules/
```

---

## 🎓 Learning Path

1. **First Time Setup**
   - Follow this Quick Start Guide
   - Read DOCUMENTATION_INDEX.md
   - Create .env file
   - Run app

2. **Understand Authentication**
   - Read AUTHENTICATION_GUIDE.md
   - Review SignInScreen.tsx
   - Review SignUpScreen.tsx

3. **Understand API**
   - Read API_REFERENCE.md
   - Review api.ts service
   - Test endpoints with curl/Postman

4. **Understand State Management**
   - Read about Redux in QUICK_REFERENCE.md
   - Review authSlice.ts
   - Check RootNavigator.tsx

5. **Ready to Code**
   - Use QUICK_REFERENCE.md for patterns
   - Follow existing code style
   - Add features as needed

---

## 🔐 Security Checklist

- [x] Environment variables configured
- [x] HTTPS enforced in production
- [x] JWT tokens handled securely
- [x] Passwords never logged
- [x] Error messages sanitized
- [x] API interceptors configured
- [x] 401 errors handled

---

## 📱 Testing on Different Platforms

### Web Browser
```bash
# Start and select 'w'
npm start
# Opens on http://localhost:8081
```

### iOS Simulator
```bash
# Start and select 'i'
npm start
```

### Android Emulator
```bash
# Start and select 'a'
npm start
```

### Physical Device (Expo Go)
```bash
# Start and scan QR code
npm start
```

---

## 🚀 Ready for Production?

Before deploying to production:

- [ ] Create .env file with production API URL
- [ ] Test Sign Up/Sign In flow thoroughly
- [ ] Verify API responses are correct
- [ ] Check error handling
- [ ] Test on actual devices
- [ ] Build for iOS and Android
- [ ] Test web version
- [ ] Check console for errors
- [ ] Review security settings
- [ ] Update API credentials if needed

---

## 🆘 Need Help?

### Documentation
- Check **DOCUMENTATION_INDEX.md** for all available docs
- Search for your issue in **QUICK_REFERENCE.md**
- Check **ENV_CONFIGURATION.md** for setup help

### Debugging
- Enable console logs (marked with 🔴)
- Check Network tab in DevTools
- Review Redux state in DevTools
- Check AsyncStorage contents

### Support
- Email: support@soanch.com
- API Status: https://api.soanch.com/status
- Documentation: https://api.soanch.com/docs

---

## 📝 Key Concepts

### API Host
- Production: `https://api.soanch.com/api`
- Local Dev: `http://localhost:8080/api`

### Authentication Flow
1. Sign Up: Create shop → Create user account
2. Sign In: Authenticate → Get JWT token
3. Logout: Clear token → Clear state

### State Management
- Redux for app state
- AsyncStorage for persistence
- Redux for auth state specifically

### Navigation
- AuthStack when not signed in
- MainApp when signed in
- Automatic redirect based on state

---

## ✨ Features Ready to Use

- ✅ User Registration
- ✅ User Login
- ✅ Shop Management
- ✅ Catalog Management
- ✅ QR Code Generation
- ✅ Cross-Platform Support

---

## 🎉 You're All Set!

Everything is configured and ready to go:
- ✅ API configured to use api.soanch.com
- ✅ Environment setup documented
- ✅ Authentication screens implemented
- ✅ Redux state management ready
- ✅ Navigation configured
- ✅ Complete documentation available

**Start with**:
1. Create `.env` file
2. Run `npm start`
3. Test Sign Up/Sign In flows
4. Read documentation as needed

---

**Last Updated**: January 5, 2026
**API Host**: https://api.soanch.com/api
**Status**: ✅ Ready to Go!

