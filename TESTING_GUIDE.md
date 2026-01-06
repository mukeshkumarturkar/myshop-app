# Testing Guide - Authentication & User Management

## Pre-requisites
- Ensure API server is running on `https://api.soanch.com/api`
- OR set `EXPO_PUBLIC_API_URL` to your local development server
- App dependencies installed: `npm install`

## Testing Scenarios

### Scenario 1: Complete Shop Registration

#### Test Case 1.1: Valid Shop Registration
**Steps**:
1. Launch app → See HomePage
2. Click "Sign Up" link (or navigate to SignUp)
3. Enter the following details:
   - Shop Name: `Test Pizza Palace`
   - Owner Name: `John Doe`
   - Email: `john@testshop.com`
   - Address: `123 Main St, New York, NY`
   - Mobile Country Code: `91`
   - Mobile Number: `9876543210`
   - Menu Description: `Italian pizza and pasta`
   - Look and Feel: `Modern restaurant`

**Expected Result**:
- ✅ All fields populate without validation errors
- ✅ Step 1 button says "Continue to Account Setup"
- ✅ Click button → Progress to Step 2
- ✅ See shop summary displayed
- ✅ No validation errors

**Test Case 1.2: Enter Password**
4. On Step 2, enter:
   - Password: `TestPass@123`
   - Confirm Password: `TestPass@123`

**Expected Result**:
- ✅ Password fields accept input
- ✅ Passwords match and button enables
- ✅ Success alert shows
- ✅ Redirect to SignIn screen

**Test Case 1.3: Invalid Inputs**
Repeat above but with invalid data:
- Empty Shop Name → "Shop name is required"
- Invalid Email → "Valid email is required"
- Mobile < 10 digits → "Valid mobile number required"
- Password < 6 chars → "Password must be at least 6 characters"
- Non-matching passwords → "Passwords do not match"

**Expected Result**:
- ✅ Each validation shows appropriate error
- ✅ Form doesn't submit with validation errors

---

### Scenario 2: Sign In Process

#### Test Case 2.1: Email & Password Sign In
**Steps**:
1. From SignUp redirect, you're at SignIn screen
2. Verify "Email & Password" tab is active
3. Enter:
   - Email: `john@testshop.com`
   - Password: `TestPass@123`
4. Click "Sign In"

**Expected Result**:
- ✅ Loading spinner shows
- ✅ API call to `/api/shops/auth` completes
- ✅ Token saved to AsyncStorage
- ✅ User data persisted
- ✅ Redirect to MainApp/Dashboard
- ✅ Success alert shows "Signed in successfully"

#### Test Case 2.2: Invalid Credentials
**Steps**:
1. Click "Sign In" tab again
2. Enter:
   - Email: `john@testshop.com`
   - Password: `WrongPassword123`
3. Click "Sign In"

**Expected Result**:
- ✅ Shows error alert: "Invalid credentials" (or API error message)
- ✅ User stays on SignIn screen
- ✅ Can retry with correct password

#### Test Case 2.3: Empty Fields
**Steps**:
1. Clear both fields
2. Click "Sign In"

**Expected Result**:
- ✅ Validation error: "Please enter email and password"
- ✅ No API call made

#### Test Case 2.4: Method Switching
**Steps**:
1. Click "Phone" tab
2. Verify UI switches to phone input
3. Click "Email" tab
4. Verify UI switches back

**Expected Result**:
- ✅ UI switches smoothly between methods
- ✅ Form state doesn't reset
- ✅ Previous entries remain (if using same form state)

---

### Scenario 3: Phone OTP (Ready for Integration)

#### Test Case 3.1: Phone Tab Navigation
**Steps**:
1. On SignIn screen, click "Phone" tab
2. See mobile number input field
3. Enter: `9876543210`
4. Click "Send OTP"

**Expected Result**:
- ✅ Shows info: "Feature Coming Soon"
- ✅ App doesn't crash
- ✅ Can return to Email tab

---

### Scenario 4: User Management

#### Test Case 4.1: Navigate to Manage Users
**Pre-requisite**: User must be logged in

**Steps**:
1. From dashboard/MainApp, navigate to Manage Users
2. See current user (shop owner) listed

**Expected Result**:
- ✅ Current user displays with "Owner" badge
- ✅ "+Add New User" button visible
- ✅ No errors in console

#### Test Case 4.2: Add New Shop User
**Steps**:
1. Click "+Add New User" button
2. Form appears
3. Enter:
   - Country Code: `91`
   - Mobile Number: `9999999999`
   - Password: `StaffPass@123`
   - Confirm: `StaffPass@123`
4. Click "Create User"

**Expected Result**:
- ✅ Loading spinner appears
- ✅ API call to `/api/shops/user` completes
- ✅ Success alert: "User account created"
- ✅ New user appears in list
- ✅ Form closes/resets

#### Test Case 4.3: Invalid User Creation
**Steps**:
1. Click "+Add New User"
2. Try to create with:
   - Mobile < 10 digits → "Valid mobile number required"
   - Password < 6 chars → "Password must be at least 6 characters"
   - Non-matching passwords → "Passwords do not match"

