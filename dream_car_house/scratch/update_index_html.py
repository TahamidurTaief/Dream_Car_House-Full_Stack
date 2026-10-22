import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Meta Description
content = content.replace(
    'Baridhara, Dhaka.',
    'Kakrail and Gulshan, Dhaka.'
)

# 2. Schema JSON-LD
content = content.replace(
    '"telephone": "+8801966900600"',
    '"telephone": "+8801615121312"'
)
content = content.replace(
    '"streetAddress": "KA-61/6A Pragati Sarani, Baridhara"',
    '"streetAddress": "18, Shaheed Captain Monsur Ali Soroni, Kakrail"'
)
content = content.replace(
    '"postalCode": "1212"',
    '"postalCode": "1000"'
)

# 3. Drawer brand subtitle & phone
content = content.replace(
    'Luxury Automotive Sanctum • Baridhara',
    'Premier Luxury Automotive Showroom • Kakrail & Gulshan'
)
content = content.replace(
    '+880 1966 900 600',
    '01615-121312'
)
content = content.replace(
    'tel:+8801966900600',
    'tel:01615-121312'
)
content = content.replace(
    'https://wa.me/8801966900600',
    'https://wa.me/8801615121312'
)

# 4. Showroom Open Today banner pill
content = content.replace(
    'Showroom Open Today • KA-61/6A Pragati Sarani, Dhaka',
    'Showroom Open Today • Kakrail & Gulshan, Dhaka'
)

# 5. Socials subtitle
content = content.replace(
    'cinema from our Baridhara studio.',
    'cinema from our Kakrail & Gulshan showrooms.'
)

# 6. Runway & VIP Consultation cards
content = content.replace(
    'BARIDHARA SANCTUARY • DHAKA',
    'KAKRAIL & GULSHAN • DHAKA'
)
content = content.replace(
    'KA-61/6A Pragati Sarani, Baridhara, Dhaka-1212',
    '18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000'
)

# 7. Inventory copy and branch dropdown
content = content.replace(
    'Browse all available luxury vehicles across our Baridhara, Gulshan, and Uttara studios.',
    'Browse all available luxury vehicles across our Kakrail and Gulshan showrooms.'
)

old_inv_branch_select = """      <select id="cars-filter-branch" class="filter-select">
        <option value="all">All Showroom Branches</option>
        <option value="baridhara">Baridhara Flagship Studio</option>
        <option value="gulshan">Gulshan Executive Lounge</option>
        <option value="uttara">Uttara Premier Atelier</option>
      </select>"""

new_inv_branch_select = """      <select id="cars-filter-branch" class="filter-select">
        <option value="all">All Showroom Branches</option>
        <option value="kakrail">Kakrail Branch (18, Monsur Ali Soroni)</option>
        <option value="gulshan">Gulshan Branch (House #07, Road #127)</option>
      </select>"""

content = content.replace(old_inv_branch_select, new_inv_branch_select)

# 8. Gallery invite description
content = content.replace(
    'Private viewings, mechanical diagnostic inspections, and trade-in valuations available daily across our Baridhara, Gulshan, and Uttara studios.',
    'Private viewings, mechanical diagnostic inspections, and trade-in valuations available daily across our Kakrail and Gulshan showrooms.'
)
content = content.replace(
    'our Baridhara studio',
    'our Kakrail & Gulshan showrooms'
)
content = content.replace(
    'our Baridhara showroom',
    'our Kakrail & Gulshan showrooms'
)

# 9. View Contact & View About
content = content.replace(
    'studio located on Pragati Sarani, Baridhara is dedicated to seamless automobile acquisition',
    'showrooms located in Kakrail and Gulshan Avenue are dedicated to seamless automobile acquisition'
)
content = content.replace(
    '<p style="color: #d1d5db; margin-bottom: 1.5rem;">KA-61/6A Pragati Sarani, Baridhara, Dhaka-1212, Bangladesh</p>',
    '<p style="color: #d1d5db; margin-bottom: 1.5rem;"><strong>Kakrail Branch:</strong> 18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka-1000<br><strong>Gulshan Branch:</strong> House #07, Road #127, Gulshan Avenue, Dhaka-1212</p>'
)
content = content.replace(
    '<p style="color: #d1d5db; margin-bottom: 2rem;">+880 1966-900600</p>',
    '<p style="color: #d1d5db; margin-bottom: 2rem;">01615-121312 / +880 1615-121312</p>'
)

# 10. Appointment Modal
content = content.replace(
    'Experience dedicated automotive advisory across our Baridhara, Gulshan, and Uttara studios.',
    'Experience dedicated automotive advisory across our Kakrail and Gulshan showrooms.'
)

old_appt_branch_select = """          <select id="appt-branch" class="appt-input appt-select">
            <option value="baridhara">Baridhara Flagship Studio (KA-61/6A Pragati Sarani)</option>
            <option value="gulshan">Gulshan Executive Lounge (House 24, Road 11, Gulshan-1)</option>
            <option value="uttara">Uttara Premier Atelier (Plot 18, Sector 3, Jasimuddin Ave)</option>
          </select>"""

