// ── 신규 AI 모델 감지 스크립트 v2 ─────────────────────────
// OpenRouter API + Artificial Analysis Changelog에서 새 모델을 감지.
// OpenClaw cron에서 매일 실행하여 Telegram으로 알림 전송.
//
// 사용법:
//   node scripts/detect-new-models.mjs
//
// 감지 항목:
//   1. OpenRouter: 신규 모델 (models.ts 미등록)
//   2. OpenRouter: 가격 변경
//   3. AA Changelog: 신규 평가 모델 + Intelligence Index 점수

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');

// ── 1. models.ts에서 현재 등록된 모델 추출 ──

function extractModelsFromTS(tsPath) {
  const content = fs.readFileSync(tsPath, 'utf-8');
  const modelBlocks = [];
  const blockRegex = /\{\s*id:\s*'([a-z0-9][a-z0-9.-]*)'[\s\S]*?\},/g;
  
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const block = match[0];
    const id = match[1];
    if (id.length <= 12 && /^[a-z]+$/.test(id)) continue;
    
    const nameMatch = block.match(/name:\s*'([^']*)'/);
    const companyMatch = block.match(/company:\s*'([^']*)'/);
    const companyIdMatch = block.match(/companyId:\s*'([^']*)'/);
    const inputPriceMatch = block.match(/inputPrice:\s*([^,\n]+)/);
    const outputPriceMatch = block.match(/outputPrice:\s*([^,\n]+)/);
    
    if (!nameMatch) continue;
    
    const rawInput = inputPriceMatch?.[1]?.trim();
    const inputPrice = rawInput === 'null' ? null : parseFloat(rawInput);
    const rawOutput = outputPriceMatch?.[1]?.trim();
    const outputPrice = rawOutput === 'null' ? null : parseFloat(rawOutput);
    
    modelBlocks.push({ id, name: nameMatch[1], company: companyMatch?.[1] || '', companyId: companyIdMatch?.[1] || '', inputPrice, outputPrice });
  }
  
  const map = new Map();
  for (const m of modelBlocks) map.set(m.id, m);
  return map;
}

// ── 2. OpenRouter API ──

async function fetchOpenRouterModels() {
  const res = await fetch('https://openrouter.ai/api/v1/models', { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`OpenRouter API HTTP ${res.status}`);
  return (await res.json()).data || [];
}

// ── 3. 모델명 정규화 ──

function normalizeModelName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.-]/g, '').replace(/\s+/g, '');
}

function matchOpenRouterToLocal(orModel, localMap) {
  const orName = orModel.name || '';
  const orNorm = normalizeModelName(orName);
  for (const [, local] of localMap) {
    const localNorm = normalizeModelName(local.name);
    if (localNorm === orNorm) return local;
    if (localNorm.length >= 4 && orNorm.includes(localNorm)) return local;
    if (orNorm.length >= 4 && localNorm.includes(orNorm)) return local;
  }
  return null;
}

// ── 4. 주요 회사 필터 ──

const MAJOR_COMPANIES = new Set([
  'openai', 'anthropic', 'google', 'meta', 'xai',
  'deepseek', 'alibaba', 'moonshot', 'zhipu', 'xiaomi',
  'minimax', 'mistral', 'cohere', 'arcee', 'nvidia',
  'microsoft', 'amazon', 'bytedance',
]);

function isMajorModel(orModel) {
  const provider = (orModel.id?.split('/')[0] || '').toLowerCase();
  if (MAJOR_COMPANIES.has(provider)) return true;
  const name = (orModel.name || '').toLowerCase();
  const kw = ['gpt', 'claude', 'gemini', 'llama', 'grok', 'deepseek', 'qwen', 'kimi', 'glm', 'mimo', 'minimax', 'mistral', 'command', 'arcee', 'phi', 'codestral', 'trinity', 'ling', 'step'];
  return kw.some(k => name.includes(k));
}

// ── 5. 신규 모델 후보 (OpenRouter) ──

