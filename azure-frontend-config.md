# Azure Frontend Configuration

## Required App Settings for projectconnect-frontend-parthd-2025

The frontend needs these environment variables to be set in Azure App Service:

```bash
# API URL pointing to backend
REACT_APP_API_URL=https://projectconnect-backend-parthd-2025.azurewebsites.net/api

# Build configuration
PROJECT=client
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=20.x
```

## How to Configure:

1. Go to Azure Portal: https://portal.azure.com
2. Navigate to App Services > projectconnect-frontend-parthd-2025
3. Go to Settings > Configuration
4. Add Application Settings:
   - Name: `REACT_APP_API_URL`, Value: `https://projectconnect-backend-parthd-2025.azurewebsites.net/api`
   - Name: `PROJECT`, Value: `client`
   - Name: `NODE_ENV`, Value: `production`
   - Name: `WEBSITE_NODE_DEFAULT_VERSION`, Value: `20.x`

5. Save and restart the app service

## Testing URLs:
- Frontend: https://projectconnect-frontend-parthd-2025.azurewebsites.net
- Backend: https://projectconnect-backend-parthd-2025.azurewebsites.net
- Backend Health: https://projectconnect-backend-parthd-2025.azurewebsites.net/health
