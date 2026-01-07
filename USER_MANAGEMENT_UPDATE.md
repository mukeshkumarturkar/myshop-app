# User Management Update - Unique User IDs

## Changes Made

### Problem
Previously, the system was creating users using the **shop's mobile number** as the User ID, which meant all users shared the same ID. This didn't allow for multiple unique users per shop.

### Solution
Updated the user creation flow to accept **unique email and mobile number** for each new user, creating truly independent user accounts.

---

## 🔄 Updated Components

### 1. **ManageUsersScreen.tsx**

#### Before:
```typescript
// Only password fields
const [addUserForm, setAddUserForm] = useState({
  password: '',
  confirmPassword: '',
});
```

#### After:
```typescript
// Email, Mobile, and Password fields
const [addUserForm, setAddUserForm] = useState({
  email: '',
  mobileCountryCode: '91',
  mobileNumber: '',
  password: '',
  confirmPassword: '',
});
```

#### New Form Fields:
1. **Email Address** (required)
   - Format validation
   - User can login with email

2. **Mobile Number** (required)
   - Country code + number
   - Creates User ID: `{countryCode}{mobileNumber}`
   - Example: `919876543210`

3. **Password** (required, min 6 chars)
4. **Confirm Password** (required, must match)

#### New Validation:
- ✅ Email format validation (regex)
- ✅ Mobile number minimum length (10 digits)
- ✅ Password strength (min 6 characters)
- ✅ Password confirmation match
- ✅ All required fields check

---

### 2. **api.ts**

#### Updated Interface:
```typescript
// Before
async createUser(data: { 
  shopId: string; 
  password: string; 
  confirmPassword: string;
})

// After
async createUser(data: { 
  shopId: string; 
  email: string;
  mobileCountryCode: string;
  mobileNumber: string;
  password: string; 
  confirmPassword: string;
})
```

#### API Request Body:
```json
{
  "shopId": "695e0cad6e2eb16bf7b62169",
  "email": "user@example.com",
  "mobileCountryCode": "91",
  "mobileNumber": "9876543210",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

---

### 3. **SignUpScreen.tsx**

Updated to pass shop owner's email and mobile when creating the first user during signup:

```typescript
await apiClient.createUser({
  shopId,
  email: shopSignupData.email,              // Shop owner's email
  mobileCountryCode: shopSignupData.mobileCountryCode,
  mobileNumber: shopSignupData.mobileNumber,
  password: accountData.password,
  confirmPassword: accountData.confirmPassword,
});
```

---

## 📋 New User Creation Flow

### Step-by-Step:

1. **Navigate to Manage Users**
   - Click hamburger menu (☰)
   - Select "Manage Users"

2. **Fill User Details**
   ```
   Email Address:     user@example.com
   Mobile Number:     +91 | 9876543210
   Password:          ••••••••
   Confirm Password:  ••••••••
   ```

3. **User ID Preview**
   - Shows: `User ID will be: 919876543210`
   - This is what user will use to login

4. **Create User**
   - Validates all fields
   - Sends to API
   - Shows success with User ID

5. **Login as New User**
   - User can now login with:
     - **User ID**: `919876543210` OR `user@example.com`
     - **Password**: Their password

---

## 🎯 Benefits

### Before (Old System):
- ❌ All users had same User ID (shop's mobile)
- ❌ No way to distinguish between users
- ❌ Security concern (shared credentials)

### After (New System):
- ✅ Each user has unique User ID
- ✅ User ID = mobile number (`{countryCode}{mobile}`)
- ✅ Can login with email OR mobile number
- ✅ Proper multi-user support
- ✅ Better security and user management

---

## 🔐 User ID Format

### User ID Generation:
```
Country Code + Mobile Number = User ID
91 + 9876543210 = 919876543210
```

### Login Options:
Users can login using either:
1. **Mobile-based User ID**: `919876543210`
2. **Email**: `user@example.com`

---

## 📱 UI Updates

### Add User Form (Before):
```
┌──────────────────────────────┐
│ Create New User Account      │
├──────────────────────────────┤
│ Password:         [_______]  │
│ Confirm Password: [_______]  │
│                              │
│ [Create User]                │
└──────────────────────────────┘
```

### Add User Form (After):
```
┌──────────────────────────────┐
│ Create New User Account      │
├──────────────────────────────┤
│ Email:            [_______]  │
│ Mobile:  [+91] [__________]  │
│ User ID will be: 91XXXXXXXXXX│
│                              │
│ Password:         [_______]  │
│ Confirm Password: [_______]  │
│                              │
│ [Create User]                │
└──────────────────────────────┘
```

---

## ✅ Testing Instructions

### Test Creating a New User:

1. **Login to your shop**
2. **Open Manage Users** (Menu → Manage Users)
3. **Fill in the form**:
   - Email: `test@example.com`
   - Country Code: `91`
   - Mobile: `9123456789`
   - Password: `test123`
   - Confirm: `test123`

4. **Click "Create User"**
   - ✅ Should show success message
   - ✅ Should display User ID: `919123456789`

5. **Test Login** (in new browser/incognito):
   - User ID: `919123456789`
   - Password: `test123`
   - ✅ Should login successfully

### Test Validation:

**Invalid Email:**
```
Email: invalid-email
❌ "Please enter a valid email address"
```

**Short Mobile:**
```
Mobile: 12345
❌ "Please enter a valid mobile number (minimum 10 digits)"
```

**Password Mismatch:**
```
Password: test123
Confirm:  test456
❌ "Passwords do not match"
```

**Short Password:**
```
Password: 123
❌ "Password must be at least 6 characters"
```

---

## 🚀 API Compatibility

The updated API call matches the OpenAPI specification:

```yaml
POST /api/shops/user
Authorization: Bearer {publicAccessToken}

Request Body:
{
  "shopId": "string",
  "email": "string",
  "mobileCountryCode": "string", 
  "mobileNumber": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

---

## 📝 Summary

**Changed Files:**
1. ✅ `ManageUsersScreen.tsx` - Added email & mobile fields
2. ✅ `api.ts` - Updated createUser interface
3. ✅ `SignUpScreen.tsx` - Pass shop owner's email & mobile

**New Features:**
- ✅ Unique User ID per user
- ✅ Email field with validation
- ✅ Mobile number with country code
- ✅ Real-time User ID preview
- ✅ Enhanced validation

**Result:**
Users can now create multiple accounts with unique credentials for the same shop! 🎉

