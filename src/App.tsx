import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Models from "./pages/Models";
import Guide from "./pages/Guide";
import Pricing from "./pages/Pricing";
import Trending from "./pages/Trending";
import News from "./pages/News";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/models" element={<Models />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
