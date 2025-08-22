# 🚀 Digital Ocean Manual Setup Guide

## ⚠️ If Components Not Detected - Follow These Steps

### **Step 1: Create App Manually**

1. **Go to Digital Ocean App Platform**: https://cloud.digitalocean.com/apps
2. **Click "Create App"**
3. **Select "GitHub"** as source
4. **Connect your GitHub account** and authorize Digital Ocean
5. **Select Repository**: `parthd45/projectconnect`
6. **Select Branch**: `main`

### **Step 2: Configure Backend Service**

When Digital Ocean asks about components, configure manually:

**📋 Backend Configuration:**
- **Type**: Service (Web Service)
- **Name**: `backend`
- **Source Directory**: `/server`
- **Build Command**: `npm install`
- **Run Command**: `npm start`
- **Port**: `3001`
- **Environment**: Node.js
- **Instance Size**: Basic (512 MB RAM, 1 vCPU)

**🔐 Backend Environment Variables:**
```
NODE_ENV=production
PORT=3001
DATABASE_URL=your_railway_database_url_here
JWT_SECRET=your_jwt_secret_here_at_least_32_characters_long
EMAIL_USER=your_email_here@gmail.com
EMAIL_PASSWORD=your_email_app_password_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
SESSION_SECRET=your_session_secret_here_at_least_32_characters_long
CLIENT_URL=${frontend.PUBLIC_URL}
```

### **Step 3: Configure Frontend Service**

**📋 Frontend Configuration:**
- **Type**: Static Site
- **Name**: `frontend`
- **Source Directory**: `/client`
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Environment**: Node.js

**🔐 Frontend Environment Variables:**
```
REACT_APP_API_URL=${backend.PUBLIC_URL}/api
```

### **Step 4: Configure Routes**

**Backend Routes:**
- Path: `/api`
- Component: backend

**Frontend Routes:**
- Path: `/`
- Component: frontend

### **Step 5: Health Checks**

**Backend Health Check:**
- **HTTP Path**: `/api/health`
- **HTTP Port**: 3001
- **Success Codes**: 200

### **Step 6: Deploy**

1. **Review Configuration**
2. **Click "Create Resources"**
3. **Wait for Deployment** (5-10 minutes)
4. **Test Your Live Application**

---

## 🔧 **Alternative: Single Static Site Approach**

If you want a simpler single-service deployment:

### **Option A: Deploy Frontend Only** (Static Site)
- Type: Static Site
- Source Directory: `/client`
- Build Command: `npm run build`
- Output Directory: `build`
- Use external API (your current Railway backend)

### **Option B: Deploy Backend Only** (Service)
- Type: Service
- Source Directory: `/server`
- Build Command: `npm install`
- Run Command: `npm start`
- Use external frontend (Netlify/Vercel)

---

## 🐛 **Troubleshooting**

### **If "No Components Detected":**
1. **Manual Component Addition**: Click "Add Component" manually
2. **Check Repository Access**: Ensure Digital Ocean has GitHub permissions
3. **Verify File Structure**: Make sure `/client` and `/server` folders exist
4. **Check package.json**: Both directories need valid package.json files

### **If Build Fails:**
1. **Check Node Version**: Both services should use Node.js 18+
2. **Verify Dependencies**: Check package.json dependencies
3. **Check Build Commands**: Ensure `npm run build` works locally
4. **Environment Variables**: Ensure all required env vars are set

### **If Deployment Fails:**
1. **Check Logs**: View build and runtime logs in Digital Ocean
2. **Database Connection**: Verify DATABASE_URL is correct
3. **CORS Issues**: Backend CORS should include frontend domain
4. **Port Configuration**: Backend should listen on PORT env variable

---

## ✅ **Success Checklist**

- [ ] GitHub repository connected
- [ ] Backend service configured with correct environment variables
- [ ] Frontend static site configured
- [ ] Routes properly set up (/api for backend, / for frontend)
- [ ] Health checks configured
- [ ] Deployment successful
- [ ] Application accessible via provided URLs
- [ ] OAuth redirects updated with new domains

---

## 🎯 **Expected Results**

After successful deployment:

**Frontend URL**: `https://projectconnect-xyz123.ondigitalocean.app`
**Backend URL**: `https://projectconnect-xyz123.ondigitalocean.app/api`

All features should work exactly like localhost, but now globally accessible!
