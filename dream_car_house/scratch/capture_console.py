import asyncio, json, subprocess, time, os, urllib.request
import websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile'

async def capture_console():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9223',
        f'--user-data-dir={user_data}_2',
        '--no-first-run',
        '--no-default-browser-check',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9223/json')
        targets = json.loads(req.read().decode())
        ws_url = [t['webSocketDebuggerUrl'] for t in targets if t.get('type') == 'page'][0]
        
        async with websockets.connect(ws_url) as ws:
            # Enable Console & Runtime
            await ws.send(json.dumps({'id': 1, 'method': 'Console.enable'}))
            await ws.send(json.dumps({'id': 2, 'method': 'Runtime.enable'}))
            await ws.send(json.dumps({'id': 3, 'method': 'Log.enable'}))

            # Collect messages for 3 seconds
            start = time.time()
            while time.time() - start < 3:
                try:
                    msg = await asyncio.wait_for(ws.recv(), timeout=0.5)
                    data = json.loads(msg)
                    if 'method' in data:
                        method = data['method']
                        if 'Console' in method or 'Log' in method or 'Runtime' in method:
                            print("BROWSER LOG/EVENT:", json.dumps(data, indent=2))
                except asyncio.TimeoutError:
                    pass

            # Now test executing the click function directly
            print("\nEvaluating handleWheelMenuClick directly...")
            await ws.send(json.dumps({
                'id': 100,
                'method': 'Runtime.evaluate',
                'params': {
                    'expression': 'typeof handleWheelMenuClick',
                    'returnByValue': True
                }
            }))
            resp = json.loads(await ws.recv())
            print("typeof handleWheelMenuClick:", resp)
            
            # Call handleWheelMenuClick()
            await ws.send(json.dumps({
                'id': 101,
                'method': 'Runtime.evaluate',
                'params': {
                    'expression': 'handleWheelMenuClick();',
                    'returnByValue': True
                }
            }))
            resp2 = json.loads(await ws.recv())
            print("Call result:", resp2)

    finally:
        proc.terminate()

asyncio.run(capture_console())
