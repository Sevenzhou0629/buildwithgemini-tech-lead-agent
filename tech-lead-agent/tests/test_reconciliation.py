import pytest
from app.services.reconciliation_service import ReconciliationService
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.mcp.adapters.slack import SlackMCPAdapter


@pytest.mark.asyncio
async def test_reconciliation_detects_premature_done_and_slack_warnings():
    jira = JiraMCPAdapter()
    github = GitHubMCPAdapter()
    slack = SlackMCPAdapter()

    evidence_jira = await jira.search("")
    evidence_gh = await github.search("")
    evidence_slack = await slack.search("")

    all_evidence = evidence_jira + evidence_gh + evidence_slack
    recon = ReconciliationService()
    conflicts = recon.reconcile(all_evidence)

    assert len(conflicts) > 0

    # Specifically check for PROJ-104 conflict (Jira says Done, PR #139 is open)
    conflict_titles = [c.title for c in conflicts]
    assert any("PROJ-104" in t for t in conflict_titles)