new_appt_branch_select = """          <select id="appt-branch" class="appt-input appt-select">
            <option value="kakrail">Kakrail Branch (18, Shaheed Captain Monsur Ali Soroni, Kakrail)</option>
            <option value="gulshan">Gulshan Branch (House #07, Road #127, Gulshan Avenue)</option>
          </select>"""

content = content.replace(old_appt_branch_select, new_appt_branch_select)

# 11. Experience video modal
content = content.replace(
    'Pragati Sarani, Dhaka',
    'Kakrail & Gulshan, Dhaka'
)
content = content.replace(
    'KA-61/6A Pragati Sarani, Baridhara, Dhaka • Private viewings by reservation',
    '18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka • Private viewings by reservation'
)

# 12. Footer Contact & Map
old_footer_contact = """              <span><strong>Baridhara (HQ)</strong>: KA-61/6A Pragati Sarani<br>
              <strong>Gulshan Lounge</strong>: Road 11, Gulshan-1<br>
              <strong>Uttara Atelier</strong>: Sector 3, Jasimuddin Ave</span>"""

new_footer_contact = """              <span><strong>Kakrail Branch (Main)</strong>: 18, Shaheed Captain Monsur Ali Soroni, Kakrail<br>
              <strong>Gulshan Branch</strong>: House #07, Road #127, Gulshan Avenue</span>"""

content = content.replace(old_footer_contact, new_footer_contact)

content = content.replace(
    '<a href="tel:+8801966900600" class="contact-link">+880 1966-900600</a>',
    '<a href="tel:01615-121312" class="contact-link">01615-121312 / +880 1615-121312</a>'
)
content = content.replace(
    'contact@dreamcarhouse.com',
    'dreamcarhouse101@gmail.com'
)

old_footer_map_block = """        <!-- Col 2: Showroom Google Map (Center) -->
        <div class="footer-col-map">
          <div class="map-col-header">
            <h3 class="footer-heading" style="margin-bottom: 0.25rem;">Showroom Studios</h3>
            <span class="map-subtitle">Baridhara Flagship Studio • Pragati Sarani, Dhaka</span>
          </div>
          <div class="footer-branch-tabs">
            <button type="button" class="footer-branch-tab active" onclick="switchFooterBranchMap('baridhara', this)">Baridhara (HQ)</button>
            <button type="button" class="footer-branch-tab" onclick="switchFooterBranchMap('gulshan', this)">Gulshan-1</button>
            <button type="button" class="footer-branch-tab" onclick="switchFooterBranchMap('uttara', this)">Uttara</button>
          </div>
          <div class="map-embed-wrapper-modern">
            <iframe 
              src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=KA-61/6A%20Pragati%20Sarani%20Baridhara%20Dhaka&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
              loading="lazy" 
              title="DREAM CAR HOUSE Showroom Location"
              allowfullscreen>
            </iframe>
            <div class="map-glow-border"></div>
          </div>
          <div class="map-actions-row">
            <a href="https://maps.google.com/?q=KA-61/6A+Pragati+Sarani+Baridhara+Dhaka" target="_blank" class="map-directions-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>Get Live Directions</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>"""

new_footer_map_block = """        <!-- Col 2: Showroom Google Map (Center) -->
        <div class="footer-col-map">
          <div class="map-col-header">
            <h3 class="footer-heading" style="margin-bottom: 0.25rem;">Showroom Locations</h3>
            <span class="map-subtitle">Kakrail Branch • 18, Shaheed Captain Monsur Ali Soroni, Kakrail, Dhaka</span>
          </div>
          <div class="footer-branch-tabs">
            <button type="button" class="footer-branch-tab active" onclick="switchFooterBranchMap('kakrail', this)">Kakrail Branch (Main)</button>
            <button type="button" class="footer-branch-tab" onclick="switchFooterBranchMap('gulshan', this)">Gulshan Branch</button>
          </div>
          <div class="map-embed-wrapper-modern">
            <iframe 
              src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=18%20Shaheed%20Captain%20Mansur%20Ali%20Soroni%20Kakrail%20Dhaka&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
              loading="lazy" 
              title="DREAM CAR HOUSE Showroom Location"
              allowfullscreen>
            </iframe>
            <div class="map-glow-border"></div>
          </div>
          <div class="map-actions-row">
            <a href="https://maps.google.com/?q=18+Shaheed+Captain+Mansur+Ali+Soroni+Kakrail+Dhaka" target="_blank" class="map-directions-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>Get Live Directions</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
            </a>
          </div>
        </div>"""

content = content.replace(old_footer_map_block, new_footer_map_block)

# 13. Copyright line
content = content.replace(
    '© 2026 <strong>DREAM CAR HOUSE</strong>. All rights reserved. Baridhara, Dhaka, Bangladesh.',
    '© 2026 <strong>DREAM CAR HOUSE</strong>. All rights reserved. Kakrail & Gulshan, Dhaka, Bangladesh.'
)

# Bump version to v=9.6
content = content.replace('css/style.css?v=9.5', 'css/style.css?v=9.6')
content = content.replace('js/data.js?v=9.5', 'js/data.js?v=9.6')
content = content.replace('js/app.js?v=9.5', 'js/app.js?v=9.6')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("index.html successfully updated with authentic branches and contact numbers!")
