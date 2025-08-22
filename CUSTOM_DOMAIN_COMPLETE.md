# Complete Custom Domain Setup Guide

## 🌐 Final Domain Structure:
- **Website**: https://projectconnect.tech
- **API**: https://api.projectconnect.tech
- **WWW**: https://www.projectconnect.tech (redirects to main)

## Phase 1: DNS Configuration (Do This First)

### Go to your domain provider (where you bought projectconnect.tech) and add:

```
Record Type    Name    Target                                          TTL
CNAME         @       projectconnect-frontend-parthd-2025.azurewebsites.net    300
CNAME         api     projectconnect-backend-parthd-2025.azurewebsites.net     300  
CNAME         www     projectconnect-frontend-parthd-2025.azurewebsites.net    300
```

**If your provider doesn't support CNAME for @ (root domain):**
1. Get IP from Azure Portal → projectconnect-frontend-parthd-2025 → Custom domains
2. Use A record instead:
```
Record Type    Name    Target                                          TTL
A             @       [IP from Azure]                                 300
CNAME         api     projectconnect-backend-parthd-2025.azurewebsites.net     300
CNAME         www     projectconnect-frontend-parthd-2025.azurewebsites.net    300
```

## Phase 2: Azure Configuration

### Frontend Domain (projectconnect.tech):
1. **Azure Portal** → **App Services** → **projectconnect-frontend-parthd-2025**
2. **Settings** → **Custom domains** → **+ Add custom domain**
3. **Domain**: `projectconnect.tech` → **Validate** → **Add**
4. **SSL**: Click domain → **Add binding** → **SNI SSL** → **App Service Managed Certificate**
5. **Repeat for**: `www.projectconnect.tech`

### Backend Domain (api.projectconnect.tech):
1. **Azure Portal** → **App Services** → **projectconnect-backend-parthd-2025**
2. **Settings** → **Custom domains** → **+ Add custom domain**
3. **Domain**: `api.projectconnect.tech` → **Validate** → **Add**
4. **SSL**: Click domain → **Add binding** → **SNI SSL** → **App Service Managed Certificate**

## Phase 3: Deploy Updated Configuration

**⚠️ IMPORTANT**: Only do this AFTER DNS is configured and Azure domains are added!

```bash
cd "d:\project 222\project-connect"
git add .
git commit -m "Switch to custom domain api.projectconnect.tech"
git push origin main
```

## Phase 4: Verification

### Test URLs (after 15-60 minutes):
- **Frontend**: https://projectconnect.tech
- **Backend Health**: https://api.projectconnect.tech/health
- **WWW Redirect**: https://www.projectconnect.tech

### DNS Propagation Check:
- Use: https://dnschecker.org
- Check: projectconnect.tech, api.projectconnect.tech, www.projectconnect.tech

## Timeline:
- **DNS Setup**: 5 minutes
- **Azure Domain Config**: 10 minutes  
- **DNS Propagation**: 15 minutes - 24 hours
- **SSL Certificate**: 5-15 minutes after domain validation

## Benefits:
✅ **Professional URLs**: Clean, branded domains
✅ **SEO Friendly**: Better search engine optimization  
✅ **Easy to Remember**: projectconnect.tech
✅ **Unified Platform**: Everything under one domain
✅ **Free SSL**: Automatic HTTPS certificates

## Ready to Start?
1. **First**: Configure DNS at your domain provider
2. **Second**: Set up Azure custom domains  
3. **Third**: Deploy the updated configuration
4. **Finally**: Test everything works!

Your professional ProjectConnect platform will be live at projectconnect.tech! 🚀
