import urllib.request, re
url = 'https://www.begautos.com/_next/static/chunks/397df2c13fb8c87d.js'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
code = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
hrefs = re.findall(r'href[:\s=]+["\']([^"\']+)["\']', code)
print("HREFS:", set(hrefs))

# Find jsx / component text
text_snippets = re.findall(r'>([^<>{}\\\"]{3,30})<', code)
print("TEXT SNIPPETS:", set(text_snippets[:30]))
