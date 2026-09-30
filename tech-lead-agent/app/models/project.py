from datetime import datetime, timezone
import uuid
from typing import Any, Dict
from sqlmodel import SQLModel, Field as DBField, Column, JSON


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class ProjectSnapshot(SQLModel, table=True):
    __tablename__ = "project_snapshots"

    id: str = DBField(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    project_key: str = DBField(default="DEFAULT", index=True)
    health_status: str = "GREEN"
    summary: str
    key_metrics_json: Dict[str, Any] = DBField(default_factory=dict, sa_column=Column(JSON))
    blockers_count: int = 0
    conflicts_count: int = 0
    created_at: datetime = DBField(default_factory=now_utc)
