#!/bin/bash

# DNS Verification Script for ProjectConnect.tech

echo "🔍 Checking DNS Configuration for projectconnect.tech"
echo "=================================================="
echo ""

echo "1. Checking root domain (projectconnect.tech):"
nslookup projectconnect.tech
echo ""

echo "2. Checking API subdomain (api.projectconnect.tech):"
nslookup api.projectconnect.tech
echo ""

echo "3. Checking WWW subdomain (www.projectconnect.tech):"
nslookup www.projectconnect.tech
echo ""

echo "4. Testing HTTP connectivity:"
echo "Frontend: curl -I https://projectconnect.tech"
curl -I https://projectconnect.tech 2>/dev/null || echo "❌ Frontend not accessible yet"
echo ""

echo "Backend API: curl -I https://api.projectconnect.tech/health"
curl -I https://api.projectconnect.tech/health 2>/dev/null || echo "❌ Backend API not accessible yet"
echo ""

echo "5. Current Azure URLs (should still work):"
echo "Frontend: https://projectconnect-frontend-parthd-2025.azurewebsites.net"
echo "Backend: https://projectconnect-backend-parthd-2025.azurewebsites.net/health"
echo ""

echo "✅ DNS Setup Complete! Custom domains should be accessible within 24-48 hours."
