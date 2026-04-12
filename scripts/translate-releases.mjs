// scripts/translate-releases.mjs
import { writeFileSync, mkdirSync } from 'fs';

const GITHUB_API = 'https://api.github.com/repos/openclaw/openclaw/releases?per_page=15';
const ZAI_API = 'https://api.z.ai/api/paas/v4/chat/completions';
const API_KEY = process.env.ZAI_API_KEY;
const OUTPUT = 'public/data/releases-ko.json';

const res = await fetch(GITHUB_API, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
const rawReleases = await res.json();

const batchSize = 3;
const allTranslated = [];
for (let i = 0; i < rawReleases.length; i += batchSize) {
  const chunk = rawReleases.slice(i, i + batchSize);
  const items = chunk.map((r, idx) => `[${i + idx + 1}] TAG: ${r.tag_name}\nTITLE: ${r.name}\nBODY: ${r.body?.slice(0, 500)}`).join('\n---\n');

  const glmRes = await fetch(ZAI_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    body: JSON.stringify({
      model: 'glm-5-turbo',
      messages: [{ role: 'user', content: `한국어로 번역해. JSON만 출력. 
[{"tag":"TAG","title":"제목","summary":"영문 요약(•시작)","summaryKo":"한글 요약(•시작)","tagLabel":"신기능|버그수정|보안|UX 개선|성능 개선|플랫폼|아키텍처|개선"}]
원문:\n${items}` }],
    }),
  });
  const glmData = await glmRes.json();
  const content = glmData.choices[0].message.content.replace(/```json?\s*/gi, '').replace(/```/g, '').trim();
  allTranslated.push(...JSON.parse(content));
}

const transMap = new Map(allTranslated.map(t => [t.tag, t]));
const releases = rawReleases.map(r => ({
  tag: r.tag_name,
  version: r.tag_name.replace(/^v/, ''),
  date: new Date(r.published_at).toLocaleDateString('ko-KR'),
  dateRaw: r.published_at?.slice(0, 10),
  title: transMap.get(r.tag_name)?.title ?? r.name,
  summary: transMap.get(r.tag_name)?.summary ?? '',
  summaryKo: transMap.get(r.tag_name)?.summaryKo ?? '',
  tagLabel: transMap.get(r.tag_name)?.tagLabel ?? '개선',
  htmlUrl: r.html_url,
  prerelease: r.prerelease
}));

mkdirSync('public/data', { recursive: true });
writeFileSync(OUTPUT, JSON.stringify({ updatedAt: new Date().toISOString(), releases }, null, 2));
