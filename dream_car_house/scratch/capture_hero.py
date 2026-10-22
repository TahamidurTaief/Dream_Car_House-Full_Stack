import asyncio, json, subprocess, urllib.request, websockets, base64, os
from html.parser import HTMLParser

edge_path = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
user_data = r'c:\Users\USER\Downloads\dream_car_house\scratch\edge_profile_hero_yt'
artifact_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'

def test_static():
    print("--- 1. Static Verification ---")
    with open('index.html', encoding='utf-8') as f:
        html = f.read()
    
    # Assert Beg Autos video is gone from index.html
    assert 'GLS_Reel_4K' not in html, "ERROR: Beg Autos GLS Reel still present in index.html!"
    assert 'begautos.com/media/images' not in html, "ERROR: Beg Autos video URL still present in index.html!"
    assert 'hero-youtube-iframe' in html, "ERROR: hero-youtube-iframe missing from index.html"
    print("[PASS] Beg Autos video completely removed, YouTube player active in index.html!")

async def test_runtime():
    print("\n--- 2. Runtime Verification in Edge ---")
    proc = subprocess.Popen([
        edge_path,
        '--headless=new',
        '--remote-debugging-port=9235',
        f'--user-data-dir={user_data}',
        '--no-first-run',
        '--no-default-browser-check',
        '--window-size=1440,900',
        'http://localhost:3000'
    ])
    await asyncio.sleep(2.5)
    try:
        req = urllib.request.urlopen('http://127.0.0.1:9235/json')
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
            await asyncio.sleep(2)

            res = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const iframe = document.getElementById('hero-youtube-iframe');
                    const title = document.querySelector('.hero-title')?.textContent;
                    const poster = document.getElementById('hero-poster-backdrop');
                    return {
                        hasIframe: !!iframe,
                        iframeSrc: iframe ? iframe.src : '',
                        isReady: iframe ? iframe.classList.contains('is-ready') : false,
                        title,
                        hasPoster: !!poster
                    };
                })()
                """,
                'returnByValue': True
            })
            info = res.get('result', {}).get('result', {}).get('value', {})
            print("Hero Runtime Info:", info)
            assert info['hasIframe'] == True, "Hero iframe not found"
            assert '7cxfVWs4YGw' in info['iframeSrc'], "Expected Maybach video ID in iframe src"
            print("[PASS] YouTube 4K Luxury Video Player is actively mounted and configured!")

            await asyncio.sleep(1)
            # Capture hero screenshot
            ss = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'hero_youtube_live.jpg'), 'wb') as f:
                f.write(base64.b64decode(ss['result']['data']))
            print("[CAPTURED] hero_youtube_live.jpg")

            # Test Watch Showroom Reel video modal
            await send('Runtime.evaluate', {
                'expression': 'openExperienceVideoModal()'
            })
            await asyncio.sleep(1)
            res_modal = await send('Runtime.evaluate', {
                'expression': """
                (() => {
                    const modal = document.getElementById('experience-video-modal');
                    const iframe = document.getElementById('experience-video-iframe');
                    return {
                        modalActive: modal ? modal.classList.contains('active') : false,
                        iframeSrc: iframe ? iframe.src : ''
                    };
                })()
                """,
                'returnByValue': True
            })
            modal_info = res_modal.get('result', {}).get('result', {}).get('value', {})
            print("Experience Modal Info:", modal_info)
            assert modal_info['modalActive'] == True, "Experience video modal failed to open"
            assert '7cxfVWs4YGw' in modal_info['iframeSrc'], "Experience modal should have Maybach video"

            ss_modal = await send('Page.captureScreenshot', {'format': 'jpeg', 'quality': 90})
            with open(os.path.join(artifact_dir, 'experience_modal_live.jpg'), 'wb') as f:
                f.write(base64.b64decode(ss_modal['result']['data']))
            print("[CAPTURED] experience_modal_live.jpg")

            print("\n>>> ALL TESTS PASSED WITH 100% SUCCESS! <<<")
    finally:
        proc.kill()

if __name__ == '__main__':
    test_static()
    asyncio.run(test_runtime())
