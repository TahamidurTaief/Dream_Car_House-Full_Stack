import urllib.request, re

url = 'https://www.pexels.com/video/sleek-luxury-car-driving-through-city-streets-29532152/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        mp4s = re.findall(r'https://[^\s"\'<>]+?\.mp4[^\s"\'<>]*', html)
        print('Found mp4s:', len(mp4s))
        for m in sorted(set(mp4s))[:10]:
            print(m)
except Exception as e:
    print('Error:', e)
