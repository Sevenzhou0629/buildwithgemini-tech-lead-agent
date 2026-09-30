import datetime
import json
from pathlib import Path
from typing import Any, Dict, List
from app.mcp.provider import MCPToolProvider, ToolDefinition
from app.models.evidence import Evidence, SourceType
from app.mock_data import MOCK_GITHUB_PRS

JSON_FILE = Path(__file__).resolve().parent.parent.parent.parent / "mock_data.json"


class GitHubMCPAdapter(MCPToolProvider):
    """GitHub MCP adapter normalizing Pull Requests, Commits, and CI/CD Status."""

    def _get_prs(self) -> List[Dict[str, Any]]:
        if JSON_FILE.exists():
            try:
                with open(JSON_FILE, "r") as f:
                    data = json.load(f)
                    return data.get("github", MOCK_GITHUB_PRS)
            except Exception:
                pass
        return MOCK_GITHUB_PRS

    @property
    def name(self) -> str:
        return "github"

    @property
    def source_type(self) -> SourceType:
        return SourceType.GITHUB

    async def list_tools(self) -> List[ToolDefinition]:
        return [
            ToolDefinition(
                name="github_list_pull_requests",
                description="List pull requests with filters for state, author, or branch",
                parameters={"type": "object", "properties": {"state": {"type": "string"}}},
                is_read_only=True
            ),
            ToolDefinition(
                name="github_get_pull_request",
                description="Get PR details by number",
                parameters={"type": "object", "properties": {"pull_number": {"type": "integer"}}, "required": ["pull_number"]},
                is_read_only=True
            ),
            ToolDefinition(
                name="github_merge_pull_request",
                description="Merge an approved pull request",
                parameters={"type": "object", "properties": {"pull_number": {"type": "integer"}}, "required": ["pull_number"]},
                is_read_only=False
            )
        ]

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        tools = {t.name: t for t in await self.list_tools()}
        if name not in tools:
            raise ValueError(f"Unknown GitHub tool: {name}")

        self.check_write_permission(tools[name])
        prs = self._get_prs()

        if name == "github_list_pull_requests":
            state = arguments.get("state", "open")
            if state == "all":
                return prs
            return [pr for pr in prs if pr["state"] == state]

        elif name == "github_get_pull_request":
            num = arguments.get("pull_number")
            for pr in prs:
                if pr["number"] == num:
                    return pr
            return {"error": f"PR #{num} not found"}

        elif name == "github_merge_pull_request":
            return {"status": "success", "message": f"PR #{arguments.get('pull_number')} merged."}

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[Evidence]:
        results: List[Evidence] = []
        q_lower = query.lower() if query else ""
        prs = self._get_prs()

        matched = [
            pr for pr in prs
            if not q_lower or q_lower in pr["title"].lower() or q_lower in pr.get("body", "").lower() or q_lower in pr.get("author", "").lower() or q_lower in pr.get("branch", "").lower() or q_lower in str(pr["number"])
        ]

        for item in matched[:limit]:
            results.append(
                Evidence(
                    source_type=SourceType.GITHUB,
                    source_name="GitHub Enterprise",
                    source_url=item.get("url"),
                    external_id=f"PR-{item['number']}",
                    author=item.get("author", "Unknown"),
                    timestamp=datetime.datetime.fromisoformat(item.get("updated_at", "2026-09-30T12:00:00Z").replace("Z", "+00:00")),
                    title=f"PR #{item['number']}: {item['title']} ({item.get('state', '').upper()})",
                    content=f"State: {item.get('state')}\nAuthor: {item.get('author')}\nBranch: {item.get('branch')}\nCI Status: {item.get('ci_status')}\nReview: {item.get('review_state')}\nBody: {item.get('body')}",
                    metadata_json={
                        "pr_number": item["number"],
                        "state": item.get("state"),
                        "ci_status": item.get("ci_status"),
                        "review_state": item.get("review_state"),
                        "branch": item.get("branch"),
                        "author": item.get("author")
                    }
                )
            )
        return results
