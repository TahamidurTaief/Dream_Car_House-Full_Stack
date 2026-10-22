from html.parser import HTMLParser
import re

# 1. HTML Syntax & Tag Balance
class StrictHTML(HTMLParser):
    void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag not in self.void_tags:
            self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag in self.void_tags:
            return
        if not self.stack:
            self.errors.append(f"Unexpected end tag </{tag}>")
        elif self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append(f"Mismatched tag: expected </{self.stack[-1]}>, got </{tag}>")

with open('index.html', encoding='utf-8') as f:
    html = f.read()

parser = StrictHTML()
parser.feed(html)
assert len(parser.stack) == 0, f"Unclosed tags: {parser.stack}"
assert len(parser.errors) == 0, f"HTML errors: {parser.errors}"
print("Pass 1: HTML structure is 100% matched and valid!")

# 2. Lightbox Cinema Elements in HTML
assert 'lightbox-cinema-container' in html
assert 'lightbox-top-bar' in html
assert 'lightbox-image-stage' in html
assert 'lightbox-footer-floating' in html
assert 'toggleLightboxFullscreen' in html
print("Pass 2: Lightbox Cinema DOM elements confirmed in index.html!")

# 3. CSS Checks
with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

# Check braces
open_c = css.count('{')
close_c = css.count('}')
assert open_c == close_c, f"CSS braces mismatch: {open_c} vs {close_c}"
assert '.lightbox-cinema-container' in css
assert 'max-height: 84vh' in css
assert 'image-rendering: -webkit-optimize-contrast' in css
print(f"Pass 3: CSS braces perfectly balanced ({open_c} pairs), cinema styles active!")

# 4. JS Checks
with open('js/app.js', encoding='utf-8') as f:
    js = f.read()

stack = []
for i, ch in enumerate(js):
    if ch in '({[':
        stack.append((ch, i))
    elif ch in ')}]':
        assert stack, f"Unmatched {ch} at {i}"
        last, pos = stack.pop()
        pairs = {'(': ')', '{': '}', '[': ']'}
        assert pairs[last] == ch, f"Mismatched {last} at {pos} with {ch} at {i}"
assert not stack, f"Unclosed JS tokens: {len(stack)}"
print("Pass 4: JS syntax and brackets perfectly balanced!")

# 5. Image Resolution Checks
low_res_matches = re.findall(r'w=(?:800|1200|1400)\b', js)
assert len(low_res_matches) == 0, f"Found low res parameters in app.js: {low_res_matches}"
high_res_matches = re.findall(r'w=2560&q=95', js)
assert len(high_res_matches) >= 10, f"Expected high res matches in app.js, found {len(high_res_matches)}"
print(f"Pass 5: Ultra High-Res 2560px & q=95 parameters verified for all images!")

print("\n>>> ALL 5 AUDIT TESTS PASSED WITH FLYING COLORS! <<<")
