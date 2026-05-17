import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JDMatcher from "./pages/JDMatcher";
import InterviewPrep from "./pages/InterviewPrep";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/resume"    element={<ResumeAnalyzer />} />
          <Route path="/jd-match"  element={<JDMatcher />} />
          <Route path="/interview" element={<InterviewPrep />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}