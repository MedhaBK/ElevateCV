import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/",          label: "Home" },
  { to: "/resume",    label: "ATS Analyzer" },
  { to: "/jd-match",  label: "JD Matcher" },
  { to: "/interview", label: "Interview Prep" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-white tracking-tight">
          Elevate <span className="text-brand-500">CV</span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                pathname === to
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}