from datetime import datetime, timezone
import uuid
from enum import Enum
from typing import Any, Dict, Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field as DBField, Column, JSON


class SourceType(str, Enum):
    JIRA = "jira"
    GITHUB = "github"
    SLACK = "slack"
    CONFLUENCE = "confluence"
    DASHBOARD = "dashboard"
    INCIDENT = "incident"
    OTHER = "other"


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class EvidenceBase(SQLModel):
    """Normalized evidence record from any engineering system."""
    source_type: SourceType
    source_name: str
    source_url: Optional[str] = None
    external_id: str
    author: Optional[str] = "Unknown"
    timestamp: datetime = DBField(default_factory=now_utc)
    title: str
    content: str
    metadata_json: Dict[str, Any] = DBField(default_factory=dict, sa_column=Column(JSON))


class Evidence(EvidenceBase, table=True):
    """Database persistence model for Evidence."""
    __tablename__ = "evidence"

    id: str = DBField(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        index=True
    )
    created_at: datetime = DBField(default_factory=now_utc)


class EvidenceFilter(BaseModel):
    """Filters for querying evidence."""
    source_types: Optional[list[SourceType]] = None
    since: Optional[datetime] = None
    until: Optional[datetime] = None
    author: Optional[str] = None
    search_term: Optional[str] = None
