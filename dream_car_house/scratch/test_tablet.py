import asyncio, json, subprocess, os, urllib.request, websockets, base64

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_tablet'

async def test_tablet():
    proc = subprocess.Popen([
        edge_path, '--headless=new', '--remote-debugging-port=9250',
        f'--user-data-dir={user_data}', '--no-first-run', '--window-size=768,1024',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
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
                    r = json.loads(await ws.recv())
                    if r.get('id') == msg_id: return r
            
            await send('Page.enable')
            await send('Runtime.enable')
            await send('Emulation.setDeviceMetricsOverride', {'width': 768, 'height': 1024, 'deviceScaleFactor': 2, 'mobile': False})
            await asyncio.sleep(1)

            # Check overflow on tablet
            of = await send('Runtime.evaluate', {'expression': "JSON.stringify({ docW: document.documentElement.clientWidth, scrollW: document.documentElement.scrollWidth })"})
            print('Tablet metrics:', of['result']['result']['value'])

            # Shot 1: Tablet Home
            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'tablet_1_home.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))
            print('Captured tablet_1_home.jpg')

            # Shot 2: Tablet Drawer Open
            await send('Runtime.evaluate', {'expression': "document.querySelector('.header-wheel-trigger').click();"})
            await asyncio.sleep(1.6)
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'tablet_2_drawer.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print('Captured tablet_2_drawer.jpg')

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(test_tablet())
