import datetime
import json
from pathlib import Path
from typing import Any, Dict, List
from app.mcp.provider import MCPToolProvider, ToolDefinition
from app.models.evidence import Evidence, SourceType
from app.mock_data import MOCK_SLACK_MESSAGES

JSON_FILE = Path(__file__).resolve().parent.parent.parent.parent / "mock_data.json"


class SlackMCPAdapter(MCPToolProvider):
    """Slack MCP adapter normalizing conversations, decisions, and incident alerts."""

    def _get_messages(self) -> List[Dict[str, Any]]:
        if JSON_FILE.exists():
            try:
                with open(JSON_FILE, "r") as f:
                    data = json.load(f)
                    return data.get("slack", MOCK_SLACK_MESSAGES)
            except Exception:
                pass
        return MOCK_SLACK_MESSAGES

    @property
    def name(self) -> str:
        return "slack"

    @property
    def source_type(self) -> SourceType:
        return SourceType.SLACK

    async def list_tools(self) -> List[ToolDefinition]:
        return [
            ToolDefinition(
                name="slack_search_messages",
                description="Search Slack channels for keywords or user mentions",
                parameters={"type": "object", "properties": {"query": {"type": "string"}, "channel": {"type": "string"}}},
                is_read_only=True
            ),
            ToolDefinition(
                name="slack_post_message",
                description="Post a message to a channel",
                parameters={"type": "object", "properties": {"channel": {"type": "string"}, "text": {"type": "string"}}, "required": ["channel", "text"]},
                is_read_only=False
            )
        ]

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        tools = {t.name: t for t in await self.list_tools()}
        if name not in tools:
            raise ValueError(f"Unknown Slack tool: {name}")

        self.check_write_permission(tools[name])
        messages = self._get_messages()

        if name == "slack_search_messages":
            q = arguments.get("query", "").lower()
            ch = arguments.get("channel", "")
            return [
                m for m in messages
                if (not q or q in m.get("text", "").lower() or q in m.get("user", "").lower()) and (not ch or ch in m.get("channel", ""))
            ]

        elif name == "slack_post_message":
            return {"ok": True, "ts": "1715000000.000100", "message": "Posted"}

    async def search(self, query: str, limit: int = 10, **kwargs) -> List[Evidence]:
        results: List[Evidence] = []
        q_lower = query.lower() if query else ""
        messages = self._get_messages()

        matched = [
            m for m in messages
            if not q_lower or q_lower in m.get("text", "").lower() or q_lower in m.get("user", "").lower() or q_lower in m.get("channel", "").lower()
        ]

        for item in matched[:limit]:
            results.append(
                Evidence(
                    source_type=SourceType.SLACK,
                    source_name=f"Slack ({item.get('channel')})",
                    source_url=item.get("permalink"),
                    external_id=item.get("id", "msg"),
                    author=item.get("user", "Unknown"),
                    timestamp=datetime.datetime.fromisoformat(item.get("timestamp", "2026-09-30T12:00:00Z").replace("Z", "+00:00")),
                    title=f"Slack in {item.get('channel')} by @{item.get('user')}",
                    content=item.get("text", ""),
                    metadata_json={
                        "channel": item.get("channel"),
                        "user": item.get("user"),
                        "message_id": item.get("id")
                    }
                )
            )
        return results
