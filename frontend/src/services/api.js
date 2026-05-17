import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 60000, // 60s — LLM calls can take time
});

export const analyzeResume = (file) => {
  const form = new FormData();
  form.append("file", file);
  return api.post("/resume/analyze", form);
};

export const matchJD = (file, jdText) => {
  const form = new FormData();
  form.append("file", file);
  form.append("jd_text", jdText);
  return api.post("/jd/match", form);
};

export const generateQuestions = (file, jobRole) => {
  const form = new FormData();
  form.append("file", file);
  form.append("job_role", jobRole);
  return api.post("/interview/generate", form);
};