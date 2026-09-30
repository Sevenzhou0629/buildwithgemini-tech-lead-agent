import pytest
from app.mcp.registry import MCPRegistry
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.models.evidence import SourceType


@pytest.mark.asyncio
async def test_mcp_registry_and_permissions():
    reg = MCPRegistry()
    jira = JiraMCPAdapter()
    github = GitHubMCPAdapter()

    reg.register(jira)
    reg.register(github)

    assert len(reg.list_providers()) == 2
    assert reg.get_provider("jira") is not None

    # Test read-only tool execution
    issue = await jira.call_tool("jira_get_issue", {"issue_key": "PROJ-101"})
    assert issue["id"] == "PROJ-101"

    # Test write tool blocked when writes disabled
    with pytest.raises(PermissionError):
        await jira.call_tool("jira_transition_issue", {"issue_key": "PROJ-101", "transition": "Done"})
