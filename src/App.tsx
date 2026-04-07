import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";

// Lazy-loaded routes for code splitting
import { lazy, Suspense } from "react";

const Explore = lazy(() => import("./pages/explore/Explore").then(m => ({ default: m.default })));
const ExploreTimeline = lazy(() => import("./pages/explore/ExploreTimeline").then(m => ({ default: m.default })));
const ExploreCompare = lazy(() => import("./pages/explore/ExploreCompare").then(m => ({ default: m.default })));
const ExplorePromo = lazy(() => import("./pages/explore/ExplorePromo").then(m => ({ default: m.default })));
const ExploreGuide = lazy(() => import("./pages/explore/ExploreGuide").then(m => ({ default: m.default })));
const PromptsHub = lazy(() => import("./pages/prompts/PromptsHub").then(m => ({ default: m.default })));
const PromptsIntro = lazy(() => import("./pages/prompts/PromptsIntro").then(m => ({ default: m.default })));
const PromptsHow = lazy(() => import("./pages/prompts/PromptsHow").then(m => ({ default: m.default })));
const PromptsLibrary = lazy(() => import("./pages/prompts/PromptsLibrary").then(m => ({ default: m.default })));
const OpenClawHub = lazy(() => import("./pages/openclaw/OpenClawHub").then(m => ({ default: m.default })));
const OpenClawIntroPage = lazy(() => import("./pages/openclaw/OpenClawIntroPage").then(m => ({ default: m.default })));
const OpenClawGuide = lazy(() => import("./pages/openclaw/OpenClawGuide").then(m => ({ default: m.default })));
const SkillTree = lazy(() => import("./pages/openclaw/SkillTree").then(m => ({ default: m.default })));
const DevNews = lazy(() => import("./pages/openclaw/DevNews").then(m => ({ default: m.default })));
const LearnHub = lazy(() => import("./pages/learn/LearnHub").then(m => ({ default: m.default })));
const LearnGlossary = lazy(() => import("./pages/learn/LearnGlossary").then(m => ({ default: m.default })));
const NewsBriefing = lazy(() => import("./pages/NewsBriefing").then(m => ({ default: m.default })));
const LearnSimulator = lazy(() => import("./pages/learn/LearnSimulator").then(m => ({ default: m.default })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">로딩 중...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/explore/timeline" element={<ExploreTimeline />} />
            <Route path="/explore/compare" element={<ExploreCompare />} />
            <Route path="/explore/promo" element={<ExplorePromo />} />
            <Route path="/explore/guide" element={<ExploreGuide />} />
            <Route path="/prompts" element={<PromptsHub />} />
            <Route path="/prompts/intro" element={<PromptsIntro />} />
            <Route path="/prompts/how" element={<PromptsHow />} />
            <Route path="/prompts/library" element={<PromptsLibrary />} />
            <Route path="/openclaw" element={<OpenClawHub />} />
            <Route path="/openclaw/intro" element={<OpenClawIntroPage />} />
            <Route path="/openclaw/guide" element={<OpenClawGuide />} />
            <Route path="/openclaw/skills" element={<SkillTree />} />
            <Route path="/openclaw/devnews" element={<DevNews />} />
            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/glossary" element={<LearnGlossary />} />
            <Route path="/learn/simulator" element={<LearnSimulator />} />
            <Route path="/news" element={<NewsBriefing />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
