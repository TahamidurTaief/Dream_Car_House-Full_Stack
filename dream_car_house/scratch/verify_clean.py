with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_exp = html.find('experience-pillars-grid')
end_exp = html.find('<!-- ================= DREAM CAR HOUSE across socials')
exp_snippet = html[start_exp:end_exp]

assert 'openAppointmentModal' not in exp_snippet, 'Still contains openAppointmentModal in experience cards!'
print('Experience cards click verified: CLEAN!')

# Verify filterByBrand in app.js
with open('js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

assert 'function filterByBrand(brandName)' in js
assert 'initRouting();' in js
print('JS routing & brand filtering: CLEAN!')
