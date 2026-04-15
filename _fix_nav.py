p = r'C:\Users\USER-PC\Desktop\onlyAI\src\components\Layout.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

# Remove news from after home
old_news = "  { label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4' },\n"
c = c.replace(old_news, '')

# Add news between explore and prompts (after the explore closing brace+comma)
# Find the pattern: end of explore block, start of prompts block
old = """    ],
  },
  {
    label: '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30'"""
new = """    ],
  },
  {
    label: '\ub274\uc2a4 \ube0c\ub9ac\ud551', path: '/news', icon: '\ud83d\udcf0', short: '\ub274\uc2a4',
  },
  {
    label: '\ud504\ub864\ud504\ud2b8 \uc801\uc6a9\ud558\uae30'"""
c = c.replace(old, new, 1)

# Also add /news to expanded list
c = c.replace(
    "['/explore','/prompts','/openclaw','/learn']",
    "['/explore','/news','/prompts','/openclaw','/learn']"
)

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('ok')
