import datetime
import json
import os
from pathlib import Path
from typing import Any, Dict, List
from app.mcp.provider import MCPToolProvider, ToolDefinition
from app.models.evidence import Evidence, SourceType
from app.mock_data import MOCK_JIRA_ISSUES

JSON_FILE = Path(__file__).resolve().parent.parent.parent.parent / "mock_data.json"


class JiraMCPAdapter(MCPToolProvider):
    """Jira MCP adapter with normalized schema mapping."""

    def _get_issues(self) -> List[Dict[str, Any]]:
        if JSON_FILE.exists():
            try:
                with open(JSON_FILE, "r") as f:
                    data = json.load(f)
                    return data.get("jira", MOCK_JIRA_ISSUES)
            except Exception:
                pass
        return MOCK_JIRA_ISSUES

    @property
    def name(self) -> str:
        return "jira"

    @property
    def source_type(self) -> SourceType:
        return SourceType.JIRA

    async def list_tools(self) -> List[ToolDefinition]:
        return [
            ToolDefinition(
                name="jira_get_issue",
                description="Get issue details by issue key (e.g. PROJ-101)",
                parameters={"type": "object", "properties": {"issue_key": {"type": "string"}}, "required": ["issue_key"]},
                is_read_only=True
            ),
            ToolDefinition(
                name="jira_search_jql",
                description="Search issues using JQL syntax",
                parameters={"type": "object", "properties": {"jql": {"type": "string"}}, "required": ["jql"]},
                is_read_only=True
            ),
            ToolDefinition(
                name="jira_transition_issue",
                description="Transition an issue status",
                parameters={"type": "object", "properties": {"issue_key": {"type": "string"}, "transition": {"type": "string"}}, "required": ["issue_key", "transition"]},
                is_read_only=False
            )
        ]

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        tools = {t.name: t for t in await self.list_tools()}
        if name not in tools:
            raise ValueError(f"Unknown Jira tool: {name}")

        self.check_write_permission(tools[name])
        issues = self._get_issues()

        if name == "jira_get_issue":
            key = arguments.get("issue_key", "").upper()
            for issue in issues:
                if issue["id"].upper() == key:
                    return issue
            return {"error": f"Issue {key} not found"}

        elif name == "jira_search_jql":
            query = arguments.get("jql", "").lower()
            return [
                issue for issue in issues
                if query in issue["summary"].lower() or query in issue["description"].lower() or query in issue["status"].lower() or any(query in l.lower() for l in issue.get("labels", []))
            ] or issues

        elif name == "jira_transition_issue":
            return {"status": "success", "message": f"Issue transitioned to {arguments.get('transition')}"}

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[Evidence]:
        results: List[Evidence] = []
        q_lower = query.lower() if query else ""
        issues = self._get_issues()

        matched = [
            issue for issue in issues
            if not q_lower or q_lower in issue["summary"].lower() or q_lower in issue["status"].lower() or q_lower in issue["description"].lower() or any(q_lower in l for l in issue.get("labels", []))
        ]

        for item in matched[:limit]:
            results.append(
                Evidence(
                    source_type=SourceType.JIRA,
                    source_name="Jira Cloud",
                    source_url=item.get("url"),
                    external_id=item["id"],
                    author=item["assignee"],
                    timestamp=datetime.datetime.fromisoformat(item["updated"].replace("Z", "+00:00")),
                    title=f"[{item['id']}] {item['summary']} ({item['status']})",
                    content=f"Status: {item['status']}\nAssignee: {item['assignee']}\nPriority: {item['priority']}\nLabels: {', '.join(item.get('labels', []))}\nDescription: {item['description']}",
                    metadata_json={
                        "raw_status": item["status"],
                        "priority": item["priority"],
                        "labels": item.get("labels", []),
                        "assignee": item["assignee"],
                        "reporter": item.get("reporter", "")
                    }
                )
            )
        return results
