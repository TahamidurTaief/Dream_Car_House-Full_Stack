import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_decay'

async def test_decay():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9248',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000/scratch/yt_api_test.html'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9248/json')
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

            # Check player time every 2 seconds for 12 seconds
            for i in range(6):
                await asyncio.sleep(2)
                res = await send('Runtime.evaluate', {
                    'expression': """
                    (() => {
                        if (typeof player !== 'undefined' && player && typeof player.getPlayerState === 'function') {
                            return {
                                state: player.getPlayerState(),
                                time: player.getCurrentTime(),
                                duration: player.getDuration(),
                                loadedFraction: player.getVideoLoadedFraction()
                            };
                        }
                        return null;
                    })()
                    """,
                    'returnByValue': True
                })
                data = res.get('result', {}).get('result', {}).get('value')
                print(f"Time {i*2 + 2}s: player status =", data)
                
                shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
                with open(f'scratch/decay_frame_{i*2+2}s.jpg', 'wb') as f:
                    f.write(base64.b64decode(shot['result']['data']))
    finally:
        proc.kill()

asyncio.run(test_decay())
