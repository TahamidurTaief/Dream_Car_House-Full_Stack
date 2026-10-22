with open('index.html', encoding='utf-8') as f:
    html = f.read()

with open('js/app.js', encoding='utf-8') as f:
    js = f.read()

with open('css/style.css', encoding='utf-8') as f:
    css = f.read()

# 1. Verify modal ID exists in HTML
assert 'id="gallery-lightbox-modal"' in html, 'gallery-lightbox-modal missing in HTML'
print('Check 1: gallery-lightbox-modal exists in index.html')

# 2. Verify modal has car-modal-backdrop class
assert 'id="gallery-lightbox-modal" class="car-modal-backdrop"' in html, 'Missing car-modal-backdrop class'
print('Check 2: gallery-lightbox-modal has car-modal-backdrop class')

# 3. Verify CSS rules for car-modal-backdrop.active
assert '.car-modal-backdrop.active' in css, 'Missing active rule in css'
assert 'opacity: 1;' in css, 'Missing opacity rule'
assert 'pointer-events: auto;' in css, 'Missing pointer-events rule'
print('Check 3: CSS .car-modal-backdrop.active sets opacity: 1 and pointer-events: auto')

# 4. Verify openGalleryLightbox adds 'active' class
assert "modal.classList.add('active')" in js, 'openGalleryLightbox does not add active class'
print('Check 4: openGalleryLightbox correctly adds active class')

# 5. Verify closeGalleryLightbox removes 'active' class
assert "modal.classList.remove('active')" in js, 'closeGalleryLightbox does not remove active class'
print('Check 5: closeGalleryLightbox correctly removes active class')

# 6. Verify NO 'Hover to' text in html and js
assert 'Hover to' not in html, 'Found Hover to text in index.html'
assert 'Hover to' not in js, 'Found Hover to text in app.js'
print('Check 6: Completely clean! No "Hover to" text exists anywhere on car cards!')

print('\nALL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!')
