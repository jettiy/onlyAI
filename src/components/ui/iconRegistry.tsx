/**
 * 공용 아이콘 레지스트리 — 문자열 키 → Lucide 컴포넌트
 *
 * 데이터 파일(.ts)은 ReactNode를 담을 수 없으므로 문자열 키를 저장하고,
 * 렌더링 시 이 레지스트리로 실제 아이콘 컴포넌트를 조회한다.
 * (models.ts의 PriceExample.icon, modelStrengths.ts의 useCaseIcons 등)
 *
 * 프로젝트 규칙: 이모티콘 대신 Lucide 아이콘 사용 (DESIGN.md "Do's and Don'ts").
 */
import {
  type LucideIcon,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Briefcase,
  Camera,
  CheckCircle2,
  Circle,
  Clapperboard,
  Code2,
  Coins,
  Compass,
  CreditCard,
  FileText,
  Flame,
  Folder,
  Gauge,
  Globe,
  GraduationCap,
  HardDrive,
  Heart,
  Image,
  Key,
  Landmark,
  Languages,
  Lightbulb,
  Link2,
  Lock,
  Mail,
  Medal,
  MessageSquare,
  Mic,
  Monitor,
  Newspaper,
  PenLine,
  PenTool,
  Play,
  Puzzle,
  Radio,
  Rss,
  Scale,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  Table2,
  Tag,
  Target,
  Terminal,
  Timer,
  Trophy,
  Type,
  Users,
  Video,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  // 데이터/분석
  chart: BarChart3,
  table: Table2,
  trend: BarChart3,
  coins: Coins,
  wallet: Wallet,
  creditcard: CreditCard,
  tag: Tag,
  gauge: Gauge,
  timer: Timer,

  // 콘텐츠
  text: PenLine,
  file: FileText,
  folder: Folder,
  image: Image,
  camera: Camera,
  video: Video,
  mic: Mic,
  play: Play,
  mail: Mail,
  news: Newspaper,
  rss: Rss,
  bell: Bell,

  // 개발/기술
  code: Code2,
  terminal: Terminal,
  server: Server,
  cpu: HardDrive,
  puzzle: Puzzle,
  key: Key,
  lock: Lock,
  shield: ShieldCheck,
  zap: Zap,

  // 목표/성과
  target: Target,
  trophy: Trophy,
  medal: Medal,
  star: Star,
  sparkles: Sparkles,
  flame: Flame,

  // 학습/이해
  book: BookOpen,
  library: GraduationCap,
  compass: Compass,
  lightbulb: Lightbulb,
  scale: Scale,
  languages: Languages,

  // 에이전트/협업
  bot: Bot,
  users: Users,
  workflow: Radio,
  message: MessageSquare,
  link: Link2,

  // 기타 카테고리
  briefcase: Briefcase,
  heart: Heart,
  korean: Landmark,
};

/** useCase 등 도메인 키 → 아이콘 키 매핑 */
export const USE_CASE_ICONS: Record<string, string> = {
  coding: "code",
  image: "image",
  video: "video",
  summary: "table",
  chat: "message",
  writing: "text",
};

/** 레지스트리에서 아이콘 컴포넌트 조회 (없으면 Circle) */
export function getIcon(key?: string | null, fallback: LucideIcon = Circle): LucideIcon {
  if (!key) return fallback;
  return ICON_REGISTRY[key] ?? fallback;
}
