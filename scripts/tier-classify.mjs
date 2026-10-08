// scripts/tier-classify.mjs — Tier 3: 신모델 Jev 티어 판정
// models-unified.json에서 models.ts 미등록 신모델을 찾아
// Jev(OpenRouter Decisions)로 티어 판정: major/minor/variant/noise
// 산출: public/data/model-alerts.json + 텔레그램 알림 텍스트(stdout)
// 사용: node scripts/tier-classify.mjs [--dry]
// 키: OPENROUTER_API_KEY (Decisions 경로) 또는 TYPESAFE_API_KEY (공식)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const UNIFIED = path.join(PROJECT_DIR, 'public', 'data', 'models-unified.json');
const MODELS_TS = path.join(PROJECT_DIR, 'src', 'data', 'models.ts');
const OUT = path.join(PROJECT_DIR, 'public', 'data', 'model-alerts.json');
const DRY = process.argv.includes('--dry');

// ── models.ts 등록 slug 추출 (detect-new-models.mjs 방식 계승) ──
function registeredSlugs() {
  const content = fs.readFileSync(MODELS_TS, 'utf-8');
  const set = new Set();
  const re = /id:\s*'([a-z0-9][a-z0-9.-]*)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (m[1].length > 12 || !/^[a-z]+$/.test(m[1])) set.add(m[1]);
  }
  const slugRe = /openRouterSlug:\s*'([^']+)'/g;
  while ((m = slugRe.exec(content)) !== null) set.add(m[1]);
  return set;
}

// ── 사전 필터: 메이저 회사 + 배치/변형 제외 ──
const MAJOR_PROVIDERS = new Set([
  'openai', 'anthropic', 'google', 'meta', 'meta-llama', 'x-ai', 'mistralai',
  'deepseek', 'qwen', 'moonshotai', 'z-ai', 'minimax', 'alibaba', 'mistral',
  'cohere', 'nvidia', 'microsoft', 'amazon', 'perplexity', 'stepfun', 'upstage',
]);
function isVariantOrNoise(id, name) {
  const t = `${id} ${name}`.toLowerCase();
  return /(:batch|:extended|:free|:floor|:nitro|:online|:safe|preview|alpha|beta|experimental|quant|awq|gguf|latest|distill|old|legacy)\b/.test(t)
    && !/step-5-preview/.test(t); // stepfun step-5-preview는 메이저 취급 예외
}

// ── Jev 호출 ──
const TYPESAFE_KEY = process.env.TYPESAFE_API_KEY;
const OR_KEY = process.env.OPENROUTER_API_KEY;

async function jevDecide(state, questions) {
  const body = { model: '~typesafe/jev-latest', state, questions };
  let url, headers = { 'Content-Type': 'application/json' };
  if (TYPESAFE_KEY) {
    url = 'https://api.typesafe.ai/v1/systemone';
    headers['x-api-key'] = TYPESAFE_KEY;
  } else if (OR_KEY) {
    url = 'https://openrouter.ai/api/alpha/decisions';
    headers['Authorization'] = `Bearer ${OR_KEY}`;
  } else {
    throw new Error('TYPESAFE_API_KEY 또는 OPENROUTER_API_KEY 필요');
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 30000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 150)}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// ── 주요 로직 ──
function kstNow() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().replace('Z', '+09:00');
}

async function main() {
  if (!fs.existsSync(UNIFIED)) {
    console.error('models-unified.json 없음 — 먼저 sync-models.mjs 실행');
    process.exit(1);
  }
  const unified = JSON.parse(fs.readFileSync(UNIFIED, 'utf-8'));
  const reg = registeredSlugs();
  const cutoff = Date.now() / 1000 - 45 * 86400; // 최근 45일

  // 신규 후보: 미등록 + 45일 내 + 메이저 회사 + 노이즈 아님
  const candidates = unified.models.filter((m) => {
    const base = m.id.split(':')[0];
    if (reg.has(m.id) || reg.has(base)) return false;
    if ((m.created ?? 0) < cutoff) return false;
    if (!MAJOR_PROVIDERS.has(m.provider)) return false;
    if (isVariantOrNoise(m.id, m.name)) return false;
    if (!m.inputPrice && m.inputPrice !== 0 && !m.desc) return false;
    return true;
  });

  console.log(`신규 후보: ${candidates.length}개 (등록 ${reg.size}개 기준)`);
  if (DRY || !TYPESAFE_KEY && !OR_KEY) {
    for (const c of candidates.slice(0, 10)) {
      console.log('  -', c.id, '| $' + c.inputPrice + '/M |', (c.desc || '').slice(0, 60));
    }
    if (!TYPESAFE_KEY && !OR_KEY) console.log('\n키 없음 — 후보만 출력 (--dry와 동일)');
    return;
  }

  const alerts = [];
  for (const c of candidates.slice(0, 15)) { // 1일 최대 15개 판정 (비용 보호)
    const state = `신규 AI 모델이 OpenRouter에 등록됨.
모델: ${c.name} (${c.id})
회사: ${c.provider}
출시: ${new Date((c.created ?? 0) * 1000).toISOString().slice(0, 10)}
가격: 입력 $${c.inputPrice}/Mtok, 출력 $${c.outputPrice}/Mtok
컨텍스트: ${c.context ? Math.round(c.context / 1000) + 'K' : '미상'}
설명: ${(c.desc || '없음').slice(0, 200)}
기준: 현재 카탈로그는 주요 공급사의 플래그십/주력 모델을 큐레이션한다.`;

    try {
      const r = await jevDecide(state, {
        tier: {
          type: 'choice',
          instructions: 'Grade this new AI model for inclusion in a curated Korean AI catalog.',
          criteria: {
            major: 'flagship or generational release — immediate alert',
            minor: 'lineup addition (mini/flash/pro) — weekly digest',
            variant: 'fine-tune or specialized variant of existing — ignore',
            noise: 'irrelevant — ignore',
          },
        },
        koreanInterest: {
          type: 'noul',
          instructions: 'Would this model influence Korean users deciding which AI to use?',
        },
      });
      const a = r.answers ?? {};
      alerts.push({
        id: c.id,
        name: c.name,
        provider: c.provider,
        created: c.created,
        tier: a.tier?.choice ?? 'unknown',
        tierProbs: a.tier?.probabilities ?? null,
        koreanInterest: a.koreanInterest?.noul ?? null,
        confidence: a.tier?.confidence ?? null,
      });
    } catch (e) {
      console.error('  판정 실패:', c.id, e.message);
      alerts.push({ id: c.id, name: c.name, provider: c.provider, tier: 'error', error: e.message });
    }
  }

  const result = { updatedAt: kstNow(), checkedCount: candidates.length, alerts };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(result, null, 1), 'utf-8');
  console.log(`✓ model-alerts.json 기록`);
  const major = alerts.filter((a) => a.tier === 'major');
  console.log(`\n[알림 대상] major: ${major.length} / 판정: ${alerts.length}`);
  for (const a of alerts) console.log(`  ${a.tier.padEnd(6)} conf=${a.confidence ?? '-'} ${a.id}`);
}

main().catch((e) => {
  console.error('치명적:', e);
  process.exit(1);
});
