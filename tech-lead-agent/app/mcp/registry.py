import logging
from typing import Dict, List, Optional
from app.mcp.provider import MCPToolProvider
from app.models.evidence import SourceType

logger = logging.getLogger(__name__)


class MCPRegistry:
    """Central registry managing loaded MCP providers."""

    def __init__(self):
        self._providers: Dict[str, MCPToolProvider] = {}

    def register(self, provider: MCPToolProvider) -> None:
        """Registers an MCP tool provider."""
        self._providers[provider.name.lower()] = provider
        logger.info(f"Registered MCP provider: {provider.name} ({provider.source_type})")

    def get_provider(self, name: str) -> Optional[MCPToolProvider]:
        """Retrieve a specific provider by name."""
        return self._providers.get(name.lower())

    def list_providers(self) -> List[MCPToolProvider]:
        """List all active providers."""
        return list(self._providers.values())

    def get_providers_for_types(self, source_types: List[SourceType]) -> List[MCPToolProvider]:
        """Retrieve providers that match the given SourceTypes."""
        target_types = set(source_types)
        return [p for p in self._providers.values() if p.source_type in target_types]


# Global singleton instance
registry = MCPRegistry()
