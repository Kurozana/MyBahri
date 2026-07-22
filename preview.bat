@echo off
title MyBahri - Production Preview
cd /d "%~dp0"
if not exist node_modules call npm install
set VITE_ENABLE_MOCKS=true
echo Building production preview (GitHub Pages version, with demo data)...
call npm run build
echo Starting preview (http://localhost:4173/MyBahri/)...
call npm run preview -- --open
echo.
echo Server stopped. Press any key to close.
pause >nul
