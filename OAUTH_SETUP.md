# OAuth Setup Guide

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application" as the application type
6. Add these URLs:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
7. Copy the Client ID and Client Secret to your `.env` file

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - Application name: ProjectConnect
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3001/api/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

## Environment Variables

Update your `server/.env` file with the actual OAuth credentials:

```
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret
GITHUB_CLIENT_ID=your_actual_github_client_id
GITHUB_CLIENT_SECRET=your_actual_github_client_secret
SESSION_SECRET=generate_a_random_session_secret_for_oauth
```

## Testing OAuth

1. Make sure both servers are running:
   - Backend: `npm start` in `server/` directory (port 3001)
   - Frontend: `npm start` in `client/` directory (port 3000)

2. Visit `http://localhost:3000/login` or `http://localhost:3000/signup`

3. Click on "Continue with Google" or "Continue with GitHub" buttons

4. Complete the OAuth flow and you should be redirected back to the dashboard

## OAuth Flow

1. User clicks OAuth button → Frontend redirects to backend OAuth route
2. Backend redirects to Google/GitHub OAuth authorization
3. User authorizes → OAuth provider redirects to callback URL
4. Backend processes OAuth callback → Creates/updates user → Generates JWT
5. Backend redirects to frontend OAuth success page with token
6. Frontend processes token → Updates auth state → Redirects to dashboard

## Notes

- OAuth users don't need passwords (password field is nullable)
- Google and GitHub IDs are stored separately and are unique
- JWT tokens are generated the same way as regular login
- Session middleware is used for OAuth flow security
