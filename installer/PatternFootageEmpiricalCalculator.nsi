; Pattern Footage Empirical Calculator - NSIS Installer
; Build steps:
; 1) npm run build
; 2) makensis installer\PatternFootageEmpiricalCalculator.nsi

!include "MUI2.nsh"

!define APP_NAME "Pattern Footage Empirical Calculator"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Dyno Nobel"
!define APP_EXE_NAME "index.html"
!define APP_SOURCE_DIR "..\dist"

Name "${APP_NAME}"
OutFile "PatternFootageEmpiricalCalculator-Setup-${APP_VERSION}.exe"
InstallDir "$LOCALAPPDATA\PatternFootageEmpiricalCalculator"
InstallDirRegKey HKCU "Software\PatternFootageEmpiricalCalculator" "Install_Dir"
RequestExecutionLevel user

!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "${APP_SOURCE_DIR}\*.*"

  WriteRegStr HKCU "Software\PatternFootageEmpiricalCalculator" "Install_Dir" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator" "DisplayName" "${APP_NAME}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator" "DisplayVersion" "${APP_VERSION}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator" "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator" "UninstallString" '"$INSTDIR\Uninstall.exe"'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator" "NoRepair" 1

  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE_NAME}"
  CreateShortCut "$SMPROGRAMS\${APP_NAME}\Uninstall ${APP_NAME}.lnk" "$INSTDIR\Uninstall.exe"
  CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE_NAME}"

  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  Delete "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"
  Delete "$SMPROGRAMS\${APP_NAME}\Uninstall ${APP_NAME}.lnk"
  RMDir "$SMPROGRAMS\${APP_NAME}"

  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"

  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\PatternFootageEmpiricalCalculator"
  DeleteRegKey HKCU "Software\PatternFootageEmpiricalCalculator"
SectionEnd
