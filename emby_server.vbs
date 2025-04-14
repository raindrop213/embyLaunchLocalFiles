Option Explicit

' Emby Helper Service Auto Start Script
' 修改为显示命令窗口以便调试

Dim WshShell, fso

' Create objects
Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' 使用绝对路径
Dim pythonExePath, serverScriptPath
pythonExePath = "H:\emby\embyLaunchLocalFiles\py310-embed\python.exe"
serverScriptPath = "H:\emby\embyLaunchLocalFiles\emby_server.py"

' Check if files exist
If Not fso.FileExists(pythonExePath) Then
    MsgBox "错误: Python可执行文件未找到: " & pythonExePath, vbCritical, "Emby Helper Service启动失败"
    WScript.Quit
End If

If Not fso.FileExists(serverScriptPath) Then
    MsgBox "错误: 服务器脚本未找到: " & serverScriptPath, vbCritical, "Emby Helper Service启动失败"
    WScript.Quit
End If

' 启动服务，窗口样式为1，表示正常显示窗口
WshShell.Run """" & pythonExePath & """ """ & serverScriptPath & """", 1, False

' Clean up objects
Set fso = Nothing
Set WshShell = Nothing 