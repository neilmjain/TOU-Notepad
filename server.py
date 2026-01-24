import http.server
import socketserver
import json
import os
import re
import urllib.parse

PORT = 8000
# Path provided by user
LOG_PATH = "/Users/neiljain/Library/Application Support/CrossOver/Bottles/Among Us/drive_c/Program Files (x86)/Steam/steamapps/common/Among Us/BepInEx/config/player_log.txt"

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle the API endpoint
        if self.path == '/latest-players':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*') # Allow local dev
            self.end_headers()
            
            players_data = []
            try:
                if os.path.exists(LOG_PATH):
                    with open(LOG_PATH, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        meeting_pos = content.rfind('=== Meeting Started')
                        if meeting_pos != -1:
                            tail = content[meeting_pos:]
                            matches = re.findall(r'Player:\s*(.+?)\s*\|\s*Color:\s*([0-9A-Fa-f]{6,8})\s*\|\s*Status:\s*(Alive|Dead)', tail)
                            for name, color_hex, status in matches:
                                color = '#' + color_hex[:6] if len(color_hex) >= 6 else '#ff1a1a'
                                alive = True if status.strip().lower() == 'alive' else False
                                players_data.append({'name': name.strip(), 'color': color, 'alive': alive})
                        else:
                            games = content.split('=== Game Started:')
                            if len(games) > 1:
                                last_game = games[-1]
                                matches = re.findall(r'Player:\s*(.+?)\s*\|\s*Color:\s*([0-9A-Fa-f]+)', last_game)
                                for name, color_hex in matches:
                                    color = '#' + color_hex[:6] if len(color_hex) >= 6 else '#ff1a1a'
                                    players_data.append({'name': name.strip(), 'color': color, 'alive': True})
            except Exception as e:
                print(f"Error processing log file: {e}")
                # Return empty list on error
            
            self.wfile.write(json.dumps(players_data).encode())
            return

        # Default behavior for other paths (serving files)
        super().do_GET()

print(f"Starting server at http://localhost:{PORT}")
print(f"Monitoring log file: {LOG_PATH}")
# Allow reusing address to avoid "Address already in use" errors during restarts
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
