# Azure Static Web Apps Configuration

## Fill in these EXACT values in the Azure portal:

### **Basics Tab:**
- **Subscription**: Your subscription (already selected)
- **Resource Group**: Use existing (same as backend)
- **Name**: `projectconnect-static`
- **Plan Type**: Free
- **Azure Functions and staging details**: 
  - Region: Central US (same as your backend)

### **Deployment Details:**
- **Source**: GitHub
- **GitHub Account**: Sign in if needed
- **Organization**: `parthd45`
- **Repository**: `projectconnect`
- **Branch**: `main`

### **Build Details:**
- **Build Presets**: React ⭐ (IMPORTANT)
- **App location**: `/client` ⭐ (IMPORTANT)
- **Api location**: (leave empty)
- **Output location**: `build` ⭐ (IMPORTANT)

## After Creation:
1. Azure will automatically create GitHub Actions workflow
2. Your app will deploy in 1-2 minutes
3. You'll get a URL like: `https://wonderful-sea-123456.2.azurestaticapps.net`

## Then Add Environment Variable:
1. Go to your new Static Web App
2. Settings → Configuration  
3. Add:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://projectconnect-backend-parthd-2025.azurewebsites.net/api`

## Ready to go! This will solve your 10+ minute deployment problem!
