import pytest
from app.visualization.models import (
    VisualType, VisualStatus, Node, Edge, Group, VisualizationSpec, OutputFormat
)
from app.visualization.validators import validate_spec, SpecValidationError
from app.visualization.renderers.mermaid import render_mermaid
from app.visualization.renderers.svg import render_svg
from app.visualization.renderers.markdown import render_markdown
from app.visualization.service import VisualizationService
from app.mcp.registry import registry
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.mcp.adapters.slack import SlackMCPAdapter
from app.mcp.adapters.confluence import ConfluenceMCPAdapter


def test_spec_validator_detects_dangling_edge():
    spec = VisualizationSpec(
        type=VisualType.ARCHITECTURE_DIAGRAM,
        title="Test Architecture",
        nodes=[Node(id="service_a", label="Service A", status=VisualStatus.VERIFIED)],
        edges=[Edge(source="service_a", target="non_existent_b", label="calls")]
    )
    with pytest.raises(SpecValidationError):
        validate_spec(spec)


def test_render_mermaid_and_svg():
    spec = VisualizationSpec(
        type=VisualType.ARCHITECTURE_DIAGRAM,
        title="Valid Diagram",
        nodes=[
            Node(id="service_a", label="Service A", status=VisualStatus.VERIFIED),
            Node(id="service_b", label="Service B", status=VisualStatus.IN_PROGRESS),
        ],
        edges=[Edge(source="service_a", target="service_b", label="calls")]
    )
    mermaid = render_mermaid(spec)
    assert "graph TD" in mermaid
    assert "service_a" in mermaid
    assert "service_b" in mermaid

    svg = render_svg(spec)
    assert "<svg" in svg
    assert "</svg>" in svg
    assert "Valid Diagram" in svg


@pytest.mark.asyncio
async def test_visualization_service_end_to_end():
    if not registry.list_providers():
        registry.register(JiraMCPAdapter())
        registry.register(GitHubMCPAdapter())
        registry.register(SlackMCPAdapter())
        registry.register(ConfluenceMCPAdapter())

    service = VisualizationService()

    # Test Architecture
    res_arch = await service.generate_visualization("visualize the current architecture", OutputFormat.MERMAID)
    assert res_arch.spec.type == VisualType.ARCHITECTURE_DIAGRAM
    assert "graph TD" in res_arch.content
    assert len(res_arch.spec.nodes) > 0

    # Test Sequence
    res_seq = await service.generate_visualization("give me a sequence diagram for payment webhook", OutputFormat.MERMAID)
    assert res_seq.spec.type == VisualType.SEQUENCE_DIAGRAM
    assert "sequenceDiagram" in res_seq.content

    # Test Launch Readiness Matrix in SVG format
    res_matrix = await service.generate_visualization("visualize launch readiness", OutputFormat.SVG)
    assert res_matrix.spec.type == VisualType.LAUNCH_READINESS_MATRIX
    assert "<svg" in res_matrix.content

    # Test State Machine in Markdown format
    res_sm = await service.generate_visualization("generate a state machine for payment webhook", OutputFormat.MARKDOWN)
    assert res_sm.spec.type == VisualType.STATE_MACHINE
    assert "stateDiagram-v2" in res_sm.content
