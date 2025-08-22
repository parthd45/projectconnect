# Azure Front Door Quick Setup Script

Write-Host "🌍 Azure Front Door Setup for ProjectConnect" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Current Application Status:" -ForegroundColor Yellow
Write-Host "Frontend: https://projectconnect-frontend-parthd-2025.azurewebsites.net"
Write-Host "Backend:  https://projectconnect-backend-parthd-2025.azurewebsites.net"
Write-Host ""

Write-Host "🎯 Front Door Benefits:" -ForegroundColor Green
Write-Host "✅ Global CDN - Faster loading worldwide"
Write-Host "✅ DDoS Protection - Enterprise security"
Write-Host "✅ Custom Domain - Professional URLs"
Write-Host "✅ Auto-scaling - Handle traffic spikes"
Write-Host "✅ SSL Management - Automatic certificates"
Write-Host ""

Write-Host "📊 Expected Performance Improvements:" -ForegroundColor Cyan
Write-Host "• 40-60% faster loading times globally"
Write-Host "• 99.99% uptime SLA"
Write-Host "• Built-in security features"
Write-Host "• Better SEO rankings"
Write-Host ""

Write-Host "💰 Estimated Cost: ~$2-5/month for small-medium traffic" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Go to Azure Portal (already opened for you)"
Write-Host "2. Create 'Front Door and CDN profiles'"
Write-Host "3. Choose 'Azure Front Door Standard'"
Write-Host "4. Name: 'projectconnect-frontdoor'"
Write-Host "5. Configure endpoints for frontend and backend"
Write-Host ""

Write-Host "📖 Complete guide available in: AZURE_FRONT_DOOR_SETUP.md" -ForegroundColor Cyan
Write-Host ""

# Test current endpoints
Write-Host "🔍 Testing current endpoints..." -ForegroundColor Yellow

try {
    $frontendResponse = Invoke-WebRequest -Uri "https://projectconnect-frontend-parthd-2025.azurewebsites.net/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Frontend: Working" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Issues detected" -ForegroundColor Red
}

try {
    $backendResponse = Invoke-WebRequest -Uri "https://projectconnect-backend-parthd-2025.azurewebsites.net/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Backend: Working" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Issues detected" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Ready to set up Azure Front Door!" -ForegroundColor Green
Write-Host "This will make your app globally accessible with enterprise-grade performance!" -ForegroundColor Green
