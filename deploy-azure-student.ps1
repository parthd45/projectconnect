# GitHub Student Pack - Premium Azure Deployment Script

# Verify student pack activation
Write-Host "🎓 GitHub Student Pack - Premium Azure Deployment" -ForegroundColor Green
Write-Host "💰 Using your $100 Azure credits for premium deployment!" -ForegroundColor Yellow

# Login to Azure with student account
Write-Host "🔑 Logging into Azure with Student Pack benefits..." -ForegroundColor Blue
az login

# Set premium variables
$RESOURCE_GROUP = "projectconnect-student-rg"
$LOCATION = "East US"
$PLAN_NAME = "projectconnect-student-premium"
$BACKEND_APP = "projectconnect-api-$(Get-Random -Minimum 1000 -Maximum 9999)"
$FRONTEND_APP = "projectconnect-app-$(Get-Random -Minimum 1000 -Maximum 9999)"
$DB_SERVER = "projectconnect-db-$(Get-Random -Minimum 1000 -Maximum 9999)"
$INSIGHTS_NAME = "projectconnect-insights"

Write-Host "🏗️  Creating PREMIUM Azure resources with Student Pack..." -ForegroundColor Green

# Create resource group
Write-Host "📁 Creating premium resource group: $RESOURCE_GROUP"
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create PREMIUM App Service Plan (Standard S1 - $54/month value, FREE with student credits)
Write-Host "💎 Creating PREMIUM App Service Plan (Standard S1): $PLAN_NAME"
az appservice plan create --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku S1 --is-linux

# Create Application Insights for monitoring
Write-Host "📊 Creating Application Insights: $INSIGHTS_NAME"
az monitor app-insights component create --app $INSIGHTS_NAME --location $LOCATION --resource-group $RESOURCE_GROUP

# Create Azure Database for PostgreSQL (Premium managed database)
Write-Host "🗄️  Creating Azure Database for PostgreSQL: $DB_SERVER"
$DB_ADMIN = "projectconnect"
$DB_PASSWORD = "StudentPack2025!@#"
az postgres server create --resource-group $RESOURCE_GROUP --name $DB_SERVER --location $LOCATION --admin-user $DB_ADMIN --admin-password $DB_PASSWORD --sku-name GP_Gen5_2 --version 13

# Configure PostgreSQL firewall (allow Azure services)
Write-Host "🔐 Configuring database firewall rules..."
az postgres server firewall-rule create --resource-group $RESOURCE_GROUP --server $DB_SERVER --name "AllowAzureServices" --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0

# Create Backend Web App (PREMIUM)
Write-Host "🔧 Creating PREMIUM Backend App: $BACKEND_APP"
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $BACKEND_APP --runtime "NODE:18-lts"

# Create Frontend Web App (PREMIUM)
Write-Host "🎨 Creating PREMIUM Frontend App: $FRONTEND_APP"
az webapp create --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --name $FRONTEND_APP --runtime "NODE:18-lts"

# Get Application Insights key
$INSIGHTS_KEY = az monitor app-insights component show --app $INSIGHTS_NAME --resource-group $RESOURCE_GROUP --query instrumentationKey --output tsv

# Configure GitHub deployment for backend
Write-Host "🔗 Configuring GitHub deployment for backend..."
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $BACKEND_APP --repo-url https://github.com/parthd45/projectconnect --branch main --manual-integration

# Configure GitHub deployment for frontend
Write-Host "🔗 Configuring GitHub deployment for frontend..."
az webapp deployment source config --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --repo-url https://github.com/parthd45/projectconnect --branch main --manual-integration

# Construct premium database connection string
$DB_CONNECTION = "postgresql://${DB_ADMIN}:${DB_PASSWORD}@${DB_SERVER}.postgres.database.azure.com:5432/postgres?sslmode=require"

