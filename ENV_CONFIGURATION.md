# Environment Configuration Guide

## API Endpoints

### Production API
```
Base URL: https://api.soanch.com/api
```

### Available Endpoints

#### Authentication
```
POST   /shops                    - Create new shop
POST   /shops/user              - Create user account
POST   /shops/auth              - Authenticate user (sign in)
POST   /shops/reset-password    - Reset password
```

#### Shop Management
```
GET    /shops                   - Get all shops
GET    /shops/:id               - Get shop by ID
PUT    /shops/:id               - Update shop details
DELETE /shops/:id               - Delete shop
GET    /shops/search/name       - Search shops by name
GET    /shops/search/owner      - Search shops by owner
GET    /shops/:id/menus         - Get shop menu
```

#### QR Code
```
POST   /shops/:id/generate-qr   - Generate QR code
GET    /shops/:id/qr            - Get QR code
GET    /shops/qr/list           - Get all QR codes
```

#### Catalog
```
GET    /catalogs                - Get all catalogs
POST   /catalogs                - Create catalog
GET    /catalogs/:id            - Get catalog by ID
PUT    /catalogs/:id            - Update catalog
DELETE /catalogs/:id            - Delete catalog
GET    /catalogs/shop/:id       - Get catalogs by shop
GET    /catalogs/category/:name - Get catalogs by category
GET    /catalogs/shop/:id/category/:name - Get catalogs by shop and category
GET    /catalogs/price-range    - Get catalogs by price range
GET    /catalogs/available/:id  - Get available catalogs
PATCH  /catalogs/:id/status     - Update catalog status
```

---

## Environment Variables

### Setup Instructions

1. **Create `.env` file in project root**
   ```bash
   cd /Users/mukeshkumar/Work/IdeaProjects/MyShop/MyShopApp
   touch .env
   ```

2. **Add environment variables**
   ```env
   # Production (Default)
   EXPO_PUBLIC_API_URL=https://api.soanch.com/api

   # Development (Local Testing)
   # EXPO_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Restart Metro Bundler**
   ```bash
   # Stop current process
   Ctrl+C

   # Start again
   npm start
   ```

### Environment File Locations

```
MyShop/
├── .env                    ← Create here
├── .env.local             ← Optional: local overrides
├── .env.production        ← Optional: production specific
└── MyShopApp/
    ├── .env               ← Can also create here
    └── package.json
```

---

## API Configuration Details

### Base URL
```typescript
// Automatically loaded from environment variable
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.soanch.com/api';
```

### Request Configuration
```typescript
{
  baseURL: 'https://api.soanch.com/api',
  timeout: 10000,              // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
}
```

### Auto-Attached Headers
```typescript
// Authorization header automatically added
Authorization: `Bearer ${token}`

// Token comes from AsyncStorage
// Automatically attached by request interceptor
```

### Response Handling
```typescript
// Success (2xx status)
→ Return response data

// Error (4xx, 5xx status)
→ 401 Unauthorized: Clear token and logout
→ Other errors: Return error response
```

---

## API Request/Response Examples

### Sign Up (Create Shop)
```
Request:
POST https://api.soanch.com/api/shops
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

Response:
{
  "_id": "shop-id-12345",
  "name": "Pizza Palace",
  "address": "123 Main St",
  "owner": "John Doe",
  "email": "john@example.com",
  "mobile_country_code": "91",
  "mobile_number": "9876543210",
  "theme": {...},
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-05T10:00:00Z"
}
```

### Create User Account
```
Request:
POST https://api.soanch.com/api/shops/user
{
  "shopId": "shop-id-12345",
  "password": "password123",
  "confirmPassword": "password123"
}

Response:
{
  "userId": "user-id-xyz",
  "shopId": "shop-id-12345",
  "email": "john@example.com",
  "message": "User created successfully"
}
```

### Sign In (Authenticate)
```
Request:
POST https://api.soanch.com/api/shops/auth
{
  "userId": "john@example.com",
  "password": "password123"
}

Response:
{
  "userId": "user-id-xyz",
  "shopId": "shop-id-12345",
  "shopName": "Pizza Palace",
  "ownerName": "John Doe",
  "email": "john@example.com",
  "token": "jwt-token-here"
}
```

---

## Testing API Endpoints

### Using cURL
```bash
# Test shop creation
curl -X POST https://api.soanch.com/api/shops \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Shop",
    "address": "123 Test St",
    "owner": "Test Owner",
    "email": "test@example.com"
  }'

