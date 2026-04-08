## 매월 가격 자동 체크

### 작업
1. pricetoken.ai API에서 최신 가격 데이터 가져오기 (python 사용):
   ```
   python -c "
   import urllib.request, json
   req = urllib.request.Request('https://pricetoken.ai/api/v1/text', headers={'User-Agent': 'Mozilla/5.0'})
   resp = urllib.request.urlopen(req)
   data = json.loads(resp.read())
   with open('C:/Users/USER-PC/.openclaw/workspace/onlyAI/pricetoken_text_new.json', 'w', encoding='utf-8') as f:
       json.dump(data['data'], f, indent=2, ensure_ascii=False)
   print(f'Text: {len(data[\"data\"])} models')
   
   req2 = urllib.request.Request('https://pricetoken.ai/api/v1/video', headers={'User-Agent': 'Mozilla/5.0'})
   resp2 = urllib.request.urlopen(req2)
   data2 = json.loads(resp2.read())
   with open('C:/Users/USER-PC/.openclaw/workspace/onlyAI/pricetoken_video_new.json', 'w', encoding='utf-8') as f:
       json.dump(data2['data'], f, indent=2, ensure_ascii=False)
   print(f'Video: {len(data2[\"data\"])} models')
   "
   ```

2. C:\Users\USER-PC\.openclaw\workspace\onlyAI\src\data\models.ts 읽고 주요 모델의 inputPrice/outputPrice/contextWindow 확인

3. C:\Users\USER-PC\.openclaw\workspace\onlyAI\src\data\videoModels.ts 읽고 price/maxResolution/maxDuration 확인

4. pricetoken API 데이터와 비교하여 변경된 항목 찾기

5. 결과를 한국어로 보고서 작성:
   - 변경된 항목: 모델명, 항목, 기존값→새값
   - 새로 추가된 모델이 있으면 목록
   - 변경이 없으면 "이번 달 가격 변경 없음"

### 주요 매칭 규칙 (pricetoken modelId → models.ts name)
- openai/gpt-5.4 → GPT-5.4
- openai/gpt-5.4-mini → GPT-5.4 Mini
- anthropic/claude-opus-4-6 → Claude Opus 4.6
- anthropic/claude-sonnet-4-6 → Claude Sonnet 4.6
- google/gemini-3.1-pro-preview → Gemini 3.1 Pro
- xai/grok-4.20 → Grok 4.20 Beta
- deepseek/deepseek-chat → DeepSeek-V3.2
- deepseek/deepseek-reasoner → DeepSeek R1
- qwen/qwen3-max → Qwen3 Max

### 비디오 매칭
- sora/sora2-pro → Sora 3
- veo/veo-3.1 → Veo 3
- kling/kling-3.0 → Kling
- runway/runway-gen4 → Runway Gen-4

### 중요
- 파일을 수정하지 말 것! 보고만 할 것
- 수정은 준석님 확인 후 수동으로 진행
