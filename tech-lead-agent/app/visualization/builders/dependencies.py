from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge, Annotation
from app.models.evidence import Evidence


class DependencyVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.DEPENDENCY_GRAPH

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="T_PROJ_101", label="PROJ-101: OAuth2 PKCE", type="ticket", status=VisualStatus.IN_PROGRESS, owner="alex"),
            Node(id="PR_142", label="PR #142: PKCE Impl", type="pr", status=VisualStatus.BLOCKED, owner="alex"),
            Node(id="T_PROJ_102", label="PROJ-102: Redis Cluster", type="ticket", status=VisualStatus.VERIFIED, owner="sarah"),
            Node(id="PR_135", label="PR #135: Redis Terraform", type="pr", status=VisualStatus.VERIFIED, owner="sarah"),
            Node(id="T_PROJ_103", label="PROJ-103: DB Replicas", type="ticket", status=VisualStatus.BLOCKED, owner="jonathan"),
            Node(id="T_PROJ_104", label="PROJ-104: Webhook Retry", type="ticket", status=VisualStatus.CONFLICT, owner="maria"),
            Node(id="PR_139", label="PR #139: Webhook Backoff", type="pr", status=VisualStatus.BLOCKED, owner="maria"),
            Node(id="MILESTONE_LAUNCH", label="Core Service Production Launch", type="milestone", status=VisualStatus.BLOCKED),
        ]

        edges = [
            Edge(source="PR_142", target="T_PROJ_101", label="implements", type="implements"),
            Edge(source="T_PROJ_101", target="MILESTONE_LAUNCH", label="blocks launch", type="blocks"),
            Edge(source="PR_135", target="T_PROJ_102", label="merged into", type="merged"),
            Edge(source="T_PROJ_102", target="MILESTONE_LAUNCH", label="satisfied", type="requires"),
            Edge(source="T_PROJ_103", target="MILESTONE_LAUNCH", label="blocks launch", type="blocks"),
            Edge(source="PR_139", target="T_PROJ_104", label="unmerged dependency", type="implements"),
            Edge(source="T_PROJ_104", target="MILESTONE_LAUNCH", label="false done", type="blocks"),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Launch Blocker Critical Dependency Graph",
            subtitle="Cross-referencing Jira blockers and GitHub pull request status",
            nodes=nodes,
            edges=edges,
            evidence_ids=[e.external_id for e in evidence[:10]],
            assumptions=["Launch date is targeted for October 5, 2026."],
            unknowns=["DevOps team turnaround time for Cloud SQL module review."]
        )
