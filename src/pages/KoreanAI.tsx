import { useState } from "react";
import type { LucideIcon } from 'lucide-react';
import {
  Bot, MessageCircle, Film, Mic,
  BookOpen, ScanEye, Smile, Search,
  Building, Sun, Sparkles, Globe,
  CheckCircle2,
} from 'lucide-react';

interface KoreanService {
  id: string;
  name: string;
  category: string;
  icon: LucideIcon;
  color: string;
  accent: string;
  bar: string;
  desc: string;
  features: string[];
  price: string;
  isFree: boolean;
  isNew: boolean;
  url: string;
  why: string;
}

const KOREAN_SERVICES: KoreanService[] = [
  {
    id: "wrtn", name: "뤼튼", category: "챗봇", icon: Bot,
    color: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800",
    accent: "text-purple-600 dark:text-purple-400",
    bar: "bg-purple-500",
    desc: "국내 최대 AI 플랫폼. GPT-4.1·Claude·Gemini를 한 곳에서 무료 사용. 가입 즉시 이용 가능.",
    features: ["GPT-4.1 무료", "Claude 무료", "AI 이미지 생성", "AI 에이전트"],
    price: "기본 무료", isFree: true, isNew: false,
    url: "https://wrtn.ai",
    why: "처음 AI를 시작한다면 뤼튼부터",
  },
  {
    id: "clovax", name: "HyperCLOVA X", category: "챗봇", icon: MessageCircle,
    color: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    accent: "text-green-600 dark:text-green-400",
    bar: "bg-green-500",
    desc: "네이버가 만든 한국어 특화 AI. 한국 문화·법률·역사 이해도 최고. 네이버 검색·쇼핑 연동.",
    features: ["한국어 특화", "네이버 생태계 연동", "기업 API 제공", "문서 분석"],
    price: "무료 체험 / 기업 별도", isFree: false, isNew: false,
    url: "https://clova.ai",
    why: "한국 맥락 이해가 필요한 업무에",
  },
  {
    id: "vrew", name: "Vrew", category: "영상", icon: Film,
    color: "bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800",
    accent: "text-brand-600 dark:text-brand-400",
    bar: "bg-brand-500",
    desc: "유튜버·크리에이터 필수 도구. AI로 자막 자동 생성, 번역, AI 더빙까지. 국내 영상 편집 1위.",
    features: ["자막 자동 생성", "AI 더빙·보이스", "영상 번역 (40개 언어)", "텍스트 기반 편집"],
    price: "기본 무료 / 프리미엄 월 9,900원~", isFree: true, isNew: false,
    url: "https://vrew.voyagerx.com",
    why: "영상 콘텐츠 제작자 필수",
  },
  {
    id: "typecast", name: "타입캐스트", category: "음성", icon: Mic,
    color: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800",
    accent: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
    desc: "AI 목소리·캐릭터로 영상 제작. 300개 이상의 한국어 AI 보이스. 드라마·유튜브 활용.",
    features: ["300+ 한국어 AI 보이스", "AI 캐릭터 영상", "감정 표현 조절", "비디오 수출"],
    price: "무료 플랜 있음 / 유료 월 11,000원~", isFree: true, isNew: false,
    url: "https://typecast.ai",
    why: "한국어 AI 음성·나레이션 제작에",
  },
  {
    id: "qanda", name: "콴다 (QANDA)", category: "교육", icon: BookOpen,
    color: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800",
    accent: "text-teal-600 dark:text-teal-400",
    bar: "bg-teal-500",
    desc: "AI 수학 풀이·학습 도우미. 사진 찍으면 풀이 과정 설명. 누적 사용자 1억 명 돌파.",
    features: ["사진으로 문제 풀기", "단계별 풀이 설명", "AI 튜터", "커리큘럼 맞춤"],
    price: "기본 무료 / 프리미엄", isFree: true, isNew: false,
    url: "https://qanda.ai",
    why: "수학·과학 학습에 최적",
  },
  {
    id: "gauss", name: "삼성 가우스", category: "기업", icon: ScanEye,
    color: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
    accent: "text-sky-600 dark:text-sky-400",
    bar: "bg-sky-500",
    desc: "삼성전자 자체 개발 AI. Galaxy 기기 내장. 실시간 통역·문서 요약·이메일 작성 지원.",
    features: ["Galaxy 기기 내장", "실시간 통역", "문서 요약", "개인정보 보호"],
    price: "Galaxy 기기 탑재 (무료)", isFree: true, isNew: false,
    url: "https://research.samsung.com/artificial-intelligence",
    why: "Galaxy 사용자라면 이미 탑재되어 있어요",
  },
  {
    id: "kakao", name: "카카오 AI", category: "챗봇", icon: Smile,
    color: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
    accent: "text-yellow-600 dark:text-yellow-500",
    bar: "bg-yellow-400",
    desc: "카카오톡 기반 AI 어시스턴트. 카카오 생태계(톡, 맵, 쇼핑)와 깊은 연동. 일상 대화에 최적.",
    features: ["카카오톡 연동", "카카오맵 연동", "쇼핑 추천", "일정 관리"],
    price: "무료 (카카오톡 내)", isFree: true, isNew: false,
    url: "https://kakao.com",
    why: "카카오 생태계를 적극 활용하는 분들에게",
  },
  {
    id: "naver-cue", name: "CUE:", category: "검색", icon: Search,
    color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    accent: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    desc: "네이버 AI 검색. 복잡한 질문도 대화형으로 답변. 최신 뉴스·쇼핑·지식iN 연동 검색.",
    features: ["대화형 검색", "실시간 정보 연동", "지식iN 통합", "쇼핑 비교"],
    price: "무료 (네이버 내)", isFree: true, isNew: false,
    url: "https://naver.com",
    why: "네이버 검색 파워유저에게 최적",
  },
  {
    id: "hiai", name: "LG AI 연구원", category: "기업", icon: Building,
    color: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    accent: "text-red-600 dark:text-red-400",
    bar: "bg-red-500",
    desc: "LG가 개발한 멀티모달 AI EXAONE. 산업·제조·연구 특화. 오픈소스 버전도 공개.",
    features: ["멀티모달 AI", "산업 특화", "EXAONE 오픈소스", "기업 맞춤형"],
    price: "기업 문의 / 오픈소스 무료", isFree: false, isNew: true,
    url: "https://www.lgresearch.ai",
    why: "제조·연구 분야 기업 솔루션으로",
  },
  {
    id: "upstage", name: "Upstage Solar", category: "기업", icon: Sun,
    color: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800",
    accent: "text-orange-600 dark:text-orange-400",
    bar: "bg-orange-500",
    desc: "카카오 출신 AI 스타트업. Solar 모델은 허깅페이스 오픈소스 성능 1위 달성. 문서 AI 특화.",
    features: ["Solar 오픈소스", "문서 AI", "OCR·파싱", "한국어 특화 API"],
    price: "API 유료 / 오픈소스 무료", isFree: false, isNew: false,
    url: "https://upstage.ai",
    why: "문서 처리·RAG 구축에 최적",
  },
];

