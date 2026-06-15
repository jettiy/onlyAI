import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { useSEO } from "./hooks/useSEO";

// Lazy-loaded routes for code splitting
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/explore/Explore").then(m => ({ default: m.default })));
const ExploreTimeline = lazy(() => import("./pages/explore/ExploreTimeline").then(m => ({ default: m.default })));
const ExploreCompare = lazy(() => import("./pages/explore/ExploreCompare").then(m => ({ default: m.default })));
const ExploreGuide = lazy(() => import("./pages/explore/ExploreGuide").then(m => ({ default: m.default })));
const ExploreRanking = lazy(() => import("./pages/explore/ExploreRanking").then(m => ({ default: m.default })));
const ExploreCalculator = lazy(() => import("./pages/explore/ExploreCalculator").then(m => ({ default: m.default })));

const LearnHub = lazy(() => import("./pages/learn/LearnHub").then(m => ({ default: m.default })));
const LearnGlossary = lazy(() => import("./pages/learn/LearnGlossary").then(m => ({ default: m.default })));
const NewsBriefing = lazy(() => import("./pages/NewsBriefing").then(m => ({ default: m.default })));
const Changelog = lazy(() => import("./pages/Changelog").then(m => ({ default: m.default })));
const LearnSimulator = lazy(() => import("./pages/learn/LearnSimulator").then(m => ({ default: m.default })));
const VideoTimeline = lazy(() => import("./pages/video/VideoTimeline").then(m => ({ default: m.default })));
const VideoCompare = lazy(() => import("./pages/video/VideoCompare").then(m => ({ default: m.default })));
const ImageCompare = lazy(() => import("./pages/image/ImageCompare").then(m => ({ default: m.default })));
const Pricing = lazy(() => import("./pages/Pricing").then(m => ({ default: m.default })));
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

            <Route path="/video" element={<Navigate to="/video/compare" replace />} />
            <Route path="/video/timeline" element={<VideoTimeline />} />
            <Route path="/video/compare" element={<VideoCompare />} />
            <Route path="/image" element={<ImageCompare />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/recommend" element={<Recommend />} />
            <Route path="/pc-check" element={<PcCheck />} />

            <Route path="/learn" element={<LearnHub />} />
            <Route path="/learn/glossary" element={<LearnGlossary />} />
            <Route path="/learn/simulator" element={<LearnSimulator />} />
            <Route path="/news" element={<NewsBriefing />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
