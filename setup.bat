@echo off
echo ========================================
echo Setting up ProjectConnect Application
echo ========================================

echo.
echo Step 1: Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2: Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Set up PostgreSQL database
echo 2. Create .env file in server folder
echo 3. Run start.bat to launch the application
echo.
pause
