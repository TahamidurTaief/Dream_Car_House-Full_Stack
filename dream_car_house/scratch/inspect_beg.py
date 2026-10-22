import re

with open(r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112\.system_generated\steps\1434\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for header and menu related snippets
matches = re.findall(r'<header.*?</header>', text, re.DOTALL)
if matches:
    print("HEADER FOUND:")
    print(matches[0][:1000])

# Look for drawer or menu
menu_matches = re.findall(r'(?:menu|drawer|sidebar|nav)[^<]*<', text, re.IGNORECASE)
print(f"Total potential menu snippets: {len(menu_matches)}")
for m in menu_matches[:10]:
    print("MATCH:", m.strip())
