from datetime import datetime, timezone
import uuid
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field as DBField


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class DecisionStatus(str, Enum):
    AGREED = "agreed"
    PENDING = "pending"
    CONFLICTED = "conflicted"
    SUPERSEDED = "superseded"


class Decision(SQLModel, table=True):
    __tablename__ = "decisions"

    id: str = DBField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str
    description: str
    status: DecisionStatus = DecisionStatus.PENDING
    deciders: Optional[str] = None
    source_url: Optional[str] = None
    unresolved_questions: Optional[str] = None
    timestamp: datetime = DBField(default_factory=now_utc)
