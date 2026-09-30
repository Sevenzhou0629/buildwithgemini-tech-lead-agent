from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from sqlmodel import Session
from app.storage.db import get_session
from app.storage.repositories import EvidenceRepository
from app.mcp.registry import registry
from app.agent.planner import QueryPlanner
from app.agent.synthesizer import Synthesizer
from app.agent.orchestrator import TechLeadOrchestrator
from app.services.evidence_service import EvidenceService
from app.services.reconciliation_service import ReconciliationService
from app.services.status_service import StatusService
from app.models.response import TechLeadAnalysisResponse
from app.models.evidence import SourceType

router = APIRouter(prefix="/api/v1")


class QueryRequest(BaseModel):
    query: str


def get_orchestrator(session: Session = Depends(get_session)) -> TechLeadOrchestrator:
    repo = EvidenceRepository(session)
    evidence_service = EvidenceService(mcp_registry=registry, repo=repo)
    recon_service = ReconciliationService()
    planner = QueryPlanner()
    synthesizer = Synthesizer()
    return TechLeadOrchestrator(planner, evidence_service, recon_service, synthesizer)


def get_status_service(session: Session = Depends(get_session)) -> StatusService:
    repo = EvidenceRepository(session)
    evidence_service = EvidenceService(mcp_registry=registry, repo=repo)
    recon_service = ReconciliationService()
    return StatusService(evidence_service, recon_service)


@router.post("/query", response_model=TechLeadAnalysisResponse)
async def query_tech_lead(
    req: QueryRequest,
    orchestrator: TechLeadOrchestrator = Depends(get_orchestrator)
):
    """Execute natural-language operational query across connected MCP sources."""
    return await orchestrator.analyze(req.query)


@router.get("/status")
async def get_project_status(
    project_key: str = "DEFAULT",
    service: StatusService = Depends(get_status_service)
):
    """Get calculated project status, blockers, and cross-system conflicts."""
    return await service.get_project_status(project_key)


@router.get("/launch-readiness")
async def evaluate_launch_readiness(
    service: StatusService = Depends(get_status_service)
):
    """Evaluate if project meets production launch readiness criteria."""
    return await service.evaluate_launch_readiness()


@router.get("/evidence")
def list_evidence(
    source_type: Optional[SourceType] = None,
    limit: int = 50,
    session: Session = Depends(get_session)
):
    """List recent normalized evidence stored in local database."""
    repo = EvidenceRepository(session)
    return repo.list_recent(limit=limit, source_type=source_type)


@router.get("/mcp/providers")
def list_mcp_providers():
    """List active MCP providers and their registration status."""
    return [
        {
            "name": p.name,
            "source_type": p.source_type.value,
        }
        for p in registry.list_providers()
    ]

from app.visualization.models import VisualType, OutputFormat, VisualizationResult
from app.visualization.service import VisualizationService


class VisualizeRequest(BaseModel):
    query: str
    format: Optional[OutputFormat] = OutputFormat.MERMAID
    visual_type: Optional[VisualType] = None


@router.post("/visualize", response_model=VisualizationResult)
async def generate_visual(
    req: VisualizeRequest,
    session: Session = Depends(get_session)
):
    """Generate evidence-grounded diagrams and technical visuals (Mermaid, SVG, JSON, Markdown)."""
    repo = EvidenceRepository(session)
    ev_service = EvidenceService(mcp_registry=registry, repo=repo)
    vis_service = VisualizationService(evidence_service=ev_service)
    return await vis_service.generate_visualization(
        query=req.query,
        requested_format=req.format or OutputFormat.MERMAID,
        force_type=req.visual_type
    )