const CATEGORIES = ["전체", "챗봇", "영상", "음성", "교육", "검색", "기업"];

export default function KoreanAI() {
  const [catFilter, setCatFilter] = useState("전체");
  const [freeOnly, setFreeOnly] = useState(false);

  const filtered = KOREAN_SERVICES.filter((s) => {
    if (catFilter !== "전체" && s.category !== catFilter) return false;
    if (freeOnly && !s.isFree) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          <Globe className="w-6 h-6 inline-block mr-2 text-brand-500" />
          국내 AI 서비스
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          한국에서 만들거나 한국어에 최적화된 AI 서비스 모음
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-gray-900 dark:text-white">{KOREAN_SERVICES.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">총 서비스</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-emerald-600">{KOREAN_SERVICES.filter(s => s.isFree).length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">무료 이용 가능</div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 text-center">
          <div className="text-2xl font-black text-brand-600">{KOREAN_SERVICES.filter(s => s.isNew).length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">신규 등록</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap items-center">
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={"px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (
              catFilter === c
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400"
            )}>
            {c}
          </button>
        ))}
        <button
          onClick={() => setFreeOnly(!freeOnly)}
          className={"ml-auto px-3 py-1.5 rounded-full text-xs font-medium border transition-colors " + (
            freeOnly
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-200"
          )}>
          <CheckCircle2 className="w-3 h-3 inline-block mr-1" />
          무료만 보기
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">조건에 맞는 서비스가 없어요.</div>
      )}

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
        가격 및 기능 정보는 변경될 수 있어요 · 마지막 업데이트: 2026-03-20
      </p>
    </div>
  );
}

function ServiceCard({ service }: { service: KoreanService }) {
  const Icon = service.icon;
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block rounded-xl border p-4 relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${service.color}`}
    >
      {/* Top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${service.bar}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-white/60 dark:bg-gray-800/50 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${service.accent}`} />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{service.name}</h3>
              {service.isNew && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-500 text-white rounded-full">NEW</span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${service.accent}`}>{service.category}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {service.isFree && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full">
              무료
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{service.desc}</p>

      {/* Why use it */}
      <div className={`text-[10px] font-semibold mb-2 ${service.accent}`}>
        <Sparkles className="w-3 h-3 inline-block mr-0.5 -mt-0.5" />
        {service.why}
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1 mb-2">
        {service.features.map((f) => (
          <span key={f} className="text-[10px] px-2 py-0.5 bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 rounded-full border border-gray-200/50 dark:border-gray-700/50">
            {f}
          </span>
        ))}
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
        <span className="text-[10px] text-gray-500 dark:text-gray-500">{service.price}</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
          바로가기 →
        </span>
      </div>
    </a>
  );
}
