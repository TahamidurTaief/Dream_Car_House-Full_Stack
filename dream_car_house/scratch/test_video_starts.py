import asyncio, json, subprocess, urllib.request, websockets, base64, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_test_vids'

async def test_videos():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9245',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9245/json')
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

            # Test 1: Change hero iframe to 7cxfVWs4YGw at start=18
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('hero-youtube-iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube-nocookie.com/embed/7cxfVWs4YGw?autoplay=1&mute=1&loop=1&playlist=7cxfVWs4YGw&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1&start=18';
                        iframe.classList.add('is-ready');
                    }
                })()
                """
            })
            await asyncio.sleep(4)
            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/test_start18.jpg', 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))
            print("Captured test_start18.jpg")

            # Test 2: Change hero iframe to 7cxfVWs4YGw at start=24
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('hero-youtube-iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube-nocookie.com/embed/7cxfVWs4YGw?autoplay=1&mute=1&loop=1&playlist=7cxfVWs4YGw&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1&start=24';
                    }
                })()
                """
            })
            await asyncio.sleep(4)
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/test_start24.jpg', 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print("Captured test_start24.jpg")

            # Test 3: Test rOmWSknq9g0 (Welcome to Hollmann - Art of Luxury Cars 4K)
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('hero-youtube-iframe');
                    if (iframe) {
                        iframe.src = 'https://www.youtube-nocookie.com/embed/rOmWSknq9g0?autoplay=1&mute=1&loop=1&playlist=rOmWSknq9g0&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1&start=2';
                    }
                })()
                """
            })
            await asyncio.sleep(4)
            shot3 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/test_hollmann.jpg', 'wb') as f:
                f.write(base64.b64decode(shot3['result']['data']))
            print("Captured test_hollmann.jpg")

    finally:
        proc.kill()

asyncio.run(test_videos())
