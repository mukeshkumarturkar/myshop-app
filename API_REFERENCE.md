# API Documentation - api.soanch.com

## Overview

All MyShop application APIs are hosted at **https://api.soanch.com/api**

This document provides complete API reference for the MyShop backend services.

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Shop Management APIs](#shop-management-apis)
3. [Catalog APIs](#catalog-apis)
4. [QR Code APIs](#qr-code-apis)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Authentication Headers](#authentication-headers)

---

## Authentication APIs

### Create Shop (Sign Up - Step 1)

**Endpoint**: `POST /shops`

**Description**: Create a new shop and register shop owner information.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Pizza Palace",
  "address": "123 Main Street, New York, NY",
  "owner": "John Doe",
  "email": "john@example.com",
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

**Response** (201 Created):
```json
{
  "_id": "shop-uuid-12345",
  "name": "Pizza Palace",
  "address": "123 Main Street, New York, NY",
  "owner": "John Doe",
  "email": "john@example.com",
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
  },
  "qr_code": null,
  "qr_code_url": null,
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-05T10:00:00Z"
}
```

**Error Responses**:
```json
// 400 Bad Request
{
  "message": "Validation failed",
  "errors": {
    "name": "Shop name is required",
    "email": "Invalid email format"
  }
}

// 409 Conflict
{
  "message": "Shop with this name already exists"
}
```

---

### Create User Account (Sign Up - Step 2)

**Endpoint**: `POST /shops/user`

**Description**: Create user login credentials for the shop owner.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "shopId": "shop-uuid-12345",
  "password": "SecurePassword123",
  "confirmPassword": "SecurePassword123"
}
```

**Response** (201 Created):
```json
{
  "userId": "user-uuid-xyz",
  "shopId": "shop-uuid-12345",
  "email": "john@example.com",
  "message": "User account created successfully"
}
```

**Error Responses**:
```json
// 400 Bad Request
{
  "message": "Password validation failed",
  "details": "Passwords do not match"
}

// 404 Not Found
{
  "message": "Shop not found"
}
```

---

### Authenticate User (Sign In)

**Endpoint**: `POST /shops/auth`

**Description**: Authenticate user with email/password and get JWT token.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "userId": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "userId": "user-uuid-xyz",
  "shopId": "shop-uuid-12345",
  "shopName": "Pizza Palace",
  "ownerName": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "message": "Authentication successful"
}
```

**Error Responses**:
```json
// 401 Unauthorized
{
  "message": "Invalid credentials"
}

// 404 Not Found
{
  "message": "User not found"
}
```

---

### Reset Password

**Endpoint**: `POST /shops/reset-password`

**Description**: Reset user password with old password verification.

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

**Request Body**:
```json
{
  "userId": "user-uuid-xyz",
  "oldPassword": "OldPassword123",
  "newPassword": "NewPassword456",
  "confirmNewPassword": "NewPassword456"
}
```

**Response** (200 OK):
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses**:
```json
// 400 Bad Request
{
  "message": "Password validation failed",
  "details": "Passwords do not match"
}

// 401 Unauthorized
{
  "message": "Old password is incorrect"
}
```

---

## Shop Management APIs

### Get All Shops

**Endpoint**: `GET /shops`

**Request Headers**:
```
Authorization: Bearer {jwt-token}
```

**Query Parameters**:
```
?page=1&limit=10&sort=name&order=asc
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "shop-uuid-12345",
      "name": "Pizza Palace",
      "owner": "John Doe",
      "email": "john@example.com",
      "address": "123 Main Street",
      "createdAt": "2026-01-05T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### Get Shop by ID

**Endpoint**: `GET /shops/:id`

**Description**: Get details of a specific shop by shop ID.

**Request Headers**:
```
Authorization: Bearer {jwt-token}
```

**URL Parameters**:
- `:id` - Shop ID (required)

**Response** (200 OK):
```json
{
  "_id": "shop-uuid-12345",
  "name": "Pizza Palace",
  "address": "123 Main Street, New York, NY",
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
  },
  "qr_code": "qr-code-uuid",
  "qr_code_url": "https://api.soanch.com/qr/qr-code-uuid.png",
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-05T10:00:00Z"
}
```

---

### Update Shop

**Endpoint**: `PUT /shops/:id`

**Description**: Update shop information.

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

**URL Parameters**:
- `:id` - Shop ID (required)

**Request Body** (all fields optional):
```json
{
  "name": "Pizza Palace Updated",
  "address": "456 Oak Avenue",
  "owner": "John Doe",
  "email": "newemail@example.com",
  "mobile_number": "9876543210",
  "theme": {
    "colors": {
      "primary": "#FF6B6B",
      "secondary": "#FFFFFF"
    }
  }
}
```

**Response** (200 OK):
```json
{
  "_id": "shop-uuid-12345",
  "name": "Pizza Palace Updated",
  "address": "456 Oak Avenue",
  "updatedAt": "2026-01-05T11:00:00Z"
}
```

---

### Delete Shop

**Endpoint**: `DELETE /shops/:id`

**Description**: Delete a shop and all associated data.

**Request Headers**:
```
Authorization: Bearer {jwt-token}
```

**URL Parameters**:
- `:id` - Shop ID (required)

**Response** (200 OK):
```json
{
  "message": "Shop deleted successfully"
}
```

---

## Catalog APIs

### Create Catalog

**Endpoint**: `POST /catalogs`

**Description**: Create a new product/item in the catalog.

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

**Request Body**:
```json
{
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza with tomato, mozzarella, and basil",
  "category": "Pizza",
  "shopId": "shop-uuid-12345",
  "unit": "piece",
  "price": {
    "currency": "INR",
    "value": 500,
    "discountPercentage": 10,
    "discountedPrice": 450
  },
  "availability": {
    "isAvailable": true,
    "startTime": "11:00 AM",
    "endTime": "11:00 PM",
    "availableDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  },
  "stock": {
    "quantity": 100,
    "unit": "piece",
    "reorderLevel": 10
  },
  "status": "ACTIVE"
}
```

**Response** (201 Created):
```json
{
  "_id": "catalog-uuid-xyz",
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza...",
  "category": "Pizza",
  "shopId": "shop-uuid-12345",
  "price": {
    "currency": "INR",
    "value": 500,
    "discountPercentage": 10,
    "discountedPrice": 450
  },
  "status": "ACTIVE",
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-05T10:00:00Z"
}
```

---

### Get All Catalogs

**Endpoint**: `GET /catalogs`

**Request Headers**:
```
Authorization: Bearer {jwt-token}
```

**Query Parameters**:
```
?page=1&limit=10&shopId=shop-uuid&category=Pizza
```

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "catalog-uuid-xyz",
      "name": "Margherita Pizza",
      "category": "Pizza",
      "shopId": "shop-uuid-12345",
      "price": {
        "value": 500,
        "discountedPrice": 450
      },
      "status": "ACTIVE"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### Get Catalog by ID

**Endpoint**: `GET /catalogs/:id`

**URL Parameters**:
- `:id` - Catalog ID (required)

**Response** (200 OK):
```json
{
  "_id": "catalog-uuid-xyz",
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza with tomato, mozzarella, and basil",
  "category": "Pizza",
  "shopId": "shop-uuid-12345",
  "unit": "piece",
  "price": {
    "currency": "INR",
    "value": 500,
    "discountPercentage": 10,
    "discountedPrice": 450
  },
  "availability": {
    "isAvailable": true,
    "startTime": "11:00 AM",
    "endTime": "11:00 PM"
  },
  "stock": {
    "quantity": 100,
    "unit": "piece"
  },
  "status": "ACTIVE",
  "createdAt": "2026-01-05T10:00:00Z"
}
```

---

### Update Catalog

**Endpoint**: `PUT /catalogs/:id`

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer {jwt-token}
```

**Request Body** (all fields optional):
```json
{
  "name": "Margherita Pizza Updated",
  "description": "Updated description",
  "price": {
    "value": 550
  },
  "stock": {
    "quantity": 80
  }
}
```

**Response** (200 OK):
```json
{
  "_id": "catalog-uuid-xyz",
  "name": "Margherita Pizza Updated",
  "updatedAt": "2026-01-05T11:00:00Z"
}
```

---

### Delete Catalog

**Endpoint**: `DELETE /catalogs/:id`

**Description**: Delete a catalog item.

**Request Headers**:
```
Authorization: Bearer {jwt-token}
```

**Response** (200 OK):
```json
{
  "message": "Catalog deleted successfully"
}
```

---

### Get Catalogs by Shop

**Endpoint**: `GET /catalogs/shop/:shopId`

**Description**: Get all catalogs for a specific shop.

**URL Parameters**:
- `:shopId` - Shop ID (required)

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "catalog-uuid-1",
      "name": "Margherita Pizza",
      "category": "Pizza"
    },
    {
      "_id": "catalog-uuid-2",
      "name": "Carbonara Pasta",
      "category": "Pasta"
    }
  ]
}
```

---

### Get Catalogs by Category

**Endpoint**: `GET /catalogs/category/:category`

**Description**: Get all catalogs of a specific category.

**URL Parameters**:
- `:category` - Category name (required)

**Response** (200 OK):
```json
{
  "data": [
    {
      "_id": "catalog-uuid-1",
      "name": "Margherita Pizza",
      "category": "Pizza",
      "shopId": "shop-uuid-12345"
    }
  ]
}
```

---

## QR Code APIs

### Generate QR Code

**Endpoint**: `POST /shops/:id/generate-qr`

**Description**: Generate a new QR code for the shop.

**Request Headers**:
```
Authorization: Bearer {jwt-token}
```

**URL Parameters**:
- `:id` - Shop ID (required)

**Query Parameters** (optional):
```
?domain=https://myshop.soanch.com
```

**Response** (201 Created):
```json
{
  "_id": "qr-uuid",
  "shopId": "shop-uuid-12345",
  "qrCode": "https://api.soanch.com/qr/qr-uuid.png",
  "qrCodeData": "https://shop.soanch.com/shop-uuid-12345",
  "createdAt": "2026-01-05T10:00:00Z"
}
```

---

### Get QR Code

**Endpoint**: `GET /shops/:id/qr`

**Description**: Get the QR code for a shop.

**URL Parameters**:
- `:id` - Shop ID (required)

**Response** (200 OK):
```json
{
  "_id": "qr-uuid",
  "shopId": "shop-uuid-12345",
  "qrCode": "https://api.soanch.com/qr/qr-uuid.png",
  "qrCodeData": "https://shop.soanch.com/shop-uuid-12345",
  "createdAt": "2026-01-05T10:00:00Z"
}
```

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "status": 400,
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "error detail"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Invalid request data |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Access denied |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

### Rate Limits

- **API calls**: 100 requests per minute per IP
- **Authentication**: 5 login attempts per minute per email

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1641379200
```

