# 🔐 Secure E-Commerce API Documentation

A secure backend API with JWT authentication, user-specific data protection, and comprehensive security measures.

## 🚀 Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **User-Specific Data**: Each user can only access their own data
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive validation and sanitization
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configured for specific origins

## 🔧 Setup

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables** (`.env`):
   ```env
   PORT=4000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=ecommerce_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

3. **Start Server**:
   ```bash
   npm run dev
   ```

## 🔐 Authentication

### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

## 🛡️ Protected Routes

All protected routes require the `Authorization` header:
```http
Authorization: Bearer your_jwt_token_here
```

## 📊 User Data Management

### Create User Data
```http
POST /api/user-data
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "My Important Note",
  "content": "This is some important content",
  "category": "personal",
  "isPrivate": true,
  "metadata": {
    "tags": ["important", "personal"],
    "priority": "high"
  }
}
```

### Get User Data
```http
GET /api/user-data
Authorization: Bearer your_jwt_token

# Optional query parameters:
GET /api/user-data?category=personal&isPrivate=true
```

### Get Single User Data
```http
GET /api/user-data/1
Authorization: Bearer your_jwt_token
```

### Update User Data
```http
PUT /api/user-data/1
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete User Data
```http
DELETE /api/user-data/1
Authorization: Bearer your_jwt_token
```

### Get User Data Statistics
```http
GET /api/user-data/stats
Authorization: Bearer your_jwt_token
```

## 👤 User Profile Management

### Get User Profile
```http
GET /api/profile
Authorization: Bearer your_jwt_token
```

### Update User Profile
```http
PUT /api/profile
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "dateOfBirth": "1990-01-01",
  "bio": "Software developer passionate about technology",
  "avatar": "https://example.com/avatar.jpg"
}
```

### Update User Preferences
```http
PUT /api/profile/preferences
Authorization: Bearer your_jwt_token
Content-Type: application/json

{
  "theme": "dark",
  "notifications": {
    "email": true,
    "push": false
  },
  "language": "en"
}
```

## 🔒 Security Features

### Rate Limiting
- **Authentication routes**: 5 requests per 15 minutes per IP
- **General API routes**: 100 requests per 15 minutes per IP
- **Data operations**: 50 requests per 15 minutes per IP

### Input Validation
- **Email validation**: Must be valid email format
- **Password requirements**: Minimum 6 characters, must contain uppercase, lowercase, and number
- **Data sanitization**: XSS prevention and HTML tag removal
- **SQL injection prevention**: Sequelize ORM with parameterized queries

### Security Headers
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer Policy
- And more via Helmet.js

## 🚨 Error Responses

### Authentication Errors
```json
{
  "success": false,
  "error": "Access token is required"
}
```

### Validation Errors
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### Authorization Errors
```json
{
  "success": false,
  "error": "Access denied - you can only access your own data"
}
```

### Rate Limit Errors
```json
{
  "success": false,
  "error": "Too many requests, please try again later"
}
```

## 🔧 Database Models

### User
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `createdAt`, `updatedAt`: Timestamps

### UserData
- `id`: Primary key
- `userId`: Foreign key to User (ensures data ownership)
- `title`: Data title
- `content`: Data content
- `category`: Optional category
- `isPrivate`: Boolean for privacy setting
- `metadata`: JSON field for additional data
- `createdAt`, `updatedAt`: Timestamps

### UserProfile
- `id`: Primary key
- `userId`: Foreign key to User (one-to-one relationship)
- `firstName`, `lastName`: Name components
- `phone`: Phone number
- `address`: Address
- `dateOfBirth`: Date of birth
- `avatar`: Avatar URL
- `bio`: User biography
- `preferences`: JSON field for user preferences
- `createdAt`, `updatedAt`: Timestamps

## 🧪 Testing

Use tools like Postman, Insomnia, or curl to test the API:

```bash
# Register a user
curl -X POST http://localhost:4000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"TestPass123"}'

# Login and get token
curl -X POST http://localhost:4000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'

# Use token to access protected routes
curl -X GET http://localhost:4000/api/user-data \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔐 Security Best Practices Implemented

1. **Password Security**: bcrypt hashing with salt
2. **JWT Security**: Secure token generation and verification
3. **Data Isolation**: Users can only access their own data
4. **Rate Limiting**: Protection against brute force attacks
5. **Input Validation**: Comprehensive validation and sanitization
6. **SQL Injection Prevention**: Sequelize ORM with parameterized queries
7. **XSS Prevention**: Input sanitization and CSP headers
8. **CORS Protection**: Configured for specific origins
9. **Security Headers**: Comprehensive security headers via Helmet.js
10. **Error Handling**: Secure error messages without information leakage
