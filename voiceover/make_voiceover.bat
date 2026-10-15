@echo off
setlocal EnableExtensions
title Hazel's Grove - voice-over builder
cd /d "%~dp0"
set HF_HUB_DISABLE_SYMLINKS_WARNING=1
set PYTHONUTF8=1

echo.
echo  Hazel's Grove - voice-over builder (v3)
echo  ---------------------------------------

rem ---- 0. Where the voice engine lives. Reuse an engine that's already installed:
rem      a .venv in this folder (from an earlier version), or the shared one in your user folder.
set "SHARED=%LOCALAPPDATA%\GroveVoice\venv"
if exist "%~dp0.venv\Scripts\python.exe" (
  set "VENV=%~dp0.venv"
) else (
  set "VENV=%SHARED%"
)
set "VPY=%VENV%\Scripts\python.exe"
if exist "%VENV%\installed.ok" goto :run

echo  First-time setup: downloads about 1 GB. Later versions reuse it, wherever you unzip them.
echo.

rem ---- 1. Find Python 3.12, 3.11 or 3.10 (the voice model doesn't support 3.13 yet)
set "PY="
for %%V in (3.12 3.11 3.10) do (
  if not defined PY (
    py -%%V -c "import sys" >nul 2>nul && set "PY=py -%%V"
  )
)
if not defined PY (
  python -c "import sys; sys.exit(0 if (3,10) <= sys.version_info[:2] <= (3,12) else 1)" >nul 2>nul && set "PY=python"
)
if not defined PY (
  echo  Python 3.10 - 3.12 was not found.
  echo.
  choice /M "  Install Python 3.12 now with winget (Microsoft's installer)"
  if errorlevel 2 goto :nopython
  winget install -e --id Python.Python.3.12 --scope user --accept-package-agreements --accept-source-agreements
  py -3.12 -c "import sys" >nul 2>nul && set "PY=py -3.12"
  if not defined PY (
    echo.
    echo  Python was installed. Close this window and double-click make_voiceover.bat again.
    pause
    exit /b 0
  )
)
echo  Using: %PY%

rem ---- 2. A private environment for the voice engine (nothing is installed system-wide)
if not exist "%VPY%" (
  echo  Creating the voice engine's environment...
  %PY% -m venv "%VENV%" || goto :fail
)

rem ---- 3. Install the voice engine once
echo  Installing the voice engine ^(Kokoro^) - a few minutes, once...
"%VPY%" -m pip install --upgrade pip || goto :fail
"%VPY%" -m pip install "kokoro==0.9.4" numpy lameenc || goto :fail
"%VPY%" -m spacy download en_core_web_sm || goto :fail
echo ok> "%VENV%\installed.ok"

:run
rem ---- 4. Build the voice-over (only the characters' spoken lines; stage directions become sound and timing)
echo.
"%VPY%" make_voiceover.py %* || goto :fail
echo.
echo  All done. Opening the output folder...
start "" "%~dp0output"
pause
exit /b 0

:nopython
echo.
echo  Install Python 3.12 from https://www.python.org/downloads/windows/
echo  (64-bit installer; tick "Add python.exe to PATH"), then run this again.
pause
exit /b 1

:fail
echo.
echo  Something went wrong (see the messages above).
echo  Common fixes: check your internet connection, then run this file again.
echo  If it keeps failing, delete "%VENV%" and try once more.
pause
exit /b 1
