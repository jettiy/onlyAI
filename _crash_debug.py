p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open(r'C:\Users\USER-PC\Desktop\onlyAI\_crash_debug.txt', 'w', encoding='utf-8') as f:
    for i, line in enumerate(lines):
        if '/news' in line or 'news' in line.lower():
            f.write(f'{i+1}: {line.rstrip()}\n')
