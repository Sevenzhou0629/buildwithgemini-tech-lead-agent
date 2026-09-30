from typing import List
from app.visualization.models import VisualizationSpec


class SpecValidationError(ValueError):
    """Raised when a visualization spec violates integrity constraints."""
    pass


def validate_spec(spec: VisualizationSpec) -> List[str]:
    """Validates spec integrity and returns warning messages for non-fatal discrepancies."""
    warnings: List[str] = []

    node_ids = {node.id for node in spec.nodes}

    # Verify edge endpoint integrity
    for edge in spec.edges:
        if edge.source not in node_ids:
            raise SpecValidationError(
                f"Edge source '{edge.source}' does not exist in nodes list for spec '{spec.title}'"
            )
        if edge.target not in node_ids:
            raise SpecValidationError(
                f"Edge target '{edge.target}' does not exist in nodes list for spec '{spec.title}'"
            )

    # Verify group node integrity
    for group in spec.groups:
        for nid in group.node_ids:
            if nid not in node_ids:
                warnings.append(f"Group '{group.id}' references non-existent node '{nid}'")

    # Verify annotation references
    for ann in spec.annotations:
        for nid in ann.related_node_ids:
            if nid not in node_ids:
                warnings.append(f"Annotation references non-existent node '{nid}'")

    return warnings
