# Azure Quick Deploy Script for Windows

# Login to Azure (will open browser)
Write-Host "🔑 Logging into Azure..." -ForegroundColor Blue
az login

# Set variables
$RESOURCE_GROUP = "projectconnect-rg"
$LOCATION = "East US"
$BACKEND_APP = "projectconnect-backend-$(Get-Random -Minimum 1000 -Maximum 9999)"
$FRONTEND_APP = "projectconnect-frontend-$(Get-Random -Minimum 1000 -Maximum 9999)"
$PLAN_NAME = "projectconnect-plan"

Write-Host "🏗️  Creating Azure resources..." -ForegroundColor Green

# Create resource group
Write-Host "📁 Creating resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create App Service Plan
Write-Host "📋 Creating App Service Plan: $PLAN_NAME"
az appservice plan create --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku B1 --is-linux

# Create Backend Web App
Write-Host "🔧 Creating Backend App: $BACKEND_APP"
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $BACKEND_APP --runtime "NODE:18-lts"

# Create Frontend Web App  
Write-Host "🎨 Creating Frontend App: $FRONTEND_APP"
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $FRONTEND_APP --runtime "NODE:18-lts"

# Configure GitHub deployment for backend
Write-Host "🔗 Configuring GitHub deployment for backend..."
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $BACKEND_APP --repo-url https://github.com/parthd45/projectconnect --branch main --manual-integration

# Configure GitHub deployment for frontend
Write-Host "🔗 Configuring GitHub deployment for frontend..."
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --repo-url https://github.com/parthd45/projectconnect --branch main --manual-integration

# Set backend app settings
Write-Host "⚙️  Configuring backend environment variables..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP --settings `
    NODE_ENV=production `
    PORT=8080 `
    PROJECT=server `
    STARTUP_FILE=server.js `
    DATABASE_URL="your_railway_database_url_here" `
    JWT_SECRET="your_jwt_secret_here_at_least_32_characters_long" `
    EMAIL_USER="your_email_here@gmail.com" `
    EMAIL_PASSWORD="your_email_app_password_here" `
    GOOGLE_CLIENT_ID="your_google_client_id_here" `
    GOOGLE_CLIENT_SECRET="your_google_client_secret_here" `
    GITHUB_CLIENT_ID="your_github_client_id_here" `
    GITHUB_CLIENT_SECRET="your_github_client_secret_here" `
    SESSION_SECRET="your_session_secret_here_at_least_32_characters_long" `
    CLIENT_URL="https://$FRONTEND_APP.azurewebsites.net"

# Set frontend app settings
Write-Host "⚙️  Configuring frontend environment variables..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --settings `
    PROJECT=client `
    REACT_APP_API_URL="https://$BACKEND_APP.azurewebsites.net/api"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Your applications will be available at:" -ForegroundColor Yellow
Write-Host "   Frontend: https://$FRONTEND_APP.azurewebsites.net" -ForegroundColor Cyan
Write-Host "   Backend:  https://$BACKEND_APP.azurewebsites.net" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Remember to update these environment variables with your actual values:" -ForegroundColor Red
Write-Host "   - DATABASE_URL (Railway connection string)"
Write-Host "   - JWT_SECRET (32+ character random string)"
Write-Host "   - Email credentials (Gmail app password)"
Write-Host "   - OAuth credentials (Google/GitHub)"
Write-Host "   - SESSION_SECRET (32+ character random string)"
Write-Host ""
Write-Host "📝 Update them in Azure Portal > App Services > Configuration" -ForegroundColor Blue
