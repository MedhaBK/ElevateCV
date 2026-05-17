export default function ScoreCard({ score }) {
  const getColor = (s) => {
    if (s >= 80) return "text-emerald-400";
    if (s >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getLabel = (s) => {
    if (s >= 80) return "ATS Optimized";
    if (s >= 60) return "Needs Improvement";
    return "Major Issues";
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
      <p className="text-slate-400 text-sm mt-1">ATS Score</p>
      <span className={`badge mt-3 ${
        score >= 80 ? "bg-emerald-500/10 text-emerald-400" :
        score >= 60 ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-red-500/10 text-red-400"
      }`}>
        {getLabel(score)}
      </span>
    </div>
  );
}