from datetime import datetime, timezone
import uuid
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field as DBField


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class RiskSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    BLOCKER = "blocker"


class RiskCategory(str, Enum):
    TECHNICAL = "technical"
    ALIGNMENT = "alignment"
    SCHEDULE = "schedule"
    COMPLIANCE = "compliance"
    OPERATIONAL = "operational"


class RiskItem(SQLModel, table=True):
    __tablename__ = "risks"

    id: str = DBField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str
    description: str
    severity: RiskSeverity = RiskSeverity.MEDIUM
    category: RiskCategory = RiskCategory.TECHNICAL
    affected_components: Optional[str] = None
    mitigation_suggestion: Optional[str] = None
    evidence_ids: Optional[str] = None
    created_at: datetime = DBField(default_factory=now_utc)
