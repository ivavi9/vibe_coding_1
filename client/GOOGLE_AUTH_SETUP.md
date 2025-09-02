# Google OAuth Authentication Setup

## Prerequisites
- Google Cloud Console account
- Node.js and npm installed
- Backend server running on port 8000

## Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (for development)
   - `https://yourdomain.com/auth/callback` (for production)
7. Copy the Client ID

## Step 2: Environment Configuration

Create a `.env` file in the `client` directory:

```bash
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Backend API URL
REACT_APP_API_URL=http://localhost:8000
```

## Step 3: Backend API Endpoints

Your backend needs these endpoints:

### 1. Google OAuth Callback
```
POST /api/v1/auth/google/callback
Body: { "code": "oauth_code" }
Response: { "access_token": "jwt_token", "user": {...} }
```

### 2. Token Validation
```
GET /api/v1/auth/validate
Headers: Authorization: Bearer <token>
Response: { "user": {...} }
```

### 3. Logout
```
POST /api/v1/auth/logout
Headers: Authorization: Bearer <token>
Response: { "message": "Logged out successfully" }
```

## Step 4: User Model

Your backend user model should include:
- `id`: Unique identifier
- `email`: User's email address
- `name`: User's full name
- `picture`: Profile picture URL (optional)
- `created_at`: Account creation timestamp

## Step 5: Testing

1. Start your backend server
2. Start your frontend: `npm run dev`
3. Navigate to `/auth`
4. Click "Continue with Google"
5. Complete OAuth flow
6. You should be redirected to `/goals`

## Security Notes

- Always validate OAuth state parameter
- Use HTTPS in production
- Implement proper JWT token validation
- Store sensitive data securely
- Implement rate limiting on auth endpoints

## Troubleshooting

### Common Issues:
1. **"Invalid redirect_uri"**: Check your Google Cloud Console redirect URIs
2. **"Client ID not found"**: Verify your environment variables
3. **"OAuth state mismatch"**: Check if cookies/localStorage is working
4. **"Backend connection failed"**: Ensure backend is running on port 8000

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded
3. Check network tab for API calls
4. Verify Google Cloud Console configuration
