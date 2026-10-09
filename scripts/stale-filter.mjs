// scripts/stale-filter.mjs — 구세대 모델 감지 (패밀리별 최신 메이저 세대군 유지 정책)
// 정책: 패밀리(예: glm)의 OpenRouter 최신 메이저가 5.3이면 카탈로그에 5.x만 유지,
//       4.x 이하는 제거 후보로 보고. 매핑 소스: models.dev family(공식) → 버전 파싱(폴백).
// 산출: public/data/stale-report.json + 제거 후보 발견 시 stdout 알림 라인
// 사용: node scripts/stale-filter.mjs [--dry]

import * as esbuild from 'esbuild';
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');
const OUT = path.join(ROOT, 'public', 'data', 'stale-report.json');

// ── 1. models.ts를 번들해 실제 데이터 구조로 읽기 (정규식 파싱 금지 원칙) ──
const TMP = path.join(ROOT, '_scratch', '.models-bundle.tmp.mjs');
fs.mkdirSync(path.dirname(TMP), { recursive: true });
await esbuild.build({
  entryPoints: [path.join(ROOT, 'src/data/models.ts')],
  bundle: true, format: 'esm', outfile: TMP, logLevel: 'silent',
});
const { models } = await import(pathToFileURL(TMP).href);
fs.rmSync(TMP, { force: true });

const unified = JSON.parse(fs.readFileSync(path.join(ROOT, 'public/data/models-unified.json'), 'utf-8'));
const OR = new Map(unified.models.map((m) => [m.id, m]));

// ── 2. 패밀리/버전 규칙 ──
const POSITIONS = ['opus','sonnet','haiku','fable','mythos','luna','sol','terra','astra','omni','spark','max','plus','pro','mini','flash','turbo','instant','thinking','code','air','nano','build'];
// 파라미터(30b/24b/8x22b)·날짜(2512/2603/2507/yyyy-mm-dd/mm-dd)·아키텍처 표기 제거
const PARAM_RE = /\b(\d{1,3})b\b|[-_](\d{4})\b|\d+x\d+b/gi;
const DATE_RE = /\b2\d{3}[-_.]\d{1,2}([-_.]\d{1,2})?\b|\b\d{1,2}[-_]\d{1,2}\b/g;

function parseVersion(name, slug) {
  const tail = slug.includes('/') ? slug.split('/')[1] : slug;
  for (const src of [name || '', tail]) {
    const s = src.toLowerCase().replace(PARAM_RE, ' ').replace(DATE_RE, ' ');
    const m = s.match(/v(\d+(?:\.\d+)?)|(?<![\dx.])(\d+(?:\.\d+)?)(?![\dx])/);
    if (!m) continue;
    const v = parseFloat(m[1] || m[2]);
    if (v >= 1 && v <= 15) return v; // 세대 번호 범위 밖은 날짜·파라미터 잔여 — 버림
  }
  return null;
}
function parseFamily(slug, name, companyId) {
  const tail = slug.includes('/') ? slug.split('/')[1] : slug;
  const s = `${tail} ${name}`.toLowerCase();
  let pos = null;
  for (const p of POSITIONS) {
    if (new RegExp(`[-_ ]${p}[-_ .0-9]|[-_ ]${p}$`).test(s)) { pos = p; break; }
  }
  const prov = slug.includes('/') ? slug.split('/')[0] : '';
  const CID = { openai:'gpt', anthropic:'claude', google:'gemini', zhipu:'glm', zai:'glm', 'z-ai':'glm',
    deepseek:'deepseek', qwen:'qwen', alibaba:'qwen', 'x-ai':'grok', xai:'grok', moonshot:'kimi',
    minimax:'minimax', meta:'llama', 'meta-llama':'llama', mistralai:'mistral', cohere:'command',
    nvidia:'nemotron', xiaomi:'mimo', stepfun:'step', upstage:'solar', microsoft:'mai' };
  const base = CID[prov] || CID[(companyId || '').toLowerCase()] || prov || (companyId || '').toLowerCase();
  return pos ? `${base}-${pos}` : base;
}
// 패밀리 최신 조회: 포지션 패밀리(gpt-instant)에 데이터 없으면 기본 패밀리(gpt)로 폴백
function famLatestOf(fam) {
  if (famLatest.has(fam)) return famLatest.get(fam);
  const base = fam.split('-')[0];
  return famLatest.get(base) ?? null;
}

