# Quick Domain Check

Write-Host "🔍 Checking your current domain setup..." -ForegroundColor Cyan
Write-Host ""

# Test common domain patterns
$domains = @(
    "https://projectconnect.tech",
    "https://api.projectconnect.tech", 
    "https://app.projectconnect.tech",
    "https://projectconnect.tech/api",
    "https://www.projectconnect.tech"
)

foreach ($domain in $domains) {
    Write-Host "Testing: $domain" -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "$domain/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
        $content = $response.Content | ConvertFrom-Json
        if ($content.message -like "*ProjectConnect*") {
            Write-Host "✅ BACKEND FOUND: $domain" -ForegroundColor Green
            Write-Host "   Response: $($content.message)" -ForegroundColor White
        }
    } catch {
        # Try without /health for frontend
        try {
            $response = Invoke-WebRequest -Uri $domain -Method Head -TimeoutSec 5 -ErrorAction Stop
            Write-Host "✅ FRONTEND FOUND: $domain" -ForegroundColor Green
        } catch {
            Write-Host "❌ Not accessible: $domain" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "🎯 Please tell me which URLs are working for your backend!" -ForegroundColor Cyan
