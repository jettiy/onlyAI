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
    id: "seedance-2.0", name: "Seedance 2.0", company: "ByteDance", flag: "",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "30fps",
    price: "API 미제공",
    description: "바이트댄스 최고의 비디오 AI. artificialanalysis.ai ELO 1,273으로 현재 최고 품질. 정교한 모션 컨트롤과 일관성.",
    strengths: ["최고 ELO 점수", "모션 정밀도", "일관성 뛰어남"],
    weaknesses: ["API 미제공", "가격 정보 없음", "접근성 제한"],
    isNew: true,
  },
  {
    id: "skyreels-v4", name: "SkyReels V4", company: "Skywork AI(昆仑万维)", flag: "",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "30fps",
    price: "$7.20/분",
    description: "ELO 1,244로 최상위권. 중국 기반 고품질 비디오 생성. 가성비 프로 등급.",
    strengths: ["높은 ELO", "가성비 좋음", "1080p 지원"],
    weaknesses: ["생성 시간", "해외 접근 제한 가능"],
    isNew: true,
  },
  {
    id: "kling-3.0", name: "Kling 3.0", company: "快手(Kuaishou)", flag: "",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "1080p", maxDuration: "15s", maxFps: "30fps",
    price: "$13.44/분",
    description: "ELO 1,243의 최상위 비디오 AI. 1080p 15초 생성. 중국 최고 수준의 품질과 안정성.",
    strengths: ["최상위 ELO", "15초 길이", "안정적 품질"],
    weaknesses: ["가격 높음", "생성 시간 김"],
    isNew: true,
  },
  {
    id: "grok-imagine-video", name: "Grok Imagine Video", company: "xAI", flag: "", logoId: "xai",
    releaseDate: "2026-01", tier: "pro",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "30fps",
    price: "$3.00/분",
    description: "xAI의 비디오 생성 모델. ELO 1,231으로 가성비 최고 수준. 텍스트+이미지 입력 지원.",
    strengths: ["가성비 최고", "이미지 입력 지원", "빠른 생성"],
    weaknesses: ["초기 단계", "기능 제한"],
    isNew: true,
  },
  {
    id: "kling-3.0-omni", name: "Kling 3.0 Omni", company: "快手(Kuaishou)", flag: "",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "1080p", maxDuration: "15s", maxFps: "30fps",
    price: "$13.44/분",
    description: "Kling 3.0에 오디오 생성 포함. ELO 1,230. 비디오와 음성을 동시에 생성하는 멀티모달 AI.",
    strengths: ["오디오 동시 생성", "멀티모달", "15초 길이"],
    weaknesses: ["가격 높음", "오디오 품질 검증 필요"],
    isNew: true,
  },
  {
    id: "pixverse-v5.6", name: "PixVerse V5.6", company: "PixVerse", flag: "",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "720p", maxDuration: "5s", maxFps: "24fps",
    price: "$9.00/분",
    description: "ELO 1,227의 고품질 비디오 AI. 텍스트와 이미지 입력 모두 지원. 창의적 스타일에 강점.",
    strengths: ["높은 ELO", "스타일 다양성", "이미지 입력"],
    weaknesses: ["5초 길이 제한", "720p 해상도"],
    isNew: true,
  },
  {
    id: "vidu-q3-pro", name: "Vidu Q3 Pro", company: "生数科技", flag: "",
    releaseDate: "2026-01", tier: "consumer",
    maxResolution: "720p", maxDuration: "8s", maxFps: "24fps",
    price: "$2.10/분",
    description: "ELO 1,225의 가성비 비디오 AI. 중국 오픈소스 기반. 빠르고 저렴한 생성.",
    strengths: ["가성비 최고", "빠른 생성", "오픈소스 기반"],
    weaknesses: ["720p 해상도", "8초 길이 제한"],
    isNew: true,
  },
  {
    id: "sora-2.0", name: "Sora 2.0", company: "OpenAI", flag: "", logoId: "openai",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "1080p", maxDuration: "20s", maxFps: "30fps",
    price: "$42.00/분",
    description: "OpenAI 비디오 AI. 곧 중단 예정. 1080p 20초 생성. Pro 등급 $42/분으로 가장 비쌈.",
    strengths: ["20초 긴 영상", "1080p", "OpenAI 생태계"],
    weaknesses: ["곧 중단 예정", "가격 매우 높음", "생성 시간 김"],
  },
  {
    id: "veo-3.1", name: "Veo 3.1", company: "Google", flag: "", logoId: "google",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "1080p", maxDuration: "8s", maxFps: "30fps",
    price: "$24.00/분",
    description: "Google 최신 비디오 AI. 4K 지원. YouTube Shorts 통합. Gemini 에코시스템 연동.",
    strengths: ["4K 지원", "YouTube 통합", "Google 생태계"],
    weaknesses: ["가격 높음", "8초 길이", "Preview 상태"],
    isNew: true,
  },
  {
    id: "hailuo-2.3", name: "Hailuo 2.3", company: "MiniMax", flag: "", logoId: "minimax",
    releaseDate: "2025-10", tier: "consumer",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "25fps",
    price: "$3.30/분",
    description: "MiniMax의 비디오 생성 AI. SNS 바이럴로 유명. 한국어 프롬프트 지원. 가성비 뛰어남.",
    strengths: ["가성비 최고", "한국어 지원", "SNS 공유 최적화"],
    weaknesses: ["10초 길이 제한", "25fps"],
  },
  {
    id: "runway-gen-4.5", name: "Runway Gen-4.5", company: "Runway", flag: "",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "720p", maxDuration: "10s", maxFps: "24fps",
    price: "$15.00/분",
    description: "Runway 최신 세대. 크리에이티브 프로를 위한 정교한 컨트롤. 다양한 스타일 지원.",
    strengths: ["크리에이티브 도구", "정교한 제어", "스타일 다양성"],
    weaknesses: ["720p 해상도", "가격 높음", "10초 제한"],
    isNew: true,
  },
  {
    id: "luma-ray-3.14", name: "Luma Ray 3.14", company: "Luma", flag: "",
    releaseDate: "2026-01", tier: "consumer",
    maxResolution: "1080p", maxDuration: "18s", maxFps: "24fps",
    price: "$3.00/분",
    description: "Luma의 최신 비디오 AI. 18초 긴 영상 생성. 1080p 해상도 지원. 가성비 최고 수준.",
    strengths: ["18초 긴 영상", "1080p", "가성비 최고"],
    weaknesses: ["24fps", "품질 편차"],
    isNew: true,
  },
  {
    id: "pika-2.5", name: "Pika 2.5", company: "Pika Labs", flag: "",
    releaseDate: "2025-11", tier: "consumer",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "24fps",
    price: "$5.76/분",
    description: "애니메이션·아트 스타일 특화. 간편한 편집 도구 제공. 초보자 친화적 인터페이스.",
    strengths: ["애니메이션 강점", "편집 도구", "초보자 친화"],
    weaknesses: ["사실감 부족", "10초 제한"],
  },
  {
    id: "ltx-video-2.3", name: "LTX Video 2.3", company: "LTX", flag: "",
    releaseDate: "2026-04", tier: "open",
    maxResolution: "1080p", maxDuration: "30s", maxFps: "24fps",
    price: "$3.60/분",
    description: "오픈소스 비디오 AI. 30초 긴 영상 생성 가능. 4K 지원. 커뮤니티 활발.",
    strengths: ["30초 긴 영상", "4K 지원", "오픈소스"],
    weaknesses: ["24fps", "품질 한계"],
    isNew: true,
  },
  {
    id: "wan-2.7", name: "Wan 2.7", company: "Alibaba(阿里)", flag: "", logoId: "alibaba",
    releaseDate: "2026-01", tier: "open",
    maxResolution: "480p", maxDuration: "5s", maxFps: "24fps",
    price: "$3.00/분",
    description: "Alibaba 오픈소스 비디오 모델. 2.7이 최신 버전. 저해상도지만 가격 저렴. 연구/실험 용도.",
    strengths: ["오픈소스", "가격 저렴", "빠른 생성"],
    weaknesses: ["480p 해상도", "5초 길이", "품질 낮음"],
    isNew: true,
  },
];

