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
7. Copy the Client ID and Client Secret

## Step 2: Environment Configuration

### Backend Configuration (Root `.env` file)
Add these to your root `.env` file:

```bash
# Google OAuth Configuration (PRIVATE - keep secret!)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# JWT Configuration
JWT_SECRET_KEY=your-super-secure-jwt-secret-key-here
SECRET_KEY=your-app-secret-key-here
```

### Frontend Configuration (Client `.env` file)
Create a `.env` file in the `client` directory:

```bash
# Google OAuth Configuration (PUBLIC - safe to expose)
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
VITE_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Backend API URL
VITE_API_URL=http://localhost:8000
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

- **NEVER commit `.env` files to git** - they're already in `.gitignore`
- **Client Secret stays in backend only** - never expose to frontend
- Always validate OAuth state parameter
- Use HTTPS in production
- Implement proper JWT token validation
- Store sensitive data securely
- Implement rate limiting on auth endpoints
- Use different client IDs/secrets for dev/staging/production

## Troubleshooting

### Common Issues:
1. **"Invalid redirect_uri"**: Check your Google Cloud Console redirect URIs
2. **"Client ID not found"**: Verify your environment variables are loaded
3. **"OAuth state mismatch"**: Check if cookies/localStorage is working
4. **"Backend connection failed"**: Ensure backend is running on port 8000
5. **"Client secret invalid"**: Verify backend `.env` has correct secret

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are loaded (use `console.log` in dev)
3. Check network tab for API calls
4. Verify Google Cloud Console configuration
5. Ensure `.env` files are in correct locations

## File Structure
```
progress_tracker/
├── .env                    ← Backend config (Google OAuth + JWT secrets)
├── client/
│   ├── .env               ← Frontend config (public OAuth vars)
│   └── src/
└── server/                 ← Backend (uses root .env)
```
