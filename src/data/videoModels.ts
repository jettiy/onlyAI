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
  deprecated?: boolean;
}

export const videoModels: VideoModel[] = [
  // ===== PRO 티어 =====
  {
    id: "happyhorse-1", name: "HappyHorse 1.0", company: "Alibaba(淘天)", flag: "", logoId: "alibaba",
    releaseDate: "2026-04", tier: "pro",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "30fps",
    price: "오픈소스 예정 (API 계획 중)",
    description: "Artificial Analysis 비디오 Arena #1 (ELO 1,374 T2V, 1,392 I2V). 전 쿠아이쇼우 VP 제작. 블라인드 평가 최고 품질.",
    strengths: ["Arena ELO #1", "블라인드 평가 최고", "오픈소스 예정"],
    weaknesses: ["신모델", "API 미정", "정보 제한적"],
    isNew: true,
  },
  {
    id: "seedance-2.0", name: "Seedance 2.0", company: "ByteDance", flag: "", logoId: "bytedance",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "1080p", maxDuration: "15s (멀티샷 6컷)", maxFps: "30fps",
    price: "$0.022(Fast)/sec ~ $0.22/sec",
    description: "블라인드 크리에이터 테스트 이미지→비디오 #1. 멀티샷 6컷 생성. 시네마틱 카메라 컨트롤. 12개 레퍼런스 입력. 2026 초반 핫 모델.",
    strengths: ["I2V 블라인드 테스트 #1", "멀티샷", "카메라 컨트롤", "12개 레퍼런스"],
    weaknesses: ["Fast 품질 낮음", "해외 접근 제한"],
    isNew: true,
  },
  {
    id: "kling-3.0", name: "Kling 3.0", company: "快手(Kuaishou)", flag: "", logoId: "klingai",
    releaseDate: "2026-02", tier: "pro",
    maxResolution: "4K (네이티브)", maxDuration: "15s (멀티샷 6컷)", maxFps: "30fps",
    price: "$0.075/sec 부터",
    description: "네이티브 4K 출력. AI 디렉터 모드. 캐릭터/소품 일관성. 멀티샷 시퀀싱. Elements 3.0 레퍼런스. 3.0 Omni는 오디오 동시 생성.",
    strengths: ["네이티브 4K", "AI 디렉터", "멀티샷", "오디오(Omni)"],
    weaknesses: ["가격 중간~높음", "생성 시간"],
    isNew: true,
  },
  {
    id: "veo-3.1", name: "Veo 3.1", company: "Google", flag: "", logoId: "google",
    releaseDate: "2026-01", tier: "pro",
    maxResolution: "4K (3840×2160)", maxDuration: "8s+", maxFps: "30fps",
    price: "$0.05(Lite) ~ $0.60(Ultra)/sec",
    description: "Google 최신. 최초 4K 메인스트림 비디오 AI. 네이티브 오디오. 클립 확장+전환. YouTube Shorts 통합. Sora 대비 30~40% 빠름.",
    strengths: ["4K", "네이티브 오디오", "YouTube 통합", "클립 확장", "Vertex AI GA"],
    weaknesses: ["Ultra 가격 높음", "8초 길이"],
    isNew: true,
  },
  {
    id: "runway-gen-4.5", name: "Runway Gen-4.5", company: "Runway", flag: "", logoId: "runway",
    releaseDate: "2025-12", tier: "pro",
    maxResolution: "4K", maxDuration: "10s (4K) / 15s (2K)", maxFps: "24fps",
    price: "$12~$95/월 (API 크레딧 기반)",
    description: "Artificial Analysis #1 평가. 시네마틱 컬러 그레이딩. 정밀 카메라 제어. 멀티모델 플랫폼 (Veo 3.1, Seedance 2.0, Kling 통합).",
    strengths: ["AA 평가 #1", "4K", "멀티모델 플랫폼", "시네마틱"],
    weaknesses: ["프로 구독 필요", "크레딧 복잡"],
    isNew: false,
  },
  {
    id: "luma-ray-3.14", name: "Luma Ray 3.14", company: "Luma", flag: "", logoId: "luma",
    releaseDate: "2026-01", tier: "pro",
    maxResolution: "1080p (HDR EXR)", maxDuration: "10s", maxFps: "24fps",
    price: "$9.99~$94.99/월",
    description: "추론 기반 생성. 업계 최초 HDR 파이프라인(EXR). Ray3 대비 4배 빠름, 3배 저렴. 캐릭터 레퍼런스/키프레임 제어.",
    strengths: ["업계 최초 HDR", "추론 기반", "4배 빠름", "EXR 출력"],
    weaknesses: ["해상도 1080p", "프로 요금 높음"],
    isNew: true,
  },
  {
    id: "skyreels-v4", name: "SkyReels V4", company: "Skywork AI(昆仑万维)", flag: "", logoId: "skywork",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "30fps",
    price: "$7.20/분",
    description: "ELO 1,244 최상위권. 중국 기반 고품질 비디오.",
    strengths: ["높은 ELO", "가성비", "1080p"],
    weaknesses: ["생성 시간", "해외 접근 제한"],
    isNew: true,
  },
  {
    id: "pixverse-v5.6", name: "PixVerse V5.6", company: "PixVerse", flag: "", logoId: "pixverse",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "720p", maxDuration: "5s", maxFps: "24fps",
    price: "$9.00/분",
    description: "ELO 1,227. 창의적 스타일 강점. 텍스트+이미지 입력.",
    strengths: ["높은 ELO", "스타일 다양성", "이미지 입력"],
    weaknesses: ["5초 제한", "720p"],
    isNew: true,
  },

  // ===== CONSUMER 티어 =====
  {
    id: "grok-imagine-video", name: "Grok Imagine Video 1.5", company: "xAI", flag: "", logoId: "xai",
    releaseDate: "2026-01", tier: "consumer",
    maxResolution: "720p", maxDuration: "10s", maxFps: "30fps",
    price: "$3.00~$4.20/분",
    description: "xAI 비디오. Artificial Analysis I2V #1. 가성비 최고. 텍스트+이미지 입력.",
    strengths: ["I2V #1", "가성비 최고", "빠른 생성"],
    weaknesses: ["720p", "기능 제한"],
    isNew: false,
  },
  {
    id: "hailuo-2.3", name: "Hailuo 2.3", company: "MiniMax", flag: "", logoId: "minimax",
    releaseDate: "2025-10", tier: "consumer",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "25fps",
    price: "$1,000 패키지 / ~$0.49/장 (fal.ai)",
    description: "네이티브 오디오. 이전 대비 2.5배 효율. SNS 숏폼 콘텐츠 최적화. 한국어 지원.",
    strengths: ["네이티브 오디오", "2.5배 빠름", "한국어", "가성비"],
    weaknesses: ["25fps", "API 가격 불투명"],
    isNew: false,
  },
  {
    id: "pika-2.2", name: "Pika 2.2", company: "Pika Labs", flag: "", logoId: "pika",
    releaseDate: "2026-04", tier: "consumer",
    maxResolution: "1080p", maxDuration: "10s", maxFps: "24fps",
    price: "$8~$28/월, ~$0.12/sec (API)",
    description: "Pikaframes 키프레임 제어. 1080p + 4K 렌더링. 크리에이티브 이펙트(스왑, 트위스트 등). 립싱크.",
    strengths: ["Pikaframes", "4K 렌더", "크리에이티브 이펙트", "초보자 친화"],
    weaknesses: ["품질 편차", "사실감 부족"],
    isNew: true,
  },
  {
    id: "vidu-q3-pro", name: "Vidu Q3 Pro", company: "生数科技", flag: "", logoId: "vidu",
    releaseDate: "2026-01", tier: "consumer",
    maxResolution: "720p", maxDuration: "8s", maxFps: "24fps",
    price: "$2.10/분",
    description: "ELO 1,225 가성비 모델. 빠르고 저렴한 생성.",
    strengths: ["가성비 최고", "빠른 생성"],
    weaknesses: ["720p", "8초 제한"],
    isNew: false,
  },
  {
    id: "sora-2.0", name: "Sora 2.0", company: "OpenAI", flag: "", logoId: "openai",
    releaseDate: "2026-02", tier: "consumer",
    maxResolution: "1080p", maxDuration: "20s", maxFps: "30fps",
    price: "$20~$200/월 구독",
    description: "🚨 웹/App 2026년 4월 26일 종료. API 9월 24일 종료 예정. 더 이상 사용 권장하지 않음.",
    strengths: ["20초 긴 영상", "오디오 생성"],
    weaknesses: ["🚨 단종 예정", "가격 매우 높음", "생성 시간 김"],
    deprecated: true,
  },

  // ===== OPEN 티어 =====
  {
    id: "ltx-video-2.3", name: "LTX Video 2.3", company: "LTX", flag: "", logoId: "ltx",
    releaseDate: "2026-04", tier: "open",
    maxResolution: "1080p", maxDuration: "30s", maxFps: "24fps",
    price: "$3.60/분 (API), 무료 (자체 호스팅)",
    description: "오픈소스. 30초 긴 영상. 4K 지원. 커뮤니티 활발.",
    strengths: ["30초 영상", "4K", "오픈소스"],
    weaknesses: ["24fps", "품질 한계"],
    isNew: true,
  },
  {
    id: "wan-2.6", name: "Wan 2.6", company: "Alibaba(阿里)", flag: "", logoId: "alibaba",
    releaseDate: "2025-12", tier: "open",
    maxResolution: "1080p", maxDuration: "15s (멀티샷)", maxFps: "24fps",
    price: "$3.00/분 (API), 무료 (Wan 2.2 오픈소스)",
    description: "멀티샷 스토리텔링. 오디오-비디오 싱크. 캐릭터 일관성. Wan 2.2은 MoE 오픈소스.",
    strengths: ["멀티샷", "오디오 싱크", "2.2 오픈소스", "캐릭터 일관성"],
    weaknesses: ["품질 경쟁 중", "24fps"],
    isNew: true,
  },
  {
    id: "wan-2.2-open", name: "Wan 2.2 (Open)", company: "Alibaba(阿里)", flag: "", logoId: "alibaba",
    releaseDate: "2025-08", tier: "open",
    maxResolution: "480p", maxDuration: "5s", maxFps: "16fps",
    price: "무료 (Apache 2.0)",
    description: "MoE 아키텍처 오픈소스. 연구/실험용.",
    strengths: ["Apache 2.0", "MoE", "무료"],
    weaknesses: ["480p", "5초", "품질 낮음"],
    isNew: false,
  },
];

