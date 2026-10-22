import asyncio, json, subprocess, os, urllib.request, websockets, base64

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_beg_modal'

async def run_test():
    proc = subprocess.Popen([
        edge_path, '--headless=new', '--remote-debugging-port=9247',
        f'--user-data-dir={user_data}', '--no-first-run', '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
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
                    r = json.loads(await ws.recv())
                    if r.get('id') == msg_id: return r
            
            await send('Page.enable')
            await send('Runtime.enable')
            await send('DOM.enable')
            await asyncio.sleep(1)

            # Test 1: Desktop Open Car Modal (Mercedes G 580)
            res = await send('Runtime.evaluate', {'expression': "openCarModal(1);"})
            await asyncio.sleep(1)
            
            # Check modal elements
            dom_check = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const waBtn = document.getElementById('beg-wa-action-btn');
                    const title = document.querySelector('.beg-car-title')?.innerText;
                    const specsCount = document.querySelectorAll('.beg-spec-item').length;
                    const topBadge = document.querySelector('.car-badge-pill')?.innerText;
                    return {
                        title,
                        specsCount,
                        topBadge,
                        waHref: waBtn ? waBtn.href : null,
                        waComputedBg: waBtn ? window.getComputedStyle(waBtn).backgroundImage : null,
                        waComputedColor: waBtn ? window.getComputedStyle(waBtn).color : null
                    };
                })()
                """,
                'returnByValue': True
            })
            print('Desktop DOM Check:', json.dumps(dom_check.get('result', {}).get('value', {}), indent=2))

            shot_desktop = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'beg_car_modal_desktop.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_desktop['result']['data']))
            print('Saved beg_car_modal_desktop.jpg')

            # Test 2: Mobile Viewport (375x667)
            await send('Emulation.setDeviceMetricsOverride', {'width': 375, 'height': 720, 'deviceScaleFactor': 2, 'mobile': True})
            await asyncio.sleep(0.8)
            
            # Check mobile overflow and scroll
            mobile_check = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const modalBox = document.querySelector('.car-modal-box');
                    return {
                        boxScrollWidth: modalBox.scrollWidth,
                        boxClientWidth: modalBox.clientWidth,
                        hasOverflow: modalBox.scrollWidth > modalBox.clientWidth + 2
                    };
                })()
                """,
                'returnByValue': True
            })
            print('Mobile Check:', json.dumps(mobile_check.get('result', {}).get('value', {}), indent=2))

            shot_mobile = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'beg_car_modal_mobile.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_mobile['result']['data']))
            print('Saved beg_car_modal_mobile.jpg')

            # Test 3: Test Book Private Viewing button integration
            viewing_test = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const viewingBtn = document.querySelector('.beg-viewing-vip-btn');
                    if (viewingBtn) viewingBtn.click();
                    const apptModal = document.getElementById('appointment-modal');
                    const notes = document.getElementById('appt-notes');
                    return {
                        apptModalActive: apptModal ? apptModal.classList.contains('active') : false,
                        notesValue: notes ? notes.value : null
                    };
                })()
                """,
                'returnByValue': True
            })
            print('Viewing Integration Test:', json.dumps(viewing_test.get('result', {}).get('value', {}), indent=2))

    finally:
        proc.terminate()

if __name__ == '__main__':
    asyncio.run(run_test())