export const TIMELINE_EVENTS = [
  { date: "2024-01", title: "Sora 공개", company: "OpenAI", flag: "", logoId: "openai", desc: "OpenAI가 최초로 긴 영상 생성 AI Sora를 공개. 업계에 충격." },
  { date: "2024-06", title: "Kling 1.0", company: "快手", flag: "", desc: "중국 최초 고성능 비디오 AI." },
  { date: "2024-07", title: "Runway Gen-3 Alpha", company: "Runway", flag: "", desc: "10초 고해상도 비디오 생성." },
  { date: "2024-11", title: "Vidu 1.0", company: "生数科技", flag: "", desc: "중국 오픈소스 비디오 AI 등장." },
  { date: "2025-02", title: "Sora 공식 출시", company: "OpenAI", flag: "", logoId: "openai", desc: "ChatGPT 통합으로 일반 사용자에게 공개." },
  { date: "2025-06", title: "MiniMax Video", company: "MiniMax", flag: "", logoId: "minimax", desc: "Hailuo AI, SNS 바이럴 대박." },
  { date: "2025-06", title: "Runway Gen-4", company: "Runway", flag: "", desc: "프로 등급 비디오 생성." },
  { date: "2025-09", title: "Seedance 1.0", company: "ByteDance", flag: "", desc: "바이트댄스 비디오 AI 첫 공개." },
  { date: "2025-10", title: "Pika 2.0", company: "Pika Labs", flag: "", desc: "개선된 일관성과 애니메이션 품질." },
  { date: "2025-11", title: "Pika 2.5", company: "Pika Labs", flag: "", desc: "1080p 지원, 향상된 애니메이션." },
  { date: "2025-12", title: "Kling 2.0", company: "快手", flag: "", desc: "4K 60fps, 2분 길이 영상 생성." },
  { date: "2026-01", title: "Vidu Q3 Pro", company: "生数科技", flag: "", desc: "가성비 720p 비디오 AI 출시.", isNew: true },
  { date: "2026-01", title: "Grok Imagine Video", company: "xAI", flag: "", logoId: "xai", desc: "xAI 비디오 생성 AI. $3/분 가성비.", isNew: true },
  { date: "2026-01", title: "Luma Ray 3.14", company: "Luma", flag: "", desc: "18초 긴 영상, 1080p $3/분.", isNew: true },
  { date: "2026-02", title: "Sora 2.0 공식 출시", company: "OpenAI", flag: "", logoId: "openai", desc: "1080p 20초. 곧 중단 예정." },
  { date: "2026-02", title: "Kling 3.0", company: "快手", flag: "", desc: "ELO 1,243 최상위. 1080p 15초." },
  { date: "2026-02", title: "Kling 3.0 Omni", company: "快手", flag: "", desc: "오디오 생성 포함 멀티모달 비디오 AI." },
  { date: "2026-02", title: "Runway Gen-4.5", company: "Runway", flag: "", desc: "크리에이티브 프로용 최신 세대." },
  { date: "2026-03", title: "Seedance 2.0", company: "ByteDance", flag: "", desc: "ELO 1,273 최고 품질. API 미제공.", isNew: true },
  { date: "2026-03", title: "Veo 3.1", company: "Google", flag: "", logoId: "google", desc: "4K 지원, YouTube 통합.", isNew: true },
  { date: "2026-03", title: "PixVerse V5.6", company: "PixVerse", flag: "", desc: "ELO 1,227, 창의적 스타일 강점.", isNew: true },
  { date: "2026-03", title: "SkyReels V4", company: "Skywork AI", flag: "", desc: "ELO 1,244, 가성비 프로 등급.", isNew: true },
  { date: "2026-04", title: "LTX Video 2.3", company: "LTX", flag: "", desc: "30초 영상, 4K 지원 오픈소스.", isNew: true },
];
