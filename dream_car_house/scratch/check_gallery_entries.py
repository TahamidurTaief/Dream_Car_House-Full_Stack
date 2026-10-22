import re
import urllib.request
import os

with open('js/app.js', encoding='utf-8') as f:
    text = f.read()

pattern = re.compile(r'id:\s*(\d+),\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*categoryLabel:\s*"([^"]+)",\s*image:\s*"([^"]+)"')
matches = pattern.findall(text)

print(f"Total entries: {len(matches)}")
for eid, title, cat, cat_lbl, img_url in matches:
    print(f"Card {eid}: {title} ({cat_lbl})")
    print(f"  URL: {img_url}")
