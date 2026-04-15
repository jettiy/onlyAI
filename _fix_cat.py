p = r'C:\Users\USER-PC\Desktop\onlyAI\api\news.ts'
with open(p, 'r', encoding='utf-8') as f:
    c = f.read()

old = """const CATEGORIES = [
  { test: /model|\ucd9c\uc2dc|launch|gpt|claude|gemini|llm|\ub9b4\ub9ac\uc988|release|\uc0c8 \ubc84\uc804|\uc0c8\ub85c\uc6b4|\u53d1\u5e03|\u4e0a\u7ebf/i, cat: '\ubaa8\ub378 \ucd9c\uc2dc' },
  { test: /agent|\uc5d0\uc774\uc804\ud2b8|autonomous|workflow|\uc790\uc728|\u667a\u80fd\u4f53/i, cat: '\uc5d0\uc774\uc804\ud2b8' },
  { test: /paper|\ub17c\ubb38|research|\uc5f0\uad6c|arxiv|\u8bba\u6587|\u7814\u7a76/i, cat: '\uc5f0\uad6c\xb7\ub17c\ubb38' },
  { test: /open.?source|\uc624\ud508\uc18c\uc2a4|github|hugging|\u5f00\u6e90/i, cat: '\uc624\ud508\uc18c\uc2a4' },
  { test: /finetun|\ud30c\uc778\ud29c\ub2dd|lora|rlhf|sft|\u5fae\u8c03/i, cat: '\ud30c\uc778\ud29c\ub2dd' },
  { test: /benchmark|\ubca4\uce58\ub9c8\ud06c|mmlu|leaderboard|rank|\u8bc4\u6d4b/i, cat: '\ubca4\uce58\ub9c8\ud06c' },
  { test: /hardware|gpu|chip|\uce58|\ubc18\ub3c4\uccb4|\uc778\ud504\ub77c|infra|nvidi|tpu|\u82af\u7247|\u534a\u5bfc\u4f53/i, cat: '\uc778\ud504\ub77c\xb7\ud558\ub4dc\uc6e8\uc5b4' },
  { test: /policy|\uc815\ucc45|\uaddc\uc81c|\ubc95|\ubc95\ub960|govern|\u76d1\u7ba1|\u5408\u89c4/i, cat: '\uc0b0\uc5c5\xb7\uc815\ucc45' },
  { test: /tool|\ub3c4\uad6c|dev|sdk|api|framework|ide|editor|\u5de5\u5177|\u6846\u67b6/i, cat: '\uac1c\ubc1c \ub3c4\uad6c' },
  { test: /vision|audio|video|image|multimodal|\uba3c\ud2f0\ubaa8\ub2ec|\uc74c\uc131|\uc774\ubbf8\uc9c0|sora|midjourney|\u591a\u6a21\u6001|\u89c6\u9891|\u8bed\u97f3/i, cat: '\uba3c\ud2f0\ubaa8\ub2ec' },
];"""

new = """const CATEGORIES = [
  { test: /model|\ucd9c\uc2dc|launch|gpt|claude|gemini|llm|\ub9b4\ub9ac\uc988|release|\uc0c8 \ubc84\uc804|\uc0c8\ub85c\uc6b4|\u53d1\u5e03|\u4e0a\u7ebf|open model/i, cat: '\ubaa8\ub378 \ucd9c\uc2dc' },
  { test: /agent|\uc5d0\uc774\uc804\ud2b8|autonomous|workflow|\uc790\uc728|\u667a\u80fd\u4f53/i, cat: '\uc5d0\uc774\uc804\ud2b8' },
  { test: /paper|\ub17c\ubb38|research|\uc5f0\uad6c|arxiv|\u8bba\u6587|\u7814\u7a76|breakthrough/i, cat: '\uc5f0\uad6c\xb7\ub17c\ubb38' },
  { test: /open.?source|\uc624\ud508\uc18c\uc2a4|github|hugging|\u5f00\u6e90/i, cat: '\uc624\ud508\uc18c\uc2a4' },
  { test: /finetun|\ud30c\uc778\ud29c\ub2dd|lora|rlhf|sft|\u5fae\u8c03|fine.?tun/i, cat: '\ud30c\uc778\ud29c\ub2dd' },
  { test: /benchmark|\ubca4\uce58\ub9c8\ud06c|mmlu|leaderboard|rank|\u8bc4\u6d4b|performance/i, cat: '\ubca4\uce58\ub9c8\ud06c' },
  { test: /hardware|gpu|chip|\uce58|\ubc18\ub3c4\uccb4|\uc778\ud504\ub77c|infra|nvidi|tpu|\u82af\u7247|\u534a\u5bfc\u4f53|datacenter|server/i, cat: '\uc778\ud504\ub77c\xb7\ud558\ub4dc\uc6e8\uc5b4' },
  { test: /policy|\uc815\ucc45|\uaddc\uc81c|\ubc95|\ubc95\ub960|govern|\u76d1\u7ba1|\u5408\u89c4|regulation|compliance/i, cat: '\uc0b0\uc5c5\xb7\uc815\ucc45' },
  { test: /tool|\ub3c4\uad6c|dev|sdk|api|framework|ide|editor|\u5de5\u5177|\u6846\u67b6|library|platform/i, cat: '\uac1c\ubc1c \ub3c4\uad6c' },
  { test: /vision|audio|video|image|multimodal|\uba3c\ud2f0\ubaa8\ub2ec|\uc74c\uc131|\uc774\ubbf8\uc9c0|sora|midjourney|\u591a\u6a21\u6001|\u89c6\u9891|\u8bed\u97f3|generation|\uc0dd\uc131|diffusion|stable diffusion/i, cat: '\uba3c\ud2f0\ubaa8\ub2ec' },
  { test: /\ud22c\uc790|investment|funding|series [ab]|\ub9e4\ucd9c|revenue|\uae30\uc5c5|company|startup|valuation|ipo|\uc0c1\uc7a5|strategic/i, cat: '\ud22c\uc790\xb7\uae30\uc5c5' },
  { test: /robot|\ub85c\ubd07|autonomous driv|\uc790\uc728\uc8fc\ud589|car|ev|\uc804\uae30\ucc28|tesla|mobility/i, cat: '\ub85c\ubd07\xb7\uc790\uc728\uc8fc\ud589' },
];"""

if old in c:
    c = c.replace(old, new, 1)
    print('categories updated')
else:
    print('PATTERN NOT FOUND')

with open(p, 'w', encoding='utf-8') as f:
    f.write(c)
