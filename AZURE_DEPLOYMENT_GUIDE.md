# 🔷 Microsoft Azure Deployment Guide

## 🚀 **AZURE APP SERVICE DEPLOYMENT**

### **Option 1: Azure App Service (Recommended)**

#### **Step 1: Prerequisites**
1. **Azure Account**: Sign up at https://azure.microsoft.com/free/
2. **Azure CLI**: Install from https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
3. **GitHub Repository**: Your code is already at `https://github.com/parthd45/projectconnect`

#### **Step 2: Create Azure Resources**

**Login to Azure:**
```bash
az login
```

**Create Resource Group:**
```bash
az group create --name projectconnect-rg --location "East US"
```

**Create App Service Plan:**
```bash
az appservice plan create --name projectconnect-plan --resource-group projectconnect-rg --sku B1 --is-linux
```

**Create Backend Web App:**
```bash
az webapp create --resource-group projectconnect-rg --plan projectconnect-plan --name projectconnect-backend --runtime "NODE|18-lts" --deployment-source-url https://github.com/parthd45/projectconnect --deployment-source-branch main
```

**Create Frontend Web App:**
```bash
az webapp create --resource-group projectconnect-rg --plan projectconnect-plan --name projectconnect-frontend --runtime "NODE|18-lts" --deployment-source-url https://github.com/parthd45/projectconnect --deployment-source-branch main
```

#### **Step 3: Configure Backend App Settings**

```bash
az webapp config appsettings set --resource-group projectconnect-rg --name projectconnect-backend --settings \
    NODE_ENV=production \
    PORT=8080 \
    DATABASE_URL="your_railway_database_url_here" \
    JWT_SECRET="your_jwt_secret_here_at_least_32_characters_long" \
    EMAIL_USER="your_email_here@gmail.com" \
    EMAIL_PASSWORD="your_email_app_password_here" \
    GOOGLE_CLIENT_ID="your_google_client_id_here" \
    GOOGLE_CLIENT_SECRET="your_google_client_secret_here" \
    GITHUB_CLIENT_ID="your_github_client_id_here" \
    GITHUB_CLIENT_SECRET="your_github_client_secret_here" \
    SESSION_SECRET="your_session_secret_here_at_least_32_characters_long" \
    CLIENT_URL="https://projectconnect-frontend.azurewebsites.net"
```

#### **Step 4: Configure Frontend App Settings**

```bash
az webapp config appsettings set --resource-group projectconnect-rg --name projectconnect-frontend --settings \
    REACT_APP_API_URL="https://projectconnect-backend.azurewebsites.net/api"
```

#### **Step 5: Configure Deployment**

**Set Backend Source Directory:**
```bash
az webapp config appsettings set --resource-group projectconnect-rg --name projectconnect-backend --settings \
    PROJECT="server" \
    STARTUP_FILE="server.js"
```

**Set Frontend Source Directory:**
```bash
az webapp config appsettings set --resource-group projectconnect-rg --name projectconnect-frontend --settings \
    PROJECT="client"
```

---

## 🌐 **Option 2: Azure Portal (GUI Method)**

### **Step 1: Create Backend App Service**

1. **Go to Azure Portal**: https://portal.azure.com
2. **Create Resource** → **Web App**

**Backend Configuration:**
```
Name: projectconnect-backend
Runtime: Node 18 LTS
Operating System: Linux
Region: East US
App Service Plan: Create new (Basic B1)
```

**Deployment:**
- **Source**: GitHub
- **Repository**: parthd45/projectconnect
- **Branch**: main
- **Build Provider**: App Service Build Service

**App Settings (Environment Variables):**
```
NODE_ENV=production
PORT=8080
DATABASE_URL=your_railway_database_url_here
JWT_SECRET=your_jwt_secret_here_at_least_32_characters_long
EMAIL_USER=your_email_here@gmail.com
EMAIL_PASSWORD=your_email_app_password_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
SESSION_SECRET=your_session_secret_here_at_least_32_characters_long
CLIENT_URL=https://projectconnect-frontend.azurewebsites.net
PROJECT=server
STARTUP_FILE=server.js
```

### **Step 2: Create Frontend App Service**

**Frontend Configuration:**
```
Name: projectconnect-frontend
Runtime: Node 18 LTS
Operating System: Linux
Region: East US
App Service Plan: Use existing (projectconnect-plan)
```

**App Settings:**
```
REACT_APP_API_URL=https://projectconnect-backend.azurewebsites.net/api
PROJECT=client
```

---

## 🚀 **Option 3: Azure Static Web Apps (Modern Approach)**

### **Step 1: Create Static Web App**

1. **Go to Azure Portal** → **Create Resource** → **Static Web Apps**
2. **Configure:**
```
Name: projectconnect
Region: East US 2
Source: GitHub
Repository: parthd45/projectconnect
Branch: main
Build Presets: React
App location: /client
API location: /server
Output location: build
```

### **Step 2: Configure Environment Variables**

In **Static Web Apps** → **Configuration**:

**Application Settings:**
```
REACT_APP_API_URL=/api
DATABASE_URL=your_railway_database_url_here
JWT_SECRET=your_jwt_secret_here_at_least_32_characters_long
EMAIL_USER=your_email_here@gmail.com
EMAIL_PASSWORD=your_email_app_password_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
SESSION_SECRET=your_session_secret_here_at_least_32_characters_long
```

---

## 📋 **Required Azure Configuration Files**

Let me create the necessary Azure configuration files for your project:

### **For Static Web Apps (Option 3 - Recommended):**
- Automatic deployment
- Built-in API support
- Custom domains
- Free SSL certificates
- Global CDN

### **For App Service (Options 1 & 2):**
- More control over infrastructure
- Better for complex applications
- Support for custom containers

---

## 🎯 **Quick Start Steps:**

1. **Choose your preferred option** (I recommend Static Web Apps)
2. **Sign up for Azure** (free tier available)
3. **Connect your GitHub repository**
4. **Set environment variables**
5. **Deploy and test**

## 🔐 **Security Notes:**

- Never commit real credentials to GitHub
- Use Azure Key Vault for sensitive data
- Enable Azure AD authentication if needed
- Configure custom domains with SSL

## 📊 **Expected Costs:**

- **Static Web Apps**: FREE tier (perfect for your app)
- **App Service Basic**: ~$13/month
- **App Service Standard**: ~$56/month

## ✅ **Success URLs:**

After deployment:
- **Frontend**: `https://projectconnect.azurestaticapps.net`
- **Backend API**: `https://projectconnect.azurestaticapps.net/api`

All your localhost features will work globally! 🌍
