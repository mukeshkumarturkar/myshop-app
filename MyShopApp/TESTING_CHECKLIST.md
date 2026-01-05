# MyShop App - Testing Checklist

Use this checklist to verify all features work correctly before deployment.

## ✅ Pre-Launch Testing

### 1. Authentication Features

#### Sign Up
- [ ] Sign Up button visible on initial screen
- [ ] All form fields render correctly
- [ ] Form validation works (shows errors for empty fields)
- [ ] Email validation works
- [ ] Password validation (min 6 chars)
- [ ] Password confirmation validation
- [ ] Mobile number validation
- [ ] Submit button enables/disables correctly
- [ ] Loading indicator shows during submission
- [ ] Success message appears after signup
- [ ] User redirected to main app
- [ ] User appears in Firebase Console

#### Sign In
- [ ] Sign In button visible
- [ ] Email/Password form works
- [ ] Login with correct credentials succeeds
- [ ] Login with wrong credentials shows error
- [ ] Session persists on app reload
- [ ] Logout functionality works
- [ ] Loading indicator shows during login
- [ ] Form validation prevents empty submission
- [ ] "Forgot password" link available (if implemented)
- [ ] Sign up link redirects to sign up screen

#### Phone OTP (Optional)
- [ ] Phone input field visible
- [ ] Phone validation works
- [ ] Send OTP button functional
- [ ] OTP input screen shows after send
- [ ] Verify OTP button works
- [ ] Error handling for expired OTP

### 2. Shop Management

#### Create Shop (During Sign Up)
- [ ] Shop created successfully
- [ ] Shop name saved correctly
- [ ] Owner name saved correctly
- [ ] Email saved correctly
- [ ] Address saved correctly
- [ ] Mobile number saved correctly
- [ ] Theme colors saved (if provided)
- [ ] Shop ID stored in local storage
- [ ] User redirected to main app

#### View Shop Details
- [ ] Shop name displays correctly
- [ ] Owner name displays correctly
- [ ] Email displays correctly
- [ ] Address displays correctly
- [ ] Mobile number displays with country code
- [ ] All details readable and properly formatted
- [ ] No console errors on screen load

#### Generate QR Code
- [ ] "Generate QR Code" button visible
- [ ] Button shows loading state during generation
- [ ] QR code image displays after generation
- [ ] QR code is clear and scannable
- [ ] QR code URL is correct
- [ ] QR code persists on app reload
- [ ] Error message shows if generation fails

#### Share QR Code
- [ ] "Share QR Code" button visible (on mobile)
- [ ] Share dialog opens on button press
- [ ] QR code can be shared via messaging
- [ ] QR code can be saved to photos
- [ ] Share functionality works on iOS and Android

#### Edit Shop Details
- [ ] Edit button navigates to edit screen
- [ ] Form pre-fills with current values
- [ ] Can edit shop name
- [ ] Can edit owner name
- [ ] Can edit address
- [ ] Can edit email
- [ ] Can edit mobile number
- [ ] Can edit theme colors
- [ ] Color preview updates in real-time
- [ ] Save button updates shop
- [ ] Success message appears after save
- [ ] Changes visible when returning to shop details
- [ ] Cancel button discards changes

### 3. Catalog Management

#### Add Catalog Item
- [ ] FAB button (+) visible on catalog screen
- [ ] "Add Item" button also visible (if implemented)
- [ ] All form fields render correctly
- [ ] Required fields marked with *
- [ ] Item name input works
- [ ] Description input works (textarea)
- [ ] Category input works
- [ ] Unit input works
- [ ] Price input accepts decimals
- [ ] Currency field works
- [ ] Discount percentage calculates correctly
- [ ] Discounted price shows calculated value
- [ ] Availability toggle works
- [ ] Start/end time inputs work
- [ ] Stock quantity input works
- [ ] Reorder level input works
- [ ] Status selector works (ACTIVE, INACTIVE, DISCONTINUED)
- [ ] Form validation prevents empty name/category/price
- [ ] Submit button shows loading state
- [ ] Success message appears
- [ ] Item appears in catalog list
- [ ] Item data correct in list

#### View Catalog List
- [ ] All items display in list
- [ ] Item name visible
- [ ] Item category visible
- [ ] Item price visible with currency symbol
- [ ] Discount percentage visible (if applicable)
- [ ] Status badge shows correct color
- [ ] Description shows (truncated if long)
- [ ] Search field visible at top
- [ ] Search filters by name
- [ ] Search filters by category
- [ ] Search is case-insensitive
- [ ] FAB button visible and functional
- [ ] Pull-to-refresh works
- [ ] Loading indicator shows when loading
- [ ] Empty state shows if no items
- [ ] "Add First Item" button visible when empty

