from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge
from app.models.evidence import Evidence


class StateMachineVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.STATE_MACHINE

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="SUBMITTED", label="SUBMITTED", status=VisualStatus.VERIFIED),
            Node(id="VALIDATING", label="VALIDATING", status=VisualStatus.VERIFIED),
            Node(id="PROCESSING", label="PROCESSING", status=VisualStatus.IN_PROGRESS),
            Node(id="RETRYING", label="RETRYING (Backoff)", status=VisualStatus.PARTIALLY_VERIFIED),
            Node(id="COMPLETED", label="COMPLETED", status=VisualStatus.VERIFIED),
            Node(id="FAILED", label="FAILED (Dead Letter)", status=VisualStatus.BLOCKED),
        ]

        edges = [
            Edge(source="SUBMITTED", target="VALIDATING", label="receive webhook"),
            Edge(source="VALIDATING", target="PROCESSING", label="signature valid"),
            Edge(source="VALIDATING", target="FAILED", label="signature mismatch"),
            Edge(source="PROCESSING", target="COMPLETED", label="charge confirmed"),
            Edge(source="PROCESSING", target="RETRYING", label="timeout / 503 error"),
            Edge(source="RETRYING", target="PROCESSING", label="exponential backoff <= 5"),
            Edge(source="RETRYING", target="FAILED", label="max retries exhausted"),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Payment Webhook Job State Machine & Retry Lifecycle",
            subtitle="Grounded in PROJ-104 specifications and Confluence runbook",
            nodes=nodes,
            edges=edges,
            evidence_ids=[e.external_id for e in evidence[:6]],
            assumptions=["Max retries set to 5."],
            unknowns=["Handling of duplicate webhooks received concurrently."]
        )
