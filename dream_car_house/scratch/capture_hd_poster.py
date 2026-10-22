import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_hd_capture'

async def capture_hd():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9250',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1920,1080',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000/scratch/yt_api_test.html'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9250/json')
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
            # Wait for video to reach 49-50 seconds
            await asyncio.sleep(8)
            shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 95})
            with open('assets/maybach_hero_poster.jpg', 'wb') as f:
                f.write(base64.b64decode(shot['result']['data']))
            print("Captured assets/maybach_hero_poster.jpg in 1080p")
    finally:
        proc.kill()

asyncio.run(capture_hd())