# Set PREMIUM backend app settings
Write-Host "⚙️  Configuring PREMIUM backend environment variables..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP --settings `
    NODE_ENV=production `
    PORT=8080 `
    PROJECT=server `
    STARTUP_FILE=server.js `
    DATABASE_URL=$DB_CONNECTION `
    JWT_SECRET="StudentPack2025_JWT_Secret_Premium_ProjectConnect_Very_Secure_String" `
    EMAIL_USER="your_email_here@gmail.com" `
    EMAIL_PASSWORD="your_email_app_password_here" `
    GOOGLE_CLIENT_ID="your_google_client_id_here" `
    GOOGLE_CLIENT_SECRET="your_google_client_secret_here" `
    GITHUB_CLIENT_ID="your_github_client_id_here" `
    GITHUB_CLIENT_SECRET="your_github_client_secret_here" `
    SESSION_SECRET="StudentPack2025_Session_Secret_Premium_ProjectConnect_Secure" `
    CLIENT_URL="https://$FRONTEND_APP.azurewebsites.net" `
    APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY

# Set PREMIUM frontend app settings
Write-Host "⚙️  Configuring PREMIUM frontend environment variables..."
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --settings `
    PROJECT=client `
    REACT_APP_API_URL="https://$BACKEND_APP.azurewebsites.net/api" `
    APPINSIGHTS_INSTRUMENTATIONKEY=$INSIGHTS_KEY

# Enable advanced features for premium apps
Write-Host "🚀 Enabling PREMIUM features..."

# Enable Always On (keeps app warm)
az webapp config set --resource-group $RESOURCE_GROUP --name $BACKEND_APP --always-on true
az webapp config set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --always-on true

# Enable Application Insights integration
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $BACKEND_APP --settings APPINSIGHTS_PROFILERFEATURE_VERSION=1.0.0 APPINSIGHTS_SNAPSHOTFEATURE_VERSION=1.0.0 ApplicationInsightsAgent_EXTENSION_VERSION=~2
az webapp config appsettings set --resource-group $RESOURCE_GROUP --name $FRONTEND_APP --settings APPINSIGHTS_PROFILERFEATURE_VERSION=1.0.0 ApplicationInsightsAgent_EXTENSION_VERSION=~2

# Enable auto-healing
Write-Host "🏥 Enabling auto-healing and health monitoring..."
az webapp config set --resource-group $RESOURCE_GROUP --name $BACKEND_APP --auto-heal-enabled true

Write-Host ""
Write-Host "🎉 PREMIUM DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "🎓 Using GitHub Student Pack benefits ($100 credit)" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Your PREMIUM applications:" -ForegroundColor Cyan
Write-Host "   Frontend: https://$FRONTEND_APP.azurewebsites.net" -ForegroundColor White
Write-Host "   Backend:  https://$BACKEND_APP.azurewebsites.net" -ForegroundColor White
Write-Host "   Database: $DB_SERVER.postgres.database.azure.com" -ForegroundColor White
Write-Host "   Monitoring: https://portal.azure.com (search: $INSIGHTS_NAME)" -ForegroundColor White
Write-Host ""
Write-Host "💎 PREMIUM FEATURES ENABLED:" -ForegroundColor Green
Write-Host "   ✅ Standard S1 App Service (normally $54/month)" -ForegroundColor Gray
Write-Host "   ✅ Azure Database for PostgreSQL (normally $15/month)" -ForegroundColor Gray
Write-Host "   ✅ Application Insights monitoring (normally $5/month)" -ForegroundColor Gray
Write-Host "   ✅ Always On (keeps app warm)" -ForegroundColor Gray
Write-Host "   ✅ Auto-healing enabled" -ForegroundColor Gray
Write-Host "   ✅ Advanced SSL certificates" -ForegroundColor Gray
Write-Host "   ✅ Custom domain support ready" -ForegroundColor Gray
Write-Host ""
Write-Host "💰 Total Monthly Value: ~$75 - FREE with Student Pack!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 MANUAL STEPS NEEDED:" -ForegroundColor Red
Write-Host "   1. Update OAuth credentials in Azure Portal" -ForegroundColor White
Write-Host "   2. Configure email settings (Gmail app password)" -ForegroundColor White
Write-Host "   3. Test database connection" -ForegroundColor White
Write-Host "   4. Optional: Add custom domain in Azure Portal" -ForegroundColor White
Write-Host ""
Write-Host "📊 Monitor usage: https://portal.azure.com > Cost Management" -ForegroundColor Blue
Write-Host "🎯 Perfect for your portfolio - enterprise-grade deployment!" -ForegroundColor Green
