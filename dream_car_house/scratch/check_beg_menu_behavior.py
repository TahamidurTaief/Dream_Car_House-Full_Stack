import urllib.request, re

req = urllib.request.Request('https://www.begautos.com', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')

chunks = re.findall(r'/_next/static/chunks/[^\'"\s>]+\.js', html)
for c in chunks:
    try:
        url = 'https://www.begautos.com' + c
        js = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=5).read().decode('utf-8', errors='ignore')
        if 'lucide-sparkles' in js or 'min-w-[80px]' in js:
            print('Found header component in chunk:', c)
            # Find what renders when menu is open
            m = re.findall(r'.{0,150}(?:min-w-\[80px\]|lucide-sparkles).{0,250}', js)
            for snippet in m[:3]:
                print('Snippet:', snippet)
    except Exception as e:
        pass
