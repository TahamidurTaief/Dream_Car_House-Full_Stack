with open('css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

# Check for any rule matching nav-drawer
rules = re.findall(r'([^{}]*nav-drawer[^{}]*)\{([^}]*)\}', css)
for sel, body in rules:
    print("SELECTOR:", sel.strip())
    print("BODY:", body.strip()[:200])
    print("-" * 40)
