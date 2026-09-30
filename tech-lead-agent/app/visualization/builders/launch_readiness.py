from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge, Group
from app.models.evidence import Evidence


class LaunchReadinessVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.LAUNCH_READINESS_MATRIX

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        categories = [
            Node(id="c_security", label="Security (OAuth2 PKCE)", type="category", status=VisualStatus.IN_PROGRESS, owner="alex"),
            Node(id="c_caching", label="Caching (Redis Cluster)", type="category", status=VisualStatus.VERIFIED, owner="sarah"),
            Node(id="c_database", label="Database (Read Replicas)", type="category", status=VisualStatus.BLOCKED, owner="jonathan"),
            Node(id="c_payments", label="Payments & Idempotency", type="category", status=VisualStatus.CONFLICT, owner="maria"),
            Node(id="c_ci", label="CI / CD Automation", type="category", status=VisualStatus.PARTIALLY_VERIFIED, owner="team"),
            Node(id="c_runbooks", label="Operational Runbooks", type="category", status=VisualStatus.VERIFIED, owner="maria"),
            Node(id="c_observability", label="Metrics & Tracing", type="category", status=VisualStatus.NOT_VERIFIED, owner="unknown"),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Production Launch Readiness Evaluation Matrix",
            subtitle="Overall Status: NOT READY (2 Blockers, 1 Conflict)",
            nodes=categories,
            edges=[],
            groups=[
                Group(id="g_ready", label="Verified & Green", node_ids=["c_caching", "c_runbooks"]),
                Group(id="g_blocked", label="Blocked & Incomplete", node_ids=["c_security", "c_database", "c_payments", "c_ci", "c_observability"])
            ],
            evidence_ids=[e.external_id for e in evidence],
            assumptions=["Confluence RFC 2.4 checklist is the authoritative release standard."],
            unknowns=["Load test results under realistic peak traffic."]
        )
