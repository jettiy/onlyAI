p = r'C:\Users\USER-PC\Desktop\onlyAI\api\news.ts'
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the line with 멀티모달 cat
new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    if '멀티모달' in line and "cat: '멀티모달'" in line:
        new_lines.append("  { test: /투자|investment|funding|series [ab]|매출|revenue|기업|company|startup|valuation|ipo|상장|strategic/i, cat: '투자·기업' },\n")
        new_lines.append("  { test: /robot|로봇|autonomous driv|자율주행|car|ev|전기차|tesla|mobility/i, cat: '로봇·자율주행' },\n")

with open(p, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('done')
