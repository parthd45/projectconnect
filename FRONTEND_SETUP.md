# Setting Up app.projectconnect.tech for Frontend

## 🎯 Final Configuration:
- **Frontend**: https://app.projectconnect.tech (React website)
- **Backend**: https://projectconnect.tech (API - already working ✅)

## Step 1: DNS Configuration (Add This Record)

Go to your domain provider and add this DNS record:

```
Type     Name    Value                                               TTL
CNAME    app     projectconnect-frontend-parthd-2025.azurewebsites.net    300
```

## Step 2: Azure Frontend Custom Domain

1. **Azure Portal** → **App Services** → **projectconnect-frontend-parthd-2025**
2. **Settings** → **Custom domains** → **+ Add custom domain**
3. **Domain**: `app.projectconnect.tech`
4. **Validate** → **Add custom domain**
5. **SSL**: Click domain → **Add binding** → **SNI SSL** → **App Service Managed Certificate**

## Step 3: Update Frontend Configuration

I'll update your frontend to use the main domain for API calls:
- API calls will go to: `https://projectconnect.tech/api`
- Frontend will be served from: `https://app.projectconnect.tech`

## Step 4: Deploy Updated Configuration

After DNS and Azure setup, deploy the changes.

Ready to start? First, add the DNS record at your domain provider!
