@echo off
title MyBahri - Web (mock data, no backend)
cd /d "%~dp0"
if not exist node_modules call npm install
echo Starting MyBahri web on MOCK data (no backend needed)...
call npm run dev:mock -- --open
pause >nul
