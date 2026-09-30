from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge
from app.models.evidence import Evidence


class SequenceVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.SEQUENCE_DIAGRAM

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="Client", label="Client (Browser/Mobile)", status=VisualStatus.VERIFIED),
            Node(id="Gateway", label="API Gateway", status=VisualStatus.VERIFIED),
            Node(id="Auth", label="Auth Service", status=VisualStatus.IN_PROGRESS),
            Node(id="PaymentWorker", label="Payment Webhook Consumer", status=VisualStatus.CONFLICT),
            Node(id="Redis", label="Redis Cluster", status=VisualStatus.VERIFIED),
            Node(id="DB", label="Postgres DB", status=VisualStatus.VERIFIED),
        ]

        edges = [
            Edge(source="Client", target="Gateway", label="POST /api/v1/checkout", type="sync"),
            Edge(source="Gateway", target="Auth", label="Validate PKCE Bearer Token", type="sync"),
            Edge(source="Auth", target="Gateway", label="Token Validated", type="sync"),
            Edge(source="Gateway", target="PaymentWorker", label="Enqueue Webhook Event", type="async"),
            Edge(source="PaymentWorker", target="Redis", label="Set Idempotency Key", type="sync"),
            Edge(source="PaymentWorker", target="DB", label="Record Transaction (with Retries)", type="sync"),
            Edge(source="Gateway", target="Client", label="HTTP 202 Accepted", type="sync"),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Asynchronous Payment Webhook & Checkout Execution Sequence",
            subtitle="Details OAuth2 token validation and idempotent retry flow",
            nodes=nodes,
            edges=edges,
            evidence_ids=[e.external_id for e in evidence[:8]],
            assumptions=["Payment retry uses exponential backoff up to 5 attempts per runbook."],
            unknowns=["Current webhook timeout threshold in staging integration tests."]
        )
