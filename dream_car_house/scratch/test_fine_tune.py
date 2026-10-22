import asyncio, json, subprocess, urllib.request, websockets, base64

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_fine_tune'

html_content = """
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #000; overflow: hidden; }
  .video-container { position: relative; width: 100vw; height: 100vh; overflow: hidden; }
  #player {
    position: absolute; top: 50%; left: 50%;
    width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.78vh;
    transform: translate(-50%, -50%) scale(1.4);
    border: none;
  }
</style>
</head>
<body>
<div class="video-container">
  <iframe id="player" src="https://www.youtube-nocookie.com/embed/7cxfVWs4YGw?autoplay=1&mute=1&controls=0&start=42&enablejsapi=1" allow="autoplay"></iframe>
</div>
<script src="https://www.youtube.com/iframe_api"></script>
</body>
</html>
"""

with open('scratch/fine_tune.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

async def test():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9249',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000/scratch/fine_tune.html'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9249/json')
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

            # Wait 4 seconds for video to play past the initial overlay
            await asyncio.sleep(4)
            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/maybach_glide_4s.jpg', 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))
            print("Captured maybach_glide_4s.jpg")

            await asyncio.sleep(3)
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open('scratch/maybach_glide_7s.jpg', 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print("Captured maybach_glide_7s.jpg")
    finally:
        proc.kill()

asyncio.run(test())
