# VolleyStats Authentication System

This document describes the secure authentication and registration system implemented in VolleyStats.

## Features

### Backend Security Features
- **JWT-based Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing with salt
- **Input Validation**: Comprehensive validation for all user inputs
- **Password Strength Requirements**: 
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **Account Security**: Account enabled/disabled status
- **Role-based Access**: User and Admin roles
- **CORS Configuration**: Secure cross-origin resource sharing
- **Security Headers**: HSTS, CSP, XSS protection, content type options

### Frontend Features
- **Responsive Design**: Mobile-friendly login and registration forms
- **Real-time Validation**: Client-side form validation with immediate feedback
- **Error Handling**: Comprehensive error messages for all scenarios
- **Toggle Interface**: Easy switching between login and registration
- **Secure Storage**: JWT tokens stored in localStorage with proper cleanup

## Default Admin Account

For testing purposes, a default admin account is created:

- **Email**: admin@volleyball.com
- **Password**: Admin123
- **Role**: ADMIN

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER"
  }
}
```

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123",
  "confirmPassword": "Password123",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "2",
    "email": "newuser@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "USER"
  }
}
```

#### POST /api/auth/logout
Logout (client-side token removal).

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
```

## Security Best Practices

### Password Security
- Passwords are never stored in plain text
- BCrypt hashing with configurable cost factor
- Password strength requirements enforced
- No password reuse allowed

### JWT Security
- Configurable secret key via environment variable
- Configurable expiration time
- Tokens stored securely in client
- Automatic cleanup on logout

### Input Validation
- Server-side validation for all inputs
- Client-side validation for immediate feedback
- SQL injection prevention through JPA
- XSS protection through security headers

### CORS Security
- Configurable allowed origins
- Secure cookie handling
- Proper header exposure
- Request method restrictions

## Environment Variables

### Backend Configuration
```bash
# JWT Configuration
JWT_SECRET=your_very_long_random_secret_key_here
JWT_EXPIRATION=86400000

# Database Configuration
DATABASE_URL=jdbc:h2:mem:testdb
DATABASE_USERNAME=sa
DATABASE_PASSWORD=password
```

## Usage Instructions

### For Users
1. Navigate to `/login` page
2. Choose between "Sign In" or "Create Account"
3. Fill in the required information
4. For registration, ensure password meets strength requirements
5. Submit the form

### For Developers
1. The system automatically creates the database schema
2. Default admin user is created on startup
3. JWT tokens are automatically included in API requests
4. Protected routes require valid authentication

## Error Handling

### Common Error Messages
- **Email already exists**: User with this email is already registered
- **Invalid email format**: Email address format is incorrect
- **Password too weak**: Password doesn't meet strength requirements
- **Passwords don't match**: Password confirmation doesn't match
- **Invalid credentials**: Email or password is incorrect
- **Account disabled**: Account has been deactivated

### Error Response Format
```json
{
  "error": "Error message here",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Testing

### Manual Testing
1. Start the backend application
2. Navigate to the frontend login page
3. Test registration with various inputs
4. Test login with valid/invalid credentials
5. Test logout functionality

### API Testing
Use tools like Postman or curl to test the authentication endpoints:
```bash
# Test registration
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","confirmPassword":"Test123","firstName":"Test","lastName":"User"}'

# Test login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

## Future Enhancements

- Email verification for new accounts
- Password reset functionality
- Two-factor authentication
- Account lockout after failed attempts
- Session management
- Audit logging
- OAuth integration (Google, Facebook, etc.)
