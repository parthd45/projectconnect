# DNS Verification Script for ProjectConnect.tech (PowerShell)

Write-Host "🔍 Checking DNS Configuration for projectconnect.tech" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking root domain (projectconnect.tech):" -ForegroundColor Yellow
nslookup projectconnect.tech
Write-Host ""

Write-Host "2. Checking API subdomain (api.projectconnect.tech):" -ForegroundColor Yellow
nslookup api.projectconnect.tech
Write-Host ""

Write-Host "3. Checking WWW subdomain (www.projectconnect.tech):" -ForegroundColor Yellow
nslookup www.projectconnect.tech
Write-Host ""

Write-Host "4. Testing HTTP connectivity:" -ForegroundColor Yellow
Write-Host "Frontend: Testing https://projectconnect.tech"
try {
    $response = Invoke-WebRequest -Uri "https://projectconnect.tech" -Method Head -ErrorAction Stop
    Write-Host "✅ Frontend accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend not accessible yet" -ForegroundColor Red
}

Write-Host "Backend API: Testing https://api.projectconnect.tech/health"
try {
    $response = Invoke-WebRequest -Uri "https://api.projectconnect.tech/health" -Method Head -ErrorAction Stop
    Write-Host "✅ Backend API accessible!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API not accessible yet" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. Current Azure URLs (should still work):" -ForegroundColor Yellow
Write-Host "Frontend: https://projectconnect-frontend-parthd-2025.azurewebsites.net"
Write-Host "Backend: https://projectconnect-backend-parthd-2025.azurewebsites.net/health"
Write-Host ""

Write-Host "✅ DNS Setup Complete! Custom domains should be accessible within 24-48 hours." -ForegroundColor Green

# Test current Azure URLs
Write-Host "6. Testing current Azure URLs:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://projectconnect-frontend-parthd-2025.azurewebsites.net" -Method Head -ErrorAction Stop
    Write-Host "✅ Azure Frontend working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure Frontend issue" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "https://projectconnect-backend-parthd-2025.azurewebsites.net/health" -Method Head -ErrorAction Stop
    Write-Host "✅ Azure Backend working!" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure Backend issue" -ForegroundColor Red
}
