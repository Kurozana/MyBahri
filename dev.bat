@echo off
title MyBahri - Dev Server
cd /d "%~dp0"
if not exist node_modules call npm install
echo Starting MyBahri dev server (http://localhost:5173)...
call npm run dev -- --open
echo.
echo Server stopped. Press any key to close.
pause >nul
