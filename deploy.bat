@echo off
echo ========================================
echo    Log Copilot - Final Deployment
echo ========================================
echo.

echo [1/4] Building the project...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)
echo ✓ Build completed successfully!
echo.

echo [2/4] Checking for Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/
    pause
    exit /b 1
)
echo ✓ Git is available
echo.

echo [3/4] Adding files to Git...
git add .
echo ✓ Files added to Git
echo.

echo [4/4] Committing changes...
git commit -m "Complete Log Copilot SOC Dashboard - FAKHAR's gift to cybersecurity community with professional blue/purple design"
if %errorlevel% neq 0 (
    echo ERROR: Commit failed!
    pause
    exit /b 1
)
echo ✓ Changes committed successfully!
echo.

echo ========================================
echo    Deployment Instructions
echo ========================================
echo.
echo 1. Push to GitHub:
echo    git push origin main
echo.
echo 2. Deploy to Vercel:
echo    - Go to https://vercel.com
echo    - Import your GitHub repository
echo    - Deploy automatically
echo.
echo 3. Share your project:
echo    - LinkedIn: https://www.linkedin.com/in/fakhur-ul-din-b8902421b
echo    - GitHub: https://github.com/fakhurdin
echo.
echo ========================================
echo    Project Ready for Launch! 🚀
echo ========================================
echo.
pause
