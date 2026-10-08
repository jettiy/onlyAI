// scripts/sync-models.mjs — Tier 1 멀티소스 모델 데이터 통합
// 소스 3개 (전부 무료·무키):
//   1. OpenRouter  /api/v1/models       — 가격·컨텍스트·출시일 (앵커)
//   2. models.dev  api.json             — reasoning/tool_call/open_weights 메타
//   3. LiteLLM     model_prices json    — 가격 크로스체크
// 산출: public/data/models-unified.json (필드별 출처 provenance 기록)
// 사용: node scripts/sync-models.mjs [--dry]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const OUT = path.join(PROJECT_DIR, 'public', 'data', 'models-unified.json');
const DRY = process.argv.includes('--dry');

// ── 이름 정규화: 소스 간 모델명 매칭용 ──
// openrouter: "anthropic/claude-haiku-5.5", models.dev: "claude-haiku-5-5",
// litellm: "anthropic/claude-haiku-5.5"
function normalizeId(id) {
  return id.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// ── 소스 패치 (제한시간 개별 적용) ──
async function fetchJSON(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${url.slice(0, 60)}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// ── 1. OpenRouter (앵커) ──
async function fetchOpenRouter() {
  const d = await fetchJSON('https://openrouter.ai/api/v1/models');
  const out = new Map();
  for (const m of d.data ?? []) {
    const p = m.pricing ?? {};
    const num = (v) => (v == null ? null : parseFloat(v));
    out.set(m.id, {
      id: m.id,
      name: m.name,
      provider: m.id.split('/')[0],
      context: m.context_length ?? null,
      created: m.created ?? null,
      // USD per 1M tokens
      inputPrice: num(p.prompt) != null ? num(p.prompt) * 1e6 : null,
      outputPrice: num(p.completion) != null ? num(p.completion) * 1e6 : null,
      modalities: m.architecture?.modalities ?? null,
      hfId: m.hugging_face_id ?? null,
      desc: m.description?.slice(0, 300) ?? null,
    });
  }
  return out;
}

// ── 2. models.dev ──
async function fetchModelsDev() {
  const d = await fetchJSON('https://models.dev/api.json');
  const out = new Map();
  for (const [provId, prov] of Object.entries(d)) {
    for (const [mid, m] of Object.entries(prov.models ?? {})) {
      const slug = `${provId}/${mid}`;
      out.set(normalizeId(slug), {
        slug,
        family: m.family ?? null,
        reasoning: m.reasoning ?? null,
        toolCall: m.tool_call ?? null,
        structuredOutput: m.structured_output ?? null,
        openWeights: m.open_weights ?? null,
        releaseDate: m.release_date ?? null,
        modalities: m.modalities ?? null,
        knowledge: m.knowledge ?? null,
        limit: m.limit ?? null,
      });
    }
  }
  return out;
}

// ── 3. LiteLLM 가격 DB ──
async function fetchLiteLLM() {
  const d = await fetchJSON(
    'https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json'
  );
  const out = new Map();
  for (const [key, m] of Object.entries(d)) {
    if (key === 'metadata') continue;
    out.set(normalizeId(key), {
      slug: key,
      inputPrice: m.input_cost_per_token != null ? m.input_cost_per_token * 1e6 : null,
      outputPrice: m.output_cost_per_token != null ? m.output_cost_per_token * 1e6 : null,
      context: m.max_input_tokens + m.max_output_tokens || m.max_input_tokens || null,
    });
  }
  return out;
}

// ── 병합 ──
function kstNow() {
  const d = new Date(Date.now() + 9 * 3600e3);
  return d.toISOString().replace('Z', '+09:00');
}

async function main() {
  console.log('── Tier 1 모델 데이터 통합 ──');
  const [or, dev, litellm] = await Promise.all([
    fetchOpenRouter().catch((e) => { console.error('OpenRouter 실패:', e.message); return null; }),
    fetchModelsDev().catch((e) => { console.error('models.dev 실패:', e.message); return null; }),
    fetchLiteLLM().catch((e) => { console.error('LiteLLM 실패:', e.message); return null; }),
  ]);
  if (!or) {
    console.error('앵커 소스(OpenRouter) 실패 — 중단');
    process.exit(1);
  }
  console.log(`OpenRouter ${or.size} | models.dev ${dev?.size ?? 0} | LiteLLM ${litellm?.size ?? 0}`);

  // ── 체인지로그 감지 (fetch-data.mjs에서 이관, 3소스 기준) ──
  const oldPath = path.join(PROJECT_DIR, 'public', 'data', 'models-unified.json');
  let oldModels = [];
  if (fs.existsSync(oldPath)) {
    try {
      oldModels = (JSON.parse(fs.readFileSync(oldPath, 'utf-8')).models ?? [])
        .map((m) => ({ id: m.id, name: m.name, provider: m.provider?.toUpperCase(), input: m.inputPrice, output: m.outputPrice }));
    } catch { /* 무시 */ }
  }
  const changeItems = [];
  if (oldModels.length > 0) {
    const oldMap = new Map(oldModels.map((m) => [m.id, m]));
    const newIds = new Set(or.keys());
    for (const m of or.values()) {
      const old = oldMap.get(m.id);
      if (!old) {
        changeItems.push({ type: 'new_model', modelId: m.id, modelName: m.name, provider: m.provider.toUpperCase(), description: '새 모델 추가', input: m.inputPrice, output: m.outputPrice });
      } else if (
        (m.inputPrice != null && old.input != null && Math.abs(m.inputPrice - old.input) > 0.001) ||
        (m.outputPrice != null && old.output != null && Math.abs(m.outputPrice - old.output) > 0.001)
      ) {
        changeItems.push({ type: 'price_change', modelId: m.id, modelName: m.name, provider: m.provider.toUpperCase(), description: '가격 변동', oldInput: old.input, newInput: m.inputPrice, oldOutput: old.output, newOutput: m.outputPrice });
      }
    }
    for (const m of oldModels) {
      if (!newIds.has(m.id)) changeItems.push({ type: 'model_removed', modelId: m.id, modelName: m.name, provider: m.provider, description: '모델 제거' });
    }
    if (changeItems.length > 0) {
      const today = new Date().toISOString().slice(0, 10);
      const clPath = path.join(PROJECT_DIR, 'public', 'data', 'changelog.json');
      let changelog = [];
      if (fs.existsSync(clPath)) {
        try { changelog = JSON.parse(fs.readFileSync(clPath, 'utf-8')); } catch { /* 무시 */ }
      }
      const entry = changelog.find((e) => e.date === today);
      if (entry) entry.items.push(...changeItems);
      else changelog.unshift({ date: today, items: changeItems });
      fs.writeFileSync(clPath, JSON.stringify(changelog.slice(0, 90), null, 1), 'utf-8');
      console.log(`체인지로그: ${changeItems.length}개 변경 감지`);
    } else {
      console.log('체인지로그: 변경사항 없음');
    }
  }

  const unified = [];
  let devMatch = 0, llmMatch = 0, priceAgree = 0, priceDiff = 0;

  for (const [id, m] of or) {
    const u = {
      ...m,
      sources: ['openrouter'],
      meta: null,
      priceCheck: null,
    };

    // models.dev 조인 (normalized id)
    if (dev) {
      const hit = dev.get(normalizeId(id));
      if (hit) {
        devMatch++;
        u.meta = {
          reasoning: hit.reasoning,
          toolCall: hit.toolCall,
          structuredOutput: hit.structuredOutput,
          openWeights: hit.openWeights,
          releaseDate: hit.releaseDate,
          family: hit.family,
        };
        u.sources.push('models.dev');
      }
    }

    // LiteLLM 가격 크로스체크
    if (litellm) {
      const hit = litellm.get(normalizeId(id));
      if (hit && hit.inputPrice != null && m.inputPrice != null) {
        llmMatch++;
        const diffPct = Math.abs(hit.inputPrice - m.inputPrice) / (m.inputPrice || 1) * 100;
        if (diffPct <= 5) {
          priceAgree++;
          u.priceCheck = 'agree';
        } else {
          priceDiff++;
          u.priceCheck = { status: 'diff', diffPct: Math.round(diffPct), litellmInput: hit.inputPrice };
        }
        u.sources.push('litellm');
      }
    }

    unified.push(u);
  }

  unified.sort((a, b) => (b.created ?? 0) - (a.created ?? 0));

  const result = {
    updatedAt: kstNow(),
    sourceStatus: {
      openrouter: or.size,
      modelsDev: dev ? Object.keys(Object.fromEntries(dev)).length : 'failed',
      litellm: litellm?.size ?? 'failed',
    },
    joinStats: {
      total: unified.length,
      modelsDevMatched: devMatch,
      litellmMatched: llmMatch,
      priceAgree,
      priceDiffOver5pct: priceDiff,
    },
    models: unified,
  };

  if (DRY) {
    console.log('[dry] 병합 미리보기:');
    console.log(JSON.stringify(result.joinStats, null, 2));
    console.log('최신 5개:');
    for (const m of unified.slice(0, 5)) console.log(' ', m.created, m.id, m.inputPrice, m.outputPrice);
    return;
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const tmp = OUT + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(result, null, 1), 'utf-8');
  fs.renameSync(tmp, OUT);
  console.log(`✓ models-unified.json 기록: ${unified.length}개 모델`);
  console.log(JSON.stringify(result.joinStats, null, 2));
}

main().catch((e) => {
  console.error('치명적 오류:', e);
  process.exit(1);
});
