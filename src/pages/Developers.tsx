import { Link } from 'react-router-dom';

const CARDS = [
  {
    icon: '⚡',
    title: 'API 빠른 시작',
    desc: '처음 API를 쓰는 분들을 위한 기초 가이드. Python/JavaScript 코드 예시 포함.',
    to: '/developers/quickstart',
    color: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
    textColor: 'text-yellow-700 dark:text-yellow-300',
  },
  {
    icon: '💰',
    title: 'API 가격 비교',
    desc: '모델별 API 가격을 한눈에 비교. 월 예상 비용까지 계산해드려요.',
    to: '/developers/pricing',
    color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: '☁️',
    title: '클라우드 제공사',
    desc: 'OpenRouter, Groq, DeepSeek API 등 어디서 API를 쓸지 비교해보세요.',
    to: '/developers/providers',
    color: 'bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-900',
    textColor: 'text-sky-700 dark:text-sky-300',
  },
];

export default function Developers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">💻 개발자</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI API를 활용해서 앱에 AI 기능을 추가해보세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CARDS.map(c => (
          <Link key={c.to} to={c.to}
            className={`group block rounded-xl border p-6 hover:shadow-lg transition-all ${c.color}`}>
            <span className="text-3xl mb-3 block">{c.icon}</span>
            <h2 className={`text-lg font-bold mb-1 ${c.textColor}`}>{c.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
