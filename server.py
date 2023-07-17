# Define HTTPS Server
import http.server, ssl, socketserver, qrcode

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


# Get ip addr
import socket
IPAddr = (([ip for ip in socket.gethostbyname_ex(socket.gethostname())[2] if not ip.startswith("127.")] or [[(s.connect(("8.8.8.8", 53)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1]]) + ["no IP found"])[0]

# Print QR Code optimistically
url = f"https://{IPAddr}/www/"
qr = qrcode.QRCode()
qr.add_data(url)
qr.print_ascii()
print(url)


# Run Websocket Server (in background)
import threading
thread = threading.Thread(target=asyncio.run, args=(main(),))
thread.start()

# Run HTTPS Server
with socketserver.TCPServer(server_address, handler) as httpd:

    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    httpd.serve_forever()

