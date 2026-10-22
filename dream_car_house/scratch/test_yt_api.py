import asyncio, json, subprocess, urllib.request, websockets

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_yt_api_test'

html_content = """
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #000; overflow: hidden; }
  .video-container { position: relative; width: 100vw; height: 100vh; overflow: hidden; pointer-events: none; }
  #player {
    position: absolute; top: 50%; left: 50%;
    width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.78vh;
    transform: translate(-50%, -50%) scale(1.4);
    pointer-events: none;
    opacity: 0;
    transition: opacity 1s ease;
  }
  #player.is-ready { opacity: 1; }
</style>
</head>
<body>
<div class="video-container">
  <div id="player"></div>
</div>
<script>
  let player;
  let stateLog = [];
  function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
      videoId: '7cxfVWs4YGw',
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        showinfo: 0,
        rel: 0,
        iv_load_policy: 3,
        disablekb: 1,
        modestbranding: 1,
        playsinline: 1,
        start: 45,
        loop: 1,
        playlist: '7cxfVWs4YGw',
        origin: window.location.origin
      },
      events: {
        onReady: (e) => {
          stateLog.push('onReady');
          e.target.mute();
          e.target.playVideo();
        },
        onStateChange: (e) => {
          stateLog.push('stateChange:' + e.data);
          if (e.data === YT.PlayerState.PLAYING) {
            setTimeout(() => {
              document.getElementById('player').classList.add('is-ready');
            }, 500);
          }
        }
      }
    });
  }
</script>
<script src="https://www.youtube.com/iframe_api"></script>
</body>
</html>
"""

with open('scratch/yt_api_test.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

async def test():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9247',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--window-size=1280,720',
        '--autoplay-policy=no-user-gesture-required',
        'http://localhost:3000/scratch/yt_api_test.html'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9247/json')
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
            await asyncio.sleep(5)
            log_res = await send('Runtime.evaluate', {
                'expression': 'JSON.stringify(window.stateLog || [])',
                'returnByValue': True
            })
            print("Player State Log:", log_res.get('result', {}).get('result', {}).get('value'))

            shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            import base64
            with open('scratch/yt_api_result.jpg', 'wb') as f:
                f.write(base64.b64decode(shot['result']['data']))
            print("Captured yt_api_result.jpg")
    finally:
        proc.kill()

asyncio.run(test())
