p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Fix: add children array to news nav item
old = "label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4',"
new = "label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4', children: [],"

if old in c:
    c = c.replace(old, new, 1)
    print('fixed: added children')
else:
    print('pattern not found')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
