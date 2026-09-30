# Engineering Tech Lead Agent - Frontend OS (`tech-lead-ui`)

A project command center and operational reasoning interface for engineering leads. Rather than acting as a generic chatbot, this frontend synthesizes multi-source project data across Jira, GitHub, Slack, and Confluence into actionable operational state, dependency chains, cross-system contradictions, and launch readiness matrices.

---

## 🏗️ Architecture & Philosophy

The application is structured into three layers:
1. **ASK**: Persistent agent interaction surface, scoped natural-language inputs, and structured reasoning responses (verifiable facts, operational inferences, conflicts, and prioritized actions).
2. **INSPECT**: Collapsible Evidence Inspector drawer exposing the raw source excerpts, author timestamps, confidence levels, and external deep-links for every factual assertion.
3. **ACT**: Context-driven non-destructive actions (Inspect Jira, Open PR, View Slack thread, Jump to Dependency Graph, Ask Agent to Reconcile).

### Core Desktop Layout (Three-Column)
```
┌─────────────────┬──────────────────────────────────┬──────────────────────┐
│ Project Nav     │ Main Content                     │ Evidence / Context   │
│                 │                                  │                      │
│ Overview        │ - High-level milestone metrics   │ - Captured excerpt   │
│ Changes Feed    │ - Needs Your Attention cards     │ - Source icon & link │
│ Blockers        │ - Cross-source conflict cards    │ - Agent reasoning    │
│ Risks           │ - Decision Inbox                 │ - Grounding metadata │
│ Decisions       │ - Interactive React Flow graphs  │                      │
│ Readiness       │ - Launch criteria matrix         │                      │
│ People & Work   │ - Agent chat conversation        │                      │
│ Visuals         │                                  │                      │
└─────────────────┴──────────────────────────────────┴──────────────────────┘
```

---

## 🗂️ Project File Tree

```
tech-lead-ui/
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Root AppShell & dark theme wrapper
│   │   ├── page.tsx                       # Redirects to default project
│   │   ├── projects/page.tsx              # Multi-project catalog
│   │   └── project/[projectId]/
│   │       ├── page.tsx                   # Project Overview & Attention cards
│   │       ├── blockers/page.tsx          # Blocker register & owner filters
│   │       ├── risks/page.tsx             # Risk register with mitigations
│   │       ├── decisions/page.tsx         # Decision inbox & evaluated alternatives
│   │       ├── changes/page.tsx           # State transitions & Snapshot Time-Travel
│   │       ├── readiness/page.tsx         # 15-category Launch Readiness matrix
│   │       ├── people/page.tsx            # Coordination & handoff friction view
│   │       ├── visuals/page.tsx           # Interactive React Flow diagrams
│   │       └── chat/page.tsx              # Agent operational reasoning console
│   ├── components/
│   │   ├── layout/                        # AppShell, Header, Sidebar, EvidenceInspector, CommandPalette
│   │   ├── shared/                        # StatusBadge, SourceBadge
│   │   ├── blockers/                      # BlockerCard
│   │   ├── risks/                         # RiskCard
│   │   ├── decisions/                     # DecisionCard
│   │   ├── evidence/                      # ConflictView
│   │   ├── agent/                         # AgentResponseView, AgentInvestigation
│   │   └── visuals/                       # InteractiveGraph (React Flow)
│   ├── mock/
│   │   └── projectData.ts                 # Realistic fixtures for AI Document Splitting
│   ├── services/
│   │   └── api.ts                         # Typed client supporting mock and live backend
│   ├── store/
│   │   └── uiStore.ts                     # Zustand store for evidence inspector & command palette
│   └── types/
│       └── index.ts                       # Domain types (Blocker, Risk, Conflict, Evidence, etc.)
├── vitest.config.ts                       # Test runner config
└── package.json
```

---

## 🚦 Primary Routes

- `/projects` — Multi-project list
- `/project/ai-doc-split` — Project Overview (Needs Your Attention, counters, reality gaps)
- `/project/ai-doc-split/changes` — Semantic State Transitions & Snapshot Compare (Current vs 24h vs 7d)
- `/project/ai-doc-split/blockers` — Active Blockers & dependency chains
- `/project/ai-doc-split/risks` — Risk Register with qualitative impacts and mitigations
- `/project/ai-doc-split/decisions` — Architectural Decision Inbox (Options, pros/cons)
- `/project/ai-doc-split/readiness` — 15-point Launch Readiness Matrix (Grid & Table views)
- `/project/ai-doc-split/people` — Team coordination & handoff friction (no productivity tracking)
- `/project/ai-doc-split/visuals` — Interactive React Flow Architecture & Dependency graphs
- `/project/ai-doc-split/chat` — Structured Agent Console (Grounded facts, inferences, conflicts)

---

## ⚡ How to Run Locally

```bash
cd /config/.gemini/antigravity/scratch/tech-lead-ui

# Install dependencies (already completed)
npm install

# Start Next.js development server
npm run dev

# Open in browser:
# http://localhost:3000/
```

To run the automated tests:
```bash
npx vitest run
```

---

## 🔌 Connecting to the Live Python Backend

The frontend is decoupled from the backend via [`src/services/api.ts`](src/services/api.ts).

To connect to the live Python `tech-lead-agent` FastAPI server:
1. Start the backend:
   ```bash
   cd /config/.gemini/antigravity/scratch/tech-lead-agent
   uv run uvicorn app.api.routes:app --port 8000
   ```
2. In `tech-lead-ui`, set the environment variables in `.env.local`:
   ```bash
   NEXT_PUBLIC_USE_REAL_BACKEND=true
   NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
   ```
