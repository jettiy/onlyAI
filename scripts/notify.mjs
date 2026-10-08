// scripts/notify.mjs — GitHub Actions 파이프라인 텔레그램 알림
// 사용: node scripts/notify.mjs "<이모지+제목>" "<본문>" [ERROR]
// 시크릿: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
// 실패해도 워크플로우를 죽이지 않는다 (알림은 부가 기능).

const [title, body = '', level = 'INFO'] = process.argv.slice(2);

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

if (!token || !chatId) {
  console.log('notify: 시크릿 없음 — 스킵');
  process.exit(0);
}

const icon = level === 'ERROR' ? '🚨' : level === 'SUCCESS' ? '✅' : 'ℹ️';
const repo = process.env.GITHUB_REPOSITORY || 'jettiy/onlyAI';
const runUrl = process.env.GITHUB_SERVER_URL
  ? `${process.env.GITHUB_SERVER_URL}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : '';

const text = `${icon} *${title}*\n${body}${runUrl ? `\n[실행 로그](${runUrl})` : ''}`;

try {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }),
  });
  const data = await res.json();
  if (data.ok) console.log('notify: 전송 성공');
  else console.log('notify: 전송 실패', JSON.stringify(data).slice(0, 200));
} catch (e) {
  console.log('notify: 네트워크 오류', e.message);
}
// 어떤 경우든 exit 0 — 알림 실패가 파이프라인을 죽이지 않게
