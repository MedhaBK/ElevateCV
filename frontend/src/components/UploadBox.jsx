import { useRef } from "react";

export default function UploadBox({ file, onFileChange, label = "Upload Resume PDF" }) {
  const inputRef = useRef(null);

  return (
    <div
      onClick={() => inputRef.current.click()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors duration-200 ${
        file
          ? "border-brand-500 bg-brand-500/5"
          : "border-slate-700 hover:border-slate-500 bg-slate-800/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => onFileChange(e.target.files[0])}
      />
      {file ? (
        <div>
          <p className="text-brand-500 font-medium">✓ {file.name}</p>
          <p className="text-slate-500 text-sm mt-1">Click to replace</p>
        </div>
      ) : (
        <div>
          <p className="text-slate-300 font-medium">{label}</p>
          <p className="text-slate-500 text-sm mt-1">Click to browse · PDF only</p>
        </div>
      )}
    </div>
  );
}