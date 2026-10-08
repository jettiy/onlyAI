import { BookOpen } from "lucide-react";
import { Link } from 'react-router-dom';

const GUIDES = [
  {
    icon: '',
    title: 'AI 처음이에요',
    desc: 'AI가 뭔지 모르겠다면 여기서 시작하세요. 한국어 AI 서비스도 소개해드려요.',
    to: '/guides/start',
    color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  {
 icon: '',
    title: '프롬프트 작성법',
    desc: 'AI에게 원하는 걸 정확히 전달하는 방법을 배워보세요.',
    to: '/guides/prompts',
    color: 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900',
    textColor: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    icon: '',
    title: '프롬프트 저장소',
    desc: '바로 복사해서 쓸 수 있는 프롬프트 예시 모음.',
    to: '/guides/prompts/library',
    color: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-900',
    textColor: 'text-violet-700 dark:text-violet-300',
  },
  {
    icon: '',
    title: '용어사전',
    desc: 'LLM, 파인튜닝, RAG... 어려운 용어를 쉽게 설명해드려요.',
    to: '/guides/glossary',
    color: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
];

export default function Guides() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white"><BookOpen className="inline-block shrink-0 align-text-bottom" size={16} /> AI 가이드</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">AI 입문부터 실전 활용까지, 단계별로 배워보세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GUIDES.map(g => (
          <Link key={g.to} to={g.to}
            className={`group block rounded-xl border p-6 hover:shadow-lg transition-all ${g.color}`}>
            <span className="text-3xl mb-3 block">{g.icon}</span>
            <h2 className={`text-lg font-bold mb-1 ${g.textColor}`}>{g.title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{g.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
