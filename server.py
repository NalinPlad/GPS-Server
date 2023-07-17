# Define HTTPS Server
import http.server, ssl, socketserver, qrcode

context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain("dosenet.cert", "dosenet.key")
server_address = ("0.0.0.0", 443)
handler = http.server.SimpleHTTPRequestHandler



# Define Websocket Server
import asyncio
from websockets.server import serve

async def resp(websocket, path):
    async for message in websocket:
        print(message)
        if(message == "clientping"):
            await websocket.send("serverpong")

            # temporary send this json payload
            await websocket.send("start")
        # await websocket.send(message)
        

async def main():
    async with serve(resp, "0.0.0.0", 8765, ssl=context):
        await asyncio.Future()  # run forever


# Get ip addr
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
IPAddr = s.getsockname()[0]
s.close()

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

