p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

target = "short: '\ub274\uc2a4',"
replacement = "short: '\ub274\uc2a4', children: [],"

c = c.replace(target, replacement, 1)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('done')