// ── 3. 패밀리별 최신 (models.dev family 우선, 버전 폴백) ──
const famLatest = new Map(); // fam → { major, byModel: Map(id→ver) }
function note(fam, ver) {
  const cur = famLatest.get(fam);
  if (!cur || ver > cur) famLatest.set(fam, ver);
}
for (const [oid, om] of OR) {
  const devFam = om.meta?.family; // models.dev 공식 패밀리
  const ver = parseVersion(om.name || '', oid);
  if (devFam && ver != null) note(devFam, ver);
}
for (const [oid, om] of OR) {
  const devFam = om.meta?.family;
  if (devFam) continue;
  const ver = parseVersion(om.name || '', oid);
  if (ver != null) note(parseFamily(oid, om.name || ''), ver);
}

// ── 4. 카탈로그 판정 ──
const keep = [], drop = [], unknown = [];
for (const m of models) {
  const slug = (m.openRouterSlug || '').split(':')[0];
  const orEntry = slug ? OR.get(slug) : undefined;
  const fam = orEntry?.meta?.family || parseFamily(slug || m.id, m.name, m.companyId);
  const ver = parseVersion(m.name, slug || m.id);
  const latest = famLatestOf(fam);

  const rec = {
    id: m.id, name: m.name, slug: slug || null, family: fam,
    version: ver, familyLatest: latest ?? null,
    orAlive: slug ? Boolean(orEntry) : null,
    releaseDate: m.releaseDate || null,
  };
  if (rec.orAlive === false) { rec.verdict = 'discontinued'; drop.push(rec); continue; }
  if (ver == null || latest == null) { rec.verdict = 'unknown'; unknown.push(rec); continue; }
  const gap = Math.floor(latest) - Math.floor(ver);
  if (gap >= 1) { rec.verdict = 'stale'; rec.genGap = gap; drop.push(rec); }
  else if (gap === 0 && latest - ver >= 0.5) { rec.verdict = 'minor-behind'; unknown.push(rec); }
  else { rec.verdict = 'current'; keep.push(rec); }
}

const report = {
  updatedAt: new Date(Date.now() + 9 * 3600e3).toISOString().replace('Z', '+09:00'),
  policy: 'family-latest-major (예: glm 최신 5.3 → 5.x만 유지, 4.x 이하 제거 후보)',
  summary: { total: models.length, current: keep.length, stale: drop.filter(r=>r.verdict==='stale').length, discontinued: drop.filter(r=>r.verdict==='discontinued').length, unknown: unknown.length },
  dropCandidates: drop,
  watch: unknown,
};

console.log(`총 ${models.length}개 | 최신 ${keep.length} / 제거후보 ${drop.length} (단종 ${drop.filter(r=>r.verdict==='discontinued').length}) / 관찰 ${unknown.length}`);
for (const r of drop) {
  console.log(`  [${r.verdict}] ${r.name} — ${r.family}: v${r.version} → 최신 v${r.familyLatest}${r.genGap ? ` (gap ${r.genGap})` : ''}`);
}
if (unknown.length) {
  console.log('관찰/판정불가:');
  for (const r of unknown) console.log(`  [${r.verdict}] ${r.name} — fam=${r.family} v=${r.version} latest=${r.familyLatest}`);
}
if (DRY) { console.log('[dry] 리포트 파일은 쓰지 않음'); process.exit(0); }

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 1), 'utf-8');
console.log(`✓ stale-report.json 기록`);

// 워크플로우가 읽는 알림 라인 (제거 후보 있을 때만)
if (drop.length > 0) {
  const names = drop.map((r) => r.name).join(', ');
  console.log(`STALE_ALERT::${names}`);
}
