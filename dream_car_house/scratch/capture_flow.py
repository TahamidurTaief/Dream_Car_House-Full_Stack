import asyncio, json, subprocess, urllib.request, websockets, base64

async def test_flow():
    proc = subprocess.Popen([
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless=new',
        '--remote-debugging-port=9233',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9233/json')
        ws_url = [t['webSocketDebuggerUrl'] for t in json.loads(req.read().decode()) if t.get('type') == 'page'][0]
        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def cmd(m, p=None):
                nonlocal msg_id
                msg_id += 1
                c = msg_id
                await ws.send(json.dumps({'id': c, 'method': m, 'params': p or {}}))
                while True:
                    raw = await ws.recv()
                    d = json.loads(raw)
                    if d.get('id') == c:
                        return d

            async def screenshot(name):
                res = await cmd('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
                with open(name, 'wb') as f:
                    f.write(base64.b64decode(res['result']['data']))
                print(f'Saved {name}')

            await cmd('Runtime.enable')
            await cmd('Page.enable')

            # Initial state
            await screenshot('scratch/screen_1_initial.jpg')

            # Hover over button
            btn_coords = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const r = btn.getBoundingClientRect();
                    return {x: r.x + r.width/2, y: r.y + r.height/2};
                })()
                """,
                'returnByValue': True
            })
            coords = btn_coords['result']['result']['value']
            print('Button coords:', coords)

            await cmd('Input.dispatchMouseEvent', {'type': 'mouseMoved', 'x': coords['x'], 'y': coords['y']})
            await asyncio.sleep(0.5)
            await screenshot('scratch/screen_2_hover.jpg')

            # Now click
            await cmd('Runtime.evaluate', {'expression': "document.getElementById('header-menu-btn').click()"})
            await asyncio.sleep(0.3)
            await screenshot('scratch/screen_3_spinning.jpg')

            await asyncio.sleep(1.2)
            await screenshot('scratch/screen_4_drawer_open.jpg')

            # Also check computed styles of drawer
            st = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const d = document.getElementById('nav-drawer');
                    const b = document.getElementById('drawer-backdrop');
                    return {
                        drawerClass: d.className,
                        drawerTransform: getComputedStyle(d).transform,
                        drawerRight: getComputedStyle(d).right,
                        drawerZ: getComputedStyle(d).zIndex,
                        backdropClass: b.className,
                        backdropOpacity: getComputedStyle(b).opacity
                    };
                })()
                """,
                'returnByValue': True
            })
            print('Drawer computed style:', st['result']['result']['value'])
    finally:
        proc.terminate()

asyncio.run(test_flow())
