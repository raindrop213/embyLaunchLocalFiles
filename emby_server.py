import http.server
import socketserver
import subprocess
import json
import urllib.parse
import os
from urllib.parse import parse_qs, urlparse

# 播放器路径配置
POTPLAYER_PATH = r"C:\Program Files\DAUM\PotPlayer\PotPlayerMini64.exe"
DANDANPLAY_PATH = r"C:\Users\Raindrop\AppData\Roaming\弹弹play\dandanplay.exe"

PORT = 38096  # 可以修改为你想要的端口

# 路径替换配置（默认关闭）
# 当开启后，会按顺序将以源前缀开头的路径替换为目标前缀，并将分隔符统一为 Windows 的 "\\"
# 例如：/mnt/media/anime/xxx.mkv -> \\192.168.100.209\acgn\emby\media\anime\xxx.mkv
PATH_REWRITE_ENABLED = False
# 规则为 (源前缀, 目标前缀)
PATH_REWRITE_RULES = [
    ("/mnt/media", r"\\192.168.100.209\acgn\emby\media"),
]

def rewrite_path_if_enabled(original_path: str) -> str:
    """根据配置按前缀替换路径，并返回替换后的新路径。

    - 默认不启用，直接返回原路径
    - 命中任一规则后：目标前缀 + 剩余相对路径（将 "/" 替换为 "\\"）
    """
    try:
        if not PATH_REWRITE_ENABLED:
            return original_path
        if not original_path:
            return original_path
        for src_prefix, dst_prefix in PATH_REWRITE_RULES:
            if not src_prefix:
                continue
            if original_path.startswith(src_prefix):
                relative_part = original_path[len(src_prefix):]
                # 统一使用 Windows 分隔符
                relative_part = relative_part.replace("/", "\\")
                # 保障连接时不会出现重复或缺失分隔符
                needs_sep = (not dst_prefix.endswith("\\")) and (not relative_part.startswith("\\"))
                sep = "\\" if needs_sep else ""
                new_path = f"{dst_prefix}{sep}{relative_part}"
                # 规范化：保留 UNC 起始的两个反斜杠，其他位置折叠多重反斜杠
                if new_path.startswith("\\\\"):
                    head = "\\\\"
                    body = new_path[2:]
                    while "\\\\" in body:
                        body = body.replace("\\\\", "\\")
                    new_path = head + body
                else:
                    while "\\\\" in new_path:
                        new_path = new_path.replace("\\\\", "\\")
                print(f"[PathRewrite] {original_path} -> {new_path}")
                return new_path
        return original_path
    except Exception as _:
        # 出现异常时兜底返回原路径，避免影响主流程
        return original_path

class EmbyHandler(http.server.SimpleHTTPRequestHandler):
    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        # 解析URL参数
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        
        # 设置响应头
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # 默认响应
        response = {"status": "error", "message": "无效的请求"}
        
        if parsed_url.path == "/open":
            action = query_params.get("action", [""])[0]
            path = query_params.get("path", [""])[0]
            
            if path:
                try:
                    # 解码路径
                    decoded_path = urllib.parse.unquote(path)
                    # 可选：路径重写
                    decoded_path = rewrite_path_if_enabled(decoded_path)
                    
                    if action == "folder":
                        # 打开文件夹并选中视频文件
                        folder_path = os.path.dirname(decoded_path)
                        subprocess.Popen(f'explorer /select,"{decoded_path}"')
                        response = {"status": "success", "message": f"已打开文件夹并选中: {decoded_path}"}
                    
                    elif action == "potplayer":
                        # 用PotPlayer打开视频
                        subprocess.Popen([POTPLAYER_PATH, decoded_path])
                        response = {"status": "success", "message": f"已用PotPlayer打开: {decoded_path}"}
                    
                    elif action == "dandanplay":
                        # 用弹弹play打开视频
                        subprocess.Popen([DANDANPLAY_PATH, decoded_path])
                        response = {"status": "success", "message": f"已用弹弹play打开: {decoded_path}"}
                    
                    else:
                        response = {"status": "error", "message": "未知的操作类型"}
                
                except Exception as e:
                    response = {"status": "error", "message": f"操作失败: {str(e)}"}
            else:
                response = {"status": "error", "message": "未提供文件路径"}
        
        # 发送响应
        self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))

def run_server():
    with socketserver.TCPServer(("", PORT), EmbyHandler) as httpd:
        print(f"服务器运行在 http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    print(f"启动Emby辅助服务器，监听端口: {PORT}")
    print(f"PotPlayer路径: {POTPLAYER_PATH}")
    print(f"弹弹play路径: {DANDANPLAY_PATH}")
    run_server() 