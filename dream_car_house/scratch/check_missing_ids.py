import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Find all getElementById in js
elem_ids = re.findall(r"getElementById\(['\"]([^'\"]+)['\"]\)", js)
print(f"Total getElementById calls: {len(elem_ids)}")
missing = []
for eid in set(elem_ids):
    if f'id="{eid}"' not in html and f"id='{eid}'" not in html:
        missing.append(eid)

print("Missing element IDs in index.html:")
for m in sorted(missing):
    print(" -", m)
