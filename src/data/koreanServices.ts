export interface KoreanService {
  id: string;
  name: string;
  category: "챗봇" | "이미지" | "영상" | "문서" | "코딩" | "음성";
  desc: string;
  features: string[];
  price: string;
  url: string;
  logo: string;
  isNew?: boolean;
  isFree?: boolean;
}

export const koreanServices: KoreanService[] = [
  // ===== 챗봇 =====
  {
    id: "wrtn",
    name: "뤼튼",
    category: "챗봇",
    desc: "국내 최대 AI 서비스. GPT-4.1·Claude·Gemini 등 다양한 모델을 한 곳에서 무료 사용. 캐릭터 대화(Crack), 인터랙티브 스토리텔링.",
    features: ["GPT-4.1 무료", "Claude·Gemini 무료", "이미지 생성", "AI 에이전트", "캐릭터 대화"],
    price: "무료 (프리미엄 플랜 있음)",
    url: "https://wrtn.ai",
    logo: "🇰🇷",
    isFree: true,
  },
  {
    id: "clovax",
    name: "HyperCLOVA X",
    category: "챗봇",
    desc: "네이버 한국어 특화 AI. SEED 시리즈 오픈소스(0.5B/1.5B/3B/8B) HuggingFace 상위 0.03%. SEED Think 32B 추론 모델. 8B Omni 멀티모달. 기업용 DASH·NeuroCloud.",
    features: ["한국어 특화", "SEED 오픈소스", "추론·멀티모달", "기업용 API", "네이버 연동"],
    price: "무료 체험 / 기업 API 별도",
    url: "https://clova.ai/hyperclova",
    logo: "🟢",
  },
  {
    id: "kanana",
    name: "카나나 (Kanana)",
    category: "챗봇",
    desc: "카카오톡 공식 AI 메이트. '나나'(1:1) + '카나'(단톡). 음성 대화, 이미지 생성, 일정 관리, 검색, 전화 요약. 70% 사용자 유지율. 한국 최초 통합 멀티모달 LLM(Kanana-o).",
    features: ["카카오톡 연동", "음성 대화", "이미지 생성", "일정 관리", "멀티모달 LLM"],
    price: "무료 (카카오톡 내)",
    url: "https://kanana.kakao.com",
    logo: "💛",
    isNew: true,
    isFree: true,
  },
  {
    id: "askup",
    name: "AskUp",
    category: "챗봇",
    desc: "카카오톡 채널 AI. 229만+ 친구. Upsketch 이미지 생성, 문서 분석, 실시간 검색.",
    features: ["카카오톡 연동", "229만+ 친구", "이미지 생성(Upsketch)", "문서 분석"],
    price: "무료 (일일 크레딧)",
    url: "https://askup.net",
    logo: "💬",
    isFree: true,
  },
  {
    id: "exaone",
    name: "EXAONE 4.0 / K-EXAONE",
    category: "챗봇",
    desc: "LG AI Research. 한국 최초 오픈웨이트 하이브리드 AI. K-EXAONE 236B MoE — MS AI 확산보고서 한국 #3. 6개국어 지원. HuggingFace·GitHub 공개.",
    features: ["한국 오픈웨이트 최대", "236B MoE", "6개국어", "추론 모델(EXAONE Deep)"],
    price: "무료 (오픈소스)",
    url: "https://github.com/LG-AI-Research",
    logo: "💜",
    isNew: true,
    isFree: true,
  },

  // ===== 이미지 =====
  {
    id: "flamel",
    name: "플라멜 (Flamel)",
    category: "이미지",
    desc: "Neosapience(수퍼톤 모회사) 국내 AI 이미지 생성. 오픈 베타. 한국 감성 스타일 특화.",
    features: ["한국어 프롬프트", "한국 감성 스타일", "오픈 베타"],
    price: "무료 (베타)",
    url: "https://flamel.ai",
    logo: "🔥",
    isNew: true,
    isFree: true,
  },

  // ===== 영상 =====
  {
    id: "vrew",
    name: "Vrew 3.0",
    category: "영상",
    desc: "AI 영상 편집. 월 결제 10억원 돌파. 3.0에서 AI 이미지 생성, 스크립트 뷰 추가. 자막 자동 생성·번역, AI 더빙.",
    features: ["AI 이미지 생성 추가", "자막 자동 생성", "AI 더빙", "영상 번역"],
    price: "무료 (월정액 프리미엄)",
    url: "https://vrew.voyagerx.com",
    logo: "🎬",
    isFree: true,
  },

  // ===== 문서 =====
  {
    id: "gamma",
    name: "감마 (Gamma)",
    category: "문서",
    desc: "텍스트 입력만으로 PPT·웹페이지 자동 생성. 한국어 지원.",
    features: ["PPT 자동 생성", "웹페이지 변환", "한국어 지원"],
    price: "무료 (월 400크레딧) / $10/월",
    url: "https://gamma.app",
    logo: "📊",
    isFree: true,
  },

  // ===== 음성 =====
  {
    id: "typecast",
    name: "타입캐스트",
    category: "음성",
    desc: "Neosapience AI 음성 합성. 2025년 145억 원 투자 유치. 글로벌 TTS Top 10. 6개국어(한·일·중·베트남 등). 상장 예정.",
    features: ["6개국어", "감정 표현", "400+ 목소리", "영상 립싱크"],
    price: "무료 체험 / 월 9,900원~",
    url: "https://typecast.ai",
    logo: "🎙️",
    isFree: true,
  },
  {
    id: "supertone",
    name: "수퍼톤",
    category: "음성",
    desc: "HYBE 계열. HuggingFace TTS #1. Play(보이스 합성) + Clear(노이즈 제거) + Shift(실시간 변조) + Air(반향). 10초 목소리 클로닝. 한·영·일 지원.",
    features: ["HuggingFace TTS #1", "10초 목소리 클로닝", "노이즈 제거", "실시간 변조"],
    price: "베타 무료 / 기업 문의",
    url: "https://supertone.ai",
    logo: "🎵",
    isNew: true,
    isFree: true,
  },
];

export const CATEGORY_COLORS: Record<KoreanService["category"], { bg: string; text: string; icon: string }> = {
  챗봇: { bg: "bg-brand-50 dark:bg-brand-950/30", text: "text-brand-600 dark:text-brand-400", icon: "💬" },
  이미지: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", icon: "🎨" },
  영상: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", icon: "🎬" },
  문서: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", icon: "📄" },
  코딩: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", icon: "💻" },
  음성: { bg: "bg-pink-50 dark:bg-pink-950/30", text: "text-pink-600 dark:text-pink-400", icon: "🎙️" },
};
