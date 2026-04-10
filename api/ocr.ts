import type { VercelRequest, VercelResponse } from '@vercel/node';

const ZAI_KEY = process.env.ZAI_API_KEY || '';
const ZAI_ENDPOINT = 'https://api.z.ai/api/paas/v4/chat/completions';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  try {
    const { image } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'image (base64) required' });
    }

    const response = await fetch(ZAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'glm-5v-turbo',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: { url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}` },
              },
              {
                type: 'text',
                text: `이 스크린샷은 Windows "정보" 설정 또는 Mac "이 Mac에 관하여" 화면입니다.
다음 정보를 JSON 형식으로만 추출해주세요. 다른 설명은 하지 마세요.
{
  "os": "Windows 11" 또는 "macOS" 등,
  "cpu": "12th Gen Intel Core i9-12900K" 또는 "Apple M3 Max" 등,
  "gpu": "NVIDIA GeForce RTX 4090" 또는 "Apple M3 Max" 등 (GPU 이름만),
  "ram": 64,
  "ramUnit": "GB"
}
파싅할 수 없는 항목은 null로 설정하세요. 반드시 유효한 JSON만 출력하세요.`,
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `API error: ${response.status}`, detail: errText.slice(0, 200) });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // JSON 추출
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      return res.status(502).json({ error: 'Failed to parse OCR result', raw: content });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return res.status(200).json({ specs: parsed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
}
