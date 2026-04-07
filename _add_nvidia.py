p = r'C:\Users\USER-PC\Desktop\onlyAI\src\pages\explore\ExploreTimeline.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

old = "  cohere: '/logos/cohere.png',\n};"
new = "  cohere: '/logos/cohere.png',\n  nvidia: '/logos/nvidia.png',\n};"

if old in c:
    c = c.replace(old, new, 1)
    with open(p, 'w', encoding='utf-8') as f:
        f.write(c)
    print('done')
else:
    print('NOT FOUND')
