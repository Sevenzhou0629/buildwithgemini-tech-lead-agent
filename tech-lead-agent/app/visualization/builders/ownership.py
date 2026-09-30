from typing import List
from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.models import VisualizationSpec, VisualType, VisualStatus, Node, Edge, Group
from app.models.evidence import Evidence


class OwnershipVisualBuilder(BaseVisualBuilder):
    @property
    def visual_type(self) -> VisualType:
        return VisualType.OWNERSHIP_MAP

    def build(self, evidence: List[Evidence]) -> VisualizationSpec:
        nodes = [
            Node(id="eng_alex", label="Alex (Senior Eng)", type="person", status=VisualStatus.IN_PROGRESS),
            Node(id="eng_sarah", label="Sarah (DevOps / Infra)", type="person", status=VisualStatus.VERIFIED),
            Node(id="eng_jonathan", label="Jonathan (Data Eng)", type="person", status=VisualStatus.BLOCKED),
            Node(id="eng_maria", label="Maria (Backend Eng)", type="person", status=VisualStatus.CONFLICT),
            Node(id="work_auth", label="Auth & Security Stream", type="stream", status=VisualStatus.IN_PROGRESS),
            Node(id="work_infra", label="Caching & DB Stream", type="stream", status=VisualStatus.PARTIALLY_VERIFIED),
            Node(id="work_payments", label="Payments Stream", type="stream", status=VisualStatus.CONFLICT),
            Node(id="t_101", label="PROJ-101 / PR #142", type="ticket", status=VisualStatus.IN_PROGRESS),
            Node(id="t_102", label="PROJ-102 / PR #135", type="ticket", status=VisualStatus.VERIFIED),
            Node(id="t_103", label="PROJ-103", type="ticket", status=VisualStatus.BLOCKED),
            Node(id="t_104", label="PROJ-104 / PR #139", type="ticket", status=VisualStatus.CONFLICT),
        ]

        edges = [
            Edge(source="eng_alex", target="work_auth", label="owns"),
            Edge(source="work_auth", target="t_101", label="delivers"),
            Edge(source="eng_sarah", target="work_infra", label="co-owns"),
            Edge(source="work_infra", target="t_102", label="delivered"),
            Edge(source="eng_jonathan", target="work_infra", label="co-owns"),
            Edge(source="work_infra", target="t_103", label="blocked on"),
            Edge(source="eng_maria", target="work_payments", label="owns"),
            Edge(source="work_payments", target="t_104", label="in progress"),
        ]

        groups = [
            Group(id="grp_engineers", label="Team Members", node_ids=["eng_alex", "eng_sarah", "eng_jonathan", "eng_maria"]),
            Group(id="grp_streams", label="Workstreams", node_ids=["work_auth", "work_infra", "work_payments"]),
        ]

        return VisualizationSpec(
            type=self.visual_type,
            title="Engineering Team Ownership & Work Allocation Map",
            subtitle="Observable mapping of engineers to active streams, tickets, and PRs",
            nodes=nodes,
            edges=edges,
            groups=groups,
            evidence_ids=[e.external_id for e in evidence[:10]]
        )
