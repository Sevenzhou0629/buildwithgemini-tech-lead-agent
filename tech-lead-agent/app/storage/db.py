from sqlmodel import SQLModel, create_engine, Session
from app.config import settings

# SQLite connection args
connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
engine = create_engine(settings.DATABASE_URL, echo=settings.DEBUG, connect_args=connect_args)


def init_db():
    """Initializes database tables."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency for obtaining DB session."""
    with Session(engine) as session:
        yield session
