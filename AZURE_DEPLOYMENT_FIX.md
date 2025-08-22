# Azure App Service Configuration Fix

## Required App Settings for Backend:

1. Go to Azure Portal → Your App → Configuration → Application settings

2. Add these settings one by one:

PROJECT=server
NODE_ENV=production
PORT=8080
WEBSITE_NODE_DEFAULT_VERSION=18.17.0

# Database and secrets (update with your actual values)
DATABASE_URL=your_railway_database_url_here
JWT_SECRET=your_jwt_secret_32_chars_minimum
SESSION_SECRET=your_session_secret_32_chars_minimum

# Optional for now (can add later)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id  
GITHUB_CLIENT_SECRET=your_github_client_secret

CLIENT_URL=https://your-frontend-app.azurewebsites.net

## For Frontend App Settings:

PROJECT=client
REACT_APP_API_URL=https://your-backend-app.azurewebsites.net/api

## After adding settings:
1. Click Save
2. Go to Deployment Center
3. Click "Sync" to redeploy
