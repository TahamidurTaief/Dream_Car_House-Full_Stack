import urllib.request
import urllib.parse
import json
import re
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

def search_youtube(query):
    url = 'https://www.youtube.com/results?search_query=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            vids = re.findall(r'"videoId":"([a-zA-Z0-9_-]{11})"', content)
            unique = []
            for v in vids:
                if v not in unique:
                    unique.append(v)
            return unique
    except Exception as e:
        print('Error:', e)
        return []

def get_oembed(vid):
    url = f'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json'
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=4) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('title', ''), data.get('author_name', '')
    except Exception as e:
        return None, None

for category, q in [
    ('Maybach / Luxury', 'Mercedes Maybach S680 cinematic 4k'),
    ('Luxury Showroom', 'Hollmann International luxury showroom tour'),
    ('Rolls Royce Cullinan', 'Rolls Royce Cullinan 4k cinematic review'),
    ('Supercar Cinematic', 'supercar cinematic 4k short film')
]:
    print(f'=== Category: {category} ===')
    vids = search_youtube(q)[:8]
    for v in vids:
        title, author = get_oembed(v)
        if title:
            print(f'  {v}: {title} | {author}')
