p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Insert after explore block, before prompts block
# Line 37 ends with "  }," and line 38 starts with "  {"
target = """    ],
  },
  {
    label: '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30'"""

replacement = """    ],
  },
  {
    label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4',
  },
  {
    label: '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30'"""

count = c.count(target)
print(f'Pattern found: {count} times')

if count > 0:
    c = c.replace(target, replacement, 1)
    print('Replaced successfully')
else:
    # Try reading bytes to find exact match
    print('Not found, trying byte-level match...')
    # Just do it with actual Korean text
    old_ko = "    ],\n  },\n  {\n    label: '프롬프트 적용하기'"
    new_ko = "    ],\n  },\n  {\n    label: '뉴스 브리핑', path: '/news', icon: '📰', short: '뉴스',\n  },\n  {\n    label: '프롬프트 적용하기'"
    if old_ko in c:
        c = c.replace(old_ko, new_ko, 1)
        print('Korean text matched!')
    else:
        print('Still not found, doing line-based insertion')
        lines = c.split('\n')
        new_lines = []
        inserted = False
        for i, line in enumerate(lines):
            new_lines.append(line)
            # After the explore block closing "  }," that's followed by prompts
            if i > 30 and i < 45 and not inserted:
                if '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30' in line:
                    new_lines.insert(len(new_lines)-1, "  {")
                    new_lines.insert(len(new_lines)-1, "    label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4',")
                    new_lines.insert(len(new_lines)-1, "  },")
                    inserted = True
        c = '\n'.join(new_lines)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)

# Verify
with open(p, 'r', encoding='utf-8') as f:
    verify = f.read()
print(f'/news in file: {'/news' in verify}')
print(f'뉴스 브리핑 in file: {'뉴스 브리핑' in verify}')
