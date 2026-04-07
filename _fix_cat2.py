p = r'C:\Users\USER-PC\Desktop\onlyAI\api\news.ts'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

old = """  { test: /vision|audio|video|image|multimodal|\uba3c\ud2f0\ubaa8\ub2ec|\uc74c\uc131|\uc774\ubbf8\uc9c0|sora|midjourney|\u591a\u6a21\u6001|\u89c6\u9891|\u8bed\u97f3/i, cat: '\uba3c\ud2f0\ubaa8\ub2ec' },
];

function isAIRelated"""

new = """  { test: /vision|audio|video|image|multimodal|\uba3c\ud2f0\ubaa8\ub2ec|\uc74c\uc131|\uc774\ubbf8\uc9c0|sora|midjourney|\u591a\u6a21\u6001|\u89c6\u9891|\u8bed\u97f3|generation|\uc0dd\uc131|diffusion/i, cat: '\uba3c\ud2f0\ubaa8\ub2ec' },
  { test: /\ud22c\uc790|investment|funding|series [ab]|\ub9e4\ucd9c|revenue|\uae30\uc5c5|company|startup|valuation|ipo|\uc0c1\uc7a5|strategic/i, cat: '\ud22c\uc790\xb7\uae30\uc5c5' },
  { test: /robot|\ub85c\ubd07|autonomous driv|\uc790\uc728\uc8fc\ud589|car|ev|\uc804\uae30\ucc28|tesla|mobility/i, cat: '\ub85c\ubd07\xb7\uc790\uc728\uc8fc\ud589' },
];

function isAIRelated"""

if old in c:
    c = c.replace(old, new, 1)
    print('done')
else:
    print('NOT FOUND')
    # Debug: find the line
    for i, line in enumerate(c.split('\n')):
        if '멀티모달' in line and 'cat:' in line:
            with open(r'C:\Users\USER-PC\Desktop\onlyAI\_cat_debug.txt', 'w', encoding='utf-8') as f:
                f.write(f'Line {i+1}: {repr(line)}\n')
                # Show surrounding lines
                lines = c.split('\n')
                for j in range(max(0,i-1), min(len(lines), i+5)):
                    f.write(f'{j+1}: {repr(lines[j])}\n')
            break

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