export const TIMELINE_EVENTS = [
  { date: "2024-01", title: "Sora 공개", company: "OpenAI", flag: "", logoId: "openai", desc: "OpenAI가 최초로 긴 영상 생성 AI Sora를 공개." },
  { date: "2024-06", title: "Kling 1.0", company: "快手", flag: "", desc: "중국 최초 고성능 비디오 AI." },
  { date: "2024-07", title: "Runway Gen-3 Alpha", company: "Runway", flag: "", desc: "10초 고해상도 비디오 생성." },
  { date: "2025-02", title: "Sora 공식 출시", company: "OpenAI", flag: "", logoId: "openai", desc: "ChatGPT 통합으로 일반 사용자에게 공개." },
  { date: "2025-06", title: "MiniMax Video", company: "MiniMax", flag: "", logoId: "minimax", desc: "Hailuo AI, SNS 바이럴 대박." },
  { date: "2025-09", title: "Seedance 1.0", company: "ByteDance", flag: "", desc: "바이트댄스 비디오 AI 첫 공개." },
  { date: "2025-11", title: "Pika 2.0", company: "Pika Labs", flag: "", desc: "개선된 일관성과 애니메이션 품질." },
  { date: "2025-12", title: "Kling 2.0", company: "快手", flag: "", desc: "4K 60fps, 2분 길이 영상 생성." },
  { date: "2025-12", title: "Runway Gen-4.5", company: "Runway", flag: "", desc: "AA 평가 #1. 시네마틱 4K." },
  { date: "2026-01", title: "Veo 3.1", company: "Google", flag: "", logoId: "google", desc: "최초 4K 메인스트림 비디오 AI. 오디오 내장." },
  { date: "2026-01", title: "Luma Ray 3.14", company: "Luma", flag: "", desc: "업계 최초 HDR 파이프라인. 4배 빠름." },
  { date: "2026-02", title: "Seedance 2.0", company: "ByteDance", flag: "", desc: "I2V 블라인드 테스트 #1. 멀티샷." },
  { date: "2026-02", title: "Kling 3.0", company: "快手", flag: "", desc: "네이티브 4K. AI 디렉터 모드." },
  { date: "2026-03", title: "PixVerse V5.6 / SkyReels V4", company: "PixVerse / Skywork", flag: "", desc: "중국 상위권 비디오 AI 신모델." },
  { date: "2026-04", title: "HappyHorse 1.0", company: "Alibaba", flag: "", logoId: "alibaba", desc: "Arena ELO #1. 오픈소스 예정.", isNew: true },
  { date: "2026-04", title: "Sora 웹 종료", company: "OpenAI", flag: "", logoId: "openai", desc: "🚨 웹/App 4/26 종료. API 9/24 종료 예정." },
  { date: "2026-04", title: "Pika 2.2", company: "Pika Labs", flag: "", desc: "1080p, Pikaframes 키프레임 제어." },
  { date: "2026-04", title: "LTX Video 2.3", company: "LTX", flag: "", desc: "30초 영상, 4K 지원 오픈소스." },
];
