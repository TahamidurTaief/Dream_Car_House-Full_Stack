import asyncio, json, subprocess, time, os, base64, urllib.request
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile'

async def run_test():
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9222',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9222/json')
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

            # Enable console & runtime
            await send_cmd("Runtime.enable")
            await send_cmd("Log.enable")
            await send_cmd("Page.enable")

            # Wait for load
            await asyncio.sleep(2)

            # Check for console errors
            eval_res = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const img = btn ? btn.querySelector('img') : null;
                    const drawer = document.getElementById('nav-drawer');
                    const backdrop = document.getElementById('drawer-backdrop');
                    return {
                        hasBtn: !!btn,
                        btnClass: btn ? btn.className : '',
                        hasImg: !!img,
                        imgSrc: img ? img.src : '',
                        imgComplete: img ? img.complete : false,
                        imgNaturalWidth: img ? img.naturalWidth : 0,
                        btnRect: btn ? btn.getBoundingClientRect() : null,
                        hasDrawer: !!drawer,
                        drawerClass: drawer ? drawer.className : '',
                        hasBackdrop: !!backdrop
                    };
                })()
                """,
                "returnByValue": True
            })
            print("INITIAL STATE:", json.dumps(eval_res.get('result', {}).get('value', {}), indent=2))

            # Take initial screenshot
            ss1 = await send_cmd("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            with open(os.path.join(artifact_dir, "edge_initial.jpg"), "wb") as f:
                f.write(base64.b64decode(ss1['result']['data']))
            print("Saved edge_initial.jpg")

            # Click the menu button
            print("Clicking #header-menu-btn...")
            click_res = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    if (!btn) return 'NO_BTN';
                    btn.click();
                    return 'CLICKED';
                })()
                """,
                "returnByValue": True
            })
            print("Click eval:", click_res.get('result', {}).get('value'))

            # Check state after 500ms (during spin)
            await asyncio.sleep(0.5)
            spin_res = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const drawer = document.getElementById('nav-drawer');
                    return {
                        btnClass: btn ? btn.className : '',
                        drawerClass: drawer ? drawer.className : ''
                    };
                })()
                """,
                "returnByValue": True
            })
            print("SPINNING STATE (at 500ms):", json.dumps(spin_res.get('result', {}).get('value', {}), indent=2))

            # Check state after 1.5s (after menu opened)
            await asyncio.sleep(1.2)
            open_res = await send_cmd("Runtime.evaluate", {
                "expression": """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const drawer = document.getElementById('nav-drawer');
                    const backdrop = document.getElementById('drawer-backdrop');
                    const banner = drawer ? drawer.querySelector('.drawer-supercar-banner') : null;
                    const navItems = drawer ? Array.from(drawer.querySelectorAll('.drawer-nav-item')).map(a => a.textContent.trim().replace(/\\s+/g, ' ')) : [];
                    return {
                        btnClass: btn ? btn.className : '',
                        drawerClass: drawer ? drawer.className : '',
                        drawerComputedStyle: drawer ? {
                            transform: getComputedStyle(drawer).transform,
                            visibility: getComputedStyle(drawer).visibility,
                            display: getComputedStyle(drawer).display,
                            zIndex: getComputedStyle(drawer).zIndex,
                            right: getComputedStyle(drawer).right,
                            width: getComputedStyle(drawer).width,
                            height: getComputedStyle(drawer).height
                        } : null,
                        backdropClass: backdrop ? backdrop.className : '',
                        bannerExists: !!banner,
                        navItemsCount: navItems.length,
                        navItems: navItems
                    };
                })()
                """,
                "returnByValue": True
            })
            print("OPENED STATE (at 1.7s):", json.dumps(open_res.get('result', {}).get('value', {}), indent=2))

            # Take screenshot after opening
            ss2 = await send_cmd("Page.captureScreenshot", {"format": "jpeg", "quality": 85})
            with open(os.path.join(artifact_dir, "edge_opened.jpg"), "wb") as f:
                f.write(base64.b64decode(ss2['result']['data']))
            print("Saved edge_opened.jpg")

    finally:
        proc.terminate()

asyncio.run(run_test())
