import asyncio, json, subprocess, urllib.request, websockets, base64

async def test_full_experience():
    proc = subprocess.Popen([
        r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
        '--headless=new',
        '--remote-debugging-port=9238',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9238/json')
        ws_url = [t['webSocketDebuggerUrl'] for t in json.loads(req.read().decode()) if t.get('type') == 'page'][0]
        async with websockets.connect(ws_url) as ws:
            msg_id = 0
            async def cmd(m, p=None):
                nonlocal msg_id
                msg_id += 1
                c = msg_id
                await ws.send(json.dumps({'id': c, 'method': m, 'params': p or {}}))
                while True:
                    raw = await ws.recv()
                    d = json.loads(raw)
                    if d.get('id') == c:
                        return d

            async def screenshot(name):
                res = await cmd('Page.captureScreenshot', {'format': 'jpeg', 'quality': 85})
                with open(name, 'wb') as f:
                    f.write(base64.b64decode(res['result']['data']))
                print(f'Screenshot saved to: {name}')

            await cmd('Runtime.enable')
            await cmd('Page.enable')

            # 1. Check Button & Initial Setup
            setup_eval = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const wrapper = btn.querySelector('.wheel-disc-wrapper');
                    const img = btn.querySelector('.realistic-wheel-img');
                    const audio = document.getElementById('supercar-rev-audio');
                    const r = btn.getBoundingClientRect();
                    return {
                        hasBtn: !!btn,
                        btnBox: { x: r.x, y: r.y, w: r.width, h: r.height },
                        wrapperWidth: getComputedStyle(wrapper).width,
                        wrapperHeight: getComputedStyle(wrapper).height,
                        hasAudioEl: !!audio,
                        imgSrc: img ? img.src : null
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Setup State:", json.dumps(setup_eval['result']['result']['value'], indent=2))

            # 2. Test Hover Rotation via CSS check
            hover_eval = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const img = btn.querySelector('.realistic-wheel-img');
                    // Add hover class or test hover keyframe rule existence
                    const hasCruise = Array.from(document.styleSheets).some(s => {
                        try {
                            return Array.from(s.cssRules).some(r => r.name === 'wheelCruiseSpin');
                        } catch(e) { return false; }
                    });
                    const hasBurnout = Array.from(document.styleSheets).some(s => {
                        try {
                            return Array.from(s.cssRules).some(r => r.name === 'wheelBurnoutSpin');
                        } catch(e) { return false; }
                    });
                    return { hasCruiseKeyframe: hasCruise, hasBurnoutKeyframe: hasBurnout };
                })()
                """,
                'returnByValue': True
            })
            print("Keyframes Check:", hover_eval['result']['result']['value'])

            # 3. Simulate real click
            click_eval = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    btn.click();
                    const img = btn.querySelector('.realistic-wheel-img');
                    return {
                        btnClasses: btn.className,
                        imgAnimation: getComputedStyle(img).animationName,
                        imgDuration: getComputedStyle(img).animationDuration
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Immediate Click State (0ms):", click_eval['result']['result']['value'])

            # Capture screenshot while wheel is spinning intensely
            await asyncio.sleep(0.4)
            await screenshot('scratch/verified_1_spinning.jpg')

            # State midway through spin (0.5s)
            mid_eval = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const btn = document.getElementById('header-menu-btn');
                    const drawer = document.getElementById('nav-drawer');
                    return {
                        isSpinning: btn.classList.contains('wheel-spinning'),
                        drawerOpenYet: drawer.classList.contains('open')
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Midway State (500ms):", mid_eval['result']['result']['value'])

            # 4. Wait for 1.15s burnout completion and drawer entrance
            await asyncio.sleep(0.9) # Total 1.3s from click
            await screenshot('scratch/verified_2_drawer_opened.jpg')

            opened_eval = await cmd('Runtime.evaluate', {
                'expression': """
                (() => {
                    const drawer = document.getElementById('nav-drawer');
                    const backdrop = document.getElementById('drawer-backdrop');
                    const bannerImg = drawer.querySelector('.supercar-banner-img');
                    const items = Array.from(drawer.querySelectorAll('.drawer-nav-item')).map(a => a.querySelector('.drawer-item-title').textContent);
                    return {
                        drawerOpen: drawer.classList.contains('open'),
                        drawerTransform: getComputedStyle(drawer).transform,
                        backdropActive: backdrop.classList.contains('active'),
                        supercarImg: bannerImg ? bannerImg.src : null,
                        menuItemCount: items.length,
                        menuItems: items
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Drawer Opened State (1300ms):", json.dumps(opened_eval['result']['result']['value'], indent=2))

    finally:
        proc.terminate()

asyncio.run(test_full_experience())
