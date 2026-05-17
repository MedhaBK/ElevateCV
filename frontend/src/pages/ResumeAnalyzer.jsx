import { useState } from "react";
import UploadBox from "../components/UploadBox";
import ScoreCard from "../components/ScoreCard";
import { analyzeResume } from "../services/api";

const Section = ({ title, items, color = "brand" }) => {
  const colors = {
    brand:   "bg-brand-500/10 text-brand-500",
    emerald: "bg-emerald-500/10 text-emerald-400",
    red:     "bg-red-500/10 text-red-400",
    yellow:  "bg-yellow-500/10 text-yellow-400",
    purple:  "bg-purple-500/10 text-purple-400",
  };

  return (
    <div className="card">
      <h3 className="section-title">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`badge mt-0.5 shrink-0 ${colors[color]}`}>
              {i + 1}
            </span>
            <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const KeywordChips = ({ keywords }) => (
  <div className="card">
    <h3 className="section-title">Missing Keywords</h3>
    <div className="flex flex-wrap gap-2">
      {keywords.map((kw, i) => (
        <span key={i} className="badge bg-red-500/10 text-red-400 px-3 py-1 text-xs">
          {kw}
        </span>
      ))}
    </div>
  </div>
);

export default function ResumeAnalyzer() {
  const [file, setFile]       = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await analyzeResume(file);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">ATS Resume Analyzer</h1>
        <p className="text-slate-400 mt-2">
          Upload your resume to get an ATS score and actionable feedback.
        </p>
      </div>

      {/* Upload */}
      <div className="max-w-xl mb-8">
        <UploadBox file={file} onFileChange={setFile} />
        <button
          onClick={handleAnalyze}
          disabled={!file || loading}
          className="btn-primary w-full mt-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Analyzing...
            </span>
          ) : "Analyze Resume"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-xl mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Summary row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScoreCard score={result.ats_score} />
            <div className="card md:col-span-2">
              <h3 className="section-title">Summary</h3>
              <p className="text-slate-300 leading-relaxed">{result.summary}</p>
            </div>
          </div>

          {/* Strengths + Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Section title="Strengths"      items={result.strengths}   color="emerald" />
            <Section title="Weaknesses"     items={result.weaknesses}  color="red" />
          </div>

          {/* Keywords + Formatting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <KeywordChips keywords={result.missing_keywords} />
            <Section title="Formatting Issues" items={result.formatting_issues} color="yellow" />
          </div>

          {/* Tips */}
          <Section title="Improvement Tips" items={result.improvement_tips} color="purple" />
        </div>
      )}
    </div>
  );
}