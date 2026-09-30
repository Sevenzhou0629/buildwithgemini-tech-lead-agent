import asyncio
from typing import List, Optional
from app.mcp.registry import MCPRegistry, registry
from app.models.evidence import Evidence, SourceType
from app.storage.repositories import EvidenceRepository


class EvidenceService:
    """Coordinates parallel queries across MCP tool providers and aggregates normalized evidence."""

    def __init__(self, mcp_registry: MCPRegistry = registry, repo: Optional[EvidenceRepository] = None):
        self.registry = mcp_registry
        self.repo = repo

    async def gather_evidence(
        self,
        query: str,
        sources: Optional[List[SourceType]] = None,
        limit_per_source: int = 10,
        persist: bool = True
    ) -> List[Evidence]:
        """Queries selected or all active MCP sources in parallel."""
        providers = self.registry.get_providers_for_types(sources) if sources else self.registry.list_providers()

        # For broad operational questions, search with empty string or keywords so providers return relevant data
        tasks = [provider.search(query=query, limit=limit_per_source) for provider in providers]
        results_nested = await asyncio.gather(*tasks, return_exceptions=True)

        aggregated: List[Evidence] = []
        for r in results_nested:
            if isinstance(r, list):
                aggregated.extend(r)

        # Fallback: if specific search returned nothing for broad query, fetch latest general context
        if not aggregated and query:
            fallback_tasks = [provider.search(query="", limit=limit_per_source) for provider in providers]
            fallback_results = await asyncio.gather(*fallback_tasks, return_exceptions=True)
            for r in fallback_results:
                if isinstance(r, list):
                    aggregated.extend(r)

        # Sort chronologically (most recent first)
        aggregated.sort(key=lambda e: e.timestamp, reverse=True)

        if persist and self.repo and aggregated:
            self.repo.add_batch(aggregated)

        return aggregated
