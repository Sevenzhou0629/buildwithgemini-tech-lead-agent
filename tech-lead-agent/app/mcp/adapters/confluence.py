import datetime
import json
from pathlib import Path
from typing import Any, Dict, List
from app.mcp.provider import MCPToolProvider, ToolDefinition
from app.models.evidence import Evidence, SourceType
from app.mock_data import MOCK_CONFLUENCE_PAGES

JSON_FILE = Path(__file__).resolve().parent.parent.parent.parent / "mock_data.json"


class ConfluenceMCPAdapter(MCPToolProvider):
    """Confluence MCP adapter normalizing PRDs, RFCs, and Runbooks."""

    def _get_pages(self) -> List[Dict[str, Any]]:
        if JSON_FILE.exists():
            try:
                with open(JSON_FILE, "r") as f:
                    data = json.load(f)
                    return data.get("confluence", MOCK_CONFLUENCE_PAGES)
            except Exception:
                pass
        return MOCK_CONFLUENCE_PAGES

    @property
    def name(self) -> str:
        return "confluence"

    @property
    def source_type(self) -> SourceType:
        return SourceType.CONFLUENCE

    async def list_tools(self) -> List[ToolDefinition]:
        return [
            ToolDefinition(
                name="confluence_get_page",
                description="Get Confluence page content by page ID or title",
                parameters={"type": "object", "properties": {"title_or_id": {"type": "string"}}, "required": ["title_or_id"]},
                is_read_only=True
            ),
            ToolDefinition(
                name="confluence_search",
                description="Search documentation using CQL syntax",
                parameters={"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]},
                is_read_only=True
            )
        ]

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        tools = {t.name: t for t in await self.list_tools()}
        if name not in tools:
            raise ValueError(f"Unknown Confluence tool: {name}")

        self.check_write_permission(tools[name])
        pages = self._get_pages()

        if name == "confluence_get_page":
            target = arguments.get("title_or_id", "").lower()
            for page in pages:
                if page.get("id", "").lower() == target or target in page.get("title", "").lower():
                    return page
            return {"error": f"Page '{target}' not found"}

        elif name == "confluence_search":
            q = arguments.get("query", "").lower()
            return [
                p for p in pages
                if not q or q in p.get("title", "").lower() or q in p.get("content", "").lower()
            ]

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[Evidence]:
        results: List[Evidence] = []
        q_lower = query.lower() if query else ""
        pages = self._get_pages()

        matched = [
            p for p in pages
            if not q_lower or q_lower in p.get("title", "").lower() or q_lower in p.get("content", "").lower()
        ]

        for item in matched[:limit]:
            results.append(
                Evidence(
                    source_type=SourceType.CONFLUENCE,
                    source_name="Confluence Wiki",
                    source_url=item.get("url"),
                    external_id=item.get("id", "conf"),
                    author=item.get("author", "Unknown"),
                    timestamp=datetime.datetime.fromisoformat(item.get("updated_at", "2026-09-30T12:00:00Z").replace("Z", "+00:00")),
                    title=item.get("title", ""),
                    content=item.get("content", ""),
                    metadata_json={
                        "space": item.get("space"),
                        "page_id": item.get("id")
                    }
                )
            )
        return results
