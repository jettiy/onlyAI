p = r'C:\Users\USER-PC\Desktop\onlyAI\src\pages\explore\ExploreTimeline.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('];\n\n];\n\nconst', '\n\nconst', 1)
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('fixed')
