@echo off
rem Hear four takes of lines side by side, then pick one in script.json ("take": "b").
rem Double-click: takes for every line the pacing report flags.
rem Or drag nothing and type numbers when asked, e.g. 3,7,12
setlocal
cd /d "%~dp0"
set "LINES="
set /p LINES=" Which lines? Type numbers like 3,7,12 (or press Enter for the flagged ones): "
if "%LINES%"=="" set "LINES=flagged"
call "%~dp0make_voiceover.bat" --takes %LINES%
