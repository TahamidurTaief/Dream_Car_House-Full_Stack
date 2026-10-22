import asyncio, json, subprocess, time, urllib.request, base64, os
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_diag2'

async def diag():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9225',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9225/json')
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

            # Open modal
            res_open = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(1);
                    const modal = document.getElementById('car-modal');
                    const hero = document.getElementById('beg-main-car-img');
                    const thumbs = document.querySelectorAll('.beg-thumb-btn');
                    const branchBox = document.querySelector('.beg-branch-allocation-box');
                    return {
                        modalActive: modal.classList.contains('active'),
                        heroSrc: hero ? hero.src : 'NO HERO',
                        thumbsCount: thumbs.length,
                        branchTitle: branchBox ? branchBox.querySelector('.branch-alloc-title')?.innerText : 'NO BRANCH'
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Modal open result:", res_open.get('result', {}).get('result', {}).get('value'))

            await asyncio.sleep(1.5)

            # Screenshot Desktop Modal
            shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_bytes = base64.b64decode(shot['result']['data'])
            shot_path = os.path.join(artifact_dir, 'car_modal_gallery_verified.jpg')
            with open(shot_path, 'wb') as f:
                f.write(shot_bytes)
            print("Saved screenshot to:", shot_path)

            # Click second thumbnail
            res_thumb = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const thumbs = document.querySelectorAll('.beg-thumb-btn');
                    if (thumbs.length > 1) {
                        thumbs[1].click();
                        const hero = document.getElementById('beg-main-car-img');
                        const counter = document.getElementById('beg-img-counter');
                        const caption = document.getElementById('beg-active-caption-tag');
                        return {
                            clicked: true,
                            newHeroSrc: hero ? hero.src : '',
                            counterText: counter ? counter.innerText : '',
                            captionText: caption ? caption.innerText : ''
                        };
                    }
                    return { clicked: false };
                })()
                """,
                'returnByValue': True
            })
            print("Thumbnail 2 click result:", res_thumb.get('result', {}).get('result', {}).get('value'))

            await asyncio.sleep(1)

            # Screenshot Thumbnail 2 state
            shot2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot2_bytes = base64.b64decode(shot2['result']['data'])
            shot2_path = os.path.join(artifact_dir, 'car_modal_gallery_thumb2.jpg')
            with open(shot2_path, 'wb') as f:
                f.write(shot2_bytes)
            print("Saved thumb2 screenshot to:", shot2_path)

            # Test Mobile Viewport (390x844)
            await send('Emulation.setDeviceMetricsOverride', {
                'width': 390,
                'height': 844,
                'deviceScaleFactor': 2,
                'mobile': True
            })
            await asyncio.sleep(1)

            shot_mob = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_mob_bytes = base64.b64decode(shot_mob['result']['data'])
            shot_mob_path = os.path.join(artifact_dir, 'car_modal_gallery_mobile.jpg')
            with open(shot_mob_path, 'wb') as f:
                f.write(shot_mob_bytes)
            print("Saved mobile screenshot to:", shot_mob_path)

            # Clear emulation
            await send('Emulation.clearDeviceMetricsOverride')

            # Test Branch Filter in Inventory
            res_filter = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    closeCarModal();
                    const filter = document.getElementById('cars-filter-branch');
                    if (!filter) return { err: 'no filter' };
                    
                    filter.value = 'baridhara';
                    filter.dispatchEvent(new Event('change'));
                    const baridharaCards = document.querySelectorAll('#cars-grid .car-card').length;

                    filter.value = 'gulshan';
                    filter.dispatchEvent(new Event('change'));
                    const gulshanCards = document.querySelectorAll('#cars-grid .car-card').length;

                    filter.value = 'uttara';
                    filter.dispatchEvent(new Event('change'));
                    const uttaraCards = document.querySelectorAll('#cars-grid .car-card').length;

                    filter.value = 'all';
                    filter.dispatchEvent(new Event('change'));
                    const allCards = document.querySelectorAll('#cars-grid .car-card').length;

                    return {
                        baridharaCards,
                        gulshanCards,
                        uttaraCards,
                        allCards
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Branch filter results:", res_filter.get('result', {}).get('result', {}).get('value'))

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(diag())
