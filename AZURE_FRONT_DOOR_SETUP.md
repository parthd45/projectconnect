# Azure Front Door Setup for ProjectConnect

## 🌍 Why Azure Front Door?

Azure Front Door is perfect for ProjectConnect because it provides:
- **Global Load Balancing**: Distribute traffic across multiple regions
- **CDN (Content Delivery Network)**: Cache static content closer to users worldwide
- **Custom Domain Integration**: Easy SSL and domain management
- **DDoS Protection**: Enterprise-level security
- **Web Application Firewall (WAF)**: Protect against attacks
- **Performance Optimization**: Faster load times globally

## 🏗️ Current Architecture vs Front Door Architecture

### Current Setup:
```
Users → Azure App Service (Single Region) → Backend API
```

### With Front Door:
```
Users → Azure Front Door (Global) → Azure App Service → Backend API
         ↓
    CDN Cache (Static Files)
```

---

## 📋 Setup Steps for Azure Front Door

### Step 1: Create Azure Front Door Profile

1. Go to Azure Portal: https://portal.azure.com
2. Search for "Front Door and CDN profiles"
3. Click **+ Create**
4. Choose **Azure Front Door (classic)** or **Azure Front Door Standard/Premium**
5. Fill in details:
   - **Name**: `projectconnect-frontdoor`
   - **Resource Group**: Same as your app services
   - **Location**: Global
   - **Tier**: Standard (recommended for your use case)

### Step 2: Configure Endpoints

#### Frontend Endpoint:
- **Origin**: `projectconnect-frontend-parthd-2025.azurewebsites.net`
- **Origin Host Header**: `projectconnect-frontend-parthd-2025.azurewebsites.net`
- **Protocol**: HTTPS
- **Port**: 443

#### Backend API Endpoint:
- **Origin**: `projectconnect-backend-parthd-2025.azurewebsites.net`
- **Origin Host Header**: `projectconnect-backend-parthd-2025.azurewebsites.net`
- **Protocol**: HTTPS
- **Port**: 443

### Step 3: Configure Routing Rules

#### Frontend Route:
- **Name**: `frontend-route`
- **Domains**: `projectconnect.tech`, `www.projectconnect.tech`
- **Patterns to match**: `/*`
- **Route type**: Forward
- **Origin group**: Frontend origins
- **Forwarding protocol**: HTTPS only

#### API Route:
- **Name**: `api-route`
- **Domains**: `api.projectconnect.tech`
- **Patterns to match**: `/api/*`
- **Route type**: Forward
- **Origin group**: Backend origins
- **Forwarding protocol**: HTTPS only

---

## 🔧 Configuration Files

### Update Frontend for Front Door

Create `.env.frontdoor` file:
```bash
# Front Door Environment Variables
REACT_APP_API_URL=https://api.projectconnect.tech/api
REACT_APP_CDN_URL=https://projectconnect.tech
GENERATE_SOURCEMAP=false
REACT_APP_ENVIRONMENT=production
```

### Update Backend CORS for Front Door

File: `server/server.js`
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://projectconnect.tech',
        'https://www.projectconnect.tech',
        'https://projectconnect-frontend-parthd-2025.azurewebsites.net',
        'https://*.azurefd.net', // Allow Front Door
        process.env.CLIENT_URL
      ] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 🌐 DNS Configuration for Front Door

### DNS Records (at your domain provider):
```
Type    Name    Value                                    TTL
CNAME   @       projectconnect-frontdoor.azurefd.net     300
CNAME   www     projectconnect-frontdoor.azurefd.net     300  
CNAME   api     projectconnect-frontdoor.azurefd.net     300
```

**Note**: Replace `projectconnect-frontdoor` with your actual Front Door name.

---

## 🎯 Benefits You'll Get

### 1. Global Performance
- **Faster Loading**: Content cached in 100+ global locations
- **Reduced Latency**: Users get content from nearest edge location
- **Better UX**: Improved performance for international users

### 2. Enhanced Security
- **DDoS Protection**: Automatic protection against attacks
- **WAF Integration**: Block malicious requests
- **SSL/TLS**: Automatic certificate management

### 3. Scalability
- **Auto-scaling**: Handle traffic spikes automatically
- **Load Balancing**: Distribute load across multiple origins
- **Health Monitoring**: Automatic failover if needed

### 4. Custom Domain Integration
- **Single Entry Point**: All traffic through Front Door
- **Easy SSL**: Automatic certificate provisioning
- **Domain Management**: Centralized configuration

---

## 📊 Cost Considerations

### Front Door Pricing (Approximate):
- **Data Transfer**: ~$0.087 per GB
- **Requests**: ~$0.0036 per 10,000 requests
- **WAF**: ~$1.00 per policy + $0.60 per million requests

### Estimated Monthly Cost for Small/Medium App:
- **10GB data transfer**: ~$0.87
- **1M requests**: ~$0.36
- **Basic WAF**: ~$1.00
- **Total**: ~$2.50/month

---

## 🚀 Implementation Plan

### Phase 1: Setup Front Door (Today)
1. Create Front Door profile in Azure
2. Configure endpoints for frontend and backend
3. Test with Azure URLs first

### Phase 2: DNS Configuration (After Front Door works)
1. Update DNS records to point to Front Door
2. Configure custom domains in Front Door
3. Enable SSL certificates

### Phase 3: Optimize Performance (Optional)
1. Configure caching rules
2. Enable compression
3. Set up WAF rules
4. Monitor performance

---

## 🔍 Monitoring and Analytics

Front Door provides:
- **Real-time metrics**: Traffic, errors, latency
- **Geographic insights**: Where users are coming from
- **Performance analytics**: Cache hit rates, response times
- **Security reports**: Blocked requests, attack patterns

---

## 🎯 Quick Start Commands

After Front Door is created, update your code:

```bash
# Create Front Door environment file
echo "REACT_APP_API_URL=https://api.projectconnect.tech/api" > client/.env.frontdoor

# Update production environment to use Front Door
# (We'll do this after Front Door is configured)

# Deploy updated configuration
git add .
git commit -m "Configure for Azure Front Door global deployment"
git push origin main
```

---

## 🏆 Why Front Door is Perfect for ProjectConnect

1. **Student Collaboration**: Global reach for international students
2. **Performance**: Fast loading for project showcases and portfolios
3. **Security**: Protect user data and prevent attacks
4. **Scalability**: Handle growth as platform expands
5. **Cost-Effective**: Pay only for what you use

Azure Front Door will transform your local project into a truly global, enterprise-grade application! 🌍✨
