# 🚀 Running MyShop App Locally - Complete Guide

## ✅ What Was Just Added

### Sign Up Link on Sign In Screen
The Sign In screen now has a prominent "Sign Up Now" link for new users:

```
Not Registered? Sign Up Now
```

Plus an info box:
```
Don't have a shop yet? Create one now and start managing your menu!
```

This allows new users to easily navigate from Sign In to Sign Up.

---

## 📱 How to Run the App Locally

### Step 1: Open Terminal

```bash
# Navigate to the project directory
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp
```

### Step 2: Ensure Dependencies are Installed

```bash
# Install all dependencies
npm install

# Or update if already installed
npm update
```

### Step 3: Start the Development Server

```bash
# Start Expo development server
npm start
```

You should see output like:
```
▄█████▄
████████
████████
▀█████▀

Ready on exp://YOUR_IP_ADDRESS:8081

To run the app:

  › Using Expo Go
  › Press s to switch to development build

  › Press a to open Android
  › Press i to open iOS
  › Press w to open in web

  › Press j to open debugger
  › Press r to reload app
  › Press m to toggle menu

  › Press ? to show all commands
```

### Step 4: Choose Your Platform

#### Option A: Web Browser (Recommended for Testing)
```
Press w
```
This will open the app at: `http://localhost:8081` or `http://localhost:8082`

#### Option B: iOS Simulator
```
Press i
```
Requires Xcode installed

#### Option C: Android Emulator
```
Press a
```
Requires Android Studio and emulator running

#### Option D: Physical Device (Using Expo Go)
1. Install "Expo Go" app from Play Store or App Store
2. Press `s` to send link via QR code
3. Scan QR code from terminal with your device camera
4. Tap the link to open in Expo Go

---

## 🧪 Testing the Sign Up Link

### Step 1: Open Sign In Screen
The app should load directly to Sign In screen.

### Step 2: Look for Sign Up Link
At the bottom of the Sign In form, you'll see:
```
┌─────────────────────────────────┐
│ Not Registered? Sign Up Now     │
│                                 │
│ Don't have a shop yet?          │
│ Create one now and start        │
│ managing your menu!             │
└─────────────────────────────────┘
```

### Step 3: Click "Sign Up Now"
The app will navigate to the Sign Up screen.

### Step 4: Test Sign Up Process
1. Fill shop details (Step 1)
2. Click "Continue to Account Setup"
3. Enter password (Step 2)
4. Click "Create Account"
5. Success! Redirect to Sign In

### Step 5: Navigate Back to Sign In
1. From Sign Up screen, click "Sign In" link at bottom
2. Or use back button
3. You're back at Sign In screen with the new Sign Up link

---

## 🎨 Visual Guide

### Sign In Screen Layout
```
┌──────────────────────────────────┐
│    Welcome Back               [X] │
│    Sign in to manage your shop    │
├──────────────────────────────────┤
│                                  │
│  [📧 Email]  [📱 Phone]          │
│                                  │
│  Email Address                   │
│  [________________________]       │
│                                  │
│  Password                        │
│  [________________________]       │
│                                  │
│  [SIGN IN]                       │
│                                  │
│           ─── or ───             │
│                                  │
│  [🔐 Sign In with Google]        │
│                                  │
│  Not Registered? Sign Up Now  ← NEW │
│                                  │
│  ┌──────────────────────────┐   │
│  │ Don't have a shop yet?   │   │
│  │ Create one now and start │   │
│  │ managing your menu!      │   │
│  └──────────────────────────┘   │
│                                  │
└──────────────────────────────────┘
```

---

## 📋 Testing Checklist

