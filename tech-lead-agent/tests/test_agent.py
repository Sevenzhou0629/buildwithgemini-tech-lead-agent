import pytest
from app.agent.orchestrator import TechLeadOrchestrator
from app.agent.planner import QueryPlanner
from app.agent.synthesizer import Synthesizer
from app.services.evidence_service import EvidenceService
from app.services.reconciliation_service import ReconciliationService
from app.mcp.registry import MCPRegistry
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.mcp.adapters.slack import SlackMCPAdapter
from app.mcp.adapters.confluence import ConfluenceMCPAdapter


@pytest.mark.asyncio
async def test_tech_lead_agent_full_analysis():
    reg = MCPRegistry()
    reg.register(JiraMCPAdapter())
    reg.register(GitHubMCPAdapter())
    reg.register(SlackMCPAdapter())
    reg.register(ConfluenceMCPAdapter())

    orchestrator = TechLeadOrchestrator(
        planner=QueryPlanner(),
        evidence_service=EvidenceService(mcp_registry=reg),
        recon_service=ReconciliationService(),
        synthesizer=Synthesizer()
    )

    res = await orchestrator.analyze("What is blocking launch and what are the cross-system risks?")
    assert len(res.facts) > 0
    assert len(res.conflicts) > 0
    assert len(res.risks) > 0
    assert len(res.action_items) > 0
    assert res.evidence_count > 0
