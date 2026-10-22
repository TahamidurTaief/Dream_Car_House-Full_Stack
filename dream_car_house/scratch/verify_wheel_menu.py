with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()

assert 'wheel-menu-btn' in h
assert 'handleWheelMenuClick' in h
assert 'luxury-wheel-svg' in h
assert 'wheel-rotating-group' in h
assert 'id="nav-drawer"' in h

with open('js/app.js', 'r', encoding='utf-8') as f:
    j = f.read()

assert 'function handleWheelMenuClick' in j
assert 'function openDrawer' in j
assert 'function closeDrawer' in j
assert 'wheel-spinning' in j

with open('css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

assert 'wheelClickBurnout' in c
assert 'wheelIdleCruise' in c
assert '.wheel-rotating-group' in c

print('ALL WHEEL MENU AND DRAWER CHECKS PASSED!')
