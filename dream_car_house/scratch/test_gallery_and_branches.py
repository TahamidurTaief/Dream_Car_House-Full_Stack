import asyncio, json, subprocess, time, os, base64, urllib.request
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_gallery_test'

async def run_test():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9223',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9223/json')
        targets = json.loads(req.read().decode())
        ws_url = None
        for t in targets:
            if t.get('type') == 'page':
                ws_url = t.get('webSocketDebuggerUrl')
                break
        
        print("Connecting to ws:", ws_url)
        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def send_cmd(method, params=None):
                nonlocal msg_id
                msg_id += 1
                payload = {"id": msg_id, "method": method, "params": params or {}}
                await ws.send(json.dumps(payload))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == msg_id:
                        return resp

            await send_cmd("Runtime.enable")
            await send_cmd("Log.enable")
            await send_cmd("Page.enable")
            await asyncio.sleep(1.5)

            # Test 1: Check if openCarModal exists and data is loaded
            res = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const cars = window.VEHICLE_DATA || [];
                    const branches = window.SHOWROOM_BRANCHES || {};
                    return {
                        carsCount: cars.length,
                        branchesCount: Object.keys(branches).length,
                        firstCarBranches: cars[0] ? cars[0].branch_name : null,
                        firstCarImagesCount: cars[0] && cars[0].images ? cars[0].images.length : 0
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Data loaded:", res.get('result', {}).get('value'))

            # Test 2: Open modal for Car ID 1
            await send_cmd("Runtime.evaluate", {
                "expression": "window.openCarModal(1);"
            })
            await asyncio.sleep(0.8)

            # Verify modal contents
            modal_check = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const modal = document.getElementById('car-modal');
                    const isOpen = modal && !modal.classList.contains('hidden');
                    const heroImg = document.getElementById('car-modal-hero-img');
                    const counter = document.getElementById('car-gallery-counter');
                    const tag = document.getElementById('car-gallery-active-tag');
                    const thumbs = document.querySelectorAll('.beg-thumb-btn');
                    const branchBox = document.querySelector('.beg-branch-allocation-box');
                    const branchTitle = branchBox ? branchBox.querySelector('.branch-alloc-title')?.textContent : '';
                    const branchAddr = branchBox ? branchBox.querySelector('.branch-alloc-addr')?.textContent : '';
                    return {
                        isOpen,
                        heroSrc: heroImg ? heroImg.src : null,
                        counterText: counter ? counter.textContent : '',
                        tagText: tag ? tag.textContent : '',
                        thumbsCount: thumbs.length,
                        hasBranchBox: !!branchBox,
                        branchTitle,
                        branchAddr
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Modal check:", modal_check.get('result', {}).get('value'))

            # Screenshot Desktop modal
            shot1 = await send_cmd("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            shot1_bytes = base64.b64decode(shot1['result']['data'])
            shot1_path = os.path.join(artifact_dir, 'gallery_modal_desktop.jpg')
            with open(shot1_path, 'wb') as f:
                f.write(shot1_bytes)
            print("Desktop modal screenshot saved to:", shot1_path)

            # Test 3: Click thumbnail 2
            thumb_click = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const thumbs = document.querySelectorAll('.beg-thumb-btn');
                    if (thumbs.length > 1) {
                        thumbs[1].click();
                        return {
                            activeIdx: window.begCurrentGalleryIndex,
                            newSrc: document.getElementById('car-modal-hero-img')?.src,
                            newCounter: document.getElementById('car-gallery-counter')?.textContent,
                            newTag: document.getElementById('car-gallery-active-tag')?.textContent
                        };
                    }
                    return null;
                })()
                """,
                "returnByValue": True
            })
            print("Thumb click result:", thumb_click.get('result', {}).get('value'))
            await asyncio.sleep(0.5)

            # Test 4: Mobile Viewport test
            await send_cmd("Emulation.setDeviceMetricsOverride", {
                "width": 390,
                "height": 844,
                "deviceScaleFactor": 2,
                "mobile": True
            })
            await asyncio.sleep(0.8)

            shot2 = await send_cmd("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            shot2_bytes = base64.b64decode(shot2['result']['data'])
            shot2_path = os.path.join(artifact_dir, 'gallery_modal_mobile.jpg')
            with open(shot2_path, 'wb') as f:
                f.write(shot2_bytes)
            print("Mobile modal screenshot saved to:", shot2_path)

            # Reset emulation to desktop
            await send_cmd("Emulation.clearDeviceMetricsOverride")
            await asyncio.sleep(0.5)

            # Test 5: Close car modal, test Appointment modal preselection
            await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    window.closeCarModal();
                    window.openAppointmentModalForCar('Mercedes-Benz G 580 EQ', 2024, 'baridhara');
                    const apptModal = document.getElementById('appointment-modal');
                    const branchSelect = document.getElementById('appt-branch');
                    const carInput = document.getElementById('appt-car');
                    return {
                        apptOpen: apptModal && !apptModal.classList.contains('hidden'),
                        branchVal: branchSelect ? branchSelect.value : '',
                        carVal: carInput ? carInput.value : ''
                    };
                })()
                """,
                "returnByValue": True
            })
            appt_check = res.get('result', {}).get('value')
            print("Appointment check result:", appt_check)

            # Test 6: Branch Filtering in Inventory
            filter_check = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    window.closeAppointmentModal();
                    const branchFilter = document.getElementById('cars-filter-branch');
                    if (!branchFilter) return { error: 'No branch filter found' };
                    
                    // Filter baridhara
                    branchFilter.value = 'baridhara';
                    branchFilter.dispatchEvent(new Event('change'));
                    const baridharaCards = document.querySelectorAll('#cars-grid .car-card').length;
                    
                    // Filter gulshan
                    branchFilter.value = 'gulshan';
                    branchFilter.dispatchEvent(new Event('change'));
                    const gulshanCards = document.querySelectorAll('#cars-grid .car-card').length;

                    // Filter uttara
                    branchFilter.value = 'uttara';
                    branchFilter.dispatchEvent(new Event('change'));
                    const uttaraCards = document.querySelectorAll('#cars-grid .car-card').length;

                    // All
                    branchFilter.value = 'all';
                    branchFilter.dispatchEvent(new Event('change'));
                    const allCards = document.querySelectorAll('#cars-grid .car-card').length;

                    return {
                        baridharaCards,
                        gulshanCards,
                        uttaraCards,
                        allCards
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Branch filter counts:", filter_check.get('result', {}).get('value'))

            # Test 7: Footer Branch Tab Switcher
            footer_check = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const tabs = document.querySelectorAll('.footer-branch-tab');
                    const mapIframe = document.getElementById('footer-branch-map-iframe');
                    const branchLabel = document.getElementById('footer-active-branch-name');
                    const branchAddr = document.getElementById('footer-active-branch-addr');
                    const initialTab = tabs.length;
                    
                    // Switch to gulshan
                    window.switchFooterBranchMap('gulshan', tabs[1]);
                    const gulshanLabel = branchLabel ? branchLabel.textContent : '';
                    
                    // Switch to uttara
                    window.switchFooterBranchMap('uttara', tabs[2]);
                    const uttaraLabel = branchLabel ? branchLabel.textContent : '';

                    return {
                        tabsCount: initialTab,
                        gulshanLabel,
                        uttaraLabel
                    };
                })()
                """,
                "returnByValue": True
            })
            print("Footer switcher check:", footer_check.get('result', {}).get('value'))

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(run_test())
