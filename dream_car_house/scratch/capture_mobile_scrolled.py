import asyncio, json, urllib.request, websockets, subprocess, base64, os

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'

async def capture_scrolled():
    proc = subprocess.Popen([
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless=new', '--remote-debugging-port=9252',
        r'--user-data-dir=c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_scrolled2',
        '--no-first-run', '--window-size=375,720', 'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9252/json')
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
            await send('Emulation.setDeviceMetricsOverride', {'width': 375, 'height': 720, 'deviceScaleFactor': 2, 'mobile': True})
            await send('Runtime.evaluate', {'expression': 'openCarModal(1);'})
            await asyncio.sleep(1)
            # Scroll modal down
            await send('Runtime.evaluate', {
                'expression': "const b = document.querySelector('.car-modal-box'); if (b) b.scrollTop = 9999;"
            })
            await asyncio.sleep(0.5)
            shot_m = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'beg_car_modal_mobile_scrolled.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_m['result']['data']))
            print('Saved beg_car_modal_mobile_scrolled.jpg')
    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(capture_scrolled())
