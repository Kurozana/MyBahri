@echo off
title MyBahri - Web (real backend)
cd /d "%~dp0"
if not exist node_modules call npm install
echo NOTE: start the API first (double-click api.bat) - this app talks to http://localhost:3000
echo Starting MyBahri web (real backend)...
call npm run dev -- --open
pause >nul
