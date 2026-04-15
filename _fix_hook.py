p = r'C:\Users\USER-PC\Desktop\onlyAI\src\hooks\useNewsRSS.ts'
with open(p, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    if '멀티모달' in line and 'border border-pink' in line:
        new_lines.append('  "\ud22c\uc790\xb7\uae30\uc5c5":      "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800",\n')
        new_lines.append('  "\ub85c\ubd07\xb7\uc790\uc728\uc8fc\ud589": "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800",\n')

with open(p, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('done')
