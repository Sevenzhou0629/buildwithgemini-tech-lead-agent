import pytest
from app.services.status_service import StatusService
from app.services.evidence_service import EvidenceService
from app.services.reconciliation_service import ReconciliationService
from app.mcp.registry import MCPRegistry
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.mcp.adapters.slack import SlackMCPAdapter
from app.mcp.adapters.confluence import ConfluenceMCPAdapter


@pytest.mark.asyncio
async def test_launch_readiness_audit():
    reg = MCPRegistry()
    reg.register(JiraMCPAdapter())
    reg.register(GitHubMCPAdapter())
    reg.register(SlackMCPAdapter())
    reg.register(ConfluenceMCPAdapter())

    ev_service = EvidenceService(mcp_registry=reg)
    recon = ReconciliationService()
    status_service = StatusService(ev_service, recon)

    readiness = await status_service.evaluate_launch_readiness()
    assert readiness["launch_ready"] is False
    assert "NOT READY" in readiness["verdict"]
