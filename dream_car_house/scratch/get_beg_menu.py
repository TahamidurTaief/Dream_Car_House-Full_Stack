import urllib.request, re

with open(r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112\.system_generated\steps\1434\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

chunks = re.findall(r'/_next/static/chunks/[a-zA-Z0-9\._-]+\.js', text)
print(f"Total chunks: {len(chunks)}")
for c in set(chunks):
    try:
        url = 'https://www.begautos.com' + c
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req, timeout=5)
        code = res.read().decode('utf-8', errors='ignore')
        if 'brand-new' in code.lower() and 'pre-owned' in code.lower():
            print(f"MATCH IN CHUNK: {c}")
            # look for navigation or menu items
            items = re.findall(r'\{[^{}]*name:[^{}]*href:[^{}]*\}', code)
            for it in items[:10]:
                print("  ITEM:", it)
            # look for drawer or sidebar classes
            classes = re.findall(r'className:\s*\"([^\"]*menu[^\"]*)\"', code)
            for cl in classes[:10]:
                print("  CLASS:", cl)
    except Exception as e:
        print("Error:", e)
