from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge, Group, Annotation
from app.models.evidence import Evidence


class ArchitectureVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.ARCHITECTURE_DIAGRAM

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="client_web", label="Web & Mobile Clients", type="client", status=VisualStatus.IN_PROGRESS, owner="alex"),
            Node(id="auth_service", label="Auth Service (OAuth2 PKCE)", type="service", status=VisualStatus.IN_PROGRESS, owner="alex"),
            Node(id="core_api", label="Core API Gateway", type="service", status=VisualStatus.VERIFIED, owner="tech-lead"),
            Node(id="webhook_consumer", label="Payment Webhook Consumer", type="service", status=VisualStatus.CONFLICT, owner="maria"),
            Node(id="redis_cluster", label="Redis Cache Cluster", type="database", status=VisualStatus.VERIFIED, owner="sarah"),
            Node(id="db_primary", label="Cloud SQL Primary (Postgres)", type="database", status=VisualStatus.VERIFIED, owner="devops"),
            Node(id="db_replica", label="Cloud SQL Read Replicas", type="database", status=VisualStatus.BLOCKED, owner="jonathan"),
        ]

        edges = [
            Edge(source="client_web", target="auth_service", label="Authenticate (PKCE)", type="calls"),
            Edge(source="client_web", target="core_api", label="HTTPS / JSON", type="calls"),
            Edge(source="core_api", target="redis_cluster", label="Cache Lookups", type="reads_from"),
            Edge(source="core_api", target="db_primary", label="Transactional Writes", type="writes_to"),
            Edge(source="webhook_consumer", target="core_api", label="Payment Events", type="calls"),
            Edge(source="core_api", target="db_replica", label="Analytics Queries", type="reads_from"),
        ]

        groups = [
            Group(id="grp_clients", label="Clients & Edge", node_ids=["client_web"]),
            Group(id="grp_services", label="Application Services", node_ids=["auth_service", "core_api", "webhook_consumer"]),
            Group(id="grp_data", label="Persistence & Caching", node_ids=["redis_cluster", "db_primary", "db_replica"]),
        ]

        annotations = [
            Annotation(
                text="PROJ-104 conflict: Webhook consumer marked Done in Jira, but PR #139 is open with failing CI",
                severity="blocker",
                related_node_ids=["webhook_consumer"]
            ),
            Annotation(
                text="PROJ-103 blocker: Read replicas waiting for Terraform module approval",
                severity="blocker",
                related_node_ids=["db_replica"]
            )
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Core Platform Architecture & Component Operational Health",
            subtitle="Derived from Confluence RFCs, GitHub PRs, and Jira Epics",
            nodes=nodes,
            edges=edges,
            groups=groups,
            annotations=annotations,
            evidence_ids=[e.external_id for e in evidence[:10]],
            assumptions=["Redis cluster deployed to staging per PR #135."],
            unknowns=["Mobile app client OAuth2 release date is unconfirmed."]
        )
