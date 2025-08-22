# Custom Domain Verification Script

Write-Host "🌐 Checking Custom Domain Setup for projectconnect.tech" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking DNS Records:" -ForegroundColor Yellow
Write-Host "Root domain (projectconnect.tech):"
try { nslookup projectconnect.tech } catch { Write-Host "❌ DNS not configured yet" -ForegroundColor Red }
Write-Host ""

Write-Host "API subdomain (api.projectconnect.tech):"
try { nslookup api.projectconnect.tech } catch { Write-Host "❌ DNS not configured yet" -ForegroundColor Red }
Write-Host ""

Write-Host "WWW subdomain (www.projectconnect.tech):"
try { nslookup www.projectconnect.tech } catch { Write-Host "❌ DNS not configured yet" -ForegroundColor Red }
Write-Host ""

Write-Host "2. Testing HTTPS Connectivity:" -ForegroundColor Yellow

# Test Frontend
Write-Host "Frontend (https://projectconnect.tech):"
try {
    $response = Invoke-WebRequest -Uri "https://projectconnect.tech" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Frontend accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible yet" -ForegroundColor Red
}

# Test Backend API
Write-Host "Backend API (https://api.projectconnect.tech/health):"
try {
    $response = Invoke-WebRequest -Uri "https://api.projectconnect.tech/health" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Backend API accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API not accessible yet" -ForegroundColor Red
}

# Test WWW
Write-Host "WWW (https://www.projectconnect.tech):"
try {
    $response = Invoke-WebRequest -Uri "https://www.projectconnect.tech" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ WWW accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ WWW not accessible yet" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing Current Azure URLs (should still work):" -ForegroundColor Yellow

# Test Azure Frontend
try {
    $response = Invoke-WebRequest -Uri "https://projectconnect-frontend-parthd-2025.azurewebsites.net" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Azure Frontend working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure Frontend issue" -ForegroundColor Red
}

# Test Azure Backend
try {
    $response = Invoke-WebRequest -Uri "https://projectconnect-backend-parthd-2025.azurewebsites.net/health" -Method Head -TimeoutSec 10 -ErrorAction Stop
    Write-Host "✅ Azure Backend working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure Backend issue" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. If DNS shows ❌: Configure DNS records at your domain provider" -ForegroundColor White
Write-Host "2. If HTTPS shows ❌: Add custom domains in Azure Portal" -ForegroundColor White  
Write-Host "3. Wait 15-60 minutes for DNS propagation" -ForegroundColor White
Write-Host "4. SSL certificates will be issued automatically" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Once all show ✅, your custom domain is ready!" -ForegroundColor Green
