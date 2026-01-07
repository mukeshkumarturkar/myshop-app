# API Endpoint Fix - Using Correct OpenAPI Spec Endpoints

## Date: January 7, 2026

## ✅ **FIXED: Using Correct API Endpoints per OpenAPI Spec**

### 🎯 **Changes Made**

Fixed the API client and HomePage to use the correct endpoints as defined in the OpenAPI specification.

---

## 🔧 **API Endpoint Corrections**

### 1. Shop Details API ✅
**Endpoint**: `GET /api/shops/{id}`
- **Purpose**: Load shop information (name, owner, address, email, QR code, etc.)
- **Usage**: Already correct, no changes needed

### 2. Catalog API ✅ FIXED
**Old (Wrong)**: `GET /api/catalogs/search/shop/{shopId}`  
**New (Correct)**: `GET /api/catalogs/shop/{shopId}`

**File**: `/src/services/api.ts`
```typescript
// Before (WRONG)
const response = await this.client.get(`/api/catalogs/search/shop/${shopId}`);

// After (CORRECT per OpenAPI spec)
const response = await this.client.get(`/api/catalogs/shop/${shopId}`);
```

---

## 📋 **HomePage Flow**

The HomePage now makes **2 separate, independent API calls**:

### Call 1: Load Shop Details
```typescript
GET /api/shops/{id}
```
**Returns**:
```json
{
  "id": "695e07e6f6d54c7cbfe1bb3d",
  "name": "Pizza Palace",
  "owner": "John Doe",
  "address": "123 Main St",
  "email": "shop@example.com",
  "mobileCountryCode": "91",
  "mobileNumber": "9876543210",
  "qrCode": "data:image/png;base64,...",
  "qrCodeUrl": "https://myshop.soanch.com/web-menu?shopid=..."
}
```

### Call 2: Load Catalogs
```typescript
GET /api/catalogs/shop/{shopId}
```
**Returns**:
```json
[
  {
    "id": "cat001",
    "name": "Margherita Pizza",
    "category": "Pizza",
    "shopId": "695e07e6f6d54c7cbfe1bb3d",
    "unit": "piece",
    "price": {
      "currency": "INR",
      "value": 299.00
    },
    "availability": {
      "startTime": "09:00",
      "endTime": "22:00",
      "available": true
    }
  }
]
```

---

## 🔄 **HomePage Loading Sequence**

1. **Component mounts**
   ```
   useEffect(() => {
     loadShopData(); // Calls GET /api/shops/{id}
   }, []);
   ```

2. **Shop data loads**
   ```
   setShopData(shop);
   // Shop details now available for display
   ```

3. **useEffect triggers catalog load**
   ```
   useEffect(() => {
     if (shopData?.id) {
       loadCatalogs(shopData.id); // Calls GET /api/catalogs/shop/{shopId}
     }
   }, [shopData]);
   ```

4. **Catalogs load**
   ```
   setCatalogs(catalogsData);
   // Catalog list now available
   ```

---

## ✨ **Error Handling**

### If Shop API Fails
- Loading spinner shows indefinitely OR
- Error message: "No shop data available"
- User cannot proceed

### If Catalog API Fails (404 or Network Error)
- ✅ Shop details **still display**
- ✅ Yellow notification shows: "No catalogs found..."
- ✅ "Add Catalog" button **still works**
- ✅ QR code **still displays**
- ✅ Page remains functional

**This is the key improvement** - catalog failures don't block the page!

---

## 📊 **API Calls Made**

When HomePage loads, you'll see these API calls in the browser Network tab:

### 1st Call - Shop Details
```
Request: GET https://api.soanch.com/api/shops/695e07e6f6d54c7cbfe1bb3d
Status: 200 OK
Response: { id, name, owner, address, email, qrCode, qrCodeUrl }
```

### 2nd Call - Catalogs
```
Request: GET https://api.soanch.com/api/catalogs/shop/695e07e6f6d54c7cbfe1bb3d
Status: 200 OK (if catalogs exist) OR 404 (if no catalogs)
Response: [...catalog items...] OR error
```

---

## 🧪 **Testing**

### Expected Behavior

1. **Refresh browser** (Cmd+Shift+R)
2. **Sign up** or use **Test Mode**
3. **Observe Network tab**:
   - ✅ `GET /api/shops/{id}` called
   - ✅ `GET /api/catalogs/shop/{shopId}` called (NOT `/search/shop/`)

4. **If catalogs exist** (200 OK):
   - Shop details display
   - Catalog list displays
   - Edit/Delete buttons work

5. **If no catalogs** (404):
   - Shop details display ✅
   - Yellow notification: "No catalogs found..." ✅
   - "Add Catalog" button available ✅
   - Page fully functional ✅

---

## 📝 **Files Modified**

### 1. `/src/services/api.ts`
```typescript
// Line 534 (approximately)
async getCatalogsByShopId(shopId: string) {
  // Changed from: /api/catalogs/search/shop/${shopId}
  // Changed to:   /api/catalogs/shop/${shopId}
  const response = await this.client.get(`/api/catalogs/shop/${shopId}`);
  return response.data;
}
```

### 2. `/src/screens/HomePage.tsx`
**Reverted to use separate API calls:**
- Shop data loads via `getShop(shopId)`
- Catalogs load via `getCatalogsByShopId(shopId)`
- No attempt to extract catalogs from shop response
- Two independent API calls

---

## ✅ **Summary**

| Item | Status |
|------|--------|
| Catalog API endpoint fixed | ✅ `/api/catalogs/shop/{shopId}` |
| Shop API endpoint | ✅ `/api/shops/{id}` (already correct) |
| Two separate API calls | ✅ Shop + Catalogs |
| Error handling | ✅ Catalog fails = page still works |
| OpenAPI spec compliance | ✅ Matches specification |

---

## 🚀 **Next Steps**

The code is ready. Please:

1. **Refresh browser** (hard refresh: Cmd+Shift+R)
2. **Test the flow**
3. **Check Network tab** - should see correct endpoints being called
4. **Verify** shop details and catalogs both load

---

**Status**: ✅ **FIXED - Ready to Test**  
**Changes**: API endpoint corrected to match OpenAPI spec  
**Result**: HomePage now uses 2 correct, independent API calls! 🎉

