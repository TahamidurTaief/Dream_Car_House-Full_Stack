with open('css/style.css', 'r', encoding='utf-8') as f:
    for line_no, line in enumerate(f, 1):
        if 'modal' in line.lower() or 'backdrop' in line.lower():
            print(f"{line_no}: {line.strip()}")
