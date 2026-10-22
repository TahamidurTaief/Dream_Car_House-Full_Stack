import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_check_fade'

async def check_fade():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9254',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1440,900',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2.5)

    try:
        req = urllib.request.urlopen('http://127.0.0.1:9254/json')
        targets = json.loads(req.read().decode())
        ws_url = [t['webSocketDebuggerUrl'] for t in targets if t.get('type') == 'page'][0]
        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def send(method, params=None):
                nonlocal msg_id
                msg_id += 1
                await ws.send(json.dumps({'id': msg_id, 'method': method, 'params': params or {}}))
                while True:
                    m = json.loads(await ws.recv())
                    if m.get('id') == msg_id:
                        return m
            await send('Page.enable')

            # Let's take screenshots at 6s and 8s
            await asyncio.sleep(6.0)
            shot6 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open('scratch/check_fade_6s.jpg', 'wb') as f:
                f.write(base64.b64decode(shot6['result']['data']))
            print("Captured check_fade_6s.jpg")

            await asyncio.sleep(2.0)
            shot8 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open('scratch/check_fade_8s.jpg', 'wb') as f:
                f.write(base64.b64decode(shot8['result']['data']))
            print("Captured check_fade_8s.jpg")

    finally:
        proc.kill()

asyncio.run(check_fade())
