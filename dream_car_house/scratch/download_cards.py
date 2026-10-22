import urllib.request
import os

art_dir = r'C:\Users\USER\.gemini\antigravity-ide\brain\39bcd673-b2e5-4de6-8cce-783ba78ae112'
headers = {'User-Agent': 'Mozilla/5.0'}

urls = {
    'card3_porsche911.jpg': 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
    'card4_rangerover.jpg': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    'card5_maybach_int.jpg': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
    'card12_audi.jpg': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=600&q=80',
    'card14_lc300.jpg': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
    'card18_supercar.jpg': 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=600&q=80'
}

for name, u in urls.items():
    try:
        req = urllib.request.Request(u, headers=headers)
        with urllib.request.urlopen(req) as resp:
            with open(os.path.join(art_dir, name), 'wb') as f:
                f.write(resp.read())
        print(f'Downloaded {name}')
    except Exception as e:
        print(f'Error downloading {name}: {e}')
