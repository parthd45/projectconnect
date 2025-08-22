# Migration Script: Switch to Azure Static Web Apps

## Current Situation:
- ❌ **Azure App Service**: 10+ minute deployments, complex setup
- ✅ **Backend**: Working perfectly on Azure App Service

## New Setup:
- ✅ **Azure Static Web Apps**: 1-2 minute deployments
- ✅ **Backend**: Keep existing (no changes needed)

## Step-by-Step Migration:

### 1. Create Azure Static Web App
```
1. Go to: https://portal.azure.com/#create/Microsoft.StaticApp
2. Fill in:
   - Subscription: Your subscription
   - Resource Group: Use existing
   - Name: projectconnect-static
   - Plan: Free
   - Region: Central US (same as backend)
   - Deployment Source: GitHub
   - GitHub account: Sign in
   - Organization: parthd45
   - Repository: projectconnect
   - Branch: main
   - Build Presets: React
   - App location: /client
   - Api location: (leave empty)
   - Output location: build
3. Click "Review + create"
4. Click "Create"
```

### 2. Azure Will Automatically:
- ✅ Create GitHub Actions workflow
- ✅ Deploy your React app
- ✅ Provide a URL like: https://calm-hill-12345.azurestaticapps.net
- ⚡ **Deploy time**: 1-2 minutes!

### 3. Add Environment Variables (after creation):
```
1. Go to your new Static Web App in Azure Portal
2. Settings → Configuration
3. Add Application Setting:
   - Name: REACT_APP_API_URL
   - Value: https://projectconnect-backend-parthd-2025.azurewebsites.net/api
4. Save
```

### 4. Custom Domain Setup (later):
```
1. Static Web Apps → Custom domains
2. Add custom domain: projectconnect.tech
3. Follow DNS instructions
4. Free SSL certificate automatically applied
```

### 5. Cleanup (after testing):
```
1. Test the new Static Web App URL
2. Verify all features work (login, dashboard, etc.)
3. Delete old App Service to save costs
4. Update any bookmarks/links
```

## Expected Results:
- ✅ **Deploy time**: 1-2 minutes (vs 10+ minutes)
- ✅ **All features working**: Login, dashboard, real-time updates
- ✅ **Better performance**: Global CDN
- ✅ **Lower cost**: Free tier available
- ✅ **Custom domain**: Easier setup

## Time to Complete: 5-10 minutes total!
