@echo off
REM ============================================================
REM  MyBahri - Production preview (what GitHub Pages will serve)
REM  Builds the /MyBahri/ version with demo mock data, then serves it.
REM  Double-click to run. Opens http://localhost:4173/MyBahri/
REM ============================================================
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies (first run only)...
  call npm install
)

set VITE_ENABLE_MOCKS=true

echo.
echo Building production preview (with demo data)...
call npm run build
if errorlevel 1 (
  echo Build failed - see errors above.
  pause
  exit /b 1
)

echo.
echo Starting preview server...
echo Press Ctrl+C in this window to stop it.
echo.
call npm run preview -- --open

pause
