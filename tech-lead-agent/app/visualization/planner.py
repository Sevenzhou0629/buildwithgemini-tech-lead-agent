from typing import List, Tuple
from app.visualization.models import VisualType
from app.models.evidence import SourceType


COMMAND_TO_TYPE = {
    "architecture": VisualType.ARCHITECTURE_DIAGRAM,
    "launch-readiness": VisualType.LAUNCH_READINESS_MATRIX,
    "dependencies": VisualType.DEPENDENCY_GRAPH,
    "state-machine": VisualType.STATE_MACHINE,
    "this-week-changes": VisualType.CHANGE_MAP,
    "ownership": VisualType.OWNERSHIP_MAP,
    "incident-flow": VisualType.INCIDENT_FLOW,
    "runbook": VisualType.RUNBOOK_FLOWCHART,
    "executive-summary": VisualType.EXECUTIVE_ONE_PAGER,
    "sequence": VisualType.SEQUENCE_DIAGRAM,
    "risk-map": VisualType.RISK_MAP,
    "timeline": VisualType.PROJECT_TIMELINE,
    "decision-tree": VisualType.DECISION_TREE,
    "team-board": VisualType.TEAM_EXECUTION_BOARD,
    "pr-graph": VisualType.PR_RELATIONSHIP_GRAPH,
    "data-flow": VisualType.DATA_FLOW_DIAGRAM,
}


class VisualizationPlanner:
    """Detects visualization intent and maps to VisualType and required MCP sources."""

    def plan(self, query: str) -> Tuple[VisualType, List[SourceType]]:
        q = query.strip().lower()

        # Strip slash commands if present (e.g. /visualize state-machine or state-machine)
        if q.startswith("/visualize"):
            q = q.replace("/visualize", "").strip()

        # Exact command or keyword matching
        if q in COMMAND_TO_TYPE:
            v_type = COMMAND_TO_TYPE[q]
            return v_type, self._sources_for_type(v_type)

        # Natural language pattern matching
        if "architecture" in q or "system design" in q or "components" in q:
            v_type = VisualType.ARCHITECTURE_DIAGRAM
        elif "launch-readiness" in q or "launch readiness" in q or "ready to launch" in q or "launch matrix" in q:
            v_type = VisualType.LAUNCH_READINESS_MATRIX
        elif "depend" in q or "blocker" in q or "blocking" in q:
            v_type = VisualType.DEPENDENCY_GRAPH
        elif "sequence" in q or ("flow" in q and "async" in q):
            v_type = VisualType.SEQUENCE_DIAGRAM
        elif "state-machine" in q or "state machine" in q or "status transition" in q or "lifecycle" in q:
            v_type = VisualType.STATE_MACHINE
        elif "ownership" in q or "who owns" in q or "who is working on" in q:
            v_type = VisualType.OWNERSHIP_MAP
        elif "timeline" in q or "gantt" in q or "milestones" in q:
            v_type = VisualType.PROJECT_TIMELINE
        elif "incident-flow" in q or "incident" in q or "alert" in q:
            v_type = VisualType.INCIDENT_FLOW
        elif "runbook" in q or "procedure" in q or "troubleshoot" in q:
            v_type = VisualType.RUNBOOK_FLOWCHART
        elif "risk" in q or "risk-map" in q:
            v_type = VisualType.RISK_MAP
        elif "change" in q or "this week" in q:
            v_type = VisualType.CHANGE_MAP
        elif "board" in q or "kanban" in q or "sprint" in q:
            v_type = VisualType.TEAM_EXECUTION_BOARD
        elif "pr" in q or "pull request" in q:
            v_type = VisualType.PR_RELATIONSHIP_GRAPH
        elif "data flow" in q or "pipeline" in q:
            v_type = VisualType.DATA_FLOW_DIAGRAM
        elif "decision" in q:
            v_type = VisualType.DECISION_TREE
        elif "executive" in q or "leadership" in q or "one pager" in q:
            v_type = VisualType.EXECUTIVE_ONE_PAGER
        else:
            v_type = VisualType.EXECUTIVE_ONE_PAGER

        return v_type, self._sources_for_type(v_type)

    def _sources_for_type(self, v_type: VisualType) -> List[SourceType]:
        if v_type in [VisualType.ARCHITECTURE_DIAGRAM, VisualType.RUNBOOK_FLOWCHART, VisualType.DECISION_TREE]:
            return [SourceType.CONFLUENCE, SourceType.GITHUB, SourceType.JIRA]
        elif v_type in [VisualType.PR_RELATIONSHIP_GRAPH, VisualType.SEQUENCE_DIAGRAM]:
            return [SourceType.GITHUB, SourceType.JIRA]
        elif v_type in [VisualType.OWNERSHIP_MAP, VisualType.TEAM_EXECUTION_BOARD]:
            return [SourceType.JIRA, SourceType.GITHUB, SourceType.SLACK]
        else:
            return [SourceType.JIRA, SourceType.GITHUB, SourceType.SLACK, SourceType.CONFLUENCE]
