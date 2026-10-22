import asyncio, json, subprocess, time, urllib.request
import websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_img'

async def check_img():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9227',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9227/json')
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

            await send('Runtime.enable')
            await asyncio.sleep(1)

            res = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(1);
                    const hero = document.getElementById('beg-main-car-img');
                    const thumbs = Array.from(document.querySelectorAll('.beg-thumb-btn img')).map(img => ({
                        src: img.src,
                        naturalWidth: img.naturalWidth,
                        complete: img.complete
                    }));
                    return {
                        heroSrc: hero.src,
                        heroNaturalWidth: hero.naturalWidth,
                        heroComplete: hero.complete,
                        thumbs
                    };
                })()
                """,
                'returnByValue': True
            })
            print(json.dumps(res.get('result', {}).get('result', {}).get('value'), indent=2))
    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(check_img())
