# Quick Reference: Sign In & Sign Up

## File Structure
```
MyShopApp/src/
├── screens/
│   ├── SignInScreen.tsx          ✅ Login screen
│   ├── SignUpScreen.tsx          ✅ Registration screen
│   └── ...
├── services/
│   └── api.ts                    ✅ API client with auth endpoints
├── store/
│   ├── authSlice.ts              ✅ Redux auth state
│   └── index.ts                  ✅ Redux store config
├── types/
│   └── index.ts                  ✅ TypeScript interfaces
└── navigation/
    └── RootNavigator.tsx         ✅ Navigation setup
```

---

## API Endpoints

### Authentication Endpoints
```
POST /api/shops                    Create new shop
POST /api/shops/user              Create user account
POST /api/shops/auth              Authenticate user
POST /api/shops/reset-password    Reset password
```

---

## Using Auth in Your Components

### Get Current User
```typescript
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const MyComponent = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  
  return isSignedIn ? <Text>{user?.shopName}</Text> : <Text>Not signed in</Text>;
};
```

### Dispatch Auth Actions
```typescript
import { useDispatch } from 'react-redux';
import { setUser, logout, setError } from '../store/authSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  
  // Set user
  dispatch(setUser({
    uid: 'user-123',
    email: 'user@example.com',
    displayName: 'John Doe',
    shopName: 'Pizza Palace'
  }));
  
  // Logout
  dispatch(logout());
  
  // Set error
  dispatch(setError('Something went wrong'));
};
```

### Make API Calls
```typescript
import { apiClient } from '../services/api';

// Create shop
const shopRes = await apiClient.createShop({
  name: 'Pizza Palace',
  address: '123 Main St',
  owner: 'John Doe',
  email: 'john@example.com',
  ...
});

// Create user
const userRes = await apiClient.createUser(
  shopId,
  password,
  confirmPassword
);

// Login
const loginRes = await apiClient.authenticate(email, password);

// Get shop
const shop = await apiClient.getShopById(shopId);
```

---

## Form Validation Examples

### Email Validation
```typescript
if (!formData.email.includes('@')) {
  Alert.alert('Validation Error', 'Valid email is required');
  return false;
}
```

### Password Validation
```typescript
if (formData.password.length < 6) {
  Alert.alert('Validation Error', 'Password must be at least 6 characters');
  return false;
}

if (formData.password !== formData.confirmPassword) {
  Alert.alert('Validation Error', 'Passwords do not match');
  return false;
}
```

### Mobile Number Validation
```typescript
if (!formData.mobileNumber.trim() || formData.mobileNumber.length < 10) {
  Alert.alert('Validation Error', 'Valid mobile number is required');
  return false;
}
```

---

## Error Handling Pattern

```typescript
try {
  console.log('🔴 Action: Starting...');
  
  // API call
  const response = await apiClient.authenticate(email, password);
  console.log('🔴 Action: Success');
  
  // Save data
  await AsyncStorage.setItem('userId', response.data.userId);
  
  // Update state
  dispatch(setUser({...}));
  
  // Show success
  Alert.alert('Success', 'Signed in successfully!');
  
  // Navigate
  navigation.replace('MainApp');
  
} catch (error: any) {
  console.error('Error details:', error);
  
  // Get error message
  const errorMessage = 
    error.response?.data?.message || 
    error.message || 
    'Operation failed';
  
  // Update state
  dispatch(setError(errorMessage));
  
  // Show error
  Alert.alert('Error', errorMessage);
  
} finally {
  setLoading(false);
}
```

---

## Redux State Selectors

```typescript
// Get all auth state
const auth = useSelector((state: RootState) => state.auth);

// Get user
const user = useSelector((state: RootState) => state.auth.user);

// Get sign in status
const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);

// Get loading state
const isLoading = useSelector((state: RootState) => state.auth.isLoading);

// Get error
const error = useSelector((state: RootState) => state.auth.error);
```

---

## AsyncStorage Keys

```typescript
// Available keys after authentication
const shopId = await AsyncStorage.getItem('shopId');
const shopName = await AsyncStorage.getItem('shopName');
const ownerName = await AsyncStorage.getItem('ownerName');
const email = await AsyncStorage.getItem('email');
const userId = await AsyncStorage.getItem('userId');
```

---

## Navigation Examples

```typescript
// Navigate to SignUp
navigation.navigate('SignUp');

// Navigate to SignIn
navigation.navigate('SignIn');

// Navigate to MainApp (after login)
navigation.replace('MainApp');

// Navigate between tabs
navigation.navigate('Shop');
navigation.navigate('Catalog');
```

