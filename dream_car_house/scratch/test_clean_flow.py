import asyncio, json, subprocess, time, urllib.request, base64, os
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_clean'

async def verify_clean():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9230',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9230/json')
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
            await send('Page.enable')
            await asyncio.sleep(1)

            # Step 1: Open Car 1 Modal (Kakrail)
            await send('Runtime.evaluate', {'expression': 'openCarModal(1);'})
            await asyncio.sleep(0.5)

            shot1 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open(os.path.join(artifact_dir, 'step1_kakrail_modal.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot1['result']['data']))

            # Step 2: Switch to Cockpit image & Click Fullscreen Expand
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    switchCarGalleryImage(1); // Cockpit
                    const expandBtn = document.querySelector('.beg-img-expand-btn');
                    if (expandBtn) expandBtn.click();
                })()
                """
            })
            await asyncio.sleep(1)

            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open(os.path.join(artifact_dir, 'step2_cinema_lightbox.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot2['result']['data']))

            # Step 3: Close Lightbox & Car 1 Modal
            await send('Runtime.evaluate', {'expression': 'closeGalleryLightbox(); closeCarModal();'})
            await asyncio.sleep(0.5)

            # Step 4: Open Car 2 Modal (Gulshan)
            await send('Runtime.evaluate', {'expression': 'openCarModal(2);'})
            await asyncio.sleep(0.5)

            shot3 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open(os.path.join(artifact_dir, 'step3_gulshan_modal.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot3['result']['data']))

            # Step 5: Close Modal and scroll to Footer
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    closeCarModal();
                    document.getElementById('contact').scrollIntoView();
                })()
                """
            })
            await asyncio.sleep(0.5)

            shot4 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            with open(os.path.join(artifact_dir, 'step4_footer_branches.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot4['result']['data']))

            print("All 4 clean screenshots captured successfully!")

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(verify_clean())
