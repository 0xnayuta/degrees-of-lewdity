#!/usr/bin/env bash

# display errors in red text at stderr
function echoError() {
	echo -e "\033[0;31m$*\033[0m" >&2
}

function compile() {
	# set working directory
	pushd "$(dirname "${BASH_SOURCE[0]}")" > /dev/null || {
		echoError "ERROR: failed to set working directory to script location"	
		read -r -p "Press [Enter] key to exit"
		exit 1
	}
	# ensure working directory is restored on exit
	trap 'popd > /dev/null' EXIT


	# scan for --skip-package-update-check as an argument
	# if found, we skip the check
	# we have to construct a list of arguments excluding that one, since we still want to pass other args to the compiler
	local skip_check="false"
	local tweego_args=()
	for arg in "$@"; do
		if [ "$arg" = "--skip-package-update-check" ]; then
			skip_check="true"
		else
			tweego_args+=("$arg")
		fi
	done

	if [ "$skip_check" = "true" ]; then
		echo "Skipping package update check"
	elif command -v npm &> /dev/null; then
		echo "Checking if packages are up-to-date..."
		if ! npm ls --depth=0 > /dev/null; then
			echoError "ERROR: 'npm ls' had nonzero exit code! Your packages are probably out of date."
			echoError "Running 'npm ci' should fix this."
			echoError "Aborting..."
			read -r -p "Press [Enter] key to exit"
			exit 1
		fi
		echo "Packages are up to date!"
	else
		echo "Notice: npm not found."
		echo "IF YOU ARE A DEVELOPER, INSTALL NODE.JS! Check the Coder's Guide: https://gitgud.io/Vrelnir/degrees-of-lewdity/-/wikis/Programming/Coder%27s-Guide"
		echo "If you just want to play the dev branch, you can ignore this :)"
		sleep 5
	fi
	echo -n "Compiling for "

	export TWEEGO_PATH=devTools/tweego/storyFormats
	if [ -z ${FORCE_VERSION+true} ]; then
		VERSION="$(git describe --tags --always --dirty)"
	else
		VERSION="$FORCE_VERSION"
	fi
	if [ -z "${VERSION}" ]; then
		TARGET="Degrees of Lewdity.html"
	else
		TARGET="Degrees of Lewdity $VERSION.html"
	fi

	TWEEGO_EXE="tweego"
	if ! command -v tweego &> /dev/null; then
		case "$(uname -m)" in
			x86_64 | amd64)
				echo "x64 arch"
				if [ "$(uname -s)" = "Darwin" ]; then
					TWEEGO_EXE="./devTools/tweego/tweego_osx64"
				elif [[ "$OSTYPE" == msys* || "$OSTYPE" == cygwin* || "$OSTYPE" == win32* ]]; then
					TWEEGO_EXE="./devTools/tweego/tweego_win64.exe"
				else
					TWEEGO_EXE="./devTools/tweego/tweego_linux64"
				fi
				;;
			x86 | i[3-6]86)
				echo "x86 arch"
				if [ "$(uname -s)" = "Darwin" ]; then
					TWEEGO_EXE="./devTools/tweego/tweego_osx86"
				elif [[ "$OSTYPE" == msys* || "$OSTYPE" == cygwin* || "$OSTYPE" == win32* ]]; then
					TWEEGO_EXE="./devTools/tweego/tweego_win86.exe"
				else
					TWEEGO_EXE="./devTools/tweego/tweego_linux86"
				fi
				;;
			arm64 | aarch64)
				if [ "$(uname -s)" = "Darwin" ]; then
					echo "arm64 arch"
					TWEEGO_EXE="./devTools/tweego/tweego_m1"  # for mac m1 and m2
				else
					echo "unsupported arm64/aarch64 arch"
					echoError "No system tweego binary found, and no precompiled binary for your platform available."
					echoError "Please compile tweego and put the executable in PATH."
					read -r -p "Press [Enter] key to exit"
					exit 2
				fi
				;;
			*)
				echo "" # trailing newline
				echoError "No system tweego binary found, and no precompiled binary for your platform available."
				echoError "Please compile tweego and put the executable in PATH."
				read -r -p "Press [Enter] key to exit"
				exit 2
				;;
		esac
	else
		echo "the tweego in your PATH"
	fi
	
	local build_failed="false"
	"$TWEEGO_EXE" "${tweego_args[@]}" -o  "$TARGET" --head "devTools/head.html" --module "modules" game/ || build_failed="true"

	if [ "$build_failed" = "true" ]; then
		echoError "Build failed."
		read -r -p "Press [Enter] key to exit"
		exit 1
	else
		if [ "$TARGET" != "Degrees of Lewdity.html" ]; then
			# android builder expects to find a file by this name. this is a symbolic link, not a full copy
			ln -fs "$TARGET" "Degrees of Lewdity.html" || cp -f "$TARGET" "Degrees of Lewdity.html"
		fi
		echo "Done: \"$TARGET\""
		exit 0
	fi
}

compile "$@"
