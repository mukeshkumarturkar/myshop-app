# MyShop Authentication Guide

## Overview
This guide explains the complete Sign In and Sign Up flow for the MyShop application. The authentication system uses API-based authentication (no Firebase) with Redux state management.

## Architecture

### Components
1. **SignInScreen** - Email/Password authentication
2. **SignUpScreen** - Shop registration and user account creation
3. **AuthSlice** - Redux state management for authentication
4. **ApiClient** - Service for API calls
5. **RootNavigator** - Handles navigation based on authentication state

### Flow Diagram
```
┌─────────────────┐
│   Home Page     │
├─────────────────┤
│  Sign In/Sign Up│
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
[SignIn]    [SignUp]
    │          │
    │      Create Shop (API)
    │      Create User (API)
    │          │
    └────┬─────┘
         │
    Auth Success
         │
         ▼
    [MainApp Tabs]
    - My Shop
    - Catalog
    - Account (if added)
```

## Sign Up Flow (User Registration)

### Step 1: User Input
```typescript
const formData = {
  shopName: 'Pizza Palace',
  ownerName: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  address: '123 Main St',
  mobileCountryCode: '91',
  mobileNumber: '9876543210',
  menuDescription: 'Italian pizza and pasta',
  lookAndFeel: 'Modern and cozy',
}
```

### Step 2: Validation
- Shop name required
- Owner name required
- Valid email format required
- Password minimum 6 characters
- Passwords must match
- Address required
- Valid mobile number (10+ digits)

### Step 3: API Calls

#### Create Shop
```
POST /api/shops
{
  "name": "Pizza Palace",
  "address": "123 Main St",
  "owner": "John Doe",
  "email": "john@example.com",
  "mobile_country_code": "91",
  "mobile_number": "9876543210",
  "theme": {
    "colors": {
      "primary": "#FF6B6B",
      "secondary": "#FFFFFF"
    },
    "menu": "Italian pizza and pasta",
    "lookAndFeel": "Modern and cozy",
    "logo": "default-logo.png"
  }
}
```

Response:
```json
{
  "_id": "shop-id-12345",
  "name": "Pizza Palace",
  ...
}
```

#### Create User Account
```
POST /api/shops/user
{
  "shopId": "shop-id-12345",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Response:
```json
{
  "userId": "user-id-xyz",
  "shopId": "shop-id-12345",
  "email": "john@example.com",
  "message": "User created successfully"
}
```

### Step 4: Save to Local Storage
```typescript
await AsyncStorage.setItem('shopId', shopId);
await AsyncStorage.setItem('shopName', formData.shopName);
await AsyncStorage.setItem('ownerName', formData.ownerName);
await AsyncStorage.setItem('email', formData.email);
```

### Step 5: Update Redux State
```typescript
dispatch(setUser({
  uid: shopId,
  email: formData.email,
  displayName: formData.ownerName,
  shopName: formData.shopName,
}));
```

### Step 6: Navigation
Redirect to Sign In screen for login

---

## Sign In Flow (User Authentication)

### Step 1: User Input
```typescript
const credentials = {
  email: 'john@example.com',
  password: 'password123'
}
```

### Step 2: Validation
- Email required and non-empty
- Password required and non-empty

### Step 3: API Call

#### Authenticate
```
POST /api/shops/auth
{
  "userId": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "userId": "user-id-xyz",
  "shopId": "shop-id-12345",
  "shopName": "Pizza Palace",
  "ownerName": "John Doe",
  "email": "john@example.com",
  "token": "jwt-token-here"
}
```

### Step 4: Save to Local Storage
```typescript
await AsyncStorage.setItem('shopId', response.data.shopId);
await AsyncStorage.setItem('shopName', response.data.shopName);
await AsyncStorage.setItem('ownerName', response.data.ownerName);
await AsyncStorage.setItem('email', response.data.email);
await AsyncStorage.setItem('userId', response.data.userId);
```

### Step 5: Update Redux State
```typescript
dispatch(setUser({
  uid: response.data.userId,
  email: response.data.email,
  displayName: response.data.ownerName,
  shopName: response.data.shopName,
}));
```

### Step 6: Navigation
Redirect to MainApp (with bottom tabs)

---

## UI/UX Features

### SignInScreen
- **Email & Password Tab**: Standard email/password login
- **Phone OTP Tab**: Placeholder for future OTP implementation
- **Google Sign-In Button**: Placeholder for future Google authentication
- **Sign Up Link**: Navigate to SignUpScreen for new users

### SignUpScreen
- **Basic Information**: Shop name, owner name, email
- **Security**: Password with confirmation
- **Contact Details**: Mobile number with country code
- **Address**: Shop location (multi-line)
- **Theme Configuration** (Optional):
  - Menu description
  - Look and feel
  - Color picker (primary/secondary)
- **Sign In Link**: Redirect to SignInScreen for existing users

---

## State Management (Redux)

### AuthState Structure
```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSignedIn: boolean;
  error: string | null;
}

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  shopName?: string;
}
```

### Actions
```typescript
setLoading(boolean)     // Set loading state
setUser(User | null)    // Set user and isSignedIn=true
setError(string)        // Set error message
clearError()            // Clear error
logout()                // Clear user and isSignedIn=false
```

---

## Error Handling

### Common Errors
1. **Validation Errors**
   - Required field missing
   - Invalid email format
   - Password too short
   - Passwords don't match
   - Invalid phone number

2. **API Errors**
   - Shop creation failed (e.g., duplicate name)
   - User creation failed (e.g., email already exists)
   - Authentication failed (invalid credentials)
   - Network timeout

3. **Error Display**
   - Alert dialog with error message
   - Error stored in Redux state
   - Console logging for debugging

---

## Future Enhancements

### Phone OTP Authentication
```typescript
// 1. Send OTP
POST /api/auth/send-otp
{ "mobileNumber": "9876543210" }