#### Edit Catalog Item
- [ ] Edit button visible on each item
- [ ] Edit screen opens with correct item data
- [ ] Form pre-fills all fields
- [ ] Can edit name
- [ ] Can edit description
- [ ] Can edit price
- [ ] Can edit discount
- [ ] Can edit availability
- [ ] Can edit stock quantity
- [ ] Can edit status
- [ ] Form validation works
- [ ] Submit button updates item
- [ ] Success message appears
- [ ] Changes visible in catalog list
- [ ] Changes persist on reload

#### Delete Catalog Item
- [ ] Delete button visible on each item
- [ ] Confirmation dialog appears on delete
- [ ] Can cancel deletion
- [ ] Deletion removes item from list
- [ ] Item removed from backend (verified in API)
- [ ] Success message appears
- [ ] Item doesn't reappear on refresh

### 4. Navigation

#### Bottom Tab Navigation
- [ ] "My Shop" tab visible
- [ ] "Catalog" tab visible
- [ ] Correct icons show for each tab
- [ ] Active tab highlighted correctly
- [ ] Switching tabs works smoothly
- [ ] Tab state persists on switch
- [ ] No navigation errors in console

#### Stack Navigation
- [ ] Back button works (where applicable)
- [ ] Can navigate from catalog list to detail
- [ ] Can navigate back from detail to list
- [ ] Can navigate to edit screens
- [ ] Can navigate back from edit screens
- [ ] Back button doesn't appear on main screens
- [ ] Header titles correct on each screen
- [ ] Animations smooth

### 5. UI/UX

