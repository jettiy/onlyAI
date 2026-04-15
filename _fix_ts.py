p = r'C:\Users\USER-PC\Desktop\onlyAI\src\pages\openclaw\DevNews.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace("  summary: string;\n  tagLabel: string;", "  title: string;\n  summary: string;\n  tagLabel: string;")
with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
print('done')