**Expected Result**:
- ✅ Each validation shows appropriate error
- ✅ Form doesn't submit

#### Test Case 4.4: Remove User
**Steps**:
1. In user list, click "Remove" on a non-owner user
2. Confirm in alert dialog
3. Click "Remove"

**Expected Result**:
- ✅ Confirmation alert appears
- ✅ User removed from list
- ✅ Success message shows
- ✅ Owner (👑) user can't be removed

---

### Scenario 5: Session Management

#### Test Case 5.1: Token Persistence
**Steps**:
1. Sign in successfully
2. Close app completely
3. Reopen app
4. Navigate to dashboard

**Expected Result**:
- ✅ App detects valid token
- ✅ User remains logged in
- ✅ No need to re-enter credentials

#### Test Case 5.2: Logout
**Steps**:
1. While logged in, find Logout button
2. Click Logout

**Expected Result**:
- ✅ Token cleared from AsyncStorage
- ✅ Redirect to SignIn screen
- ✅ User data cleared

---

## API Testing

### Manual API Testing (Using cURL)

#### Create Shop
```bash
curl -X POST https://api.soanch.com/api/shops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Shop",
    "address": "123 Test St",
    "owner": "Test Owner",
    "email": "test@example.com",
    "mobile_country_code": "91",
    "mobile_number": "9876543210",
    "theme": {
      "colors": {"primary": "#FF6B6B", "secondary": "#FFFFFF"},
      "menu": "Test items",
      "lookAndFeel": "Modern",
      "logo": "default"
    }
  }'
```

#### Create User
```bash
curl -X POST https://api.soanch.com/api/shops/user \
  -H "Content-Type: application/json" \
  -d '{
    "shopId": "6958fbaac7c72a28f87b07ef",
    "password": "TestPass@123",
    "confirmPassword": "TestPass@123"
  }'
```

#### Authenticate
```bash
curl -X POST https://api.soanch.com/api/shops/auth \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test@example.com",
    "password": "TestPass@123"
  }'
```

---

## Console Logging

### Expected Debug Logs (with 🔴 prefix)

**Sign Up**:
```
🔴 SignUp: Starting shop creation...
🔴 SignUp: Shop created successfully: {shopId}
🔴 SignUp: Creating user account for shop: {shopId}
🔴 SignUp: User account created successfully
```

**Sign In**:
```
🔴 SignIn: Attempting email/password authentication...
🔴 SignIn: Authentication successful
```

**User Management**:
```
🔴 ManageUsers: Creating new user account...
🔴 ManageUsers: User account created successfully
```

### Error Logs
Look for error messages if any action fails:
- Validation errors
- API connection errors
- Response parsing errors

---

## Common Issues & Solutions

### Issue 1: "API Base URL not found"
**Cause**: `EXPO_PUBLIC_API_URL` not set
**Solution**:
```bash
export EXPO_PUBLIC_API_URL=https://api.soanch.com/api
npm start
```

### Issue 2: "Cannot read property '_id' of undefined"
**Cause**: API response format different than expected
**Solution**: Check API documentation and response format

### Issue 3: "Token not saving"
**Cause**: AsyncStorage not available
**Solution**: Ensure `@react-native-async-storage` is installed

### Issue 4: "Navigation stack error"
**Cause**: Screen not registered in navigation
**Solution**: Verify screens are imported in RootNavigator

### Issue 5: "Form not submitting"
**Cause**: Validation error or disabled button
**Solution**: Check console for validation errors

---

## Performance Testing

### Load Testing
1. Sign up 5 shops quickly
2. Add 10 users per shop
3. Perform 20 sign-ins
4. Monitor memory usage

**Expected Result**:
- ✅ No memory leaks
- ✅ API requests don't timeout
- ✅ UI remains responsive

### Response Time
- Sign Up: < 2 seconds
- Sign In: < 1 second
- Create User: < 1 second

---

## Security Testing

### Password Security
- [ ] Passwords not visible in plain text
- [ ] Passwords min 6 characters enforced
- [ ] Password mismatch validation works
- [ ] Confirm password field is secure (masked)

### Token Security
- [ ] Token stored in AsyncStorage (not logged)
- [ ] Token sent in Authorization header
- [ ] Token cleared on logout
- [ ] Token validates correctly

### Data Privacy
- [ ] Email not logged in console
- [ ] Passwords never logged
- [ ] Errors don't expose sensitive data
- [ ] No hardcoded credentials

---

## Checklist for Go-Live

### Code Quality
- [ ] No console.log with sensitive data
- [ ] All error messages are user-friendly
- [ ] TypeScript types used everywhere
- [ ] No any types except where necessary

### Functionality
- [ ] Sign up creates shop and user
- [ ] Sign in authenticates correctly
- [ ] Manage users works properly
- [ ] Logout clears all data

### Testing
- [ ] All test scenarios pass
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] Security tested

### Deployment
- [ ] Environment variables configured
- [ ] API URL pointing to production
- [ ] Build successful
- [ ] No console errors

---

**Version**: 1.0.0
**Last Updated**: January 6, 2026

