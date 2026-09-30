from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge
from app.models.evidence import Evidence


class IncidentFlowVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.INCIDENT_FLOW

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="alert", label="Alert: High Webhook Failure Rate (>5%)", status=VisualStatus.BLOCKED),
            Node(id="triage", label="Check Integration Test CI & Logs", status=VisualStatus.IN_PROGRESS),
            Node(id="check_queue", label="Is Webhook Queue Backlogged?", status=VisualStatus.UNKNOWN),
            Node(id="restart", label="Restart Failing Consumer Container", status=VisualStatus.PARTIALLY_VERIFIED),
            Node(id="rollback", label="Rollback PR #139 / Hold Release", status=VisualStatus.CONFLICT),
            Node(id="resolved", label="Incident Resolved & Monitored", status=VisualStatus.VERIFIED),
        ]

        edges = [
            Edge(source="alert", target="triage", label="triggers page"),
            Edge(source="triage", target="check_queue", label="inspect metrics"),
            Edge(source="check_queue", target="restart", label="consumers stuck"),
            Edge(source="restart", target="rollback", label="still failing"),
            Edge(source="rollback", target="resolved", label="traffic restored"),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Payment Webhook Incident Triage & Mitigation Flow",
            subtitle="Derived from runbook and Slack incident chatter",
            nodes=nodes,
            edges=edges,
            evidence_ids=[e.external_id for e in evidence[:6]]
        )


class RunbookFlowchartVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.RUNBOOK_FLOWCHART

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="step_start", label="Webhook Consumer Unhealthy Alert", status=VisualStatus.BLOCKED),
            Node(id="q_growing", label="Is Dead Letter Queue Growing?", status=VisualStatus.UNKNOWN),
            Node(id="action_drain", label="Drain & Re-drive Dead Letter Queue", status=VisualStatus.PARTIALLY_VERIFIED),
            Node(id="q_redis", label="Is Redis Cluster Healthy?", status=VisualStatus.VERIFIED),
            Node(id="action_scale_redis", label="Scale Redis Read Replicas", status=VisualStatus.IN_PROGRESS),
            Node(id="action_escalate", label="Escalate to On-Call Tech Lead", status=VisualStatus.CONFLICT),
        ]

        edges = [
            Edge(source="step_start", target="q_growing", label="start triage"),
            Edge(source="q_growing", target="action_drain", label="Yes"),
            Edge(source="q_growing", target="q_redis", label="No"),
            Edge(source="q_redis", target="action_scale_redis", label="Memory > 80%"),
            Edge(source="q_redis", target="action_escalate", label="Memory Normal but failing"),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Operational Runbook Diagnostic Flowchart",
            subtitle="Standard troubleshooting procedures for payment webhook failures",
            nodes=nodes,
            edges=edges,
            evidence_ids=[e.external_id for e in evidence[:6]]
        )
