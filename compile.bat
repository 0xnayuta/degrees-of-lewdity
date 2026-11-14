@echo off
setlocal

:: Set working directory
pushd "%~dp0"

:: Scan for --skip-package-update-check as an argument
set "SKIP_CHECK=0"
set "TWEEGO_ARGS=%*"
:: Quotes can mess with the comparison below, so we strip them for the check
if defined TWEEGO_ARGS (
	set "ARGS_NO_QUOTES=%TWEEGO_ARGS:"=%"
)
if defined ARGS_NO_QUOTES (
	if not "%ARGS_NO_QUOTES%"=="%ARGS_NO_QUOTES:--skip-package-update-check=%" (
		set "SKIP_CHECK=1"
		set "TWEEGO_ARGS=%TWEEGO_ARGS:--skip-package-update-check=%"
	)
)

IF "%SKIP_CHECK%"=="1" (
	echo Skipping package update check
	goto compile
)

where npm >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
	echo Checking if packages are up-to-date...
	call npm ls --depth=0 >nul || (
		echo ERROR: 'npm ls' had nonzero exit code! Your packages are probably out of date.
		echo Running 'npm ci' should fix this.
		echo Aborting...
		pause
		exit /b 1
	)
	echo Packages are up to date!
) ELSE (
	echo Notice: npm not found.
	echo IF YOU ARE A DEVELOPER, INSTALL NODE.JS! Check the Coder's Guide: https://gitgud.io/Vrelnir/degrees-of-lewdity/-/wikis/Programming/Coder%%27s-Guide
	echo If you just want to play the dev branch, you can ignore this c:
	timeout /t 5 /nobreak >nul
)

:compile
set "TWEEGO_PATH=%~dp0devTools\tweego\storyFormats"

:: Run the appropriate compiler for the user's CPU architecture.
:: Because the EXEs are named identically except for '64' or '86', we can just use variable expansion to pick which one we call.
set "ARCH_SUFFIX=64"
:: There are a lot of values for x64 architectures in that variable, but only one for x86
:: To avoid messiness with lots of IFs, we can just default to x64 unless we explicitly find x86
:: PROCESSOR_ARCHITEW6432 is defined when the script is being run in a 32-bit process but the machine's architecture is still 64-bit
if /i "%PROCESSOR_ARCHITECTURE%" == "x86" if not defined PROCESSOR_ARCHITEW6432 (
	set "ARCH_SUFFIX=86"
)

echo Compiling for x%ARCH_SUFFIX% arch
CALL "%~dp0devTools\tweego\tweego_win%ARCH_SUFFIX%.exe" %TWEEGO_ARGS% -o "%~dp0Degrees of Lewdity VERSION.html" --head "%~dp0devTools\head.html" "%~dp0game" --module "%~dp0modules" || goto build_failed
goto build_success

:build_failed
echo Build failed...
pause
exit /b 1

:build_success
echo Build successful!
