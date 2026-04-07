p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()
with open(r'C:\Users\USER-PC\Desktop\onlyAI\_nav_debug2.txt', 'w', encoding='utf-8') as f:
    for i, line in enumerate(lines):
        if 'news' in line.lower() or '/news' in line:
            f.write(f'{i+1}: {line.rstrip()[:150]}\n')
    f.write(f'\n--- Lines 26-50 ---\n')
    for i in range(26, 50):
        f.write(f'{i+1}: {lines[i].rstrip()[:150]}\n')
