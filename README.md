compiled file for anyone who anyone wants to test this https://mega.nz/file/F9tHDLZR#yaEMeXYFsDMhgoO9ORI8C8s75m3wb-q8iytVDUzQMTo without needing to compile it(no img folder so some images will be missing)

# Degrees of Lewdity

## How to build

### Optional Prerequisites

1. Install [Tweego](http://www.motoslave.net/tweego/) and remember the path where it was installed.
2. Add path to `tweego.exe` (e.g. `C:\Program Files\Twine\tweego-2.1.0-windows-x64`) to Windows `Path` environment variable.

### Changing the build version and type

1. Open `01-config\sugarcubeConfig.js`.
2. Edit the `window.StartConfig` object to the relevant config type.
    * Normal Build - `enableImages` needs to be `true` and `enableLinkNumberify` needs to be `true`.
    * Text Only Build - `enableImages` needs to be `false` and `enableLinkNumberify` needs to be `true`.
    * Android Build - `enableImages` needs to be `true` and `enableLinkNumberify` needs to be `false`.
3. `version` is optional between release versions but will be displayed on screen in several places and stored in the saves made.
4. `debug` is optional and will only effect new games.

### Compiling the html

1. Run `compile.bat` or `compile-watch.bat`.
2. Open `Degrees of Lewdity VERSION.html`.

### Build Android version (.apk)

?
