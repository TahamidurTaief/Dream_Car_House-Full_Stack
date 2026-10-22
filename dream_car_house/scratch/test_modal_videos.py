import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_test_modals'

async def test_modals():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9251',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9251/json')
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

            # Test Cullinan / Maybach SUV modal
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const modal = document.getElementById('experience-video-modal');
                    const iframe = document.getElementById('experience-video-iframe');
                    if (iframe) iframe.src = 'https://www.youtube.com/embed/9WPmzHuaCo4?autoplay=1&mute=0&rel=0&modestbranding=1';
                    if (modal) modal.classList.add('active');
                })()
                """
            })
            await asyncio.sleep(3)
            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/modal_suv_cullinan.jpg', 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))
            print("Captured modal_suv_cullinan.jpg")

            # Test Showroom Tour modal
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('experience-video-iframe');
                    if (iframe) iframe.src = 'https://www.youtube.com/embed/rOmWSknq9g0?autoplay=1&mute=0&rel=0&modestbranding=1';
                })()
                """
            })
            await asyncio.sleep(3)
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/modal_showroom_tour.jpg', 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print("Captured modal_showroom_tour.jpg")

    finally:
        proc.kill()

asyncio.run(test_modals())
