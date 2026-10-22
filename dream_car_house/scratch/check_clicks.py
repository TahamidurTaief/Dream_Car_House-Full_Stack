import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for line_no, line in enumerate(html.splitlines(), 1):
    if 'onclick' in line or 'href' in line:
        if any(k in line for k in ['brand', 'inventory', 'experience', 'modal', 'footer', 'shortcut', 'appointment']):
            print(f"{line_no}: {line.strip()}")
