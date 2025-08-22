@echo off
echo ========================================
echo Starting ProjectConnect Application
echo ========================================

echo.
echo Starting PostgreSQL database...
echo Make sure PostgreSQL is running on your system.
echo.

echo Starting backend server...
cd server
start "Backend Server" cmd /k "npm run dev"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting frontend client...
cd ..\client
start "Frontend Client" cmd /k "npm start"

echo.
echo ========================================
echo Application Starting!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
