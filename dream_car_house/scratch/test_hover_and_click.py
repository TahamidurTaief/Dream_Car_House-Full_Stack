import asyncio, json, subprocess, time, urllib.request, websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

async def test_hover_and_click():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9226',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9226/json')
        ws_url = [t['webSocketDebuggerUrl'] for t in json.loads(req.read().decode()) if t.get('type') == 'page'][0]
        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def send_cmd(method, params=None):
                nonlocal msg_id
                msg_id += 1
                curr_id = msg_id
                await ws.send(json.dumps({'id': curr_id, 'method': method, 'params': params or {}}))
                while True:
                    raw = await ws.recv()
                    data = json.loads(raw)
                    if data.get('id') == curr_id:
                        return data

            await send_cmd('Runtime.enable')
            await send_cmd('Input.enable')
            await send_cmd('Page.enable')

            # Find coordinates of #header-menu-btn
            eval_res = await send_cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    if (!btn) return null;
                    const r = btn.getBoundingClientRect();
                    return { x: r.x + r.width/2, y: r.y + r.height/2, width: r.width, height: r.height };
                })()
                """,
                'returnByValue': True
            })
            coords = eval_res['result']['result']['value']
            print("Button center coordinates:", coords)

            # Move mouse over button (hover)
            await send_cmd('Input.dispatchMouseEvent', {
                'type': 'mouseMoved',
                'x': coords['x'],
                'y': coords['y']
            })
            await asyncio.sleep(0.5)

            # Check if animation is running on img during hover
            hov_eval = await send_cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const img = document.querySelector('.realistic-wheel-img');
                    return {
                        btnHover: btn.matches(':hover'),
                        animationName: getComputedStyle(img).animationName,
                        animationDuration: getComputedStyle(img).animationDuration
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Hover animation state:", hov_eval['result']['result']['value'])

            # Real mouse click
            print("Dispatching real mouse click...")
            await send_cmd('Input.dispatchMouseEvent', {
                'type': 'mousePressed',
                'x': coords['x'],
                'y': coords['y'],
                'button': 'left',
                'clickCount': 1
            })
            await send_cmd('Input.dispatchMouseEvent', {
                'type': 'mouseReleased',
                'x': coords['x'],
                'y': coords['y'],
                'button': 'left',
                'clickCount': 1
            })

            # Check state right after click (at 200ms)
            await asyncio.sleep(0.2)
            click_eval = await send_cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const img = document.querySelector('.realistic-wheel-img');
                    const drawer = document.getElementById('nav-drawer');
                    return {
                        btnClasses: btn.className,
                        imgAnimation: getComputedStyle(img).animationName,
                        drawerClasses: drawer.className
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Click t=200ms state:", click_eval['result']['result']['value'])

            # Check state after 1.3s (when drawer should open)
            await asyncio.sleep(1.2)
            after_eval = await send_cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const drawer = document.getElementById('nav-drawer');
                    return {
                        btnClasses: btn.className,
                        drawerClasses: drawer.className,
                        drawerTransform: getComputedStyle(drawer).transform,
                        drawerVisibility: getComputedStyle(drawer).visibility
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Click t=1.4s state:", after_eval['result']['result']['value'])
    finally:
        proc.terminate()

asyncio.run(test_hover_and_click())
