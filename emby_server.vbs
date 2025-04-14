Option Explicit

' Emby Helper Service Auto Start Script
' Changed to hidden window mode for background running

Dim WshShell, fso

' Create objects
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Use absolute paths
Dim pythonExePath, serverScriptPath
pythonExePath = "H:\emby\embyLaunchLocalFiles\py310-embed\python.exe"
serverScriptPath = "H:\emby\embyLaunchLocalFiles\emby_server.py"

' Check if files exist
If Not fso.FileExists(pythonExePath) Then
    MsgBox "Error: Python executable not found: " & pythonExePath, vbCritical, "Emby Helper Service Start Failed"
    WScript.Quit
End If

If Not fso.FileExists(serverScriptPath) Then
    MsgBox "Error: Server script not found: " & serverScriptPath, vbCritical, "Emby Helper Service Start Failed"
    WScript.Quit
End If

' Start service, window style 0 means hidden window (background running)
WshShell.Run """" & pythonExePath & """ """ & serverScriptPath & """", 0, False

' Clean up objects
Set fso = Nothing
Set WshShell = Nothing 