# Authentication Implementation Guide

## Overview
This document describes the complete authentication implementation for the MyShop app, including Sign Up, Sign In, and User Management.

## API Base URL
- **Production**: `https://api.soanch.com/api`
- **Environment Variable**: `EXPO_PUBLIC_API_URL`

## Authentication Flows

### 1. Sign Up Flow (Shop Registration)

#### Step 1: Create Shop
**Endpoint**: `POST /api/shops`

**Request**:
```json
{
  "name": "Pizza Palace",
  "address": "123 Main St, New York, NY",
  "owner": "John Doe",
  "email": "shop@example.com",
  "mobile_country_code": "91",
  "mobile_number": "9876543210",
  "theme": {
    "colors": {
      "primary": "#FF6B6B",
      "secondary": "#FFFFFF"
    },
    "menu": "Italian pizza, pasta, and desserts",
    "lookAndFeel": "Modern and cozy Italian restaurant",
    "logo": "default-logo.png"
  }
}
```

**Response**:
```json
{
  "_id": "6958fbaac7c72a28f87b07ef",
  "name": "Pizza Palace",
  "address": "123 Main St, New York, NY",
  "owner": "John Doe",
  "email": "shop@example.com",
  "mobile_country_code": "91",
  "mobile_number": "9876543210",
  "theme": {...},
  "createdAt": "2025-01-06T12:00:00Z",
  "updatedAt": "2025-01-06T12:00:00Z"
}
```

#### Step 2: Create User Account
**Endpoint**: `POST /api/shops/user`

**Request**:
```json
{
  "shopId": "6958fbaac7c72a28f87b07ef",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "User account created successfully",
  "userId": "919876543210"
}
```

**Note**: The `userId` is automatically set to the shop's mobile number (country code + number)

### 2. Sign In Flow

#### Email/Password Authentication
**Endpoint**: `POST /api/shops/auth`

**Request** (using email):
```json
{
  "userId": "shop@example.com",
  "password": "SecurePassword123!"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Authentication successful",
  "oauth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "shopId": "6958fbaac7c72a28f87b07ef",
  "shop_name": "Pizza Palace",
  "owner_name": "John Doe",
  "email": "shop@example.com",
  "userId": "919876543210"
}
```

**Authentication Token**:
- Valid for 90 days
- Sent in `Authorization: Bearer <token>` header for authenticated requests
- Automatically saved to AsyncStorage

#### Phone Number Authentication
**Endpoint**: `POST /api/shops/auth` (Coming Soon)

**Request** (using phone):
```json
{
  "userId": "919876543210",
  "password": "SecurePassword123!"
}
```

### 3. Password Reset

**Endpoint**: `POST /api/shops/reset-password`

**Request**:
```json
{
  "userId": "919876543210",
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmNewPassword": "NewPassword123!"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

## User Types

### 1. Shop Owner
- Initial account creator for a shop
- Can manage shop details and create additional users
- Has full access to all features

### 2. Shop Staff
- Created by shop owner
- Can login with their mobile number and password
- Has access to catalog management and operations

## Screen Components

### SignUpScreen.tsx
**Two-step sign up process**:

1. **Step 1 - Shop Details**
   - Shop Name (required)
   - Owner Name (required)
   - Email (required)
   - Address (required)
   - Mobile Number (required, 10 digits)
   - Theme details (optional)

2. **Step 2 - User Account**
   - Password (minimum 6 characters)
   - Confirm Password
   - Display shop details for confirmation

**User ID Creation**: Mobile number (country code + number)
Example: `919876543210` for country code 91, mobile 9876543210

### SignInScreen.tsx
**Multi-method authentication**:

1. **Email & Password**
   - Enter shop email address
   - Enter password
   - Automatic authentication token retrieval

2. **Phone OTP** (Coming Soon)
   - Enter 10-digit mobile number
   - Receive OTP via SMS
   - Verify OTP to authenticate

3. **Google Sign-In** (Coming Soon)
   - One-tap authentication via Google
   - Requires Firebase/Google Cloud Console setup

### ManageUsersScreen.tsx
**User management features**:

- View all authorized users
- Add new users with mobile number and password
- Remove users (except shop owner)
- Each user gets unique mobile-based userId

## API Integration

### ApiClient Methods

```typescript
// Authentication
await apiClient.authenticate(userId: string, password: string)
await apiClient.createUser(shopId: string, password: string, confirmPassword: string)
await apiClient.resetPassword(userId: string, oldPassword: string, newPassword: string, confirmNewPassword: string)

// Shop Management
await apiClient.createShop(data: ShopCreate)
await apiClient.getShopById(id: string)
await apiClient.updateShop(id: string, data: any)

// Catalog Management
await apiClient.createCatalog(data: CatalogCreate)
await apiClient.getCatalogsByShopId(shopId: string)
await apiClient.updateCatalog(id: string, data: any)
await apiClient.deleteCatalog(id: string)
```

## Data Storage

### AsyncStorage Keys

```typescript
// Authentication
authToken           // JWT token from authentication
userId              // User's mobile number or ID

// Shop Information
shopId              // MongoDB ObjectId of the shop
shopName            // Shop display name
ownerName           // Shop owner's full name
email               // Shop email address
mobileNumber        // Full mobile number with country code
```

## Redux Store

### Auth Slice
```typescript
{
  user: User | null,           // Current user object
  isLoading: boolean,          // Loading state for API calls
  isSignedIn: boolean,         // Authentication status
  error: string | null         // Error message if any
}
```

## Error Handling

All API calls include error handling:

```typescript
try {
  const response = await apiClient.authenticate(email, password);
  // Handle success
} catch (error: any) {
  const errorMessage = error.response?.data?.details 
    || error.response?.data?.message 
    || error.message 
    || 'Operation failed';
  // Display error to user
}
```

## Security Considerations

1. **Password Requirements**
   - Minimum 6 characters (validate on client)
   - Should be strong (validate on server)
   - Never stored in plain text

2. **Token Management**
   - JWT token stored securely in AsyncStorage
   - Automatically added to request headers
   - 90-day expiration
   - Cleared on logout

3. **User ID Format**
   - Mobile-based: `{countryCode}{mobileNumber}`
   - Example: `919876543210`
   - Or email-based for compatibility

## Environment Configuration

```bash
# .env file or EXPO_PUBLIC_ variables
EXPO_PUBLIC_API_URL=https://api.soanch.com/api
```

For local development:
```bash
EXPO_PUBLIC_API_URL=http://localhost:8080/api
```

## Testing Authentication

### Test Account Creation
1. Open SignUp screen
2. Fill shop details:
   - Shop Name: Test Pizza
   - Owner: Test Owner
   - Email: test@example.com
   - Address: 123 Test St
   - Mobile: 9876543210
3. Click "Continue to Account Setup"
4. Set password: TestPass123
5. Click "Create Account"
6. Navigate to SignIn screen
7. Sign in with email and password

### Test Additional User Creation
1. Go to Manage Users screen
2. Click "+ Add New User"
3. Enter mobile number: 9999999999
4. Set password: TestPass123
5. Click "Create User"
6. New user can login with: 919999999999 and password

## Next Steps

1. **OTP Integration**
   - Integrate Firebase Auth for OTP handling
   - Implement SMS delivery service

2. **Google Sign-In**
   - Setup Google Cloud Console
   - Configure @react-native-google-signin package

3. **Session Management**
   - Implement token refresh mechanism
   - Handle session expiration

4. **User Roles & Permissions**
   - Define role-based access control
   - Implement permission management

## Support

For API documentation, visit: https://api.soanch.com/docs
For issues, contact: support@soanch.com

