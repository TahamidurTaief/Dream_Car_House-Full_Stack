import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

for m in re.finditer(r'id=[\"\']([^\"\']+)[\"\']', html):
    line_no = html[:m.start()].count('\n') + 1
    print(f"Line {line_no}: id='{m.group(1)}'")
