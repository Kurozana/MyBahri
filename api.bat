@echo off
title MyBahri - API (NestJS)
cd /d "%~dp0server"
if not exist node_modules call npm install
echo Starting MyBahri API on http://localhost:3000/api ...
echo Press Ctrl+C to stop.
call npm run start:dev
pause >nul
