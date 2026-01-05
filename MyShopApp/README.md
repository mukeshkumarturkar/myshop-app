# MyShop - Multi-Platform Shop Management App

A modern React Native application for shop owners to manage their catalogs, generate QR codes, and sell online. Built with Expo for seamless deployment across Android, iOS, and Web.

![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)
![Expo](https://img.shields.io/badge/Expo-54-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.8-red)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-1.9-764ABC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication
- Email/Password registration and login
- Google OAuth integration
- Phone OTP support (Firebase)
- Secure token storage using Expo SecureStore

### 🏪 Shop Management
- Create and edit shop details
- Customize shop theme (colors, look & feel)
- View all shop information
- Mobile number and address management

### 📦 Catalog Management
- Add new products/items
- Edit existing catalog items
- Delete items
- Set pricing with discounts
- Manage inventory (quantity, reorder level)
- Track item availability and time slots
- Category-based organization
- Search functionality

### 📱 QR Code Features
- Generate QR codes for shop menus
- Display QR code in app
- Share QR codes via messaging/email
- QR code points to web menu

### 🎨 User Interface
- Beautiful, intuitive design
- Dark mode support ready
- Responsive layout for all screen sizes
- Bottom tab navigation
- Smooth transitions and animations

## 📋 System Requirements

- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Expo CLI**: Latest version
- **React Native**: 0.74.5
- **React**: 18.3.1

### Platform Requirements

**Android**:
- Android 5.0 (API level 21) or higher
- Google Play Services

**iOS**:
- iOS 12.0 or higher
- Apple device (for testing)

**Web**:
- Modern browser (Chrome, Firefox, Safari, Edge)
- No special requirements

## 🚀 Quick Start

### 1. Clone the Repository

```bash
cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase credentials:

```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Start Development Server

```bash
npm start
```

### 5. Run on Device/Emulator

**Web**:
```bash
npm run web
```

**Android**:
```bash
npm run android
```

**iOS**:
```bash
npm run ios
```

## 📁 Project Structure

```
MyShopApp/
├── src/
│   ├── screens/           # Screen components
│   │   ├── SignUpScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   ├── ManageShopScreen.tsx
│   │   ├── CatalogListScreen.tsx
│   │   ├── CatalogDetailScreen.tsx
│   │   └── EditShopScreen.tsx
│   ├── components/        # Reusable components
│   ├── services/          # API client and services
│   │   └── api.ts         # Axios API wrapper
│   ├── store/             # Redux store
│   │   ├── index.ts
│   │   ├── authSlice.ts
│   │   ├── shopSlice.ts
│   │   └── catalogSlice.ts
│   ├── navigation/        # Navigation configuration
│   │   └── RootNavigator.tsx
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── config/            # Configuration files
│   │   └── firebase.ts
│   └── utils/             # Utility functions
├── app.json               # Expo configuration
├── App.tsx                # Main App component
├── index.tsx              # Entry point with Redux Provider
├── package.json
├── tsconfig.json
├── DEPLOYMENT.md          # Deployment guide
└── .env.example           # Environment variables template
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication methods:
   - Email/Password
   - Google Sign-In
3. Copy credentials to `.env.local`
4. Enable Firestore (optional for future features)

### API Backend

The app communicates with a backend API. Ensure your backend:
- Runs on `EXPO_PUBLIC_API_URL`
- Implements all endpoints from `openapi.yaml`
- Returns proper CORS headers
- Uses Bearer token authentication

## 📚 API Integration

All API calls are handled through `src/services/api.ts`:

```typescript
import { apiClient } from '../services/api';

// Create a shop
const shop = await apiClient.createShop({
  name: "Pizza Palace",
  owner: "John Doe",
  address: "123 Main St",
  // ... other fields
});

// Get catalogs
const catalogs = await apiClient.getCatalogsByShopId(shopId);

// Generate QR code
const qrCode = await apiClient.generateQRCode(shopId);
```

## 🎯 Key Screens

### Sign Up Screen
- Create new shop
- Input shop details (name, owner, address)
- Set mobile number
- Theme configuration
- Firebase user creation

### Sign In Screen
- Email/Password login
- Google OAuth (with setup)
- Phone OTP (with additional setup)
- Persistent session management

### Manage Shop Screen
- Display shop details
- Generate QR code
- Share QR code
- Edit shop information
- Link to catalog management

### Catalog List Screen
- Display all catalog items
- Search by name/category
- Edit/Delete items
- Floating action button for adding items
- Pull-to-refresh

### Add/Edit Catalog Screen
- Input item details
- Set pricing with discounts
- Manage availability
- Track stock levels
- Set item status
- Form validation

## 🔐 Authentication Flow

```
1. User signs up → Firebase creates account → API creates shop
2. Firebase generates ID token → Stored in AsyncStorage
3. On app restart → Firebase checks auth state → Restore session
4. API calls include token in Authorization header
5. On logout → Token deleted → Redirect to auth screen
```

## 📊 State Management

Using Redux Toolkit for centralized state:

```typescript
// Auth state
{
  user: { uid, email, displayName },
  isSignedIn: boolean,
  isLoading: boolean,
  error: string | null
}

// Shop state
{
  currentShop: Shop | null,
  shops: Shop[],
  isLoading: boolean,
  error: string | null
}

// Catalog state
{
  catalogs: Catalog[],
  selectedCatalog: Catalog | null,
  filteredByShop: Catalog[],
  isLoading: boolean,
  error: string | null
}
```

## 🌐 Supported Platforms

| Platform | Support | Status |
|----------|---------|--------|
| Android | Full | ✅ Ready |
| iOS | Full | ✅ Ready |
| Web | Full | ✅ Ready |
| Windows | Partial | ⚠️ Via web only |
| macOS | Partial | ⚠️ Via web only |

## 📱 Testing

### Local Testing

1. **Android Emulator**:
   ```bash
   npm run android
   ```

2. **iOS Simulator** (macOS):
   ```bash
   npm run ios
   ```

3. **Web**:
   ```bash
   npm run web
   ```

### Real Device Testing

Install Expo Go from Google Play or Apple App Store:
```bash
npm start
# Scan QR code with Expo Go app
```

### Test Credentials

```
Email: test@example.com
Password: test123456
```

## 🚢 Deployment

### Google Play Store

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md):

1. Set up signing key
2. Build with EAS
3. Submit to Play Store
4. Wait for review (usually 2-3 hours)

### Apple App Store

Similar process using EAS for iOS. Requires Apple Developer account.

### Web Deployment

Deploy the web build to Vercel, Netlify, or any static host:

```bash
npm run web
# Deploy the build folder
```

## 🐛 Troubleshooting

### Dependencies Installation Failed

```bash
npm install --legacy-peer-deps
npm cache clean --force
```

### Firebase Initialization Error

- Verify all `EXPO_PUBLIC_FIREBASE_*` env variables are set
- Check Firebase project is enabled
- Ensure app is registered in Firebase Console

### API Connection Failed

- Verify `EXPO_PUBLIC_API_URL` is correct
- Check backend server is running
- Ensure network connectivity
- Check CORS headers on backend

### QR Code Not Generating

- Verify `expo-sharing` is installed
- Check API returns `qr_code` field
- Verify file system permissions

## 📖 Documentation

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Navigation](https://reactnavigation.org/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👨‍💼 Author

Development Team

## 🙏 Acknowledgments

- Firebase for authentication
- Expo for cross-platform tooling
- Redux for state management
- React Navigation team

## 📞 Support

For support, email support@myshop.app or open an issue on GitHub.

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅

