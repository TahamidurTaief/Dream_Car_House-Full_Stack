import asyncio, json, subprocess, time, urllib.request, websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'

async def inspect_wheel():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9224',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9224/json')
        ws_url = [t['webSocketDebuggerUrl'] for t in json.loads(req.read().decode()) if t.get('type') == 'page'][0]
        async with websockets.connect(ws_url) as ws:
            await ws.send(json.dumps({'id': 1, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'DOM.enable'}))
            await ws.send(json.dumps({'id': 3, 'method': 'CSS.enable'}))

            # Query wheel element
            res = await ws.send(json.dumps({
                'id': 10,
                'method': 'Runtime.evaluate',
                'params': {
                    'expression': """
                    (() => {
                        const btn = document.getElementById('header-menu-btn');
                        if (!btn) return 'NO_BTN';
                        const wrapper = btn.querySelector('.wheel-disc-wrapper');
                        const img = btn.querySelector('.realistic-wheel-img');
                        const csBtn = getComputedStyle(btn);
                        const csWrapper = wrapper ? getComputedStyle(wrapper) : null;
                        const csImg = img ? getComputedStyle(img) : null;
                        return {
                            btn: {
                                display: csBtn.display,
                                width: csBtn.width,
                                height: csBtn.height,
                                pointerEvents: csBtn.pointerEvents,
                                zIndex: csBtn.zIndex,
                                position: csBtn.position
                            },
                            wrapper: csWrapper ? {
                                width: csWrapper.width,
                                height: csWrapper.height,
                                animation: csWrapper.animation
                            } : null,
                            img: csImg ? {
                                width: csImg.width,
                                height: csImg.height,
                                animation: csImg.animation,
                                transform: csImg.transform
                            } : null
                        };
                    })()
                    """,
                    'returnByValue': True
                }
            }))
            msg = json.loads(await ws.recv())
            # Find response with id 10
            while msg.get('id') != 10:
                msg = json.loads(await ws.recv())
            print("Computed styles of wheel:\n", json.dumps(msg.get('result', {}).get('result', {}).get('value', {}), indent=2))
    finally:
        proc.terminate()

asyncio.run(inspect_wheel())