### Response (429 Too Many Requests)

```json
{
  "message": "Rate limit exceeded",
  "retryAfter": 60
}
```

---

## Authentication Headers

### Required Header Format

```
Authorization: Bearer {jwt-token}
```

### Obtaining JWT Token

1. Call `/shops/auth` with email and password
2. Receive JWT token in response
3. Include token in `Authorization` header for all authenticated requests

### Token Expiration

- Default: 24 hours (86400 seconds)
- Expired tokens return 401 Unauthorized
- Users must re-authenticate

---

## CORS Configuration

### Allowed Origins

- `https://api.soanch.com`
- `https://*.soanch.com`
- Local development: `http://localhost:*`

### Allowed Methods

- GET
- POST
- PUT
- DELETE
- PATCH
- OPTIONS

### Allowed Headers

- Content-Type
- Authorization
- X-Requested-With

---

## Changelog

### Version 1.0.0 (January 5, 2026)
- Initial API release
- Authentication endpoints
- Shop management
- Catalog management
- QR code generation

---

## Support

For API issues or questions:

**Email**: support@soanch.com
**Status Page**: https://api.soanch.com/status
**Documentation**: https://api.soanch.com/docs

---

**Base URL**: https://api.soanch.com/api
**Last Updated**: January 5, 2026
**Version**: 1.0.0

