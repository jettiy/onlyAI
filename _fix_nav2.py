p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Check if news already exists after explore
if '\ub274\uc2a4 \ube0c\ub9ac\ud551' in c:
    print('news already in nav')
else:
    # Insert news item between explore closing and prompts opening
    old = """  },
  {
    label: '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30', path: '/prompts', icon: '\ud83d\udcd1', short: '\ud504\ub864\ud504\ud2b8',"""
    new = """  },
  {
    label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4',
  },
  {
    label: '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30', path: '/prompts', icon: '\ud83d\udcd1', short: '\ud504\ub864\ud504\ud2b8',"""
    if old in c:
        c = c.replace(old, new, 1)
        print('inserted')
    else:
        print('PATTERN NOT FOUND, trying manual')

# Verify
if '/news' in c:
    print('news in nav: YES')
else:
    print('news in nav: NO')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