# Test authentication
curl -X POST https://api.soanch.com/api/shops/auth \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test@example.com",
    "password": "password123"
  }'
```

### Using Postman
1. **Import API Collection**
   - Create new POST request
   - URL: `https://api.soanch.com/api/shops`
   - Headers: `Content-Type: application/json`
   - Body: JSON with shop details

2. **Add Authorization**
   - Type: Bearer Token
   - Token: JWT token from login response

---

## Troubleshooting API Issues

### Issue: "Cannot connect to API"
**Possible Causes**:
1. API URL incorrect in `.env` file
2. API server not running
3. Network connectivity issue
4. CORS configuration on server

**Solution**:
1. Verify `EXPO_PUBLIC_API_URL` is correct
2. Check server is running: `https://api.soanch.com/api/shops`
3. Check network connectivity
4. Check browser console for CORS errors

### Issue: "Request timeout"
**Possible Causes**:
1. API server slow/overloaded
2. Network latency
3. Timeout set too low (currently 10s)

**Solution**:
1. Check API server status
2. Check network connectivity
3. Increase timeout in api.ts if needed

### Issue: "401 Unauthorized"
**Possible Causes**:
1. Token expired
2. Token not sent
3. Invalid token

**Solution**:
1. Token automatically cleared on 401
2. User redirected to sign in
3. Force sign in again

### Issue: "Wrong API URL being used"
**Debug Steps**:
1. Check console logs for "🔴 API Client: Base URL ="
2. Verify `.env` file exists
3. Verify `EXPO_PUBLIC_API_URL` is set
4. Restart Metro Bundler

---

## API Response Status Codes

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Authentication failed or token expired |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Server error occurred |
| 503 | Service Unavailable | Server temporarily unavailable |

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] `.env` file contains `EXPO_PUBLIC_API_URL=https://api.soanch.com/api`
- [ ] All API endpoints tested and working
- [ ] HTTPS enabled for all requests
- [ ] CORS configured on server
- [ ] Authentication tokens working
- [ ] Error messages appropriate
- [ ] Network timeout adequate
- [ ] No console errors during testing

### Build and Deploy

```bash
# Web deployment
cd MyShopApp
expo export --platform web
# Deploy ./dist folder to hosting

# Mobile deployment
# iOS
eas build --platform ios

# Android
eas build --platform android
```

### Verify Production

1. Build app with production `.env`
2. Test authentication flow
3. Test catalog operations
4. Test shop management
5. Verify no console errors
6. Check API logs for requests

---

## Security Considerations

### HTTPS
- ✅ All requests use HTTPS
- ✅ No sensitive data in URLs
- ✅ SSL certificate valid

### Token Management
- ✅ JWT tokens stored securely
- ✅ Tokens cleared on logout
- ✅ 401 errors handled properly
- ✅ Token auto-attached to requests

### Data Protection
- ✅ Passwords never logged
- ✅ Tokens never exposed
- ✅ Error messages sanitized
- ✅ No sensitive data in Redux logs

---

## API Monitoring

### Check API Status
```bash
# Ping API
curl https://api.soanch.com/api/health

# Get API version
curl https://api.soanch.com/api/version
```

### View API Logs
- Access API admin dashboard
- Check request logs
- Monitor error rates
- Track performance metrics

### Performance Metrics
- Response times
- Success/failure rates
- Timeout occurrences
- Network issues

---

## Useful Links

- **API Documentation**: https://api.soanch.com/docs
- **API Status**: https://api.soanch.com/status
- **Admin Dashboard**: https://api.soanch.com/admin
- **Support**: support@soanch.com

---

## Environment Variables Summary

```env
# Required for all deployments
EXPO_PUBLIC_API_URL=https://api.soanch.com/api

# Optional: Local development override
# EXPO_PUBLIC_API_URL=http://localhost:8080/api

# Optional: Firebase (if using)
# EXPO_PUBLIC_FIREBASE_API_KEY=...
# EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
```

---

## Testing Credentials

### Production API Test Account
```
Email: test@example.com
Password: Test@123456
Shop: Test Shop
```

### Create Test Account
1. Go to Sign Up screen
2. Fill in shop details
3. Create account
4. Note credentials for testing

---

**Last Updated**: January 5, 2026
**API Host**: api.soanch.com
**Status**: Production Ready

