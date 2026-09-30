from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge, Group
from app.models.evidence import Evidence


class RiskMapVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.RISK_MAP

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="risk_1", label="Deploying Closed Ticket with Open PR (PROJ-104)", status=VisualStatus.BLOCKED, owner="maria"),
            Node(id="risk_2", label="OAuth2 PKCE Review Delays (PROJ-101)", status=VisualStatus.IN_PROGRESS, owner="alex"),
            Node(id="risk_3", label="Unreviewed DB Replica Infrastructure (PROJ-103)", status=VisualStatus.BLOCKED, owner="jonathan"),
            Node(id="risk_4", label="Legacy Session Deprecation Client Breakage", status=VisualStatus.PARTIALLY_VERIFIED, owner="tech-lead"),
        ]

        groups = [
            Group(id="high_impact", label="High Impact / High Likelihood Risks", node_ids=["risk_1", "risk_2", "risk_3"]),
            Group(id="medium_impact", label="Medium Impact / Monitored Risks", node_ids=["risk_4"]),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Project Risk Assessment Map (Likelihood vs Impact)",
            subtitle="Identified from cross-system discrepancies and open dependencies",
            nodes=nodes,
            edges=[],
            groups=groups,
            evidence_ids=[e.external_id for e in evidence[:8]]
        )
