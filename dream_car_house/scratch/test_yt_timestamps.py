import asyncio, json, subprocess, urllib.request, websockets, base64, os

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_test_timestamps'

html_test = """
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #000; overflow: hidden; }
  .wrap { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
  iframe {
    position: absolute; top: 50%; left: 50%;
    width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.78vh;
    transform: translate(-50%, -50%) scale(1.35);
    border: none;
  }
</style>
</head>
<body>
<div class="wrap">
  <iframe id="yt" src="https://www.youtube.com/embed/7cxfVWs4YGw?autoplay=1&mute=1&controls=0&start=18" allow="autoplay"></iframe>
</div>
</body>
</html>
"""

test_html_path = r'c:\Users\USER\Downloads\dream_car_house\scratch\yt_test_18.html'
with open(test_html_path, 'w', encoding='utf-8') as f:
    f.write(html_test)

async def run():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9240',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        f'file:///{test_html_path.replace("\\\\", "/")}'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9240/json')
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
            await send('Page.enable')
            for sec in [3, 6, 9]:
                await asyncio.sleep(3)
                shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
                data = base64.b64decode(shot['result']['data'])
                out_path = f'c:/Users/USER/Downloads/dream_car_house/scratch/maybach_frame_{sec}s.jpg'
                with open(out_path, 'wb') as f:
                    f.write(data)
                print(f'Captured maybach_frame_{sec}s.jpg ({len(data)} bytes)')
    finally:
        proc.kill()

asyncio.run(run())
