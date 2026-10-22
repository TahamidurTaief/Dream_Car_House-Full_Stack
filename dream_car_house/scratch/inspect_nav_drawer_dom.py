with open('c:/Users/USER/Downloads/dream_car_house/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('id="nav-drawer"')
end = text.find('</aside>', start)
drawer_html = text[start:end]
print("Drawer HTML snippet:")
print(drawer_html[:500])
