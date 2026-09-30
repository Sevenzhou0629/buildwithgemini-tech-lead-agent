from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class VisualType(str, Enum):
    ARCHITECTURE_DIAGRAM = "ARCHITECTURE_DIAGRAM"
    DEPENDENCY_GRAPH = "DEPENDENCY_GRAPH"
    LAUNCH_READINESS_MATRIX = "LAUNCH_READINESS_MATRIX"
    PROJECT_TIMELINE = "PROJECT_TIMELINE"
    OWNERSHIP_MAP = "OWNERSHIP_MAP"
    DECISION_TREE = "DECISION_TREE"
    INCIDENT_FLOW = "INCIDENT_FLOW"
    SEQUENCE_DIAGRAM = "SEQUENCE_DIAGRAM"
    RISK_MAP = "RISK_MAP"
    CHANGE_MAP = "CHANGE_MAP"
    TEAM_EXECUTION_BOARD = "TEAM_EXECUTION_BOARD"
    PR_RELATIONSHIP_GRAPH = "PR_RELATIONSHIP_GRAPH"
    DATA_FLOW_DIAGRAM = "DATA_FLOW_DIAGRAM"
    STATE_MACHINE = "STATE_MACHINE"
    RUNBOOK_FLOWCHART = "RUNBOOK_FLOWCHART"
    EXECUTIVE_ONE_PAGER = "EXECUTIVE_ONE_PAGER"


class VisualStatus(str, Enum):
    VERIFIED = "VERIFIED"
    IN_PROGRESS = "IN_PROGRESS"
    PARTIALLY_VERIFIED = "PARTIALLY_VERIFIED"
    BLOCKED = "BLOCKED"
    NOT_VERIFIED = "NOT_VERIFIED"
    UNKNOWN = "UNKNOWN"
    STALE = "STALE"
    CONFLICT = "CONFLICT"


# Standard Color Scheme for VisualStatus
STATUS_COLORS = {
    VisualStatus.VERIFIED: "#10b981",          # Green
    VisualStatus.IN_PROGRESS: "#3b82f6",       # Blue
    VisualStatus.PARTIALLY_VERIFIED: "#06b6d4", # Cyan / Teal
    VisualStatus.BLOCKED: "#ef4444",           # Red
    VisualStatus.NOT_VERIFIED: "#f97316",      # Orange
    VisualStatus.UNKNOWN: "#6b7280",           # Gray
    VisualStatus.STALE: "#d97706",             # Amber
    VisualStatus.CONFLICT: "#8b5cf6",          # Purple
}


class Node(BaseModel):
    id: str
    label: str
    type: str = "component"  # service, database, queue, ticket, pr, person, status, step
    status: VisualStatus = VisualStatus.UNKNOWN
    owner: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    evidence_ids: List[str] = Field(default_factory=list)


class Edge(BaseModel):
    source: str
    target: str
    label: Optional[str] = None
    type: str = "depends_on"  # calls, blocks, reads_from, writes_to, transitions_to, owns
    status: Optional[VisualStatus] = None
    evidence_ids: List[str] = Field(default_factory=list)


class Group(BaseModel):
    id: str
    label: str
    node_ids: List[str] = Field(default_factory=list)


class Annotation(BaseModel):
    text: str
    severity: str = "info"  # info, warning, blocker
    related_node_ids: List[str] = Field(default_factory=list)
    evidence_ids: List[str] = Field(default_factory=list)


class VisualizationSpec(BaseModel):
    """The canonical structured visualization model."""
    type: VisualType
    title: str
    subtitle: Optional[str] = None
    nodes: List[Node] = Field(default_factory=list)
    edges: List[Edge] = Field(default_factory=list)
    groups: List[Group] = Field(default_factory=list)
    annotations: List[Annotation] = Field(default_factory=list)
    status_legend: Dict[str, str] = Field(
        default_factory=lambda: {s.value: STATUS_COLORS[s] for s in VisualStatus}
    )
    metadata: Dict[str, Any] = Field(default_factory=dict)
    evidence_ids: List[str] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    unknowns: List[str] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class OutputFormat(str, Enum):
    MERMAID = "mermaid"
    SVG = "svg"
    JSON = "json"
    MARKDOWN = "markdown"


class VisualizationResult(BaseModel):
    spec: VisualizationSpec
    format: OutputFormat
    content: str
    explanation: str
    evidence_references: List[str] = Field(default_factory=list)
    unknowns_or_assumptions: List[str] = Field(default_factory=list)
