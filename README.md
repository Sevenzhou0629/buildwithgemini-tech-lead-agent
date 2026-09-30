# Engineering Tech Lead Agent & Command Center OS

An evidence-grounded AI agent and frontend command center that reconciles engineering project state across Jira, GitHub, Slack, and Confluence.

## Modules

- `tech-lead-agent/`: Python reasoning backend with multi-source adapters, cross-system conflict detection, and visualization engine.
- `tech-lead-ui/`: Next.js 16 / React 19 Frontend command center with interactive React Flow graphs and Evidence Inspector drawer.
- `demo/`: Recorded demo video with voiceover narration and walkthrough documentation.

## Running Locally

### Backend (Python FastAPI)
```bash
cd tech-lead-agent
uv run uvicorn app.main:app --port 8000
```

### Frontend (Next.js)
```bash
cd tech-lead-ui
npm install
npm run dev
# Open http://localhost:3000
```
