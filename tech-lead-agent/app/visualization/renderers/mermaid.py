from app.visualization.models import VisualizationSpec, VisualType, STATUS_COLORS, VisualStatus


def render_mermaid(spec: VisualizationSpec) -> str:
    """Renders VisualizationSpec to valid Mermaid syntax tailored to the VisualType."""

    if spec.type == VisualType.SEQUENCE_DIAGRAM:
        return _render_sequence(spec)
    elif spec.type == VisualType.STATE_MACHINE:
        return _render_state_machine(spec)
    elif spec.type == VisualType.PROJECT_TIMELINE:
        return _render_gantt(spec)
    elif spec.type == VisualType.LAUNCH_READINESS_MATRIX or spec.type == VisualType.RISK_MAP:
        return _render_quadrant_or_flow(spec)
    else:
        return _render_flowchart(spec)


def _clean_id(raw_id: str) -> str:
    """Sanitizes node ID for Mermaid compatibility."""
    return raw_id.replace("-", "_").replace(" ", "_").replace("#", "").replace("@", "").replace("/", "_").replace(".", "_")


def _render_flowchart(spec: VisualizationSpec) -> str:
    lines = ["graph TD", f"    %% {spec.title}"]

    # Class definitions for status coloring
    for status, color in STATUS_COLORS.items():
        text_color = "#ffffff"
        lines.append(f"    classDef status_{status.value} fill:{color},stroke:#1e293b,stroke-width:2px,color:{text_color};")

    # Render groups (subgraphs)
    grouped_node_ids = set()
    for group in spec.groups:
        lines.append(f"    subgraph {group.id} [\"{group.label}\"]")
        for nid in group.node_ids:
            grouped_node_ids.add(nid)
            node = next((n for n in spec.nodes if n.id == nid), None)
            if node:
                cid = _clean_id(node.id)
                lines.append(f"        {cid}[\"{node.label}\"]:::{'status_' + node.status.value}")
        lines.append("    end")

    # Render ungrouped nodes
    for node in spec.nodes:
        if node.id not in grouped_node_ids:
            cid = _clean_id(node.id)
            lines.append(f"    {cid}[\"{node.label}\"]:::{'status_' + node.status.value}")

    # Render edges
    for edge in spec.edges:
        src = _clean_id(edge.source)
        tgt = _clean_id(edge.target)
        if edge.label:
            lines.append(f"    {src} -->|\"{edge.label}\"| {tgt}")
        else:
            lines.append(f"    {src} --> {tgt}")

    return "\n".join(lines)


def _render_sequence(spec: VisualizationSpec) -> str:
    lines = ["sequenceDiagram", "    autonumber", f"    %% {spec.title}"]

    # Participants
    for node in spec.nodes:
        cid = _clean_id(node.id)
        lines.append(f"    participant {cid} as {node.label}")

    # Sequence calls
    for edge in spec.edges:
        src = _clean_id(edge.source)
        tgt = _clean_id(edge.target)
        label = edge.label or "calls"
        if edge.type == "async":
            lines.append(f"    {src}-->>{tgt}: {label}")
        else:
            lines.append(f"    {src}->>{tgt}: {label}")

    return "\n".join(lines)


def _render_state_machine(spec: VisualizationSpec) -> str:
    lines = ["stateDiagram-v2", f"    %% {spec.title}"]

    # States
    for node in spec.nodes:
        cid = _clean_id(node.id)
        lines.append(f"    state \"{node.label}\" as {cid}")

    # Transitions
    for edge in spec.edges:
        src = _clean_id(edge.source)
        tgt = _clean_id(edge.target)
        lbl = f" : {edge.label}" if edge.label else ""
        lines.append(f"    {src} --> {tgt}{lbl}")

    return "\n".join(lines)


def _render_gantt(spec: VisualizationSpec) -> str:
    lines = [
        "gantt",
        f"    title {spec.title}",
        "    dateFormat YYYY-MM-DD",
        "    section Milestones & Sprints"
    ]
    for node in spec.nodes:
        status_tag = "done, " if node.status == VisualStatus.VERIFIED else ("active, " if node.status == VisualStatus.IN_PROGRESS else "crit, ")
        start = node.metadata.get("start", "2026-09-28")
        end = node.metadata.get("end", "2026-10-05")
        cid = _clean_id(node.id)
        lines.append(f"    {node.label} :{status_tag}{cid}, {start}, {end}")

    return "\n".join(lines)


def _render_quadrant_or_flow(spec: VisualizationSpec) -> str:
    return _render_flowchart(spec)
