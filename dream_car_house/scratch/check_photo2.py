import urllib.request
import re

req = urllib.request.Request('https://unsplash.com/photos/1503376780353-7e6692767b70', headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        title = re.search(r'<title>(.*?)</title>', html)
        print('Title:', title.group(1) if title else 'No title')
except Exception as e:
    print('Error:', e)
