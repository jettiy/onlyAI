export interface ImageModel {
  id: string;
  name: string;
  company: string;
  flag: string;
  logoId?: string;
  releaseDate: string;
  tier: "pro" | "consumer" | "open";
  maxResolution: string;
  quality: string;
  price: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  isNew?: boolean;
}

export const imageModels: ImageModel[] = [
  {
    id: "nano-banana-pro", name: "Nano Banana Pro", company: "fal", flag: "", logoId: "fal",
    releaseDate: "2025-12", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.15/장",
    description: "fal.ai 최고 품질 이미지 모델. 프리미엄 등급으로 섬세한 디테일과 뛰어난 색감 재현.",
    strengths: ["최고 품질", "디테일 뛰어남", "색감 정확"],
    weaknesses: ["가격 높음", "생성 속도"],
    isNew: true,
  },
  {
    id: "gpt-image-1.5", name: "GPT Image 1.5", company: "OpenAI", flag: "", logoId: "openai",
    releaseDate: "2026-03", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.035~$0.531/장",
    description: "OpenAI 최신 이미지 생성 모델. High/Medium/Low 3단계 품질. 텍스트 렌더링에 강점.",
    strengths: ["텍스트 렌더링", "3단계 품질 선택", "OpenAI 생태계"],
    weaknesses: ["High 모드 가격 높음", "해상도 제한"],
    isNew: true,
  },
  {
    id: "grok-imagine-pro", name: "Grok Imagine Pro", company: "xAI", flag: "", logoId: "xai",
    releaseDate: "2025-01", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.07/장",
    description: "xAI 프리미엄 이미지 생성. Grok 생태계 통합. 고품질 사진과 아트 스타일.",
    strengths: ["품질 뛰어남", "가성비 좋음", "빠른 생성"],
    weaknesses: ["초기 단계", "스타일 제한"],
  },
  {
    id: "seedream-5.0-lite", name: "Seedream 5.0 Lite", company: "ByteDance", flag: "", logoId: "bytedance",
    releaseDate: "2026-01", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.04/장",
    description: "바이트댄스 이미지 AI. Seedream 4.5 기반 최신 5.0 Lite. 정교한 이미지 생성.",
    strengths: ["정교한 품질", "가격 저렴", "빠른 생성"],
    weaknesses: ["해외 접근 제한", "한국어 지원 확인 필요"],
    isNew: true,
  },
  {
    id: "imagen-4-ultra", name: "Imagen 4", company: "Google", flag: "", logoId: "google",
    releaseDate: "2025-05", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.04~$0.06/장",
    description: "Google 최신 이미지 생성 AI. Standard/Ultra 등급. Gemini 에코시스템 연동.",
    strengths: ["Google 생태계", "안정적 품질", "다양한 포맷"],
    weaknesses: ["Preview 상태", "해상도 제한"],
  },
  {
    id: "flux-2-pro", name: "Flux 2", company: "Black Forest Labs", flag: "", logoId: "bfl",
    releaseDate: "2025-11", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.03~$0.06/장",
    description: "Black Forest Labs의 최신 이미지 모델. Pro/Flex/Klein 3단계. 오픈소스 생태계 기반.",
    strengths: ["3단계 모델", "오픈소스 기반", "가성비 다양"],
    weaknesses: ["Pro 품질 검증 중", "초기 버전"],
    isNew: true,
  },
  {
    id: "recraft-v4", name: "Recraft V4", company: "Recraft", flag: "", logoId: "recraft",
    releaseDate: "2025-01", tier: "pro",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.04~$0.08/장",
    description: "디자이너 특화 이미지 AI. Raster/Vector 출력 지원. SVG 벡터 생성 가능.",
    strengths: ["Vector 출력", "디자인 특화", "정밀한 제어"],
    weaknesses: ["전문가용", "가격 편차"],
  },
  {
    id: "ideogram-v3", name: "Ideogram V3", company: "Ideogram", flag: "", logoId: "ideogram",
    releaseDate: "2025-06", tier: "consumer",
    maxResolution: "1024×1024", quality: "high",
    price: "$0.008~$0.016/장",
    description: "텍스트 렌더링에 특화된 이미지 AI. 가장 저렴한 가격. Turbo 모드 지원.",
    strengths: ["가격 최저", "텍스트 렌더링 강점", "Turbo 모드"],
    weaknesses: ["품질 한계", "스타일 제한"],
  },
  {
    id: "nano-banana-2", name: "Nano Banana 2", company: "fal", flag: "", logoId: "fal",
    releaseDate: "2025-12", tier: "consumer",
    maxResolution: "1024×1024", quality: "medium",
    price: "$0.04/장",
    description: "fal.ai 이미지 생성 모델. Pro 대비 저렴하지만 준수한 품질. 일반 용도에 적합.",
    strengths: ["가격 적절", "안정적 품질", "빠른 생성"],
    weaknesses: ["Pro 대비 품질 낮음", "디테일 부족"],
    isNew: true,
  },
  {
    id: "grok-imagine", name: "Grok Imagine", company: "xAI", flag: "", logoId: "xai",
    releaseDate: "2025-01", tier: "consumer",
    maxResolution: "1024×1024", quality: "medium",
    price: "$0.02/장",
    description: "xAI 표준 이미지 생성. 가장 저렴한 모델 중 하나. 일반 용도에 충분한 품질.",
    strengths: ["가격 최저 수준", "빠른 생성", "Grok 통합"],
    weaknesses: ["Standard 품질", "디테일 한계"],
  },
  {
    id: "z-image", name: "Z-Image", company: "Zhipu AI(智谱AI)", flag: "", logoId: "zhipu",
    releaseDate: "2025-06", tier: "consumer",
    maxResolution: "1024×1024", quality: "medium",
    price: "정보 없음",
    description: "Zhipu AI의 이미지 생성 모델. 한국어 프롬프트 지원. 중국 기반 품질.",
    strengths: ["한국어 지원", "중국어 최적화", "Zhipu 생태계"],
    weaknesses: ["가격 정보 없음", "해외 접근 제한"],
    isNew: true,
  },
  {
    id: "reve", name: "Reve", company: "Reve", flag: "",
    releaseDate: "2026-01", tier: "consumer",
    maxResolution: "1024×1024", quality: "medium",
    price: "정보 없음",
    description: "새로운 이미지 생성 AI. 독자적인 아트 스타일과 스타일 트랜스퍼 기능.",
    strengths: ["독자적 스타일", "스타일 트랜스퍼", "새로운 접근"],
    weaknesses: ["정보 부족", "검증 필요"],
    isNew: true,
  },
  {
    id: "dall-e-3", name: "DALL-E 3", company: "OpenAI", flag: "", logoId: "openai",
    releaseDate: "2023-10", tier: "consumer",
    maxResolution: "1792×1024", quality: "medium",
    price: "$0.04~$0.12/장",
    description: "OpenAI의 범용 이미지 생성 모델. HD 등급 지원. 넓은 해상도 선택지.",
    strengths: ["넓은 해상도", "ChatGPT 통합", "안정적"],
    weaknesses: ["구형 모델", "최신 모델 대비 품질 낮음"],
  },
  {
    id: "sd-3.5", name: "SD 3.5", company: "Stability AI", flag: "", logoId: "stability",
    releaseDate: "2024-10", tier: "open",
    maxResolution: "1024×1024", quality: "medium",
    price: "$0.065/장",
    description: "Stability AI 오픈소스 이미지 모델. 자체 호스팅 가능. 커뮤니티 확장 모듈 풍부.",
    strengths: ["오픈소스", "자체 호스팅", "커뮤니티 확장"],
    weaknesses: ["품질 한계", "설정 복잡", "가격 비쌈"],
  },
];