function isNewModelCandidate(orModel, localMap) {
  if (matchOpenRouterToLocal(orModel, localMap)) return null;
  const prompt = parseFloat(orModel.pricing?.prompt || '0');
  const completion = parseFloat(orModel.pricing?.completion || '0');
  if (prompt === 0 && completion === 0) return null;
  const modality = orModel.architecture?.modality || '';
  if (modality.includes('image->image') || modality.includes('audio')) return null;
  if (!isMajorModel(orModel)) return null;
  if (prompt > 0 && prompt < 0.01) return null;
  return {
    source: 'openrouter',
    id: orModel.id,
    name: orModel.name || orModel.id,
    provider: (orModel.id?.split('/')[0] || '').toUpperCase(),
    inputPrice: prompt * 1000000,
    outputPrice: completion * 1000000,
    context: orModel.context_length || 0,
    description: (orModel.description || '').slice(0, 150),
    modality,
  };
}

// ── 6. Artificial Analysis Changelog 파싱 ──

async function fetchAAChangelog() {
  const res = await fetch('https://artificialanalysis.ai/changelog', {
    signal: AbortSignal.timeout(20000),
    headers: { 'User-Agent': 'onlyAI-Bot/1.0' },
  });
  if (!res.ok) throw new Error(`AA Changelog HTTP ${res.status}`);
  return await res.text();
}

function parseAAChangelog(html) {
  const entries = [];
  
  // 1) 날짜 추출: "24 Apr 2026" 형식
  const dates = [...html.matchAll(/(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/g)].map(m => ({ date: m[1], idx: m.index }));
  
  // 2) 모델명 추출: <h3>ModelName (variant)</h3>
  const nameRegex = /<h3[^>]*>([^<]+)<\/h3>/g;
  const models = [];
  let m;
  while ((m = nameRegex.exec(html)) !== null) {
    const name = m[1].trim();
    const pos = m.index;
    const remaining = html.substring(pos, pos + 500);
    // 3) 점수 추출: Intelligence Index: 52 | AA-Omniscience: 10
    const sMatch = remaining.match(/Intelligence Index:\s*(-?\d+(?:\.\d+)?)\s*\|\s*AA-Omniscience:\s*(-?\d+)/);
    if (sMatch) {
      models.push({ name, pos, ii: parseInt(sMatch[1], 10), ao: parseInt(sMatch[2], 10) });
    }
  }
  
  // 4) 각 모델에 가장 가까운 이전 날짜 할당
  for (const model of models) {
    let dateStr = '';
    for (const d of dates) {
      if (d.idx < model.pos) dateStr = d.date;
      else break;
    }
    const dateObj = dateStr ? new Date(dateStr) : null;
    
    // 베이스 모델명 추출 (변형 제거): "GPT-5.5 (low)" → "GPT-5.5"
    const baseName = model.name.replace(/\s*\([^)]+\)\s*$/, '').trim();
    // variant: 괄호 안 내용
    const variantMatch = model.name.match(/\(([^)]+)\)/);
    const variant = variantMatch ? variantMatch[1].trim() : '';
    
    entries.push({
      source: 'artificial-analysis',
      name: model.name,
      baseName,
      variant,
      intelligenceIndex: model.ii,
      omniscience: model.ao,
      date: dateObj ? dateObj.toISOString().split('T')[0] : null,
      dateRaw: dateStr,
    });
  }
  
  // 날짜순 정렬 (최신 먼저)
  entries.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
  
  return entries;
}

// AA 모델명을 onlyAI 로컬 모델과 매칭 (baseName 우선)
function matchAAChangelogToLocal(entry, localMap) {
  // baseName으로 먼저 매칭 ("GPT-5.5 (low)" → "GPT-5.5")
  const baseNorm = normalizeModelName(entry.baseName);
  const fullNorm = normalizeModelName(entry.name);
  for (const [, local] of localMap) {
    const localNorm = normalizeModelName(local.name);
    if (localNorm === baseNorm) return { local, confidence: 'exact' };
    if (localNorm === fullNorm) return { local, confidence: 'exact' };
    if (localNorm.length >= 4 && baseNorm.includes(localNorm)) return { local, confidence: 'partial' };
    if (localNorm.length >= 4 && localNorm.includes(baseNorm)) return { local, confidence: 'partial' };
  }
  return null;
}

// ── 메인 ──

