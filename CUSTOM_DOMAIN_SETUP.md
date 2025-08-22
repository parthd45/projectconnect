# Custom Domain Setup Guide for ProjectConnect.tech

## Overview
You have the domain `projectconnect.tech` and need to configure it for:
- **Frontend**: `projectconnect.tech` (main domain)
- **Backend API**: `api.projectconnect.tech` (subdomain)

## Current Azure Applications
- **Frontend**: projectconnect-frontend-parthd-2025.azurewebsites.net
- **Backend**: projectconnect-backend-parthd-2025.azurewebsites.net

---

## Step 1: DNS Configuration

### A. Configure DNS Records at Your Domain Provider

Add these DNS records to your domain provider (where you bought projectconnect.tech):

```
Type    Name    Value                                           TTL
CNAME   @       projectconnect-frontend-parthd-2025.azurewebsites.net    300
CNAME   api     projectconnect-backend-parthd-2025.azurewebsites.net     300
CNAME   www     projectconnect-frontend-parthd-2025.azurewebsites.net    300
```

**Alternative for root domain (if CNAME @ doesn't work):**
```
Type    Name    Value                                           TTL
A       @       [Get IP from Azure - see Step 2]               300
CNAME   api     projectconnect-backend-parthd-2025.azurewebsites.net     300
CNAME   www     projectconnect-frontend-parthd-2025.azurewebsites.net    300
```

---

## Step 2: Azure Frontend Custom Domain Setup

### A. Get Frontend IP Address (if needed for A record)
1. Go to Azure Portal: https://portal.azure.com
2. Navigate to **App Services** → **projectconnect-frontend-parthd-2025**
3. Go to **Settings** → **Custom domains**
4. Note the IP address shown

### B. Add Custom Domain to Frontend
1. In **projectconnect-frontend-parthd-2025** → **Custom domains**
2. Click **+ Add custom domain**
3. Enter: `projectconnect.tech`
4. Click **Validate**
5. Once validated, click **Add custom domain**
6. Repeat for `www.projectconnect.tech`

### C. Add SSL Certificate for Frontend
1. In **Custom domains**, click on `projectconnect.tech`
2. Click **Add binding**
3. Select **SNI SSL**
4. Choose **App Service Managed Certificate** (free)
5. Click **Add binding**
6. Repeat for `www.projectconnect.tech`

---

## Step 3: Azure Backend Custom Domain Setup

### A. Add Custom Domain to Backend
1. Go to **App Services** → **projectconnect-backend-parthd-2025**
2. Go to **Settings** → **Custom domains**
3. Click **+ Add custom domain**
4. Enter: `api.projectconnect.tech`
5. Click **Validate**
6. Once validated, click **Add custom domain**

### B. Add SSL Certificate for Backend
1. In **Custom domains**, click on `api.projectconnect.tech`
2. Click **Add binding**
3. Select **SNI SSL**
4. Choose **App Service Managed Certificate** (free)
5. Click **Add binding**

---

## Step 4: Update Frontend Configuration

After custom domain is set up, update the frontend to use the new API URL:

### A. Update Production Environment
File: `client/.env.production`
```
REACT_APP_API_URL=https://api.projectconnect.tech/api
GENERATE_SOURCEMAP=false
REACT_APP_ENVIRONMENT=production
```

### B. Update GitHub Actions Workflow
File: `.github/workflows/main_projectconnect-frontend-parthd-2025.yml`
Change the environment variable:
```yaml
env:
  REACT_APP_API_URL: https://api.projectconnect.tech/api
```

---

## Step 5: Update Backend CORS Configuration

Update backend to allow the new domain:

File: `server/server.js`
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://projectconnect.tech',
    'https://www.projectconnect.tech',
    'https://projectconnect-frontend-parthd-2025.azurewebsites.net'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

---

## Step 6: Verification and Testing

### A. DNS Propagation Check
Use online tools to verify DNS propagation:
- https://dnschecker.org
- Enter your domain and check CNAME records

### B. Test URLs
After setup (24-48 hours for full propagation):
- **Frontend**: https://projectconnect.tech
- **Backend API**: https://api.projectconnect.tech/health
- **WWW Redirect**: https://www.projectconnect.tech

### C. SSL Certificate Check
- All URLs should show green padlock (HTTPS)
- Certificates should be issued by Microsoft

---

## Timeline Expectations

- **DNS Changes**: 15 minutes to 24 hours
- **Azure Domain Validation**: 5-10 minutes
- **SSL Certificate Issuance**: 5-15 minutes
- **Full Propagation**: Up to 48 hours globally

---

## Troubleshooting

### Common Issues:
1. **Domain validation fails**: Check DNS records are correct
2. **SSL certificate fails**: Ensure domain is accessible via HTTP first
3. **API calls fail**: Update CORS settings in backend
4. **DNS not propagating**: Wait longer or check with different DNS checker

### Support:
- Azure Portal has built-in validation tools
- Use browser developer tools to check network requests
- Test API endpoints directly before testing through frontend

---

## Quick Commands for Implementation

After DNS is configured and Azure domains are added, run these commands to update the code:

```bash
# Update frontend API URL to use custom domain
# Then commit and push to trigger redeployment
git add .
git commit -m "Update API URL to use custom domain api.projectconnect.tech"
git push origin main
```

The deployment will automatically use the new custom domain setup!
