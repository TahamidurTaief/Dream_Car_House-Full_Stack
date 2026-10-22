import asyncio, json, subprocess, time, urllib.request, base64, os
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_fs_test'

async def verify():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9229',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,950',
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
                    m = json.loads(await ws.recv())
                    if m.get('id') == msg_id:
                        return m

            await send('Runtime.enable')
            await send('Page.enable')
            await asyncio.sleep(1)

            # 1. Open Car Modal for Car 1 (Mercedes G 580 - Kakrail Branch)
            res_modal = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(1);
                    const branchTitle = document.querySelector('.branch-alloc-name')?.textContent;
                    const branchAddr = document.querySelector('.branch-alloc-address')?.textContent;
                    const hotline = document.querySelector('.beg-hotline-row strong')?.textContent;
                    const waBtn = document.querySelector('.beg-wa-vip-btn');
                    const expandBtn = document.querySelector('.beg-img-expand-btn');
                    return {
                        branchTitle,
                        branchAddr,
                        hotline,
                        waHref: waBtn ? waBtn.href : '',
                        hasExpandBtn: !!expandBtn
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Modal details:", json.dumps(res_modal.get('result', {}).get('result', {}).get('value'), indent=2))

            # 2. Test Fullscreen Cinema Button Click!
            res_fs_click = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const expandBtn = document.querySelector('.beg-img-expand-btn');
                    if (expandBtn) expandBtn.click();
                    
                    const lbModal = document.getElementById('gallery-lightbox-modal');
                    const lbImg = document.getElementById('lightbox-main-img');
                    const lbTitle = document.getElementById('lightbox-title');
                    const lbCounter = document.getElementById('lightbox-counter');
                    
                    return {
                        lightboxActive: lbModal ? lbModal.classList.contains('active') : false,
                        lightboxImgSrc: lbImg ? lbImg.src : '',
                        lightboxTitle: lbTitle ? lbTitle.textContent : '',
                        lightboxCounter: lbCounter ? lbCounter.textContent : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Lightbox test result:", json.dumps(res_fs_click.get('result', {}).get('result', {}).get('value'), indent=2))

            await asyncio.sleep(1)

            # Screenshot of the Fullscreen Cinema Lightbox Modal!
            shot_lb = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_lb_bytes = base64.b64decode(shot_lb['result']['data'])
            shot_lb_path = os.path.join(artifact_dir, 'fullscreen_cinema_lightbox_verified.jpg')
            with open(shot_lb_path, 'wb') as f:
                f.write(shot_lb_bytes)
            print("Saved cinema lightbox screenshot to:", shot_lb_path)

            # 3. Test Next arrow inside Cinema Lightbox
            res_lb_next = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    nextLightboxSlide();
                    const lbImg = document.getElementById('lightbox-main-img');
                    const lbCounter = document.getElementById('lightbox-counter');
                    const lbTitle = document.getElementById('lightbox-title');
                    return {
                        newCounter: lbCounter ? lbCounter.textContent : '',
                        newTitle: lbTitle ? lbTitle.textContent : '',
                        newSrc: lbImg ? lbImg.src : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Lightbox next slide:", json.dumps(res_lb_next.get('result', {}).get('result', {}).get('value'), indent=2))

            await asyncio.sleep(0.5)

            # 4. Close Lightbox and inspect Car Modal back state
            res_close_lb = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    closeGalleryLightbox();
                    const carModal = document.getElementById('car-modal');
                    const lbModal = document.getElementById('gallery-lightbox-modal');
                    return {
                        lbActive: lbModal.classList.contains('active'),
                        carModalActive: carModal.classList.contains('active'),
                        bodyOverflow: document.body.style.overflow
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Lightbox closed, back to car modal:", json.dumps(res_close_lb.get('result', {}).get('result', {}).get('value'), indent=2))

            # 5. Test Car 2 (Land Cruiser 250 - Gulshan Branch)
            res_car2 = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(2);
                    const branchTitle = document.querySelector('.branch-alloc-name')?.textContent;
                    const branchAddr = document.querySelector('.branch-alloc-address')?.textContent;
                    return {
                        car2BranchTitle: branchTitle,
                        car2BranchAddr: branchAddr
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Car 2 (Gulshan) details:", json.dumps(res_car2.get('result', {}).get('result', {}).get('value'), indent=2))

            # Screenshot Car 2 Modal with Gulshan address
            shot_car2 = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
            shot_car2_bytes = base64.b64decode(shot_car2['result']['data'])
            shot_car2_path = os.path.join(artifact_dir, 'car2_gulshan_modal_verified.jpg')
            with open(shot_car2_path, 'wb') as f:
                f.write(shot_car2_bytes)
            print("Saved car 2 screenshot to:", shot_car2_path)

            # 6. Test Inventory Filter for Kakrail and Gulshan
            res_inv = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    closeCarModal();
                    const select = document.getElementById('cars-filter-branch');
                    const options = Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
                    
                    select.value = 'kakrail';
                    select.dispatchEvent(new Event('change'));
                    const kakrailCount = document.querySelectorAll('#inventory-grid .group').length;

                    select.value = 'gulshan';
                    select.dispatchEvent(new Event('change'));
                    const gulshanCount = document.querySelectorAll('#inventory-grid .group').length;

                    return {
                        options,
                        kakrailCount,
                        gulshanCount
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Inventory filter verification:", json.dumps(res_inv.get('result', {}).get('result', {}).get('value'), indent=2))

            # 7. Test Footer Branch Tabs (Kakrail & Gulshan)
            res_footer = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const tabs = Array.from(document.querySelectorAll('.footer-branch-tab')).map(t => t.textContent);
                    const sub = document.querySelector('.footer-col-map .map-subtitle')?.textContent;
                    const phone = document.querySelector('.footer-col-contact a[href^="tel:"]')?.textContent;
                    const email = document.querySelector('.footer-col-contact a[href^="mailto:"]')?.textContent;
                    return {
                        footerTabs: tabs,
                        mapSubtitle: sub,
                        phone,
                        email
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Footer verification:", json.dumps(res_footer.get('result', {}).get('result', {}).get('value'), indent=2))

    finally:
        proc.kill()

if __name__ == '__main__':
    asyncio.run(verify())
