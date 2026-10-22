import asyncio, json, subprocess, time, urllib.request, base64, os
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_clean_photo'

async def verify():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9231',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9231/json')
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

            # 1. Open Car Modal
            res_open = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(1);
                    const studioCert = document.querySelector('.beg-studio-grade-badge');
                    const valOverlay = document.querySelector('.beg-img-valuation-card');
                    const captionPill = document.querySelector('.beg-photo-angle-pill');
                    const priceRow = document.querySelector('.beg-car-price-row');
                    const priceVal = priceRow ? priceRow.querySelector('.beg-price-value')?.textContent : '';
                    
                    return {
                        hasStudioCertOnPhoto: !!studioCert,
                        hasValuationOverlayOnPhoto: !!valOverlay,
                        captionPillText: captionPill ? captionPill.textContent : '',
                        hasPriceRowInHeader: !!priceRow,
                        priceVal
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Modal clean check:", json.dumps(res_open.get('result', {}).get('result', {}).get('value'), indent=2))

            # Switch to cockpit photo (index 1)
            await send('Runtime.evaluate', {'expression': 'switchCarGalleryImage(1);'})
            await asyncio.sleep(0.8)

            # Screenshot Desktop Clean Modal
            shot_desk = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_desk_path = os.path.join(artifact_dir, 'car_modal_clean_desktop.jpg')
            with open(shot_desk_path, 'wb') as f:
                f.write(base64.b64decode(shot_desk['result']['data']))
            print("Desktop screenshot saved to:", shot_desk_path)

            # Mobile Emulation (390x844)
            await send('Emulation.setDeviceMetricsOverride', {
                'width': 390,
                'height': 844,
                'deviceScaleFactor': 2,
                'mobile': True
            })
            await asyncio.sleep(0.8)

            shot_mob = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_mob_path = os.path.join(artifact_dir, 'car_modal_clean_mobile.jpg')
            with open(shot_mob_path, 'wb') as f:
                f.write(base64.b64decode(shot_mob['result']['data']))
            print("Mobile screenshot saved to:", shot_mob_path)

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(verify())
