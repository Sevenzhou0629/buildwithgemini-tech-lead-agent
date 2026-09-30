from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge, Group
from app.models.evidence import Evidence


class ExecutiveOnePagerVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.EXECUTIVE_ONE_PAGER

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="summary_health", label="Health: RED (3 Critical Blockers)", status=VisualStatus.BLOCKED),
            Node(id="stream_auth", label="Security & Auth: PR Under Review", status=VisualStatus.IN_PROGRESS, owner="alex"),
            Node(id="stream_caching", label="Caching: Redis Deployed to Staging", status=VisualStatus.VERIFIED, owner="sarah"),
            Node(id="stream_db", label="DB Replicas: Waiting on Terraform", status=VisualStatus.BLOCKED, owner="jonathan"),
            Node(id="stream_pay", label="Payments: Discrepancy (PR #139 Open)", status=VisualStatus.CONFLICT, owner="maria"),
            Node(id="launch_verdict", label="Verdict: HOLD PRODUCTION LAUNCH", status=VisualStatus.BLOCKED),
        ]

        edges = [
            Edge(source="summary_health", target="stream_auth", label="monitored"),
            Edge(source="summary_health", target="stream_caching", label="monitored"),
            Edge(source="summary_health", target="stream_db", label="monitored"),
            Edge(source="summary_health", target="stream_pay", label="monitored"),
            Edge(source="stream_db", target="launch_verdict", label="causes hold"),
            Edge(source="stream_pay", target="launch_verdict", label="causes hold"),
        ]

        groups = [
            Group(id="status_overview", label="Leadership Project Health Overview", node_ids=["summary_health", "launch_verdict"]),
            Group(id="workstream_details", label="Workstream Highlights", node_ids=["stream_auth", "stream_caching", "stream_db", "stream_pay"]),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Executive Status One-Pager: Core Service Launch Audit",
            subtitle="Synthesized for Engineering Leadership and Product Stakeholders",
            nodes=nodes,
            edges=edges,
            groups=groups,
            evidence_ids=[e.external_id for e in evidence[:10]],
            assumptions=["Target launch date remains October 5, 2026."],
            unknowns=["Resolution timeline for DevOps Cloud SQL review."]
        )
