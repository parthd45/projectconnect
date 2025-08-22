# Step-by-Step: Azure Portal GitHub Configuration

## What You'll See in Azure Portal:

### **Step 1: Deployment Source**
```
Source: GitHub (select this)
```

### **Step 2: GitHub Authentication**
```
GitHub account: [Sign in with GitHub button]
```
**What to do:** Click the button and sign in with your GitHub account

### **Step 3: Repository Selection**
After signing in, you'll see dropdowns:
```
Organization: parthd45
Repository: projectconnect  
Branch: main
```

### **Step 4: Build Configuration**
```
Build Presets: React (select from dropdown)
App location: /client
Api location: (leave this empty)
Output location: build
```

## **IMPORTANT - You DON'T need to:**
- ❌ Create any GitHub Personal Access Tokens
- ❌ Add secrets manually to GitHub
- ❌ Create deployment keys
- ❌ Configure webhooks

## **Azure Does This Automatically:**
- ✅ Creates deployment token
- ✅ Adds secrets to your GitHub repo
- ✅ Creates GitHub Actions workflow
- ✅ Sets up automatic deployments

## **What Happens After You Click Create:**
1. Azure creates the Static Web App resource
2. Azure automatically adds a secret to your GitHub repo
3. Azure creates a workflow file in `.github/workflows/`
4. GitHub Actions starts building and deploying immediately
5. You get a live URL in 1-2 minutes!

**Just sign in to GitHub and fill in the repository details - Azure handles all the token management!**
