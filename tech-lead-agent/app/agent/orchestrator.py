import logging
from app.agent.planner import QueryPlanner
from app.agent.synthesizer import Synthesizer
from app.services.evidence_service import EvidenceService
from app.services.reconciliation_service import ReconciliationService
from app.models.response import TechLeadAnalysisResponse

logger = logging.getLogger(__name__)


class TechLeadOrchestrator:
    """Core reasoning engine orchestrating tool dispatch, normalization, reconciliation, and synthesis."""

    def __init__(
        self,
        planner: QueryPlanner,
        evidence_service: EvidenceService,
        recon_service: ReconciliationService,
        synthesizer: Synthesizer
    ):
        self.planner = planner
        self.evidence_service = evidence_service
        self.recon_service = recon_service
        self.synthesizer = synthesizer

    async def analyze(self, query: str) -> TechLeadAnalysisResponse:
        logger.info(f"Orchestrating operational query: '{query}'")

        # 1. Plan source queries
        sources = self.planner.plan(query)

        # 2. Parallel evidence gathering via MCP
        evidence = await self.evidence_service.gather_evidence(
            query=query,
            sources=sources,
            limit_per_source=15,
            persist=True
        )

        # 3. Multi-source reconciliation
        conflicts = self.recon_service.reconcile(evidence)

        # 4. Rigorous operational synthesis
        response = await self.synthesizer.synthesize(
            query=query,
            evidence=evidence,
            conflicts=conflicts
        )

        return response
