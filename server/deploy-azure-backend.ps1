# ProjectConnect Backend - Azure Deployment Script
# Run this in Azure Cloud Shell or with Azure CLI installed

Write-Host "ProjectConnect Backend Deployment Script" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Configuration
$resourceGroup = "projectconnect-rg"
$appName = "projectconnect-backend-$(Get-Random -Minimum 1000 -Maximum 9999)"
$location = "East Asia"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "   Resource Group: $resourceGroup"
Write-Host "   App Name: $appName"
Write-Host "   Location: $location"
Write-Host ""

# Step 1: Create Resource Group (if it doesn't exist)
Write-Host "📁 Creating Resource Group..." -ForegroundColor Blue
try {
    az group create --name $resourceGroup --location "$location"
    Write-Host "✅ Resource Group created/verified" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create Resource Group: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create App Service Plan
Write-Host "📊 Creating App Service Plan..." -ForegroundColor Blue
try {
    az appservice plan create `
        --name "$appName-plan" `
        --resource-group $resourceGroup `
        --location "$location" `
        --sku B1 `
        --is-linux
    Write-Host "✅ App Service Plan created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create App Service Plan: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Create Web App
Write-Host "🌐 Creating Web App..." -ForegroundColor Blue
try {
    az webapp create `
        --name $appName `
        --resource-group $resourceGroup `
        --plan "$appName-plan" `
        --runtime "NODE:18-lts"
    Write-Host "✅ Web App created" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create Web App: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Configure App Settings
Write-Host "⚙️ Configuring App Settings..." -ForegroundColor Blue
try {
    az webapp config appsettings set `
        --name $appName `
        --resource-group $resourceGroup `
        --settings @'
[
    {
        "name": "NODE_ENV",
        "value": "production"
    },
    {
        "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
        "value": "false"
    },
    {
        "name": "SCM_DO_BUILD_DURING_DEPLOYMENT",
        "value": "true"
    }
]
'@
    Write-Host "✅ App Settings configured" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure App Settings: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 5: Set startup command
Write-Host "🚀 Setting Startup Command..." -ForegroundColor Blue
try {
    az webapp config set `
        --name $appName `
        --resource-group $resourceGroup `
        --startup-file "azure-server.js"
    Write-Host "✅ Startup command set" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set startup command: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Deploy from ZIP
Write-Host "📦 Deploying ZIP package..." -ForegroundColor Blue
try {
    az webapp deployment source config-zip `
        --name $appName `
        --resource-group $resourceGroup `
        --src "backend-azure-final.zip"
    Write-Host "✅ ZIP deployment completed" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to deploy ZIP: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 7: Show deployment information
Write-Host ""
Write-Host "🎉 Deployment Summary:" -ForegroundColor Green
Write-Host "=====================" -ForegroundColor Green
Write-Host "App Name: $appName" -ForegroundColor Yellow
Write-Host "URL: https://$appName.azurewebsites.net" -ForegroundColor Yellow
Write-Host "Resource Group: $resourceGroup" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔍 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test the API: https://$appName.azurewebsites.net" -ForegroundColor White
Write-Host "2. Check logs: az webapp log tail --name $appName --resource-group $resourceGroup" -ForegroundColor White
Write-Host "3. Update frontend API_BASE_URL to: https://$appName.azurewebsites.net" -ForegroundColor White

# Test the deployment
Write-Host ""
Write-Host "🧪 Testing deployment..." -ForegroundColor Blue
Start-Sleep -Seconds 30
try {
    $response = Invoke-RestMethod -Uri "https://$appName.azurewebsites.net" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "⚠️ Backend might still be starting up. Please wait a few minutes and test manually." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Backend deployment script completed!" -ForegroundColor Green
