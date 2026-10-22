import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_sampler'

async def sample():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9246',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9246/json')
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

            # Let's test timestamps on 7cxfVWs4YGw: 32s, 48s, 65s
            for ts in [32, 48, 65]:
                await send('Runtime.evaluate', {
                    'expression': f"""
                    (() => {{
                        const iframe = document.getElementById('hero-youtube-iframe');
                        if (iframe) {{
                            iframe.src = 'https://www.youtube-nocookie.com/embed/7cxfVWs4YGw?autoplay=1&mute=1&controls=0&start={ts}';
                        }}
                    }})()
                    """
                })
                # Wait 5 seconds so video is well underway and all startup overlays are completely gone
                await asyncio.sleep(5)
                shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
                with open(f'scratch/maybach_{ts}s.jpg', 'wb') as f:
                    f.write(base64.b64decode(shot['result']['data']))
                print(f"Captured maybach_{ts}s.jpg")

            # Let's test NupQJIgvpHU (Mercedes-Maybach S680 Ultimate Luxury Car Edit 4K)
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('hero-youtube-iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube-nocookie.com/embed/NupQJIgvpHU?autoplay=1&mute=1&controls=0&start=3';
                    }
                })()
                """
            })
            await asyncio.sleep(5)
            shot_edit = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/maybach_edit_3s.jpg', 'wb') as f:
                f.write(base64.b64decode(shot_edit['result']['data']))
            print("Captured maybach_edit_3s.jpg")

    finally:
        proc.kill()

asyncio.run(sample())
