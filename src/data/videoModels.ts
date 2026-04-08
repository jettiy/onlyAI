export interface VideoModel {
  id: string;
  name: string;
  company: string;
  flag: string;
  logoId?: string;
  releaseDate: string;
  tier: "pro" | "consumer" | "open";
  maxResolution: string;
  maxDuration: string;
  maxFps: string;
  price: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  isNew?: boolean;
}

export const videoModels: VideoModel[] = [
  {
    id: "sora3", name: "Sora 3", company: "OpenAI", flag: "", logoId: "openai",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "4K", maxDuration: "60s", maxFps: "60fps",
    price: "$0.20/초",
    description: "최고 수준의 사실적 비디오 생성. 텍스트에서 고품질 영상 제작. 물리 법칙 준수가 뛰어남.",
    strengths: ["사실감 최고", "물리 시뮬레이션", "일관된 캐릭터"],
    weaknesses: ["생성 시간 김", "가격 비쌈"],
    isNew: true,
  },
  {
    id: "kling2", name: "Kling 2.0", company: "快手(Kuaishou)", flag: "",
    releaseDate: "2025-12", tier: "pro",
    maxResolution: "4K", maxDuration: "120s", maxFps: "60fps",
    price: "무료/유료 하이브리드",
    description: "중국 최고 수준 비디오 AI. 2분 길이 영상 생성 가능. 한국어 프롬프트 지원.",
    strengths: ["긴 영상 생성", "무료 체험", "한국어 지원"],
    weaknesses: ["큐잉 시간 김", "중국어 우선"],
  },
  {
    id: "runway4", name: "Runway Gen-4", company: "Runway", flag: "",
    releaseDate: "2025-06", tier: "pro",
    maxResolution: "4K", maxDuration: "30s", maxFps: "60fps",
    price: "$12/월부터",
    description: "크리에이티브 프로를 위한 비디오 AI. 정교한 제어와 다양한 스타일.",
    strengths: ["스타일 컨트롤", "크리에이티브 도구 풍부", "안정적"],
    weaknesses: ["길이 제한", "구독제"],
  },
  {
    id: "minimax-video", name: "MiniMax Video-01", company: "MiniMax", flag: "", logoId: "minimax",
    releaseDate: "2025-08", tier: "consumer",
    maxResolution: "1080p", maxDuration: "6s", maxFps: "25fps",
    price: "무료",
    description: "SNS 바이럴 대박. Hailuo AI로도 불림. 빠르고 자연스러운 영상 생성.",
    strengths: ["무료", "빠른 생성", "바이럴 강함"],
    weaknesses: ["해상도 제한", "길이 6초만"],
  },
  {
    id: "vidu2", name: "Vidu 2.0", company: "生数科技", flag: "",
    releaseDate: "2026-01", tier: "consumer",
    maxResolution: "4K", maxDuration: "32s", maxFps: "30fps",
    price: "무료/유료",
    description: "중국 오픈소스 비디오 AI. 4K 해상도 지원. 커뮤니티 활성.",
    strengths: ["4K 지원", "오픈소스", "활발한 커뮤니티"],
    weaknesses: ["캐릭터 일관성", "복잡한 움직임"],
    isNew: true,
  },
  {
    id: "pika3", name: "Pika 3.0", company: "Pika Labs", flag: "",
    releaseDate: "2025-10", tier: "consumer",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "24fps",
    price: "무료/유료",
    description: "애니메이션·아트 스타일 특화. 간편한 편집 도구 제공.",
    strengths: ["애니메이션 강점", "편집 도구", "초보자 친화"],
    weaknesses: ["사실감 부족", "길이 제한"],
  },
  {
    id: "stable-video", name: "Stable Video 2", company: "Stability AI", flag: "",
    releaseDate: "2025-09", tier: "open",
    maxResolution: "1080p", maxDuration: "8s", maxFps: "24fps",
    price: "오픈소스",
    description: "오픈소스 비디오 생성. 이미지에서 비디오 변환 특화. 자체 호스팅 가능.",
    strengths: ["오픈소스", "이미지→비디오", "자체 호스팅"],
    weaknesses: ["품질 낮음", "길이 짧음"],
  },
  {
    id: "cogvideox", name: "CogVideoX-5B", company: "智谱AI", flag: "", logoId: "zhipu",
    releaseDate: "2025-07", tier: "open",
    maxResolution: "720p", maxDuration: "6s", maxFps: "16fps",
    price: "오픈소스",
    description: "Zhipu AI 오픈소스 비디오 모델. 한국어 프롬프트 지원. 연구용으로 적합.",
    strengths: ["오픈소스", "한국어 지원", "연구용"],
    weaknesses: ["해상도 낮음", "품질 한계"],
  },
  {
    id: "google-veo3", name: "Veo 3", company: "Google", flag: "", logoId: "google",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "4K", maxDuration: "60s", maxFps: "60fps",
    price: "Google AI Studio",
    description: "구글의 최신 비디오 AI. YouTube Shorts 통합. Gemini 에코시스템 연동.",
    strengths: ["YouTube 통합", "오디오 생성", "긴 영상"],
    weaknesses: ["초기 단계", "제한적 접근"],
    isNew: true,
  },
  {
    id: "hailuo", name: "Hailuo (MiniMax)", company: "MiniMax", flag: "", logoId: "minimax",
    releaseDate: "2025-06", tier: "consumer",
    maxResolution: "1080p", maxDuration: "6s", maxFps: "25fps",
    price: "무료",
    description: "MiniMax의 동영상 생성 서비스. 한국어 프롬프트 가능. SNS 공유 최적화.",
    strengths: ["무료", "한국어 지원", "SNS 최적화"],
    weaknesses: ["6초 제한", "일관성 부족"],
  },
];

