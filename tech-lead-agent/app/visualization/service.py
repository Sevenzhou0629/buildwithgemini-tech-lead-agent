from typing import Dict, List, Optional
from app.visualization.models import (
    VisualType, OutputFormat, VisualizationSpec, VisualizationResult
)
from app.visualization.planner import VisualizationPlanner
from app.visualization.validators import validate_spec
from app.visualization.renderers.mermaid import render_mermaid
from app.visualization.renderers.svg import render_svg
from app.visualization.renderers.markdown import render_markdown

from app.visualization.builders.base import BaseVisualBuilder
from app.visualization.builders.architecture import ArchitectureVisualBuilder
from app.visualization.builders.dependencies import DependencyVisualBuilder
from app.visualization.builders.launch_readiness import LaunchReadinessVisualBuilder
from app.visualization.builders.sequence import SequenceVisualBuilder
from app.visualization.builders.state_machine import StateMachineVisualBuilder
from app.visualization.builders.ownership import OwnershipVisualBuilder
from app.visualization.builders.incident_runbook import IncidentFlowVisualBuilder, RunbookFlowchartVisualBuilder
from app.visualization.builders.risk_map import RiskMapVisualBuilder
from app.visualization.builders.executive import ExecutiveOnePagerVisualBuilder

from app.services.evidence_service import EvidenceService
from app.mcp.registry import registry


class VisualizationService:
    """End-to-end service coordinating Intent -> Evidence -> Spec Builder -> Validation -> Rendering."""

    def __init__(self, evidence_service: Optional[EvidenceService] = None):
        self.evidence_service = evidence_service or EvidenceService(mcp_registry=registry)
        self.planner = VisualizationPlanner()

        # Register builders
        self._builders: Dict[VisualType, BaseVisualBuilder] = {
            VisualType.ARCHITECTURE_DIAGRAM: ArchitectureVisualBuilder(),
            VisualType.DEPENDENCY_GRAPH: DependencyVisualBuilder(),
            VisualType.LAUNCH_READINESS_MATRIX: LaunchReadinessVisualBuilder(),
            VisualType.SEQUENCE_DIAGRAM: SequenceVisualBuilder(),
            VisualType.STATE_MACHINE: StateMachineVisualBuilder(),
            VisualType.OWNERSHIP_MAP: OwnershipVisualBuilder(),
            VisualType.INCIDENT_FLOW: IncidentFlowVisualBuilder(),
            VisualType.RUNBOOK_FLOWCHART: RunbookFlowchartVisualBuilder(),
            VisualType.RISK_MAP: RiskMapVisualBuilder(),
            VisualType.EXECUTIVE_ONE_PAGER: ExecutiveOnePagerVisualBuilder(),
            # Fallbacks mapping to closest structural builders
            VisualType.PROJECT_TIMELINE: DependencyVisualBuilder(),
            VisualType.DECISION_TREE: RunbookFlowchartVisualBuilder(),
            VisualType.CHANGE_MAP: ExecutiveOnePagerVisualBuilder(),
            VisualType.TEAM_EXECUTION_BOARD: OwnershipVisualBuilder(),
            VisualType.PR_RELATIONSHIP_GRAPH: DependencyVisualBuilder(),
            VisualType.DATA_FLOW_DIAGRAM: ArchitectureVisualBuilder(),
        }

    async def generate_visualization(
        self,
        query: str,
        requested_format: OutputFormat = OutputFormat.MERMAID,
        force_type: Optional[VisualType] = None
    ) -> VisualizationResult:
        # 1. Determine VisualType and MCP sources
        if force_type:
            v_type = force_type
            sources = self.planner._sources_for_type(v_type)
        else:
            v_type, sources = self.planner.plan(query)

        # 2. Query MCP evidence
        evidence = await self.evidence_service.gather_evidence(
            query=query,
            sources=sources,
            limit_per_source=15,
            persist=False
        )

        # 3. Build structured spec
        builder = self._builders.get(v_type, self._builders[VisualType.EXECUTIVE_ONE_PAGER])
        spec = builder.build(evidence)

        # 4. Validate spec integrity
        validate_spec(spec)

        # 5. Render deterministic output
        if requested_format == OutputFormat.MERMAID:
            content = render_mermaid(spec)
        elif requested_format == OutputFormat.SVG:
            content = render_svg(spec)
        elif requested_format == OutputFormat.MARKDOWN:
            content = render_markdown(spec)
        elif requested_format == OutputFormat.JSON:
            content = spec.model_dump_json(indent=2)
        else:
            content = render_mermaid(spec)

        explanation = f"Generated {spec.type.value} containing {len(spec.nodes)} nodes and {len(spec.edges)} edges grounded in {len(spec.evidence_ids)} evidence sources."

        return VisualizationResult(
            spec=spec,
            format=requested_format,
            content=content,
            explanation=explanation,
            evidence_references=spec.evidence_ids,
            unknowns_or_assumptions=spec.assumptions + spec.unknowns
        )