async function main() {
  const modelsTsPath = path.join(PROJECT_DIR, 'src', 'data', 'models.ts');
  console.log('▶ 신규 모델 감지 시작 (v2: OpenRouter + AA Changelog)...');
  
  const localMap = extractModelsFromTS(modelsTsPath);
  console.log(`  로컬 등록 모델: ${localMap.size}개`);
  
  // ── A) OpenRouter 감지 ──
  let orModels = [];
  try {
    orModels = await fetchOpenRouterModels();
    console.log(`  OpenRouter 전체 모델: ${orModels.length}개`);
  } catch (err) {
    console.error(`  ⚠ OpenRouter API 실패: ${err.message}`);
  }
  
  // 신규 모델
  const newModels = [];
  for (const orModel of orModels) {
    const candidate = isNewModelCandidate(orModel, localMap);
    if (candidate) newModels.push(candidate);
  }
  const seenOR = new Set();
  const uniqueNew = [];
  for (const m of newModels) {
    const norm = normalizeModelName(m.name);
    if (!seenOR.has(norm)) { seenOR.add(norm); uniqueNew.push(m); }
  }
  
  // 가격 변경
  const priceChanged = [];
  for (const [localId, local] of localMap) {
    if (local.inputPrice === null) continue;
    for (const orModel of orModels) {
      if (matchOpenRouterToLocal(orModel, new Map([[localId, local]]))) {
        const newIn = Math.round(parseFloat(orModel.pricing?.prompt || '0') * 1000000 * 100) / 100;
        const newOut = Math.round(parseFloat(orModel.pricing?.completion || '0') * 1000000 * 100) / 100;
        if (Math.abs(newIn - local.inputPrice) > 0.05 || Math.abs(newOut - (local.outputPrice ?? 0)) > 0.05) {
          priceChanged.push({ id: localId, name: local.name, company: local.company, oldInput: local.inputPrice, oldOutput: local.outputPrice, newInput: newIn, newOutput: newOut });
        }
        break;
      }
    }
  }
  
  // ── B) AA Changelog 감지 ──
  let aaEntries = [];
  try {
    const aaHtml = await fetchAAChangelog();
    aaEntries = parseAAChangelog(aaHtml);
    console.log(`  AA Changelog 평가 항목: ${aaEntries.length}개`);
  } catch (err) {
    console.error(`  ⚠ AA Changelog 실패: ${err.message}`);
  }
  
  // AA에서만 감지된 모델 (onlyAI 미등록)
  const aaUnregistered = [];
  const aaScoreUpdates = []; // 이미 등록된 모델의 새 점수
  const seenAA = new Set();
  
  // 최근 7일 항목만 (너무 오래된 건 제외)
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  
  for (const entry of aaEntries) {
    if (entry.date && entry.date < sevenDaysAgo) continue;
    
    const baseNorm = normalizeModelName(entry.baseName);
    if (seenAA.has(baseNorm)) continue;
    seenAA.add(baseNorm);
    
    const match = matchAAChangelogToLocal(entry, localMap);
    if (!match) {
      // onlyAI 미등록 모델
      aaUnregistered.push(entry);
    } else {
      // 이미 등록된 모델 — 점수 정보
      aaScoreUpdates.push({
        ...entry,
        localId: match.local.id,
        localName: match.local.name,
        confidence: match.confidence,
      });
    }
  }
  
  // ── 결과 ──
  const result = {
    timestamp: new Date().toISOString(),
    localModelCount: localMap.size,
    openRouterModelCount: orModels.length,
    aaChangelogEntries: aaEntries.length,
    // 신규 모델 (OpenRouter)
    newModels: uniqueNew.slice(0, 15),
    newModelCount: uniqueNew.length,
    // 가격 변경
    priceChanged,
    priceChangedCount: priceChanged.length,
    // AA Changelog: 미등록 모델
    aaUnregistered,
    aaUnregisteredCount: aaUnregistered.length,
    // AA Changelog: 등록 모델 새 점수
    aaScoreUpdates: aaScoreUpdates.slice(0, 20),
    // 종합
    hasChanges: uniqueNew.length > 0 || priceChanged.length > 0 || aaUnregistered.length > 0,
  };
  
  console.log(`\n  ══ 감지 결과 ══`);
  console.log(`  OpenRouter 신규 후보: ${result.newModelCount}개`);
  console.log(`  가격 변경: ${result.priceChangedCount}개`);
  console.log(`  AA 미등록 모델: ${result.aaUnregisteredCount}개 (최근 7일)`);
  console.log(`  AA 점수 업데이트: ${result.aaScoreUpdates.length}개`);
  
  console.log('\n---JSON_START---');
  console.log(JSON.stringify(result, null, 2));
  console.log('---JSON_END---');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
