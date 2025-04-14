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