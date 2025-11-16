# whipnae

FinTech co-pilot we are building for the 2025 ShenZhen FinTechathon. The goal is to pair a conversational AI assistant with lightweight financial tooling.

## Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, ESLint
- **Backend:** FastAPI, LangChain, OpenAI SDK, SQLite (via SQLModel/SQLAlchemy planned)
- **Infra & Tooling:** pnpm or npm, Python 3.11+, uvicorn, dotenv

## Getting Started

### Prerequisites
- Node.js 20 LTS (Next.js 16 requirement) and your preferred package manager (`npm`, `pnpm`, or `yarn`).
- Python 3.11+ plus `pip`.
- An OpenAI (or compatible) API key for LLM features.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The dev server runs at `http://localhost:3000`. Tailwind and ESLint are preconfigured; run `npm run lint` before committing UI changes.

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
The FastAPI server will be available at `http://localhost:8000`.

### Quick Start (Both Servers)

From the project root, start both servers in separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm run dev
```

### Environment Variables
- Root-level `.env` (future): shared values such as feature flags or analytics keys.
- `frontend/.env.local`: public-safe keys or API URLs used by the Next.js client.
- `backend/.env`: private credentials (e.g., `OPENROUTER_API_KEY`, database URLs). Supply a matching `.env.example` once the schema is finalized.
