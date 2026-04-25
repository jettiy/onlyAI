// ── 데이터 수집 스크립트 ──────────────────────────────────
// Node.js로 실행. OpenRouter API + RSS 피드에서 데이터를
// 가져와 public/data/ 디렉토리에 JSON 파일로 저장합니다.
//
// 사용법:
//   node scripts/fetch-data.mjs [--force]
//
// GitHub Actions / 로컬 모두에서 실행 가능
//
// 요구사항: Node.js 18+

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(PROJECT_DIR, 'public', 'data');

// ── 유틸리티 ──
function kstNow() {
  const d = new Date();
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())} ${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:${pad(kst.getUTCSeconds())}`;
}

function isoKST() {
  const d = new Date();
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().replace('Z', '+09:00');
}

async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function saveJSON(filename, data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = path.join(DATA_DIR, filename + '.tmp');
  const out = path.join(DATA_DIR, filename);
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmp, out);
}

function parseRSS(xmlText, sourceName) {
  const items = [];
  let match;
  
  // RSS <item> 형식
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    items.push(parseItem(match[1], sourceName));
  }
  
  // Atom <entry> 형식
  if (items.length === 0) {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    while ((match = entryRegex.exec(xmlText)) !== null) {
      items.push(parseEntry(match[1], sourceName));
    }
  }
  
  return items;
}

function extractTag(text, tag) {
  const cdataMatch = text.match(new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`));
  if (cdataMatch) return cdataMatch[1].trim();
  const plainMatch = text.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (plainMatch) return plainMatch[1].trim();
  return '';
}

function extractAttr(text, tag, attr) {
  const match = text.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`));
  return match ? match[1].trim() : '';
}

function parseItem(xml, source) {
  const title = extractTag(xml, 'title');
  const link = extractTag(xml, 'link');
  const pubDate = extractTag(xml, 'pubDate');
  const description = extractTag(xml, 'description').replace(/<[^>]*>/g, '').slice(0, 200);
  
  return {
    title: title || '(제목 없음)',
    url: link || extractAttr(xml, 'link', 'href') || '',
    date: pubDate || new Date().toUTCString(),
    summary: description,
    source,
  };
}

function parseEntry(xml, source) {
  const title = extractTag(xml, 'title');
  const linkHref = extractAttr(xml, 'link', 'href');
  const id = extractTag(xml, 'id');
  const updated = extractTag(xml, 'updated');
  const summary = extractTag(xml, 'summary').replace(/<[^>]*>/g, '').slice(0, 200);
  
  return {
    title: title || '(제목 없음)',
    url: linkHref || id || '',
    date: updated || new Date().toUTCString(),
    summary,
    source,
  };
}

// ── 메인 ──
async function main() {
  const now = kstNow();
  console.log(`▶ 데이터 수집 시작: ${now}`);
  
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  
  // ── 1. OpenRouter Models ──
  console.log('  1) OpenRouter 모델 목록 수집 중...');
  let models = [];
  let rankings = [];
  
  try {
    const raw = await fetchWithTimeout('https://openrouter.ai/api/v1/models');
    const json = JSON.parse(raw);
    
    // Raw 저장
    fs.writeFileSync(path.join(DATA_DIR, 'openrouter-models-raw.json'), raw, 'utf-8');
    
    // 가격 테이블
    models = (json.data || []).filter(m => {
      const prompt = parseFloat(m.pricing?.prompt);
      const completion = parseFloat(m.pricing?.completion);
      return prompt > 0 || completion > 0;
    }).map(m => ({
      id: m.id,
      name: m.name,
      provider: (m.id?.split('/')[0] || 'UNKNOWN').toUpperCase(),
      input: parseFloat(m.pricing?.prompt || '0') * 1000000,
      output: parseFloat(m.pricing?.completion || '0') * 1000000,
      context: m.context_length > 0
        ? (m.context_length >= 1000000 ? `${(m.context_length / 1000000).toFixed(0)}M` : `${Math.round(m.context_length / 1000)}K`)
        : '—',
      description: (m.description || '').slice(0, 200),
      createdAt: m.created || 0,
      modalities: (m.architecture?.modality || 'TEXT'),
      maxTokens: m.top_provider?.max_completion_tokens || null,
    }));
    
    saveJSON('models-pricing.json', models);
    
    // 랭킹 (최신순 정렬)
    const sorted = [...(json.data || [])]
      .sort((a, b) => (b.created || 0) - (a.created || 0))
      .slice(0, 20);
    
    rankings = sorted.map((m, i) => ({
      rank: i + 1,
      model: m.name || m.id,
      provider: (m.id?.split('/')[0] || 'UNKNOWN').toUpperCase(),
      tokens: m.created ? 'LIVE' : '',
      tokensNum: 0,
      share: 0,
      change: i < 5 ? 'NEW' : '',
      category: i < 5 ? 'flagship' : i < 12 ? 'value' : 'free',
      color: 'from-brand-400 to-violet-500',
    }));
    
    saveJSON('rankings.json', rankings);
    console.log(`    ✓ 모델 ${models.length}개, 랭킹 ${rankings.length}개 수집`);
  } catch (err) {
    console.log(`    ⚠ OpenRouter API 실패: ${err.message}`);
  }
  
  // ── 2. RSS 뉴스 ──
  console.log('  2) AI 뉴스 RSS 수집 중...');
  
  const RSS_FEEDS = [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', name: 'NY Times' },
    { url: 'https://feeds.feedburner.com/TechCrunch/', name: 'TechCrunch' },
    { url: 'https://www.artificialintelligence-news.com/feed/', name: 'AI News' },
  ];
  
  let allNews = [];
  
  for (const feed of RSS_FEEDS) {
    try {
      const xml = await fetchWithTimeout(feed.url);
      const items = parseRSS(xml, feed.name);
      if (items.length > 0) {
        saveJSON(`rss-${feed.name.toLowerCase().replace(/\s+/g, '')}.json`, items);
        console.log(`    ✓ ${feed.name}: ${items.length}개`);
        allNews = allNews.concat(items);
      } else {
        console.log(`    ⚠ ${feed.name}: 항목 없음`);
      }
    } catch (err) {
      console.log(`    ⚠ ${feed.name}: ${err.message}`);
    }
  }
  
  // 뉴스 병합
  allNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // 중복 제거 (title 기준)
  const seen = new Set();
  const merged = [];
  for (const item of allNews) {
    const key = item.title.toLowerCase().slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(item);
    }
  }
  
  saveJSON('rss-merged.json', merged.slice(0, 50));
  console.log(`    ✓ 뉴스 병합: ${Math.min(merged.length, 50)}개`);
  
  // ── 3. 메타데이터 ──
  saveJSON('meta.json', {
    updatedAt: isoKST(),
    updatedAtKST: now,
    source: 'OpenRouter API + RSS Feeds (batch)',
    modelCount: models ? models.length : 0,
    newsCount: merged.length,
    rankingCount: rankings ? rankings.length : 0,
  });
  
  // Summary
  console.log('');
  console.log(`✅ 데이터 수집 완료: ${now}`);
  console.log(`   - models-pricing.json: ${models.length}개 가격`);
  console.log(`   - rankings.json: ${rankings.length}개 랭킹`);
  console.log(`   - rss-merged.json: ${Math.min(merged.length, 50)}개 뉴스`);
  console.log(`   - meta.json: 수집 시각 기록됨`);
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
