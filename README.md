# Electron JS ATOM VPN Application


This repo has Electron JS application which is used to make VPN Connection using ATOM VPN Windows application.

## How to build the application

1. Clone this repo into your local folder
2. Navigate to the folder where you cloned the repo and open folder .../atom.vpn.electronin in VSCode
3. Open Terminal in VSCode and run below commands
4. npm install
5. npm run build

## To run the application from VSCode execute below command from VSCode Terminal

1. Copy all files from atom.vpn.console application's bin folder to a path which is written in config.json or check function startSDKProcess() in main.ts which launches atom.vpn.console. This applicaiton cannot run without atom.vpn.console.exe. https://github.com/sa-abbasi/atom.vpn.console.git
2. npm start

## Compiling Application for Distribution/QA
Run below command to compile application for distribution
1. electron-packager . atomvpnapp  --platform=win32 --arch=x64 --overwrite
Application will be compiled and published to folder (..\atom.vpn.electron\atomvpnapp-win32-x64)
2. Copy content from folder (..\atom.vpn.electron\atomvpnapp-win32-x64\resources\app\release\app\dist) to a similarly folder found in release.
Note: I created two release in this repo, please download the latter release and extract it, you will find a folder structure in extracted zip (atomvpnapp-win32-x64\resources\app\release\app\dist).

Please check release notes   for (atom vpn electron application v1.0.1) and download this release, it has everything pre-compiled, configured and packaged.
You need to install Atom VPN drivers and Windows Service, please check https://Secure.com.
