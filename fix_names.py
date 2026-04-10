p = r'C:\Users\USER-PC\.openclaw\workspace\onlyAI\src\pages\explore\ExplorePromptBench.tsx'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('GPT-5"', 'GPT-5.4"').replace('DeepSeek R1"', 'DeepSeek V3.2"')
with open(p, 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
print('OK')
