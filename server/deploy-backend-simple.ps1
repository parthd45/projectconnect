# ProjectConnect Backend - Azure Deployment Script
# Run this with Azure CLI installed and logged in

Write-Host "ProjectConnect Backend Deployment" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Configuration
$resourceGroup = "projectconnect-rg"
$appName = "projectconnect-backend-$(Get-Random -Minimum 1000 -Maximum 9999)"
$location = "East Asia"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "   Resource Group: $resourceGroup"
Write-Host "   App Name: $appName"
Write-Host "   Location: $location"
Write-Host ""

# Step 1: Create Resource Group
Write-Host "Creating Resource Group..." -ForegroundColor Blue
az group create --name $resourceGroup --location "$location"

# Step 2: Create App Service Plan
Write-Host "Creating App Service Plan..." -ForegroundColor Blue
az appservice plan create `
    --name "$appName-plan" `
    --resource-group $resourceGroup `
    --location "$location" `
    --sku B1 `
    --is-linux

# Step 3: Create Web App
Write-Host "Creating Web App..." -ForegroundColor Blue
az webapp create `
    --name $appName `
    --resource-group $resourceGroup `
    --plan "$appName-plan" `
    --runtime "NODE:18-lts"

# Step 4: Set startup command
Write-Host "Setting Startup Command..." -ForegroundColor Blue
az webapp config set `
    --name $appName `
    --resource-group $resourceGroup `
    --startup-file "node azure-server.js"

# Step 5: Deploy from ZIP
Write-Host "Deploying ZIP package..." -ForegroundColor Blue
az webapp deployment source config-zip `
    --name $appName `
    --resource-group $resourceGroup `
    --src "backend-azure-final.zip"

# Show results
Write-Host ""
Write-Host "Deployment Summary:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "App Name: $appName" -ForegroundColor Yellow
Write-Host "URL: https://$appName.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""

# Test the deployment
Write-Host "Testing deployment in 30 seconds..." -ForegroundColor Blue
Start-Sleep -Seconds 30

try {
    $response = Invoke-RestMethod -Uri "https://$appName.azurewebsites.net" -Method GET -TimeoutSec 10
    Write-Host "Backend is responding!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "Backend might still be starting up. Test manually at: https://$appName.azurewebsites.net" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Deployment completed!" -ForegroundColor Green
