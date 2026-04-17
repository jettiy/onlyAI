import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import { useSEO } from "./hooks/useSEO";

// Lazy-loaded routes for code splitting
import { lazy, Suspense } from "react";

const Explore = lazy(() => import("./pages/explore/Explore").then(m => ({ default: m.default })));
const ExploreTimeline = lazy(() => import("./pages/explore/ExploreTimeline").then(m => ({ default: m.default })));
const ExploreCompare = lazy(() => import("./pages/explore/ExploreCompare").then(m => ({ default: m.default })));
const ExploreGuide = lazy(() => import("./pages/explore/ExploreGuide").then(m => ({ default: m.default })));
const ExploreRanking = lazy(() => import("./pages/explore/ExploreRanking").then(m => ({ default: m.default })));
const ExploreCalculator = lazy(() => import("./pages/explore/ExploreCalculator").then(m => ({ default: m.default })));
const ExploreKoreanBench = lazy(() => import("./pages/explore/ExploreKoreanBench").then(m => ({ default: m.default })));
const ExploreTokenizer = lazy(() => import("./pages/explore/ExploreTokenizer").then(m => ({ default: m.default })));
const ExplorePromptBench = lazy(() => import("./pages/explore/ExplorePromptBench").then(m => ({ default: m.default })));
const ExploreContextWindow = lazy(() => import("./pages/explore/ExploreContextWindow").then(m => ({ default: m.default })));
const PromptsHub = lazy(() => import("./pages/prompts/PromptsHub").then(m => ({ default: m.default })));
const PromptsIntro = lazy(() => import("./pages/prompts/PromptsIntro").then(m => ({ default: m.default })));
const PromptsHow = lazy(() => import("./pages/prompts/PromptsHow").then(m => ({ default: m.default })));
const PromptsLibrary = lazy(() => import("./pages/prompts/PromptsLibrary").then(m => ({ default: m.default })));
const OpenClawHub = lazy(() => import("./pages/openclaw/OpenClawHub").then(m => ({ default: m.default })));
const OpenClawIntroPage = lazy(() => import("./pages/openclaw/OpenClawIntroPage").then(m => ({ default: m.default })));
const OpenClawGuide = lazy(() => import("./pages/openclaw/OpenClawGuide").then(m => ({ default: m.default })));
const SkillTree = lazy(() => import("./pages/openclaw/SkillTree").then(m => ({ default: m.default })));
const DevNews = lazy(() => import("./pages/openclaw/DevNews").then(m => ({ default: m.default })));
const OpenClawInstall = lazy(() => import("./pages/openclaw/OpenClawInstall").then(m => ({ default: m.default })));
const LearnHub = lazy(() => import("./pages/learn/LearnHub").then(m => ({ default: m.default })));
const LearnGlossary = lazy(() => import("./pages/learn/LearnGlossary").then(m => ({ default: m.default })));
const NewsBriefing = lazy(() => import("./pages/NewsBriefing").then(m => ({ default: m.default })));
const LearnSimulator = lazy(() => import("./pages/learn/LearnSimulator").then(m => ({ default: m.default })));
const VideoTimeline = lazy(() => import("./pages/video/VideoTimeline").then(m => ({ default: m.default })));
const VideoCompare = lazy(() => import("./pages/video/VideoCompare").then(m => ({ default: m.default })));
const ImageCompare = lazy(() => import("./pages/image/ImageCompare").then(m => ({ default: m.default })));
const Recommend = lazy(() => import("./pages/Recommend").then(m => ({ default: m.default })));
const PcCheck = lazy(() => import("./pages/PcCheck").then(m => ({ default: m.default })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.default })));

function SEOHandler() {
  useSEO();
  return null;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">로딩 중...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SEOHandler />
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Navigate to="/explore/compare" replace />} />
            <Route path="/explore/timeline" element={<ExploreTimeline />} />
            <Route path="/explore/compare" element={<ExploreCompare />} />
            <Route path="/explore/guide" element={<ExploreGuide />} />
            <Route path="/explore/ranking" element={<ExploreRanking />} />
            <Route path="/explore/calculator" element={<ExploreCalculator />} />
            <Route path="/explore/korean-bench" element={<ExploreKoreanBench />} />
            <Route path="/explore/tokenizer" element={<ExploreTokenizer />} />
            <Route path="/explore/prompt-bench" element={<ExplorePromptBench />} />
            <Route path="/explore/context-window" element={<ExploreContextWindow />} />
            <Route path="/video" element={<Navigate to="/video/compare" replace />} />
            <Route path="/video/timeline" element={<VideoTimeline />} />
            <Route path="/video/compare" element={<VideoCompare />} />
            <Route path="/image" element={<ImageCompare />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/pc-check" element={<PcCheck />} />
            <Route path="/prompts" element={<PromptsHub />} />
            <Route path="/prompts/intro" element={<PromptsIntro />} />
            <Route path="/prompts/how" element={<PromptsHow />} />
            <Route path="/prompts/library" element={<PromptsLibrary />} />
            <Route path="/openclaw" element={<OpenClawHub />} />
            <Route path="/openclaw/intro" element={<OpenClawIntroPage />} />
            <Route path="/openclaw/guide" element={<OpenClawGuide />} />
            <Route path="/openclaw/skills" element={<SkillTree />} />
            <Route path="/openclaw/devnews" element={<DevNews />} />
            <Route path="/openclaw/install" element={<OpenClawInstall />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/glossary" element={<LearnGlossary />} />
            <Route path="/learn/simulator" element={<LearnSimulator />} />
            <Route path="/news" element={<NewsBriefing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
