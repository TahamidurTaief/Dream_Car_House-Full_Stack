import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_test_reel'

async def test_reel():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9255',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2.5)

    try:
        req = urllib.request.urlopen('http://127.0.0.1:9255/json')
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

            # Test 9WPmzHuaCo4
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('experience-video-iframe');
                    const modal = document.getElementById('experience-video-modal');
                    if (iframe) iframe.src = 'https://www.youtube.com/embed/9WPmzHuaCo4?autoplay=1&mute=0&rel=0&modestbranding=1';
                    if (modal) modal.classList.add('active');
                })()
                """
            })
            await asyncio.sleep(4)
            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/reel_test_9WPmzHuaCo4.jpg', 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))
            print("Captured reel_test_9WPmzHuaCo4.jpg")

            # Test Ilz3cSxLvLM
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('experience-video-iframe');
                    if (iframe) iframe.src = 'https://www.youtube.com/embed/Ilz3cSxLvLM?autoplay=1&mute=0&rel=0&modestbranding=1';
                })()
                """
            })
            await asyncio.sleep(4)
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/reel_test_Ilz3cSxLvLM.jpg', 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print("Captured reel_test_Ilz3cSxLvLM.jpg")

    finally:
        proc.kill()

asyncio.run(test_reel())