export const TIMELINE_EVENTS = [
  { date: "2024-01", title: "Sora 공개", company: "OpenAI", flag: "", logoId: "openai", desc: "OpenAI가 최초로 긴 영상 생성 AI Sora를 공개. 업계에 충격." },
  { date: "2024-03", title: "Stable Video 1.0", company: "Stability AI", flag: "", desc: "오픈소스 비디오 AI 첫 공개." },
  { date: "2024-06", title: "Kling 1.0", company: "快手", flag: "", desc: "중국 최초 고성능 비디오 AI." },
  { date: "2024-07", title: "Runway Gen-3 Alpha", company: "Runway", flag: "", desc: "10초 고해상도 비디오 생성." },
  { date: "2024-09", title: "Pika 1.5", company: "Pika Labs", flag: "", desc: "리피치·인페인팅 기능 추가." },
  { date: "2024-11", title: "Vidu 1.0", company: "生数科技", flag: "", desc: "중국 오픈소스 비디오 AI 등장." },
  { date: "2025-02", title: "Sora 공식 출시", company: "OpenAI", flag: "", logoId: "openai", desc: "ChatGPT 통합으로 일반 사용자에게 공개." },
  { date: "2025-05", title: "CogVideoX", company: "智谱AI", flag: "", logoId: "zhipu", desc: "Zhipu AI 오픈소스 비디오 모델 공개." },
  { date: "2025-06", title: "Runway Gen-4", company: "Runway", flag: "", desc: "4K 60fps 지원, 프로 등급." },
  { date: "2025-06", title: "MiniMax Video", company: "MiniMax", flag: "", logoId: "minimax", desc: "Hailuo AI, SNS 바이럴 대박." },
  { date: "2025-08", title: "Kling 1.6", company: "快手", flag: "", desc: "영어 지원 강화, 2분 영상 테스트." },
  { date: "2025-09", title: "Pika 2.0", company: "Pika Labs", flag: "", desc: "개선된 일관성과 애니메이션 품질." },
  { date: "2025-10", title: "Pika 3.0", company: "Pika Labs", flag: "", desc: "새로운 애니메이션 엔진." },
  { date: "2025-12", title: "Kling 2.0", company: "快手", flag: "", desc: "4K 60fps, 2분 길이 영상 생성." },
  { date: "2026-01", title: "Vidu 2.0", company: "生数科技", flag: "", desc: "4K 지원, 오픈소스 커뮤니티 확대." },
  { date: "2026-02", title: "Sora 3", company: "OpenAI", flag: "", logoId: "openai", desc: "사실적 물리 시뮬레이션, 60초 4K." },
  { date: "2026-03", title: "Google Veo 3", company: "Google", flag: "", logoId: "google", desc: "YouTube 통합, 오디오 생성 포함.", isNew: true },
];
