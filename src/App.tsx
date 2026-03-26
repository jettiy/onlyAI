import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/explore/Explore";
import ExploreTimeline from "./pages/explore/ExploreTimeline";
import ExploreCompare from "./pages/explore/ExploreCompare";
import ExplorePromo from "./pages/explore/ExplorePromo";
import ExploreGuide from "./pages/explore/ExploreGuide";
import PromptsHub from "./pages/prompts/PromptsHub";
import PromptsIntro from "./pages/prompts/PromptsIntro";
import PromptsHow from "./pages/prompts/PromptsHow";
import PromptsLibrary from "./pages/prompts/PromptsLibrary";
import OpenClawHub from "./pages/openclaw/OpenClawHub";
import OpenClawIntroPage from "./pages/openclaw/OpenClawIntroPage";
import OpenClawGuide from "./pages/openclaw/OpenClawGuide";
import SkillTree from "./pages/openclaw/SkillTree";
import DevNews from "./pages/openclaw/DevNews";
import LearnHub from "./pages/learn/LearnHub";
import LearnGlossary from "./pages/learn/LearnGlossary";
import LearnSimulator from "./pages/learn/LearnSimulator";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
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
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
