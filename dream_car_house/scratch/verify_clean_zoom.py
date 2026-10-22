import asyncio, json, subprocess, time, urllib.request, base64, os
from html.parser import HTMLParser
import websockets

artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_zoom_test'

def test_static():
    print("--- 1. Testing Static Syntax & Balance ---")
    class StrictHTML(HTMLParser):
        void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
        def __init__(self):
            super().__init__()
            self.stack = []
            self.errors = []
        def handle_starttag(self, tag, attrs):
            if tag not in self.void_tags:
                self.stack.append(tag)
        def handle_endtag(self, tag):
            if tag in self.void_tags:
                return
            if not self.stack:
                self.errors.append(f"Unexpected end tag </{tag}>")
            elif self.stack[-1] == tag:
                self.stack.pop()
            else:
                self.errors.append(f"Mismatched tag: expected </{self.stack[-1]}>, got </{tag}>")

    with open('index.html', encoding='utf-8') as f:
        html = f.read()

    parser = StrictHTML()
    parser.feed(html)
    assert len(parser.stack) == 0, f"Unclosed tags: {parser.stack}"
    assert len(parser.errors) == 0, f"HTML errors: {parser.errors}"
    print("[PASS] HTML is perfectly balanced!")

    # Verify bottom floating bar is NOT in index.html
    assert 'lightbox-footer-floating' not in html, "ERROR: lightbox-footer-floating should be removed from index.html"
    assert 'lightbox-zoom-bar' in html, "ERROR: lightbox-zoom-bar not found in index.html"
    assert 'lightbox-zoom-val' in html, "ERROR: lightbox-zoom-val not found in index.html"
    print("[PASS] Bottom floating bar removed, Zoom toolbar present in index.html!")

    # CSS check
    with open('css/style.css', encoding='utf-8') as f:
        css = f.read()
    assert css.count('{') == css.count('}'), "CSS braces mismatch"
    assert '.lightbox-zoom-bar' in css
    assert 'cursor: grab' in css
    print("[PASS] CSS braces balanced and zoom styles confirmed!")

    # JS check
    with open('js/app.js', encoding='utf-8') as f:
        js = f.read()

    assert 'function zoomInLightbox' in js
    assert 'function resetLightboxZoom' in js
    assert 'function initLightboxZoomEngine' in js
    assert 'function applyLightboxTransform' in js
    print("[PASS] JS zoom methods and engine definitions confirmed!")

