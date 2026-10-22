import asyncio, json, subprocess, os, urllib.request, websockets, base64

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_responsive_audit'

async def audit():
    proc = subprocess.Popen([
        edge_path, '--headless=new', '--remote-debugging-port=9246',
        f'--user-data-dir={user_data}', '--no-first-run', '--window-size=375,667',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9246/json')
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
            await send('Emulation.setDeviceMetricsOverride', {'width': 375, 'height': 667, 'deviceScaleFactor': 2, 'mobile': True})
            await asyncio.sleep(1)

            # Test 1: Inventory View
            await send('Runtime.evaluate', {'expression': "window.location.hash = '#inventory'; initRouting();"})
            await asyncio.sleep(0.8)
            shot_inv = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mobile_view_inventory.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_inv['result']['data']))
            print('Captured mobile_view_inventory.jpg')

            # Test 2: Gallery View
            await send('Runtime.evaluate', {'expression': "window.location.hash = '#gallery'; initRouting();"})
            await asyncio.sleep(0.8)
            shot_gal = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mobile_view_gallery.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_gal['result']['data']))
            print('Captured mobile_view_gallery.jpg')

            # Test 3: Car Details Modal
            await send('Runtime.evaluate', {'expression': "openCarModal(1);"})
            await asyncio.sleep(0.8)
            shot_modal = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mobile_view_car_modal.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_modal['result']['data']))
            print('Captured mobile_view_car_modal.jpg')
            await send('Runtime.evaluate', {'expression': "closeCarModal();"})

            # Test 4: Appointment Modal
            await send('Runtime.evaluate', {'expression': "openAppointmentModal();"})
            await asyncio.sleep(0.8)
            shot_appt = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mobile_view_appointment_modal.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_appt['result']['data']))
            print('Captured mobile_view_appointment_modal.jpg')
            await send('Runtime.evaluate', {'expression': "closeAppointmentModal();"})

            # Test 5: Gallery Lightbox
            await send('Runtime.evaluate', {'expression': "window.location.hash = '#gallery'; initRouting(); openGalleryLightbox(0);"})
            await asyncio.sleep(1)
            shot_lb = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'mobile_view_lightbox.jpg'), 'wb') as f:
                f.write(base64.b64decode(shot_lb['result']['data']))
            print('Captured mobile_view_lightbox.jpg')

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(audit())
