import asyncio
import pathlib
import ssl
import websockets

async def echo(websocket, path):
    async for message in websocket:
        await websocket.send(message)

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain("dosenet.cert", "dosenet.key")

start_server = websockets.serve(
    echo, "0.0.0.0", 8765, ssl=ssl_context
)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()