import asyncio, json, subprocess, time, os, base64, urllib.request
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_full_mono_v2'

async def capture():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9229',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9229/json')
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
                    if r.get('id') == msg_id:
                        return r
            
            await send('Page.enable')
            await send('Runtime.enable')
            await asyncio.sleep(1.5)
            
            # Shot 1: Top Hero
            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mono_1_hero_top.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))
            print('Shot 1 saved')

            # Shot 2: Scroll 120px - sticky frosted header
            await send('Runtime.evaluate', {'expression': "window.scrollTo(0, 150);"})
            await asyncio.sleep(0.5)
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mono_2_sticky_header_scrolled.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))
            print('Shot 2 saved')

            # Shot 3: Choose per your preference
            await send('Runtime.evaluate', {'expression': "document.querySelector('.preference-section').scrollIntoView({behavior: 'instant'});"})
            await asyncio.sleep(0.5)
            shot3 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mono_3_preference.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot3['result']['data']))
            print('Shot 3 saved')

            # Shot 4: Connect to Consult
            await send('Runtime.evaluate', {'expression': "document.querySelector('.connect-consult-section').scrollIntoView({behavior: 'instant'});"})
            await asyncio.sleep(0.5)
            shot4 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mono_4_connect_to_consult.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot4['result']['data']))
            print('Shot 4 saved')

            # Shot 5: Experience Beyond Ordinary
            await send('Runtime.evaluate', {'expression': "document.querySelector('.experience-section').scrollIntoView({behavior: 'instant'});"})
            await asyncio.sleep(0.5)
            shot5 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mono_5_experience.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot5['result']['data']))
            print('Shot 5 saved')

            # Shot 6: Visual Chronicles
            await send('Runtime.evaluate', {'expression': "document.getElementById('socials').scrollIntoView({behavior: 'instant'});"})
            await asyncio.sleep(0.5)
            shot6 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mono_6_visual_chronicles.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot6['result']['data']))
            print('Shot 6 saved')

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(capture())
