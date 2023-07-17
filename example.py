# Define HTTPS Server
import http.server, ssl, socketserver, pyqrcode

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain("dosenet.cert", "dosenet.key")
server_address = ("0.0.0.0", 443)
handler = http.server.SimpleHTTPRequestHandler



# Define Websocket Server
import asyncio
from websockets.server import serve

async def echo(websocket, path):
    async for message in websocket:
        print(message)
        await websocket.send(message)
        

async def main():
    async with serve(echo, "0.0.0.0", 8765, ssl=context):
        await asyncio.Future()  # run forever





# Run Websocket Server (in background)
import threading
thread = threading.Thread(target=asyncio.run, args=(main(),))
thread.start()


# Run HTTPS Server
with socketserver.TCPServer(server_address, handler) as httpd:

    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    httpd.serve_forever()

