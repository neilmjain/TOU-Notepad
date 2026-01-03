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
                        # Find the last "Game Started" block
                        # We look for "=== Game Started:"
                        # Splitting by it gives us chunks, the last chunk is the latest game
                        games = content.split('=== Game Started:')
                        if len(games) > 1:
                            last_game = games[-1]
                            # Parse players
                            # Format example: Player: NeiL | Color: 1FA49FFF
                            # Regex to capture Name and Color
                            # Name can contain spaces
                            matches = re.findall(r'Player:\s*(.+?)\s*\|\s*Color:\s*([0-9A-Fa-f]+)', last_game)
                            
                            for name, color_hex in matches:
                                # Convert RRGGBBAA to #RRGGBB
                                # The log seems to use RRGGBBAA
                                # HTML color input expects #RRGGBB
                                if len(color_hex) >= 6:
                                    color = '#' + color_hex[:6]
                                else:
                                    color = '#ff1a1a' # fallback red
                                
                                players_data.append({'name': name.strip(), 'color': color})
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
