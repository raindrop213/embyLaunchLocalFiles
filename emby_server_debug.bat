@echo off
title Starting Emby Service...
"py310-embed\python.exe" "emby_server.py"

echo Emby Helper Service started successfully.
echo Service is running in background on port 38096.
echo Window remains open for debugging purposes.
pause 