// 2. Verify OTP
POST /api/auth/verify-otp
{ 
  "mobileNumber": "9876543210",
  "otp": "123456"
}
```

### Google Authentication
```typescript
// Using @react-native-google-signin/google-signin
// 1. Initialize with Google Cloud credentials
// 2. Handle sign-in
// 3. Create/link shop account
```

### Password Reset
```
POST /api/shops/reset-password
{
  "userId": "user-id",
  "oldPassword": "current-password",
  "newPassword": "new-password",
  "confirmNewPassword": "new-password"
}
```

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/shops` | Create shop |
| POST | `/shops/user` | Create user account |
| POST | `/shops/auth` | Authenticate user |
| POST | `/shops/reset-password` | Reset password |

### Shop Management
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/shops/:id` | Get shop details |
| PUT | `/shops/:id` | Update shop |
| DELETE | `/shops/:id` | Delete shop |

### QR Code
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/shops/:id/generate-qr` | Generate QR code |
| GET | `/shops/:id/qr` | Get QR code |

---

## Testing Credentials

### Test Sign Up
```
Shop Name: Test Pizza
Owner Name: Test User
Email: test@example.com
Password: test123456
Mobile: 9999999999
```

### Test Sign In
```
Email: test@example.com
Password: test123456
```

---

## Troubleshooting

### Issue: "Sign in failed"
**Cause**: Invalid credentials or API not responding
**Solution**:
1. Check if backend API is running
2. Verify email and password are correct
3. Check EXPO_PUBLIC_API_URL environment variable
4. Check network connectivity

### Issue: "Shop creation failed"
**Cause**: Validation error or duplicate shop name
**Solution**:
1. Ensure all required fields are filled
2. Use a unique shop name
3. Check internet connection
4. Verify API is accepting POST requests

### Issue: "Navigation not working"
**Cause**: RootNavigator not properly configured
**Solution**:
1. Check isSignedIn state in Redux
2. Ensure navigation names match: 'SignIn', 'SignUp', 'MainApp'
3. Verify screen components are imported correctly

---

## Environment Variables

Create a `.env` file in the project root:
```
EXPO_PUBLIC_API_URL=https://api.soanch.com/api
```

For local development:
```
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```


---

## Security Notes

1. **Password Storage**
   - Passwords are sent to backend via HTTPS
   - Never store plain passwords locally
   - Use secure storage for tokens

2. **Token Management**
   - JWT tokens stored in AsyncStorage
   - Tokens included in Authorization header
   - Tokens cleared on logout

3. **Error Messages**
   - Don't expose sensitive server errors to user
   - Use generic error messages for security

---

## Code Examples

### Using Authentication in Components

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const MyComponent = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  
  if (!isSignedIn) {
    return <Text>Please sign in</Text>;
  }
  
  return <Text>Welcome, {user?.displayName}</Text>;
};
```

### Accessing AsyncStorage Data

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const shopId = await AsyncStorage.getItem('shopId');
const shopName = await AsyncStorage.getItem('shopName');
const email = await AsyncStorage.getItem('email');
```

### Making Authenticated API Calls

```typescript
import { apiClient } from '../services/api';

const response = await apiClient.getShopById(shopId);
// Authorization header is automatically added by the interceptor
```

---

## Support

For issues or questions about authentication:
1. Check console logs for error messages
2. Verify API endpoint is correct
3. Ensure backend service is running
4. Check network connectivity
5. Review this guide for troubleshooting steps

