import re

# 1. Verify index.html
with open('c:/Users/USER/Downloads/dream_car_house/index.html', 'r', encoding='utf-8') as f:
    h = f.read()

assert 'id="header-menu-btn"' in h, "header-menu-btn missing"
assert 'assets/supercar_wheel.png' in h, "supercar_wheel.png missing in button"
assert 'MENU' not in h.split('id="header-menu-btn"')[1].split('</button>')[0], "MENU text should be removed from button"
assert 'id="drawer-backdrop"' in h, "drawer-backdrop missing"
assert 'id="nav-drawer"' in h, "nav-drawer missing"
assert 'drawer-supercar-banner' in h, "drawer-supercar-banner missing"
assert 'assets/supercar_menu_car.jpg' in h, "supercar_menu_car.jpg missing"
assert 'Showroom Home' in h, "Showroom Home link missing"
assert 'Complete Inventory' in h, "Complete Inventory link missing"
assert 'Brand New Editions' in h, "Brand New link missing"
assert 'Certified Pre-Owned' in h, "Pre-Owned link missing"
assert 'Showroom Gallery & Media' in h, "Gallery link missing"
assert 'Sell Your Luxury Car' in h, "Sell Your Car link missing"
assert 'About The Studio' in h, "About Studio link missing"
assert 'Location & Contact' in h, "Location link missing"
assert '+880 1966 900 600' in h, "Concierge phone missing"
print("[OK] index.html structure verified")

# 2. Verify css/style.css
with open('c:/Users/USER/Downloads/dream_car_house/css/style.css', 'r', encoding='utf-8') as f:
    c = f.read()

assert 'wheelBurnoutSpin' in c, "wheelBurnoutSpin keyframes missing"
assert 'wheelIdleCruise' in c, "wheelIdleCruise keyframes missing"
assert 'drawer-supercar-banner' in c, "drawer-supercar-banner CSS missing"
assert 'beamIgnition' in c, "beamIgnition animation missing"
assert 'transform: translateX(0)' in c, "translateX(0) for drawer open missing"
backdrop_match = re.search(r'\.drawer-backdrop\s*\{([^}]+)\}', c)
assert backdrop_match and 'rgba(0, 0, 0, 0.75)' not in backdrop_match.group(1), "Old dark backdrop rule should not be on drawer-backdrop"
assert c.count('.drawer-backdrop {') == 1, f"Expected exactly 1 .drawer-backdrop rule, found {c.count('.drawer-backdrop {')}"
print("[OK] css/style.css drawer & wheel rules verified")

# 3. Verify js/app.js
with open('c:/Users/USER/Downloads/dream_car_house/js/app.js', 'r', encoding='utf-8') as f:
    j = f.read()

assert 'function handleWheelMenuClick' in j, "handleWheelMenuClick missing"
assert 'playSupercarEngineRev' in j, "playSupercarEngineRev missing"
assert 'function openDrawer' in j, "openDrawer missing"
assert 'function closeDrawer' in j, "closeDrawer missing"
assert 'Escape' in j, "Escape listener missing"
assert 'menuBtn.addEventListener(\'click\'' not in j, "Redundant click listener should be removed"
print("[OK] js/app.js functions & guards verified")

print("\n>>> ALL 3D WHEEL & HYPERCAR MENU CHECKS PASSED PERFECTLY! <<<")
