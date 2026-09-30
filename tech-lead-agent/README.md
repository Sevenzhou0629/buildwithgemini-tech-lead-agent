# 🛠️ Engineering Tech Lead Agent

An operational reasoning agent that continuously reconstructs, reconciles, and evaluates the real state of an engineering project by connecting to **Jira, GitHub, Slack, and Confluence** via Model Context Protocol (MCP) tools.

Rather than acting as a passive chat bot, this agent:
- Normalizes data into a single, structured **Evidence Model**.
- Detects discrepancies across sources (e.g. Jira tickets marked *Done* when GitHub PRs are still open or failing CI).
- Distinguishes **Facts, Inferences, Conflicts, and Unknowns**.
- Audits launch readiness and identifies emerging project risks.
- Strictly guards against unauthorized writes (`ALLOW_EXTERNAL_WRITES=false`).

---

## 🏗️ Architecture

```
                    User Query / CLI / REST API
                                 │
                                 ▼
                     TechLeadOrchestrator
                     ├── QueryPlanner (determines needed MCP sources)
                     ├── EvidenceService (parallel query dispatch)
                     ├── ReconciliationService (cross-source conflict engine)
                     └── Synthesizer (OpenAI / Deterministic engine)
                                 │
         ┌───────────────┬───────┴───────┬──────────────┐
         ▼               ▼               ▼              ▼
     Jira MCP       GitHub MCP       Slack MCP    Confluence MCP
   (Tickets, Epics)   (PRs, CI)      (Threads)     (RFCs, Runbooks)
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
cd /config/.gemini/antigravity/scratch/tech-lead-agent
uv sync
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*Note: If `OPENAI_API_KEY` is not provided, the agent automatically runs in deterministic local reasoning mode, allowing full offline usage and zero-dependency testing.*

### 3. Run Automated Tests
```bash
uv run pytest
```

---

## 💻 CLI Commands

The interactive CLI provides colored terminal output and tables powered by `Rich`:

```bash
# Ask operational questions
uv run tech-lead ask "What is blocking launch and what are the cross-system risks?"

# Check project health, active blockers, and discrepancies
uv run tech-lead status

# Audit launch readiness against RFCs and PRs
uv run tech-lead launch-readiness
```

---

## 🌐 FastAPI REST API

Start the API server:
```bash
uv run uvicorn app.main:app --port 8000 --reload
```

### Endpoints
- `POST /api/v1/query` — Execute structured analysis on an engineering question.
- `GET /api/v1/status` — Get project health, blockers, and detected conflicts.
- `GET /api/v1/launch-readiness` — Run production launch readiness audit.
- `GET /api/v1/evidence` — Inspect stored evidence records.
- `GET /api/v1/mcp/providers` — List active MCP adapters.
- `GET /health` — Service health and safety settings.
