import asyncio, json, subprocess, os, urllib.request, websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_overflow'

async def find_overflow():
    proc = subprocess.Popen([
        edge_path, '--headless=new', '--remote-debugging-port=9238',
        f'--user-data-dir={user_data}', '--no-first-run', '--window-size=375,667',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9238/json')
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
            await send('Emulation.setDeviceMetricsOverride', {
                'width': 375,
                'height': 667,
                'deviceScaleFactor': 2,
                'mobile': True
            })
            await asyncio.sleep(1)

            res = await send('Runtime.evaluate', {'expression': """
                (() => {
                    const docW = document.documentElement.clientWidth;
                    const overflowing = [];
                    document.querySelectorAll('*').forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.right > docW + 1 && el.offsetParent !== null) {
                            overflowing.push({
                                tag: el.tagName,
                                class: String(el.className).slice(0, 40),
                                id: el.id,
                                width: Math.round(rect.width),
                                right: Math.round(rect.right),
                                overflowBy: Math.round(rect.right - docW)
                            });
                        }
                    });
                    return JSON.stringify({ 
                        docW: docW, 
                        docScrollW: document.documentElement.scrollWidth, 
                        bodyScrollW: document.body.scrollWidth,
                        overflowing: overflowing.slice(0, 20) 
                    });
                })()
            """})
            print('Result:', res.get('result', {}).get('result', {}).get('value'))
    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(find_overflow())