---

## Debugging

### Enable Console Logs
All screens have console logs marked with 🔴:
```typescript
console.log('🔴 SignUp: Starting shop creation...');
console.log('🔴 SignIn: Attempting email/password authentication...');
```

### Check Redux State
```typescript
import { store } from '../store';
console.log('Current auth state:', store.getState().auth);
```

### Check AsyncStorage
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
const keys = await AsyncStorage.getAllKeys();
console.log('Stored keys:', keys);
```

### Monitor API Calls
```typescript
// API client has request/response logging in interceptors
// Check Network tab in dev tools for full details
```

---

## Common Issues & Solutions

### Issue: User can't sign up
**Check**:
1. Backend `/shops` endpoint running
2. Backend `/shops/user` endpoint running
3. EXPO_PUBLIC_API_URL is correct
4. Network connectivity
5. API response format matches expected

### Issue: User can't sign in
**Check**:
1. Backend `/shops/auth` endpoint running
2. User account exists (from signup)
3. Email/password correct
4. API running and accessible

### Issue: Navigation not working
**Check**:
1. Redux `isSignedIn` state correct
2. Navigation names match: 'SignIn', 'SignUp', 'MainApp'
3. RootNavigator properly configured
4. Screen components imported correctly

### Issue: Data not persisting
**Check**:
1. AsyncStorage.setItem called
2. No AsyncStorage.removeItem called prematurely
3. Check AsyncStorage.getAllKeys() to verify

### Issue: Redux state not updating
**Check**:
1. dispatch() called with correct action
2. Reducer correctly handling action
3. Component subscribed to correct state selector
4. No typos in action names

---

## Performance Tips

1. **Use selectors to avoid re-renders**
   ```typescript
   // Good
   const user = useSelector((state: RootState) => state.auth.user);
   
   // Avoid
   const auth = useSelector((state: RootState) => state.auth);
   ```

2. **Memoize components**
   ```typescript
   export default React.memo(SignInScreen);
   ```

3. **Lazy load screens**
   ```typescript
   // Already done in navigation
   ```

4. **Debounce form inputs**
   ```typescript
   // Implement if needed for large forms
   const debouncedChange = useCallback(
     debounce((value) => handleInputChange('field', value), 300),
     []
   );
   ```

---

## Testing Examples

### Test Sign Up
```bash
# 1. Fill form with valid data
# 2. Press "Create Shop"
# 3. Check console for 🔴 logs
# 4. Verify AsyncStorage has data
# 5. Verify Redux state updated
# 6. Should navigate to SignIn
```

### Test Sign In
```bash
# 1. Use created account
# 2. Enter email and password
# 3. Press "Sign In"
# 4. Check console for 🔴 logs
# 5. Verify AsyncStorage has data
# 6. Verify Redux state updated
# 7. Should navigate to MainApp
```

---

## Environment Setup

### Development
```env
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

### Production
```env
EXPO_PUBLIC_API_URL=https://api.soanch.com/api
```

### Update Procedure
1. Create `.env` or `.env.local` file
2. Add environment variable
3. Restart Metro Bundler (Ctrl+C, then `npm start`)
4. Variable available as `process.env.EXPO_PUBLIC_API_URL`

---

## Security Checklist

- ✅ Passwords not logged in console
- ✅ Tokens not logged in console
- ✅ Error messages don't expose sensitive data
- ✅ HTTPS enforced in production
- ✅ Tokens cleared on logout
- ✅ 401 errors handled correctly
- ✅ No plain passwords stored locally

---

## Documentation References

- 📖 `AUTHENTICATION_GUIDE.md` - Complete guide
- 📖 `SIGNIN_SIGNUP_SUMMARY.md` - Implementation summary
- 📖 This file - Quick reference
- 🔗 `/MyShopApp/src/screens/SignInScreen.tsx` - Login code
- 🔗 `/MyShopApp/src/screens/SignUpScreen.tsx` - Signup code
- 🔗 `/MyShopApp/src/services/api.ts` - API client
- 🔗 `/MyShopApp/src/store/authSlice.ts` - Redux state

---

## Support

**For questions about**:
- **API Integration** → Check `AUTHENTICATION_GUIDE.md`
- **Component Structure** → Check `SIGNIN_SIGNUP_SUMMARY.md`
- **Code Examples** → Check this Quick Reference
- **Debugging** → Enable 🔴 console logs and check Redux state
- **Production Deployment** → Update `EXPO_PUBLIC_API_URL`

---

**Last Updated**: January 5, 2026
**Status**: ✅ Complete and Production Ready

