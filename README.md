# Emby本地媒体打开工具

这是一个帮助你从Emby/Jellyfin界面直接打开本地媒体文件夹或使用本地播放器播放视频的工具组合。

## 功能特点

- 支持在Emby/Jellyfin界面添加三个按钮：
  - 打开文件夹 - 使用资源管理器打开视频所在文件夹
  - PotPlayer播放 - 使用PotPlayer打开当前视频文件
  - 弹弹play播放 - 使用弹弹play打开当前视频文件

## 系统组件

1. **油猴脚本(embyLaunchLocalFiles.js)** - 在Emby/Jellyfin界面添加按钮并发送请求
2. **Python服务端(emby_server.py)** - 接收请求并执行本地操作
3. **启动批处理(emby_server_debug.bat)** - 显示控制台窗口启动Python服务

## 安装步骤

### 1. 下载并解压

1. 下载本项目所有文件并解压到任意位置
2. 确保所有文件保持在同一文件夹中

### 2. 配置Python服务端

可以编辑`emby_server.py`文件，修改以下设置:
- `POTPLAYER_PATH` - PotPlayer播放器路径
- `DANDANPLAY_PATH` - 弹弹play播放器路径
- `PORT` - 服务器端口号(默认38096)

### 3. 安装油猴脚本

1. 确保浏览器已安装Tampermonkey或类似的用户脚本管理器
2. [点击此处安装](https://raw.githubusercontent.com/raindrop213/embyLaunchLocalFiles/main/embyLaunchLocalFiles.user.js)

### 4. 设置自动启动(可选)

如果希望服务在Windows启动时自动运行:
1. 编辑`emby_server.vbs`中的路径，确保指向正确的Python和脚本位置
2. 将该VBS脚本的快捷方式到启动项中（win + R 输入 shell:startup）
