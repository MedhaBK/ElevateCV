import { useState } from "react";
import UploadBox from "../components/UploadBox";
import { matchJD } from "../services/api";

const MatchScoreCard = ({ score }) => {
  const getColor = (s) => {
    if (s >= 70) return "text-emerald-400";
    if (s >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getLabel = (s) => {
    if (s >= 70) return "Strong Match";
    if (s >= 50) return "Partial Match";
    return "Weak Match";
  };

  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="card flex flex-col items-center py-8">
      <svg width="120" height="120" className="-rotate-90">
        <circle cx="60" cy="60" r="40" fill="none"
          stroke="#1e293b" strokeWidth="10" />
        <circle cx="60" cy="60" r="40" fill="none"
          stroke="currentColor" strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${getColor(score)} transition-all duration-700`}
        />
      </svg>
      <p className={`text-5xl font-bold mt-2 ${getColor(score)}`}>{score}</p>
      <p className="text-slate-400 text-sm mt-1">Match Score</p>
      <span className={`badge mt-3 ${
        score >= 70 ? "bg-emerald-500/10 text-emerald-400" :
        score >= 50 ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
      }`}>
        {getLabel(score)}
      </span>
    </div>
  );
};

const SkillChips = ({ title, skills, chipClass }) => (
  <div className="card">
    <h3 className="section-title">{title}</h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <span key={i} className={`badge px-3 py-1 text-xs ${chipClass}`}>
          {skill}
        </span>
      ))}
    </div>
  </div>
);

const ListCard = ({ title, items, color }) => {
  const colors = {
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

export default function JDMatcher() {
  const [file, setFile]       = useState(null);
  const [jdText, setJdText]   = useState("");
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleMatch = async () => {
    if (!file || !jdText.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await matchJD(file, jdText);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = file && jdText.trim().length >= 50 && !loading;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">JD Matcher</h1>
        <p className="text-slate-400 mt-2">
          See how well your resume matches a job description and identify skill gaps.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="text-slate-400 text-sm font-medium mb-2 block">
            Your Resume
          </label>
          <UploadBox file={file} onFileChange={setFile} />
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium mb-2 block">
            Job Description
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={9}
            className="input-field resize-none"
          />
        </div>
      </div>

      <button
        onClick={handleMatch}
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
            Matching...
          </span>
        ) : "Match Resume to JD"}
      </button>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-10 space-y-6">
          {/* Score + Gap */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MatchScoreCard score={result.match_score} />
            <div className="card md:col-span-2">
              <h3 className="section-title">Experience Gap Analysis</h3>
              <p className="text-slate-300 leading-relaxed">{result.experience_gap}</p>
            </div>
          </div>

          {/* Skill chips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkillChips
              title="Matched Skills"
              skills={result.matched_skills}
              chipClass="bg-emerald-500/10 text-emerald-400"
            />
            <SkillChips
              title="Missing Skills"
              skills={result.missing_skills}
              chipClass="bg-red-500/10 text-red-400"
            />
            <SkillChips
              title="Bonus Skills"
              skills={result.extra_skills}
              chipClass="bg-brand-500/10 text-brand-500"
            />
          </div>

          {/* Recommendations */}
          <ListCard
            title="Recommendations"
            items={result.recommendations}
            color="purple"
          />
        </div>
      )}
    </div>
  );
}