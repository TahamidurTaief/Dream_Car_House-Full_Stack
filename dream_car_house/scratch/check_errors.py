import asyncio, json, subprocess, urllib.request, websockets

async def check_console():
    proc = subprocess.Popen([
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless=new',
        '--remote-debugging-port=9235',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9235/json')
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

            await cmd('Runtime.enable')
            await cmd('Console.enable')

            # Listen for console messages
            messages = []
            
            # Click
            res = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    btn.click();
                    return { clicked: true };
                })()
                """,
                'returnByValue': True
            })
            print('Click eval result:', res)

            # Wait and check
            await asyncio.sleep(1.5)

            # Check if any errors occurred
            err = await cmd('Runtime.evaluate', {
                'expression': 'window.__lastError || null',
                'returnByValue': True
            })
            print('Window last error:', err)
    finally:
        proc.terminate()

asyncio.run(check_console())
