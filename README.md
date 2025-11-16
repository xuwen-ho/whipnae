# whipnae

我们为2025年深圳金融科技马拉松打造的金融科技助手。目标是将对话式AI助手与轻量级金融工具相结合。

## 技术栈
- **前端：** Next.js 16 (App Router)、React 19、Tailwind CSS v4、TypeScript、ESLint
- **后端：** FastAPI、LangChain、OpenAI SDK、SQLite（计划使用 SQLModel/SQLAlchemy）
- **基础设施与工具：** pnpm 或 npm、Python 3.11+、uvicorn、dotenv

## 快速开始

### 前置要求
- Node.js 20 LTS（Next.js 16 要求）以及您喜欢的包管理器（`npm`、`pnpm` 或 `yarn`）
- Python 3.11+ 以及 `pip`
- 用于 LLM 功能的 OpenAI（或兼容）API 密钥

### 前端设置
```bash
cd frontend
npm install
npm run dev
```
开发服务器运行在 `http://localhost:3000`。Tailwind 和 ESLint 已预配置；在提交 UI 更改前请运行 `npm run lint`。

### 后端设置
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows 系统: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
FastAPI 服务器将在 `http://localhost:8000` 运行。

### 环境变量设置 ⚠️

**在运行服务器之前**，请配置您的环境变量：

**前端环境变量：**
   - 创建 `frontend/.env.local` 文件并添加以下内容：
     ```
     OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```

### 快速启动（两个服务器）

从项目根目录，在两个独立的终端中启动服务器：

**终端 1（后端）：**
```bash
cd backend && source venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**终端 2（前端）：**
```bash
cd frontend && npm run dev
```

---

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

### Environment Variables Setup ⚠️

**Before running the servers**, configure your environment variables:

**Frontend Environment Variables:**
   - Create `frontend/.env.local` with the following:
     ```
     OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```

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
