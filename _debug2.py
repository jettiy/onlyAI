p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()
with open(r'C:\Users\USER-PC\Desktop\onlyAI\_nav_debug.txt', 'w', encoding='utf-8') as f:
    for i in range(26, 48):
        f.write(f'{i+1}: {lines[i].rstrip()[:120]}\n')
print('saved')
