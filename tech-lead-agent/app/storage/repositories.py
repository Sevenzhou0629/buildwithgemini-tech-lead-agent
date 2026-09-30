from typing import List, Optional
from sqlmodel import Session, select, desc
from app.models.evidence import Evidence, SourceType
from app.models.project import ProjectSnapshot
from app.models.risks import RiskItem
from app.models.decisions import Decision
from app.models.actions import ActionItem


class EvidenceRepository:
    def __init__(self, session: Session):
        self.session = session

    def add(self, evidence: Evidence) -> Evidence:
        self.session.add(evidence)
        self.session.commit()
        self.session.refresh(evidence)
        return evidence

    def add_batch(self, items: List[Evidence]) -> List[Evidence]:
        for item in items:
            self.session.add(item)
        self.session.commit()
        return items

    def list_recent(self, limit: int = 50, source_type: Optional[SourceType] = None) -> List[Evidence]:
        stmt = select(Evidence).order_by(desc(Evidence.timestamp))
        if source_type:
            stmt = stmt.where(Evidence.source_type == source_type)
        stmt = stmt.limit(limit)
        return list(self.session.exec(stmt).all())

    def get_by_external_id(self, external_id: str) -> Optional[Evidence]:
        stmt = select(Evidence).where(Evidence.external_id == external_id)
        return self.session.exec(stmt).first()


class SnapshotRepository:
    def __init__(self, session: Session):
        self.session = session

    def save(self, snapshot: ProjectSnapshot) -> ProjectSnapshot:
        self.session.add(snapshot)
        self.session.commit()
        self.session.refresh(snapshot)
        return snapshot

    def get_latest(self, project_key: str = "DEFAULT") -> Optional[ProjectSnapshot]:
        stmt = select(ProjectSnapshot).where(ProjectSnapshot.project_key == project_key).order_by(desc(ProjectSnapshot.created_at))
        return self.session.exec(stmt).first()
