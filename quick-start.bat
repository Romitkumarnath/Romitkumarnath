@echo off
REM Quick Start Script for Windows
REM Google Meet Tone Monitor

echo ================================================================
echo.
echo      Google Meet Tone Monitor - Quick Start Script
echo.
echo ================================================================
echo.

REM Check Node.js
echo Checking prerequisites...
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)

for /f "delims=" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
)

for /f "delims=" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm found: v%NPM_VERSION%

REM Check git
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] git not found!
    echo Please install git from: https://git-scm.com/
    pause
    exit /b 1
)

echo [OK] git found
echo.
echo All prerequisites met!
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Make sure you're in the project directory
    echo Run: cd Romitkumarnath
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take 2-3 minutes (downloading Chrome)...
    echo.
    call npm install
    echo.
    echo Dependencies installed!
) else (
    echo Dependencies already installed
)

echo.
echo Configuration:
if exist ".env" (
    echo [OK] .env file found
    findstr "MEET_URL" .env
) else (
    echo [WARNING] .env file not found
)

echo.
echo ================================================================
echo.
echo Choose what to do:
echo.
echo   1) Run demo mode (simulated meeting)
echo   2) Join real meeting (opens browser)
echo   3) Exit
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Running demo mode...
    echo.
    call npm run demo
    goto :end
)

if "%choice%"=="2" (
    echo.
    echo Starting Google Meet monitor...
    echo.
    echo Instructions:
    echo   1. Browser will open automatically
    echo   2. Meeting will join: https://meet.google.com/ybt-yxvu-ged
    echo   3. Press 'C' key to enable captions (REQUIRED!)
    echo   4. Speak test phrases to trigger alerts
    echo   5. Press Ctrl+C to stop monitoring
    echo.
    pause
    echo.
    call npm start
    goto :end
)

if "%choice%"=="3" (
    echo.
    echo Goodbye!
    goto :end
)

echo.
echo [ERROR] Invalid choice
pause
exit /b 1

:end
echo.
echo Done!
pause
