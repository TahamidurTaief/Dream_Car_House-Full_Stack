import urllib.request
import json
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

vids = [
    ('7cxfVWs4YGw', 'Maybach S680 V12 Edition 4K'),
    ('rOmWSknq9g0', 'Welcome to Hollmann - Art of Luxury Cars'),
    ('9WPmzHuaCo4', 'Cullinan vs Maybach GLS 600'),
    ('hZkD2iuM56Q', 'Rolls-Royce Cullinan Midnight Run 4K'),
    ('UJlaxqT4mMo', 'Rolls-Royce Cullinan Series II'),
    ('NupQJIgvpHU', 'Maybach S680 Ultimate Edit 4K'),
]

for vid, label in vids:
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f'OK: {vid} | {label} | title: {data.get("title")}')
    except Exception as e:
        print(f'FAIL: {vid} | {e}')
