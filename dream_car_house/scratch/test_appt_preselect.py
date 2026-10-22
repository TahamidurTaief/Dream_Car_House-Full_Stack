import asyncio, json, subprocess, time, urllib.request, base64, os
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_appt_test'

async def verify_appt():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9228',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9228/json')
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

            # Open Car 2 (Land Cruiser 250, Gulshan)
            res = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(2);
                    const apptBtn = document.querySelector('.beg-viewing-vip-btn');
                    if (apptBtn) apptBtn.click();
                    const apptModal = document.getElementById('appointment-modal');
                    const branchSelect = document.getElementById('appt-branch');
                    const notes = document.getElementById('appt-notes');
                    return {
                        apptModalActive: apptModal ? apptModal.classList.contains('active') : false,
                        branchVal: branchSelect ? branchSelect.value : '',
                        branchText: branchSelect ? branchSelect.options[branchSelect.selectedIndex]?.text : '',
                        notesVal: notes ? notes.value : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Appointment test result:", json.dumps(res.get('result', {}).get('result', {}).get('value'), indent=2))

            await asyncio.sleep(0.5)

            shot = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_bytes = base64.b64decode(shot['result']['data'])
            shot_path = os.path.join(artifact_dir, 'appointment_branch_selected_success.jpg')
            with open(shot_path, 'wb') as f:
                f.write(shot_bytes)
            print("Saved screenshot to:", shot_path)

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(verify_appt())