async def test_runtime():
    print("\n--- 2. Testing Runtime Behavior in Microsoft Edge ---")
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
    await asyncio.sleep(2.5)

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

            def extract_val(r):
                if 'exceptionDetails' in r.get('result', {}):
                    print("JS EXCEPTION:", r['result']['exceptionDetails'])
                return r.get('result', {}).get('result', {}).get('value')

            # Step 1: Open Car Modal 1 and then expand into Cinema Lightbox
            res = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarModal(1);
                    return {
                        modalActive: document.getElementById('car-modal')?.classList.contains('active'),
                        carTitle: document.getElementById('beg-modal-title')?.textContent
                    };
                })()
                """,
                'returnByValue': True
            })
            print("Car modal opened:", extract_val(res))
            await asyncio.sleep(0.5)

            # Click Expand into Cinema Lightbox
            res_lb = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    openCarImageLightbox();
                    const lb = document.getElementById('gallery-lightbox-modal');
                    const hasFooter = !!document.querySelector('.lightbox-footer-floating');
                    const footerVisible = hasFooter && window.getComputedStyle(document.querySelector('.lightbox-footer-floating')).display !== 'none';
                    const zoomVal = document.getElementById('lightbox-zoom-val')?.textContent;
                    const counter = document.getElementById('lightbox-counter')?.textContent;
                    const img = document.getElementById('lightbox-main-img');
                    return {
                        lbActive: lb?.classList.contains('active'),
                        hasFooter,
                        footerVisible,
                        zoomVal,
                        counter,
                        imgSrc: img ? img.src : '',
                        imgTransform: img ? img.style.transform : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            lb_info = extract_val(res_lb) or {}
            print("Lightbox status:", lb_info)
            assert lb_info.get('lbActive') == True, f"Lightbox failed to open: {lb_info}"
            assert lb_info.get('footerVisible') == False, "Footer should NOT be visible"
            assert lb_info.get('zoomVal') == '100%', "Initial zoom should be 100%"
            print("[PASS] Clean Cinema Lightbox active without bottom footer bar!")

            # Wait for image to load completely
            await send('Runtime.evaluate', {
                'expression': """
                new Promise(resolve => {
                    const img = document.getElementById('lightbox-main-img');
                    if (img && img.complete && img.naturalWidth > 0) return resolve(true);
                    if (img) {
                        img.onload = () => resolve(true);
                        img.onerror = () => resolve(false);
                        setTimeout(() => resolve(false), 5000);
                    } else resolve(false);
                })
                """,
                'awaitPromise': True
            })
            await asyncio.sleep(0.5)

            # Capture initial pristine screenshot
            ss = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'cinema_clean_fullscreen.jpg'), 'wb') as f:
                f.write(base64.b64decode(ss['result']['data']))
            print("[CAPTURED] cinema_clean_fullscreen.jpg")

            # Step 2: Test Zoom In (2 clicks -> 150%)
            await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    zoomInLightbox();
                    zoomInLightbox();
                })()
                """,
                'returnByValue': True
            })
            await asyncio.sleep(0.3)
            res_zoom = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const img = document.getElementById('lightbox-main-img');
                    const zoomVal = document.getElementById('lightbox-zoom-val')?.textContent;
                    return {
                        zoomVal,
                        transform: img ? img.style.transform : '',
                        cursor: img ? img.style.cursor : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            zoom_info = extract_val(res_zoom) or {}
            print("Zoomed In status (150%):", zoom_info)
            assert zoom_info.get('zoomVal') == '150%', f"Expected 150%, got {zoom_info.get('zoomVal')}"
            assert 'scale(1.5)' in zoom_info.get('transform', ''), f"Expected scale(1.5), got {zoom_info.get('transform')}"
            assert zoom_info.get('cursor') == 'grab', f"Expected cursor: grab, got {zoom_info.get('cursor')}"
            print("[PASS] Zoom In functionality verified at 150% with grab cursor!")

            # Capture zoomed screenshot
            ss = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'cinema_zoomed_150.jpg'), 'wb') as f:
                f.write(base64.b64decode(ss['result']['data']))
            print("[CAPTURED] cinema_zoomed_150.jpg")

            # Step 3: Test Reset Zoom button
            res_reset = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    resetLightboxZoom();
                    const img = document.getElementById('lightbox-main-img');
                    const zoomVal = document.getElementById('lightbox-zoom-val')?.textContent;
                    return {
                        zoomVal,
                        transform: img ? img.style.transform : '',
                        cursor: img ? img.style.cursor : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            reset_info = extract_val(res_reset) or {}
            print("Reset status:", reset_info)
            assert reset_info.get('zoomVal') == '100%', "Expected 100% after reset"
            assert 'scale(1)' in reset_info.get('transform', ''), "Expected scale(1) after reset"
            print("[PASS] Reset Zoom functionality verified!")

            # Step 4: Test Double-Click Toggle (100% -> 200%)
            res_dbl = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    toggleLightboxZoom();
                    const img = document.getElementById('lightbox-main-img');
                    const zoomVal = document.getElementById('lightbox-zoom-val')?.textContent;
                    return {
                        zoomVal,
                        transform: img ? img.style.transform : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            dbl_info = extract_val(res_dbl) or {}
            print("Double-click toggle status (200%):", dbl_info)
            assert dbl_info.get('zoomVal') == '200%', "Expected 200% on double click"
            assert 'scale(2)' in dbl_info.get('transform', '')

            # Step 5: Test slide transition auto-resets zoom
            res_next = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    nextLightboxSlide();
                    const img = document.getElementById('lightbox-main-img');
                    const zoomVal = document.getElementById('lightbox-zoom-val')?.textContent;
                    const counter = document.getElementById('lightbox-counter')?.textContent;
                    return {
                        zoomVal,
                        counter,
                        transform: img ? img.style.transform : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            next_info = extract_val(res_next) or {}
            print("Next slide status:", next_info)
            assert next_info.get('zoomVal') == '100%', "Zoom should auto-reset on slide change"
            print("[PASS] Next slide auto-reset zoom verified!")

            print("\n>>> ALL TESTS PASSED WITH 100% SUCCESS! <<<")

    finally:
        proc.kill()

if __name__ == '__main__':
    test_static()
    asyncio.run(test_runtime())
