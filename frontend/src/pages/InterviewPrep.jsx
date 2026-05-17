import { useState } from "react";
import UploadBox from "../components/UploadBox";
import { generateQuestions } from "../services/api";

const difficultyStyle = {
  Easy:   "bg-emerald-500/10 text-emerald-400",
  Medium: "bg-yellow-500/10 text-yellow-400",
  Hard:   "bg-red-500/10 text-red-400",
};

const TechnicalCard = ({ question, difficulty, topic }) => (
  <div className="card hover:border-slate-700 transition-colors">
    <div className="flex items-start justify-between gap-4 mb-3">
      <span className="badge bg-brand-500/10 text-brand-500 text-xs">{topic}</span>
      <span className={`badge text-xs shrink-0 ${difficultyStyle[difficulty]}`}>
        {difficulty}
      </span>
    </div>
    <p className="text-slate-200 text-sm leading-relaxed">{question}</p>
  </div>
);

const SimpleCard = ({ question, tag, tagClass }) => (
  <div className="card hover:border-slate-700 transition-colors">
    <span className={`badge text-xs mb-3 inline-block ${tagClass}`}>{tag}</span>
    <p className="text-slate-200 text-sm leading-relaxed">{question}</p>
  </div>
);

const TabButton = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
      active
        ? "bg-brand-500/10 text-brand-500"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
    }`}
  >
    {label}
    <span className={`badge text-xs ${active ? "bg-brand-500/20 text-brand-400" : "bg-slate-700 text-slate-400"}`}>
      {count}
    </span>
  </button>
);

export default function InterviewPrep() {
  const [file, setFile]         = useState(null);
  const [jobRole, setJobRole]   = useState("");
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [activeTab, setActiveTab] = useState("technical");

  const handleGenerate = async () => {
    if (!file || !jobRole.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await generateQuestions(file, jobRole);
      setResult(data);
      setActiveTab("technical");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = file && jobRole.trim().length >= 3 && !loading;

  const tabs = result ? [
    { key: "technical",   label: "Technical",   count: result.technical.length },
    { key: "behavioral",  label: "Behavioral",  count: result.behavioral.length },
    { key: "resume",      label: "Resume-Based", count: result.resume_based.length },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Interview Prep</h1>
        <p className="text-slate-400 mt-2">
          Generate personalized interview questions based on your resume and target role.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="text-slate-400 text-sm font-medium mb-2 block">
            Your Resume
          </label>
          <UploadBox file={file} onFileChange={setFile} />
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium mb-2 block">
            Target Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSubmit && handleGenerate()}
            placeholder="e.g. Machine Learning Engineer, Backend Developer"
            className="input-field"
          />
          <p className="text-slate-600 text-xs mt-2">
            Be specific — "ML Engineer at a fintech startup" gives better questions than "Engineer"
          </p>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!canSubmit}
        className="btn-primary px-10"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Generating...
          </span>
        ) : "Generate Questions"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-10">
          {/* Stats bar */}
          <div className="card mb-6 flex flex-wrap items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{result.technical.length + result.behavioral.length + result.resume_based.length}</p>
              <p className="text-slate-500 text-xs mt-0.5">Total Questions</p>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden md:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">
                {result.technical.filter(q => q.difficulty === "Hard").length}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">Hard</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {result.technical.filter(q => q.difficulty === "Medium").length}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">Medium</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">
                {result.technical.filter(q => q.difficulty === "Easy").length}
              </p>
              <p className="text-slate-500 text-xs mt-0.5">Easy</p>
            </div>
            <div className="w-px h-8 bg-slate-800 hidden md:block" />
            <p className="text-slate-400 text-sm">
              Role: <span className="text-white font-medium">{jobRole}</span>
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map(({ key, label, count }) => (
              <TabButton
                key={key}
                label={label}
                count={count}
                active={activeTab === key}
                onClick={() => setActiveTab(key)}
              />
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "technical" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.technical.map((q, i) => (
                <TechnicalCard key={i} {...q} />
              ))}
            </div>
          )}

          {activeTab === "behavioral" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.behavioral.map((q, i) => (
                <SimpleCard
                  key={i}
                  question={q.question}
                  tag="STAR Method"
                  tagClass="bg-purple-500/10 text-purple-400"
                />
              ))}
            </div>
          )}

          {activeTab === "resume" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.resume_based.map((q, i) => (
                <SimpleCard
                  key={i}
                  question={q.question}
                  tag="From Your Resume"
                  tagClass="bg-brand-500/10 text-brand-500"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

