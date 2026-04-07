p = r'C:\Users\USER-PC\Desktop\onlyAI\src\pages\explore\ExploreTimeline.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
old = '  },\n\n\nconst FILTER_OPTIONS'
new = '  },\n];\n\nconst FILTER_OPTIONS'
c = c.replace(old, new, 1)
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('fixed')
