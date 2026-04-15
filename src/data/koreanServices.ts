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
  {
    id: "wrtn",
    name: "뤼튼",
    category: "챗봇",
    desc: "국내 최대 AI 서비스. GPT-4.1·Claude·Gemini 등 다양한 모델을 한 곳에서 무료로 사용.",
    features: ["GPT-4.1 무료", "Claude 무료", "이미지 생성", "AI 에이전트"],
    price: "무료 (프리미엄 플랜 있음)",
    url: "https://wrtn.ai",
    logo: "🇰🇷",
    isFree: true,
  },
  {
    id: "clovax",
    name: "HyperCLOVA X",
    category: "챗봇",
    desc: "네이버 자체 개발 한국어 특화 AI. 네이버 생태계와 연동. 한국 문화·역사 이해 탁월.",
    features: ["한국어 특화", "네이버 연동", "기업용 API", "문서 분석"],
    price: "무료 체험 / 기업 API 별도",
    url: "https://clova.ai/hyperclova",
    logo: "🟢",
  },
  {
    id: "vrew",
    name: "Vrew",
    category: "영상",
    desc: "AI 기반 영상 편집 툴. 자막 자동 생성·번역, AI 보이스 탑재. 유튜버 필수 도구.",
    features: ["자막 자동 생성", "AI 더빙", "영상 번역", "텍스트 기반 편집"],
    price: "무료 (월정액 프리미엄)",
    url: "https://vrew.voyagerx.com",
    logo: "🎬",
    isFree: true,
  },
  {
    id: "typecast",
    name: "타입캐스트",
    category: "음성",
    desc: "AI 음성 합성 및 캐릭터 보이스. 400개 이상의 AI 성우 목소리. 팟캐스트·오디오북 제작에 최적.",
    features: ["400+ AI 목소리", "감정 표현 조절", "다국어 지원", "영상 립싱크"],
    price: "무료 체험 / 월 9,900원~",
    url: "https://typecast.ai",
    logo: "🎙️",
    isFree: true,
  },
  {
    id: "askup",
    name: "AskUp",
    category: "챗봇",
    desc: "카카오톡에서 바로 쓰는 AI 챗봇. 이미지 인식·문서 분석·검색까지. 카카오 사용자에게 최적.",
    features: ["카카오톡 연동", "이미지 인식", "문서 분석", "실시간 검색"],
    price: "무료 (일일 크레딧 제한)",
    url: "https://askup.net",
    logo: "💬",
    isFree: true,
  },
  {
    id: "aislidesmaker",
    name: "감마 (Gamma)",
    category: "문서",
    desc: "AI가 텍스트만 입력하면 자동으로 PPT·웹페이지를 만들어주는 서비스. 한국어 지원.",
    features: ["PPT 자동 생성", "웹페이지 변환", "한국어 지원", "다양한 템플릿"],
    price: "무료 (월 400크레딧) / 프리미엄 $10/월",
    url: "https://gamma.app",
    logo: "📊",
    isFree: true,
  },
  {
    id: "supertone",
    name: "수퍼톤 플레이",
    category: "음성",
    desc: "국내 AI 음성 합성 스타트업 수퍼톤의 서비스. 연예인·캐릭터 목소리 재현 기술 보유.",
    features: ["고품질 음성 합성", "목소리 클로닝", "다국어 변환", "실시간 처리"],
    price: "베타 무료 / 기업 문의",
    url: "https://play.supertone.ai",
    logo: "🎵",
    isNew: true,
    isFree: true,
  },
  {
    id: "kreadio",
    name: "크리에이티오",
    category: "이미지",
    desc: "국내 AI 이미지 생성 플랫폼. 한국 감성에 맞는 스타일 지원. 웹툰·캐릭터 특화.",
    features: ["웹툰 스타일", "캐릭터 생성", "한국어 프롬프트", "상업적 이용 가능"],
    price: "무료 플랜 / 월 9,900원~",
    url: "https://krea.ai",
    logo: "🎨",
    isFree: true,
  },
];

export const CATEGORY_COLORS: Record<KoreanService["category"], { bg: string; text: string; icon: string }> = {
  챗봇: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-600 dark:text-blue-400", icon: "💬" },
  이미지: { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-600 dark:text-purple-400", icon: "🎨" },
  영상: { bg: "bg-red-50 dark:bg-red-950/30", text: "text-red-600 dark:text-red-400", icon: "🎬" },
  문서: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-600 dark:text-amber-400", icon: "📄" },
  코딩: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-600 dark:text-emerald-400", icon: "💻" },
  음성: { bg: "bg-pink-50 dark:bg-pink-950/30", text: "text-pink-600 dark:text-pink-400", icon: "🎙️" },
};
