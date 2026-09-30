from datetime import datetime, timezone
import uuid
from enum import Enum
from typing import Optional
from sqlmodel import SQLModel, Field as DBField


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class ActionPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ActionStatus(str, Enum):
    PROPOSED = "proposed"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


class ActionItem(SQLModel, table=True):
    __tablename__ = "action_items"

    id: str = DBField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    title: str
    description: str
    owner: Optional[str] = None
    priority: ActionPriority = ActionPriority.MEDIUM
    status: ActionStatus = ActionStatus.PROPOSED
    source_ref: Optional[str] = None
    created_at: datetime = DBField(default_factory=now_utc)