#### Responsiveness
- [ ] App works on small screens (6")
- [ ] App works on medium screens (6.5")
- [ ] App works on large screens (7"+)
- [ ] Text readable on all sizes
- [ ] Buttons easily tappable
- [ ] No text overflow
- [ ] No layout shifts
- [ ] Forms fit on screen without scrolling (mostly)
- [ ] Web version responsive
- [ ] Safe area respected (notches, home bar)

#### Visual Design
- [ ] Purple color scheme consistent (#6C63FF)
- [ ] Button colors appropriate
- [ ] Status badges colors meaningful
- [ ] Cards have proper shadows
- [ ] Spacing consistent throughout
- [ ] Icons display correctly
- [ ] Fonts readable
- [ ] No blurry text
- [ ] Loading spinners visible

#### User Feedback
- [ ] Loading indicators show during API calls
- [ ] Error messages clear and helpful
- [ ] Success messages appear for actions
- [ ] Confirmation dialogs appear for destructive actions
- [ ] Toast notifications (if implemented) work
- [ ] Buttons disable during loading
- [ ] No duplicate API calls

### 6. API Integration

#### Sign Up API
- [ ] POST /api/shops called correctly
- [ ] Shop data sent correctly
- [ ] Response received without errors
- [ ] Shop ID stored from response
- [ ] Error message shows if API fails

#### Shop APIs
- [ ] GET /api/shops/{id} works
- [ ] PUT /api/shops/{id} works
- [ ] Shop updates reflected in UI
- [ ] Error handling works

#### Catalog APIs
- [ ] POST /api/catalogs creates items
- [ ] GET /api/catalogs/shop/{id} loads items
- [ ] PUT /api/catalogs/{id} updates items
- [ ] DELETE /api/catalogs/{id} removes items
- [ ] All responses handled correctly

#### QR Code API
- [ ] POST /api/shops/{id}/generate-qr works
- [ ] QR code returned as base64 PNG
- [ ] QR code displays in UI
- [ ] GET /api/shops/{id}/qr works
- [ ] Error handling works

### 7. Data Persistence

#### Local Storage
- [ ] Auth token saved after login
- [ ] Shop ID saved after signup
- [ ] User data persists on reload
- [ ] Logout clears stored data

#### API Requests
- [ ] Token sent in Authorization header
- [ ] API validates token
- [ ] Expired token triggers logout
- [ ] Multiple concurrent requests work

### 8. Error Handling

#### Network Errors
- [ ] Offline mode handled gracefully
- [ ] Error message shows for failed API calls
- [ ] User can retry failed operations
- [ ] No app crashes on network error

#### Validation Errors
- [ ] Empty field validation works
- [ ] Email format validation works
- [ ] Number format validation works
- [ ] Error messages specific and helpful
- [ ] Form doesn't submit with errors

#### API Errors
- [ ] 400 errors handled (bad request)
- [ ] 401 errors handled (unauthorized)
- [ ] 404 errors handled (not found)
- [ ] 500 errors handled (server error)
- [ ] User sees appropriate message

### 9. Performance

#### Loading Times
- [ ] Initial app load < 3 seconds
- [ ] Sign in < 2 seconds
- [ ] Catalog load < 2 seconds
- [ ] Item creation < 2 seconds
- [ ] Item update < 2 seconds
- [ ] QR generation < 3 seconds

#### Memory Usage
- [ ] No memory leaks (check React DevTools)
- [ ] App doesn't crash with large catalog
- [ ] Smooth scrolling through long lists
- [ ] No lag when typing

#### File Size
- [ ] APK size < 100MB (if too large, optimize)
- [ ] App loads quickly on slow internet

### 10. Security

#### Authentication
- [ ] Password not visible in plain text
- [ ] Password fields are secure input type
- [ ] Session token stored securely
- [ ] Logout clears token
- [ ] Can't access app screens without login

#### Data Protection
- [ ] Sensitive data not logged to console
- [ ] No hardcoded credentials in code
- [ ] Environment variables used for keys
- [ ] .env.local not committed to git
- [ ] API calls use HTTPS

#### Input Sanitization
- [ ] Special characters handled correctly
- [ ] SQL injection not possible
- [ ] XSS attacks not possible
- [ ] Long inputs handled (truncated or limited)

### 11. Platform-Specific

#### Android
- [ ] App installs via APK
- [ ] Runs on Android 5.0+
- [ ] Camera permissions handled (if used)
- [ ] Storage permissions handled (for QR share)
- [ ] App doesn't crash on permission denial
- [ ] Back button works correctly
- [ ] Navigation drawer works (if used)

#### iOS
- [ ] App installs via TestFlight or direct
- [ ] Runs on iOS 12.0+
- [ ] Permissions requests work
- [ ] Safe area respected
- [ ] Bottom home indicator space handled
- [ ] Swipe back gesture works

#### Web
- [ ] App loads in modern browsers
- [ ] Works in Chrome, Firefox, Safari
- [ ] Responsive design works
- [ ] Touch/mouse input works
- [ ] Keyboard navigation works
- [ ] No console errors

### 12. Deployment Readiness

#### Code Quality
- [ ] No console errors
- [ ] No console warnings (optional)
- [ ] TypeScript types correct
- [ ] No commented debug code
- [ ] Functions documented
- [ ] Code follows naming conventions

#### Testing
- [ ] All features tested
- [ ] Edge cases tested
- [ ] Error scenarios tested
- [ ] Large data sets tested
- [ ] Slow network tested

#### Documentation
- [ ] README.md complete
- [ ] DEPLOYMENT.md complete
- [ ] FIREBASE_SETUP.md complete
- [ ] Code comments present
- [ ] Installation instructions clear

#### Build Configuration
- [ ] app.json configured
- [ ] package.json correct
- [ ] eas.json configured
- [ ] Icons and splash screens ready
- [ ] Signing key ready
- [ ] Version numbers correct

---

## 🚀 Testing Before Submission

### Local Testing Checklist
- [ ] Test on real Android device (if possible)
- [ ] Test on iOS simulator or device
- [ ] Test on web browser
- [ ] Test with poor network connection
- [ ] Test with app in background/foreground
- [ ] Test after installing fresh
- [ ] Test on different screen sizes

### Before Play Store Submission
- [ ] All checklist items above passing
- [ ] Privacy policy created and linked
- [ ] Screenshots captured (1280x720 or 1440x810)
- [ ] App description written
- [ ] Release notes written
- [ ] Icons and graphics prepared
- [ ] Tested on physical devices
- [ ] No crashes reported
- [ ] All features working
- [ ] Permissions justified

---

## 🐛 Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| Firebase not initializing | Check `.env.local` has all variables |
| API calls timeout | Verify backend is running |
| QR code not showing | Ensure backend returns `qr_code` field |
| Build fails | Run `npm install --legacy-peer-deps` again |
| App crashes on startup | Check Firebase config in `src/config/firebase.ts` |

---

## 📝 Test Results

Record test results here:

```
Date: ____________
Tester: __________
Device: __________
OS Version: ______
App Version: _____

Total Tests: ____ / ____
Passed: ____ ✅
Failed: ____ ❌
Warnings: ____ ⚠️

Notes:
_________________________________________________________________
_________________________________________________________________
```

---

## ✅ Final Approval

- [ ] All critical features tested and working
- [ ] No major bugs found
- [ ] Performance acceptable
- [ ] UI/UX meets expectations
- [ ] Ready for deployment
- [ ] Documentation complete

**Approved by**: ________________  
**Date**: ________________  
**Ready for Play Store**: ✅ YES / ❌ NO

---

Good luck with your deployment! 🚀

