# Azure Static Web Apps - GitHub Configuration

## What to Put in the Azure Portal Form:

### **GitHub Account Section:**
- **GitHub Account**: Click "Sign in with GitHub" 
  - Use your GitHub account that has access to the `parthd45/projectconnect` repository
  - This will authenticate Azure to access your GitHub

### **Repository Details:**
- **Organization**: `parthd45`
- **Repository**: `projectconnect` 
- **Branch**: `main`

### **Build Details:**
- **Build Presets**: `React`
- **App location**: `/client`
- **Api location**: (leave empty)
- **Output location**: `build`

## What Azure Will Do Automatically:

### 1. **GitHub Token/Secrets:**
Azure will automatically:
- Create a deployment token
- Add it to your GitHub repository secrets
- Set up the GitHub Actions workflow
- You DON'T need to manually add any tokens!

### 2. **GitHub Actions Workflow:**
Azure will create a file like:
`.github/workflows/azure-static-web-apps-<random-name>.yml`

### 3. **Deployment Secret:**
Azure adds this secret to your GitHub repo:
- Name: `AZURE_STATIC_WEB_APPS_API_TOKEN_<RANDOM>`
- Value: (Azure generates this automatically)

## You Don't Need To:
❌ Manually create GitHub tokens
❌ Add secrets to GitHub
❌ Create workflow files
❌ Configure deployment keys

## You Just Need To:
✅ Sign in to GitHub when prompted
✅ Grant Azure permission to access your repo
✅ Fill in the repository details correctly

## After Creation:
1. Check your GitHub repo - you'll see a new workflow file
2. Check GitHub Actions tab - deployment will start automatically
3. Azure manages all the tokens and secrets!

**Just click "Sign in with GitHub" and let Azure handle the rest!**
