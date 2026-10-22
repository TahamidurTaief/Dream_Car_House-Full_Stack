import urllib.request
import json
import re

# Search Unsplash or check available car photos
# Let's search Unsplash API or web search for official photos
def check_url(u):
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.status == 200
    except:
        return False

# Known Unsplash Rolls Royce photos:
rr_candidates = [
    'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=2560&q=95', # Rolls Royce
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2560&q=95', # Rolls Royce Phantom/Ghost
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=2560&q=95',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=2560&q=95',
]

for u in rr_candidates:
    print(u[:65], 'Valid:', check_url(u))
