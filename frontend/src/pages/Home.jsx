import { Link } from "react-router-dom";

const features = [
  {
    to: "/resume",
    // icon: "📄",
    title: "ATS Resume Analyzer",
    description: "Get your resume scored and receive actionable improvement tips.",
  },
  {
    to: "/jd-match",
    // icon: "🎯",
    title: "JD Matcher",
    description: "Paste a job description and see how well your resume matches.",
  },
  {
    to: "/interview",
    // icon: "🧠",
    title: "Interview Prep",
    description: "Generate personalized technical and behavioral questions.",
  },
];

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
          Turn Your Resume into {" "}
          <span className="text-brand-500">Opportunities</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          AI-powered resume analysis, optimization, and interview preparation for ambitious students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ to, icon, title, description }) => (
          <Link
            key={to}
            to={to}
            className="card hover:border-brand-500/50 hover:bg-slate-800/50 transition-all duration-200 group"
          >
            <div className="text-4xl mb-4">{icon}</div>
            <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-brand-500 transition-colors">
              {title}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}