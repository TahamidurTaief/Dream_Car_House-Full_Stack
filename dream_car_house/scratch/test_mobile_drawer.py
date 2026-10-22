import asyncio, json, subprocess, os, base64, urllib.request
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_mobile_drawer'

async def capture():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9235',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=390,844',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9235/json')
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
                    if r.get('id') == msg_id:
                        return r
            
            await send('Page.enable')
            await send('Runtime.enable')
            # Set exact modern iPhone screen metrics (390px)
            await send('Emulation.setDeviceMetricsOverride', {
                'width': 390,
                'height': 844,
                'deviceScaleFactor': 3,
                'mobile': True
            })
            await asyncio.sleep(1)

            # Click wheel menu trigger
            await send('Runtime.evaluate', {'expression': "document.querySelector('.header-wheel-trigger').click();"})
            # Wait 1.5s for drawer to animate open
            await asyncio.sleep(1.8)

            # Get debug info
            info = await send('Runtime.evaluate', {'expression': """
                JSON.stringify({
                    drawerOpen: document.querySelector('.nav-drawer').classList.contains('open'),
                    btnExists: !!document.querySelector('.drawer-close-btn'),
                    btnRect: document.querySelector('.drawer-close-btn').getBoundingClientRect(),
                    drawerRect: document.querySelector('.nav-drawer').getBoundingClientRect(),
                    bannerRect: document.querySelector('.drawer-supercar-banner').getBoundingClientRect(),
                    scrollWidth: document.body.scrollWidth,
                    clientWidth: document.documentElement.clientWidth
                })
            """})
            print('Info:', info)

            shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mobile_menu_open_390.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot['result']['data']))
            print('Screenshot saved')

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(capture())
