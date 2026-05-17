<h1>ElevateCV — Turn your Resume into Opportunities</h1><br>
Built a full-stack GenAI application using FastAPI and React that analyzes
resumes, matches job descriptions, and generates interview questions using
LLM inference and semantic embeddings.

- Designed a provider-agnostic LLM service layer (Groq/LLaMA 3.1) with
  structured JSON output and defensive parsing for production reliability

- Implemented semantic JD matching using sentence-transformers embeddings
  and cosine similarity — no vector DB required, runs fully local

- Engineered modular prompt templates (ATS analysis, gap detection,
  interview generation) with Pydantic v2 schema validation on all
  LLM responses

- Deployed backend on Render and frontend on Vercel with environment-scoped
  CORS, cold-start handling, and Swagger API documentation

Tech: FastAPI · React · Tailwind · Groq API · LLaMA 3.1 · sentence-transformers
      pdfplumber · Pydantic v2 · Render · Vercel
