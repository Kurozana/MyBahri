@echo off
REM ============================================================
REM  MyBahri - Development server (fast, hot-reload)
REM  Double-click to run. Opens http://localhost:5173
REM ============================================================
cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies (first run only)...
  call npm install
)

echo.
echo Starting MyBahri dev server...
echo Press Ctrl+C in this window to stop it.
echo.
call npm run dev -- --open

pause
