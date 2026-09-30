from datetime import datetime, timezone
import pytest
from app.models.evidence import Evidence, SourceType
from app.storage.repositories import EvidenceRepository
from sqlmodel import Session, SQLModel, create_engine


@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


def test_evidence_normalization_and_repo(test_db):
    repo = EvidenceRepository(test_db)
    ev = Evidence(
        source_type=SourceType.JIRA,
        source_name="Jira Cloud",
        source_url="https://jira.internal/browse/PROJ-101",
        external_id="PROJ-101",
        author="alex@company.com",
        timestamp=datetime.now(timezone.utc),
        title="[PROJ-101] Fix OAuth2",
        content="Description content here",
        metadata_json={"priority": "High", "raw_status": "In Progress"}
    )
    saved = repo.add(ev)
    assert saved.id is not None
    assert saved.external_id == "PROJ-101"

    recent = repo.list_recent(limit=10)
    assert len(recent) == 1
    assert recent[0].title == "[PROJ-101] Fix OAuth2"
