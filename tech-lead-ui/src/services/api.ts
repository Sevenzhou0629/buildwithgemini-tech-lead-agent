import {
  Project,
  Blocker,
  Risk,
  Decision,
  Conflict,
  ReadinessCategory,
  PersonStatus,
  SemanticChange,
  ProjectSnapshot,
  AgentChatMessage,
} from "@/types";
import {
  MOCK_PROJECT,
  MOCK_BLOCKERS,
  MOCK_RISKS,
  MOCK_DECISIONS,
  MOCK_CONFLICTS,
  MOCK_READINESS,
  MOCK_PEOPLE,
  MOCK_CHANGES,
  MOCK_SNAPSHOTS,
  INITIAL_CHAT_MESSAGES,
} from "@/mock/projectData";

const USE_REAL_BACKEND = process.env.NEXT_PUBLIC_USE_REAL_BACKEND === "true";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export const apiClient = {
  getProjects: async (): Promise<Project[]> => {
    return [MOCK_PROJECT];
  },

  getProject: async (projectId: string): Promise<Project> => {
    return MOCK_PROJECT;
  },

  getBlockers: async (projectId: string): Promise<Blocker[]> => {
    return MOCK_BLOCKERS;
  },

  getRisks: async (projectId: string): Promise<Risk[]> => {
    return MOCK_RISKS;
  },

  getDecisions: async (projectId: string): Promise<Decision[]> => {
    return MOCK_DECISIONS;
  },

  getConflicts: async (projectId: string): Promise<Conflict[]> => {
    return MOCK_CONFLICTS;
  },

  getReadiness: async (projectId: string): Promise<ReadinessCategory[]> => {
    return MOCK_READINESS;
  },

  getPeople: async (projectId: string): Promise<PersonStatus[]> => {
    return MOCK_PEOPLE;
  },

  getPerson: async (projectId: string, personId: string): Promise<PersonStatus | undefined> => {
    return MOCK_PEOPLE.find((p) => p.id === personId);
  },

  getChanges: async (projectId: string): Promise<SemanticChange[]> => {
    return MOCK_CHANGES;
  },

  getSnapshots: async (projectId: string): Promise<ProjectSnapshot[]> => {
    return MOCK_SNAPSHOTS;
  },

  getChatHistory: async (projectId: string): Promise<AgentChatMessage[]> => {
    return INITIAL_CHAT_MESSAGES;
  },

  sendChatMessage: async (
    projectId: string,
    query: string
  ): Promise<AgentChatMessage> => {
    if (USE_REAL_BACKEND) {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (res.ok) {
          const data = await res.json();
          return {
            id: `msg-${Date.now()}`,
            sender: "agent",
            timestamp: "Just now",
            text: data.executive_summary,
            structuredData: {
              facts: data.verifiable_facts,
              inferences: data.operational_inferences,
              actions: data.recommended_actions,
            },
          };
        }
      } catch (e) {
        console.warn("Backend unavailable, falling back to mock response", e);
      }
    }

    // Realistic Mocked Agent Reasoning Response
    return {
      id: `msg-${Date.now()}`,
      sender: "agent",
      timestamp: "Just now",
      text: `Based on cross-system evidence from Jira, GitHub, Slack, and Confluence, here is the current operational diagnosis for: "${query}".`,
      investigationSteps: [
        { label: "Cross-checked 4 active Jira tickets with GitHub PR branches", status: "completed" },
        { label: "Scanned #proj-ai-doc-launch Slack channels for recent blocker disclosures", status: "completed" },
        { label: "Validated Confluence PRT launch criteria against current code", status: "completed" },
      ],
      summaryStats: {
        sourcesChecked: 4,
        evidenceItemsCount: 8,
      },
      structuredData: {
        facts: [
          "Jira ticket AIDOC-101 is closed as Done, but PR #211 remains unmerged on GitHub.",
          "PR #207 (Frontend progress UI) is blocked awaiting updated schema contract.",
          "Datadog alert thresholds have not been configured for P95 latency.",
        ],
        inferences: [
          "The team is experiencing a coordination gap between backend schema finalization and frontend consumption.",
          "PRT Launch cannot be approved until AIDOC-101 is re-opened and merged.",
        ],
        conflicts: MOCK_CONFLICTS,
        blockers: MOCK_BLOCKERS.slice(0, 2),
        actions: [
          {
            priority: "HIGH",
            title: "Re-open AIDOC-101 in Jira",
            details: "Clarify to the team that contract v2 code has not merged.",
          },
          {
            priority: "HIGH",
            title: "Pair on PR #211 test timeout",
            details: "Help Ivan fix the integration test failure so Zhuo can resume frontend integration.",
          },
        ],
        evidenceIds: ["ev-1", "ev-4", "ev-5"],
      },
    };
  },
};
