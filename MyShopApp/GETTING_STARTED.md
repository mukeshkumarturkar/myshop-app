# Getting Started with MyShop App

This guide will help you get the MyShop app up and running in 5 minutes.

## 🎯 What We've Built

A complete React Native app for shop owners to:
- Create their shop (Sign Up)
- Log back in (Sign In)
- Manage product catalog (Add, Edit, Delete)
- View shop details and generate QR codes
- Works on **Android**, **iOS**, and **Web**

## ⚡ 5-Minute Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- A Google account (for Firebase)

### Step 1: Navigate to Project (1 min)

```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp
```

### Step 2: Install Dependencies (2 min)

```bash
npm install --legacy-peer-deps
```

### Step 3: Setup Firebase (1 min)

For now, copy example env file:
```bash
cp .env.example .env.local
```

**Note**: You'll need to add real Firebase credentials later (see step 4)

### Step 4: Run on Web (1 min)

```bash
npm start
npm run web
```

Open http://localhost:19006 in your browser!

---

## 🔐 Adding Firebase Credentials (5-10 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** → name it `MyShop`
3. Wait for creation to complete

### Step 2: Get Your Config

1. Click **Settings icon** (⚙️) → **Project Settings**
2. Under **"Your apps"**, find your web app
3. Click **"Config"** button
4. Copy the config object

### Step 3: Add to .env.local

Edit `.env.local` and add:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=myshop-xxx.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=myshop-xxx
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=myshop-xxx.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4: Enable Authentication

1. In Firebase Console → **Authentication**
2. Click **Sign-in method**
3. Enable **Email/Password**
4. Click **Save**

### Step 5: Restart App

```bash
npm start
# Press 'w' for web
```

---

## 📱 Testing the App

### Sign Up Flow

1. Click **"Sign Up"** tab
2. Fill in form:
   - Shop Name: "Pizza Palace"
   - Owner Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Address: "123 Main St"
   - Mobile: "9876543210"
3. Click **"Create Shop"**
4. ✅ Shop created!

### Sign In Flow

1. Click **"Sign In"** tab
2. Enter your email and password
3. Click **"Sign In"**
4. ✅ Logged in!

### Manage Shop

1. In **"My Shop"** tab
2. See all your shop details
3. Click **"Generate QR Code"** (if backend is running)
4. Click **"Share QR Code"** (on mobile)

### Add Catalog Items

1. Go to **"Catalog"** tab
2. Click **+** button (bottom-right)
3. Fill in item details:
   - Name: "Margherita Pizza"
   - Category: "Pizzas"
   - Price: "299"
   - Description: "Fresh mozarella pizza"
4. Click **"Create Item"**
5. ✅ Item added!

### Edit/Delete Items

1. Click item in catalog list
2. Click **"Edit"** to modify
3. Click **"Delete"** to remove
4. Confirm deletion

---

## 🖥️ Running on Different Platforms

### Web (Already Running)

```bash
npm run web
```

### Android

**Option 1: Use Expo Go (Fastest)**
```bash
npm start
# Scan QR code with Expo Go app (from Google Play)
```

**Option 2: Use Android Emulator**
```bash
npm run android
# Requires Android Studio emulator
```

### iOS (macOS Only)

**Option 1: Use Expo Go**
```bash
npm start
# Scan QR code with Expo Go app
```

**Option 2: Use iOS Simulator**
```bash
npm run ios
# Requires Xcode
```

---

## 🚀 Deploy to Google Play Store

### Step 1: Initialize EAS

```bash
eas init
# Follow the prompts
# Login with Expo account
```

### Step 2: Build

```bash
eas build --platform android --profile production
```

This creates an App Bundle (.aab) file ready for Play Store.

### Step 3: Create Play Store Listing

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app: "MyShop"
3. Fill in details:
   - Description
   - Screenshots
   - Privacy policy link

### Step 4: Submit Build

1. In Play Console → **Release** → **Production**
2. Upload the .aab file from EAS Build
3. Review and submit
4. ✅ App under review!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed steps.

---

## 🐛 Troubleshooting

### "Cannot find module" Error

```bash
npm install --legacy-peer-deps
npm start -- --clear
```

### Firebase Not Initialized

- Check all `EXPO_PUBLIC_FIREBASE_*` variables in `.env.local`
- Verify Firebase project is created
- Enable Email/Password in Firebase Authentication

### API Connection Failed

- Make sure backend server is running on `http://localhost:8080`
- Check `EXPO_PUBLIC_API_URL` in `.env.local`
- Verify network connectivity

### App Won't Start

```bash
# Clear all caches
npm cache clean --force
rm -rf node_modules
npm install --legacy-peer-deps

# Clear Expo cache
npm start -- --clear
```

---

## 📁 Project Structure

```
MyShopApp/
├── src/
│   ├── screens/          # App screens
│   ├── components/       # Reusable components
│   ├── services/         # API calls
│   ├── store/            # Redux state
│   ├── types/            # TypeScript types
│   ├── config/           # Firebase config
│   └── navigation/       # Navigation setup
├── App.tsx               # Main app component
├── index.tsx             # Entry point
├── app.json              # Expo config
├── .env.example          # Environment template
├── .env.local            # Your credentials (git-ignored)
├── DEPLOYMENT.md         # Deployment guide
├── FIREBASE_SETUP.md     # Firebase guide
└── README.md             # Full documentation
```

---

## 🎨 Key Screens

1. **Sign Up** - Create shop account
2. **Sign In** - Login to existing account
3. **My Shop** - View shop details, generate QR code
4. **Edit Shop** - Modify shop information
5. **Catalog** - List all products
6. **Add/Edit Item** - Create or modify products

---

## 🔐 Security Notes

✅ Never commit `.env.local` (it's in `.gitignore`)  
✅ Keep Firebase credentials secret  
✅ Don't share your signing key (.jks file)  
✅ Use HTTPS for all API calls  
✅ Enable 2FA on your Google account  

---

## 📚 Next Steps

1. **✅ Already Done**: Project setup, all screens, Firebase integration
2. **→ Now**: Add your Firebase credentials and test locally
3. **→ Next**: Test on real device with Expo Go
4. **→ Then**: Build and deploy to Play Store

---

## 💡 Useful Commands

```bash
# Start dev server
npm start

# Run on web
npm run web

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android

# View build status
eas build:list

# Clear cache
npm start -- --clear
```

---

## 📞 Need Help?

1. **Firebase Issues?** → See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
2. **Deployment Issues?** → See [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **General Info?** → See [README.md](./README.md)
4. **Implementation Details?** → See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## ✨ What's Included

- ✅ Sign Up/Sign In screens
- ✅ Shop management (create, edit, delete)
- ✅ Catalog management (CRUD operations)
- ✅ QR code generation
- ✅ Firebase authentication
- ✅ Redux state management
- ✅ Full TypeScript support
- ✅ Responsive UI
- ✅ Works on Android, iOS, Web
- ✅ Ready for Play Store deployment

---

## 🎉 You're All Set!

Your MyShop app is ready to:
- Run locally for testing
- Deploy to all platforms
- Scale to thousands of users

**Happy coding!** 🚀

---

**Questions?** Check the full documentation in this folder!

