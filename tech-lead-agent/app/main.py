from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config import settings
from app.storage.db import init_db
from app.mcp.registry import registry
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.mcp.adapters.slack import SlackMCPAdapter
from app.mcp.adapters.confluence import ConfluenceMCPAdapter
from app.api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    init_db()

    # Register default/configured MCP adapters
    registry.register(JiraMCPAdapter())
    registry.register(GitHubMCPAdapter())
    registry.register(SlackMCPAdapter())
    registry.register(ConfluenceMCPAdapter())

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Operational Reasoning & Multi-Source Evidence Reconciliation Agent",
    lifespan=lifespan
)

app.include_router(router)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mcp_mode": settings.MCP_MODE,
        "allow_writes": settings.ALLOW_EXTERNAL_WRITES
    }
