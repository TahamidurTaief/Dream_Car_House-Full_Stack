import asyncio, json, subprocess, time, urllib.request, base64, os
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_verify_final'

async def verify_all():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9226',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
        'http://localhost:3000#inventory'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9226/json')
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

            # Test 1: Inventory branch filter
            res_filter = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const grid = document.getElementById('inventory-grid');
                    const filter = document.getElementById('cars-filter-branch');
                    
                    filter.value = 'baridhara';
                    filter.dispatchEvent(new Event('change'));
                    const baridharaCount = grid.querySelectorAll('.group').length;

                    filter.value = 'gulshan';
                    filter.dispatchEvent(new Event('change'));
                    const gulshanCount = grid.querySelectorAll('.group').length;

                    filter.value = 'uttara';
                    filter.dispatchEvent(new Event('change'));
                    const uttaraCount = grid.querySelectorAll('.group').length;

                    filter.value = 'all';
                    filter.dispatchEvent(new Event('change'));
                    const allCount = grid.querySelectorAll('.group').length;

                    // Read card tags
                    const cardTags = Array.from(grid.querySelectorAll('.card-branch-tag')).map(el => el.textContent.trim());

                    return {
                        baridharaCount,
                        gulshanCount,
                        uttaraCount,
                        allCount,
                        cardTagsSample: cardTags.slice(0, 4)
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Branch filter results:", res_filter.get('result', {}).get('result', {}).get('value'))

            # Screenshot Inventory with Branch Tags
            shot_inv = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_inv_bytes = base64.b64decode(shot_inv['result']['data'])
            shot_inv_path = os.path.join(artifact_dir, 'inventory_branch_filter.jpg')
            with open(shot_inv_path, 'wb') as f:
                f.write(shot_inv_bytes)
            print("Saved inventory screenshot to:", shot_inv_path)

            # Test 2: Footer Branch Switcher Tabs
            res_footer = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const tabs = document.querySelectorAll('.footer-branch-tab');
                    const iframe = document.querySelector('.map-embed-wrapper-modern iframe');
                    const subtitle = document.querySelector('.map-subtitle');

                    // Click Gulshan-1 tab
                    switchFooterBranchMap('gulshan', tabs[1]);
                    const gulshanMapSrc = iframe ? iframe.src : '';
                    const gulshanSub = subtitle ? subtitle.textContent : '';

                    // Click Uttara tab
                    switchFooterBranchMap('uttara', tabs[2]);
                    const uttaraMapSrc = iframe ? iframe.src : '';
                    const uttaraSub = subtitle ? subtitle.textContent : '';

                    return {
                        gulshanSub,
                        uttaraSub,
                        gulshanMapHasGulshan: gulshanMapSrc.includes('Gulshan'),
                        uttaraMapHasUttara: uttaraMapSrc.includes('Uttara')
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Footer map switcher results:", res_footer.get('result', {}).get('result', {}).get('value'))

            # Test 3: Open Car Modal and check "Book Private Viewing" auto-preselects branch in Appointment Modal
            res_booking = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(2); // Land Cruiser 250 (Gulshan)
                    // Click Book Private Viewing
                    const apptBtn = document.querySelector('.beg-cta-row button.consult-primary-btn');
                    if (apptBtn) apptBtn.click();
                    
                    const apptModal = document.getElementById('appointment-modal');
                    const branchSelect = document.getElementById('appt-branch');
                    const notes = document.getElementById('appt-notes');

                    return {
                        modalOpen: apptModal && apptModal.classList.contains('active'),
                        selectedBranch: branchSelect ? branchSelect.value : '',
                        prefilledQuery: notes ? notes.value : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Appointment preselection results:", res_booking.get('result', {}).get('result', {}).get('value'))

            # Screenshot Appointment Modal
            shot_appt = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_appt_bytes = base64.b64decode(shot_appt['result']['data'])
            shot_appt_path = os.path.join(artifact_dir, 'appointment_branch_preselected.jpg')
            with open(shot_appt_path, 'wb') as f:
                f.write(shot_appt_bytes)
            print("Saved appointment screenshot to:", shot_appt_path)

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(verify_all())
