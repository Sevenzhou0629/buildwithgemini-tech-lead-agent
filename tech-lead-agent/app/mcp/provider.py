from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from app.models.evidence import Evidence, SourceType
from app.config import settings


class ToolDefinition:
    """Represents an executable MCP tool definition."""
    def __init__(self, name: str, description: str, parameters: Dict[str, Any], is_read_only: bool = True):
        self.name = name
        self.description = description
        self.parameters = parameters
        self.is_read_only = is_read_only


class MCPToolProvider(ABC):
    """Abstract base provider for any engineering tool connected via MCP."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name, e.g. 'jira', 'github', 'slack', 'confluence'."""
        pass

    @property
    @abstractmethod
    def source_type(self) -> SourceType:
        """Standard source type classification."""
        pass

    @abstractmethod
    async def list_tools(self) -> List[ToolDefinition]:
        """List all tools exposed by this provider."""
        pass

    @abstractmethod
    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Any:
        """Execute a tool with arguments."""
        pass

    @abstractmethod
    async def search(self, query: str, limit: int = 10, **kwargs) -> List[Evidence]:
        """Search and normalize results into Evidence objects."""
        pass

    def check_write_permission(self, tool_def: ToolDefinition):
        """Enforces write-safety across all providers."""
        if not tool_def.is_read_only and not settings.ALLOW_EXTERNAL_WRITES:
            raise PermissionError(
                f"Tool '{tool_def.name}' requires write permissions, but ALLOW_EXTERNAL_WRITES is disabled."
            )