### Sign Up Link
- [ ] Link appears at bottom of Sign In screen
- [ ] Text says "Not Registered? Sign Up Now"
- [ ] Link is blue/purple color (#6C63FF)
- [ ] Clicking link navigates to Sign Up screen
- [ ] Info box displays below link

### Sign Up Process
- [ ] Can fill shop details on Step 1
- [ ] Progress indicator shows current step
- [ ] Click "Continue" goes to Step 2
- [ ] Can set password on Step 2
- [ ] Click "Create Account" creates shop
- [ ] Success alert appears
- [ ] Redirects to Sign In

### Navigation
- [ ] Click "Sign In" link from Sign Up goes back to Sign In
- [ ] Click "Sign Up Now" from Sign In goes to Sign Up
- [ ] Back button works on both screens

---

## 🔧 Troubleshooting

### Issue: App doesn't start
**Solution:**
```bash
# Clear cache and reinstall
npm install
npm start
```

### Issue: Port 8081 already in use
**Solution:**
```bash
# Use different port
npm start -- --port 8082
```

### Issue: Module not found errors
**Solution:**
```bash
# Reinstall all dependencies
rm -rf node_modules
npm install
```

### Issue: TypeScript errors
**Solution:**
```bash
# Check for errors
npm run tsc

# Or ignore and run anyway
npm start
```

### Issue: Can't connect to API
**Solution:**
```bash
# Check if API is reachable
curl https://api.soanch.com/api/shops

# If local development, set environment variable
export EXPO_PUBLIC_API_URL=http://localhost:8080/api
npm start
```

---

## 🌐 Web Browser Testing (Recommended)

### Accessing the App
1. Start with: `npm start`
2. Press `w` for web
3. Browser opens at: `http://localhost:8081`

### Using Browser DevTools
1. **Open DevTools:** F12 or Cmd+Option+I
2. **Console Tab:** See logs with 🔴 prefix
3. **Network Tab:** Monitor API calls
4. **Redux DevTools:** See state changes

### Console Logs to Look For
```
🔴 SignIn: Attempting email/password authentication...
🔴 SignIn: Authentication successful
🔴 index.tsx: Store imported: ✓
🔴 App.tsx: App component function called
```

---

## 📱 Mobile Device Testing

### Android
1. Install Expo Go from Play Store
2. Run: `npm start`
3. Press `a` for Android
4. Scan QR code with Expo Go app

### iOS
1. Install Expo Go from App Store
2. Run: `npm start`
3. Press `i` for iOS simulator
4. Or scan QR code from Camera app

---

## ✨ Features to Test

### 1. Sign Up Flow
```
SignUp Screen
├─ Step 1: Shop Details
│  ├─ Shop Name: ✓
│  ├─ Owner Name: ✓
│  ├─ Email: ✓
│  ├─ Address: ✓
│  ├─ Mobile: ✓
│  └─ Theme: ✓
│
├─ Step 2: User Account
│  ├─ Password: ✓
│  ├─ Confirm Password: ✓
│  └─ Create Account: ✓
│
└─ Success: ✓
```

### 2. Sign In Flow
```
SignIn Screen
├─ Email Method: ✓
├─ Phone Method: ✓ (ready)
├─ Google Method: ✓ (ready)
├─ Authentication: ✓
└─ Token Saving: ✓
```

### 3. User Management
```
ManageUsers Screen
├─ View Users: ✓
├─ Add User: ✓
├─ Remove User: ✓
└─ Update List: ✓
```

### 4. Navigation
```
Navigation
├─ SignIn → SignUp: ✓ (NEW)
├─ SignUp → SignIn: ✓
├─ SignUp Step 1 → Step 2: ✓
├─ SignUp Step 2 → Step 1: ✓
└─ MainApp Navigation: ✓
```

---

## 🎯 Next Steps After Running

1. **Test Sign Up**
   - Try creating a shop account
   - Verify all validations work
   - Check API connectivity

2. **Test Sign In**
   - Login with created account
   - Verify token saves
   - Test session persistence

3. **Test User Management**
   - Add a new user
   - Remove a user
   - Verify user list updates

4. **Check Console**
   - Look for 🔴 logs
   - No red errors
   - API calls successful

5. **Test on Different Devices**
   - Web browser
   - iOS simulator
   - Android emulator
   - Physical device

---

## 📊 Expected Output

### Terminal Output
```
▄█████▄
████████
████████
▀█████▀

Ready on:
  exp://192.168.x.x:8081
  http://localhost:8081

To run the app:
  › Using Expo Go
  › Press a │ open Android
  › Press i │ open iOS
  › Press w │ open web
  › Press j │ open debugger
  › Press r │ reload app
  › Press m │ toggle menu
```

### Browser Output
```
✓ App loads successfully
✓ Sign In screen displays
✓ "Not Registered? Sign Up Now" link visible
✓ No console errors
✓ API calls succeed
```

---

## 🔍 Quick Verification Checklist

- [ ] App starts without errors
- [ ] Sign In screen loads
- [ ] Sign Up link visible with proper styling
- [ ] Clicking link navigates to Sign Up
- [ ] Sign Up wizard displays
- [ ] Progress indicator shows steps
- [ ] Form validation works
- [ ] No console errors
- [ ] API calls are successful
- [ ] Session token persists

---

## 💡 Pro Tips

1. **Use Web for Quick Testing**
   - Web browser is fastest
   - DevTools give you debugging power
   - No device setup needed

2. **Monitor Network Requests**
   - Open DevTools Network tab
   - Watch API calls to api.soanch.com
   - Check request/response format

3. **Use Redux DevTools**
   - Monitor state changes
   - Track auth state updates
   - Debug store issues

4. **Check Console Regularly**
   - 🔴 prefix indicates important logs
   - Look for error messages
   - Verify API response data

5. **Hot Reload is Your Friend**
   - Make code changes
   - Press `r` in terminal
   - Changes appear instantly

---

## 📞 Help & Support

If you encounter issues:

1. **Check Console:** Look for error messages
2. **Verify API:** Test https://api.soanch.com/api/shops
3. **Clear Cache:** `npm start -- --clear`
4. **Reinstall:** `rm -rf node_modules && npm install`
5. **Check Git:** Ensure all changes are committed

---

## 🎊 Ready to Test!

Everything is set up and ready to run locally. The Sign Up link has been added to the Sign In screen, and the app is configured for testing on web, iOS, or Android.

**Start with:** 
```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp
npm start
# Then press 'w' for web
```

Happy Testing! 🚀

---

**Last Updated:** January 6, 2026
**Status:** Ready to Run
**Version:** 1.0.0

