export type SourceType = "jira" | "github" | "slack" | "confluence";

export type SemanticStatus =
  | "VERIFIED"
  | "IN_PROGRESS"
  | "PARTIALLY_VERIFIED"
  | "BLOCKED"
  | "NOT_VERIFIED"
  | "UNKNOWN"
  | "STALE"
  | "CONFLICT"
  | "AT_RISK";

export type ItemType =
  | "ISSUE"
  | "RISK"
  | "DECISION"
  | "DEPENDENCY"
  | "BLOCKER"
  | "CONFLICT"
  | "UNKNOWN";

export interface Evidence {
  id: string;
  sourceType: SourceType;
  title: string;
  excerpt?: string;
  url?: string;
  author?: string;
  timestamp?: string;
  externalId?: string;
  metadata?: Record<string, unknown>;
}

export interface AgentStatement {
  id: string;
  text: string;
  classification: "FACT" | "INFERENCE" | "UNKNOWN" | "CONFLICT";
  confidence?: "LOW" | "MEDIUM" | "HIGH";
  evidenceIds: string[];
}

export interface Blocker {
  id: string;
  title: string;
  status: SemanticStatus;
  affectedWorkstream: string;
  owner: string;
  age: string;
  dependencies: string[];
  evidenceIds: string[];
  latestActivity: string;
  relatedJira?: string;
  relatedPR?: string;
  impactDescription: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  affectedArea: string;
  impact: "LOW" | "MEDIUM" | "HIGH";
  likelihood?: "LOW" | "MEDIUM" | "HIGH";
  confidence?: "LOW" | "MEDIUM" | "HIGH";
  evidenceIds: string[];
  mitigation: string;
  owner: string;
  status: SemanticStatus;
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros?: string[];
  cons?: string[];
}

export interface Decision {
  id: string;
  title: string;
  status: "OPEN" | "DECIDED" | "SUPERSEDED";
  blocksWorkstream: string;
  options: DecisionOption[];
  chosenOptionId?: string;
  evidenceIds: string[];
  lastUpdated: string;
  owner: string;
}

export interface Conflict {
  id: string;
  title: string;
  claimA: {
    source: SourceType;
    entityId: string;
    statement: string;
  };
  claimB: {
    source: SourceType;
    entityId: string;
    statement: string;
  };
  agentInterpretation: string;
  suggestedAction: string;
  evidenceIds: string[];
  severity: "HIGH" | "CRITICAL";
}

export interface ReadinessCategory {
  id: string;
  name: string;
  status: SemanticStatus;
  owner?: string;
  missingVerification?: string;
  evidenceIds: string[];
  blockerCount: number;
}

export interface PersonStatus {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  currentWork: {
    title: string;
    jiraKey?: string;
    prNumber?: number;
  }[];
  recentlyCompleted: string[];
  waitingFor: {
    item: string;
    owner: string;
  }[];
  inReview: string[];
  blocked: string[];
  unclearSignals: string[];
}

export interface SemanticChange {
  id: string;
  timestamp: string;
  category:
    | "NEW"
    | "RESOLVED"
    | "CHANGED"
    | "BLOCKED"
    | "UNBLOCKED"
    | "MERGED"
    | "DECIDED"
    | "CONFLICT";
  title: string;
  description: string;
  relatedEntities: string[];
  evidenceIds: string[];
}

export interface ProjectSnapshot {
  id: string;
  label: string;
  timestamp: string;
  blockerCount: number;
  riskCount: number;
  openDecisionsCount: number;
  openPRCount: number;
}

export interface Project {
  id: string;
  name: string;
  currentMilestone: string;
  lastRefreshed: string;
  blockerCount: number;
  riskCount: number;
  openDecisionsCount: number;
  openPRCount: number;
  mcpHealth: Record<SourceType, "HEALTHY" | "DEGRADED" | "OFFLINE">;
  workstreams: string[];
}

export interface AgentChatMessage {
  id: string;
  sender: "user" | "agent";
  timestamp: string;
  text: string;
  investigationSteps?: {
    label: string;
    status: "completed" | "in_progress" | "pending";
  }[];
  summaryStats?: {
    sourcesChecked: number;
    evidenceItemsCount: number;
  };
  structuredData?: {
    facts?: string[];
    inferences?: string[];
    conflicts?: Conflict[];
    blockers?: Blocker[];
    actions?: {
      priority: "HIGH" | "MEDIUM" | "LOW";
      title: string;
      details: string;
    }[];
    evidenceIds?: string[];
  };
}
