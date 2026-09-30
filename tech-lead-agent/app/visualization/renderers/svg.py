import html
from app.visualization.models import VisualizationSpec, VisualStatus, STATUS_COLORS


def render_svg(spec: VisualizationSpec, width: int = 1000, height: int = 700) -> str:
    """Renders a polished, dark-mode SVG card with nodes, edges, badges, and status legend."""

    svg_parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="100%" height="100%" style="background:#0f172a; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif;">',
        '  <defs>',
        '    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">',
        '      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />',
        '    </marker>',
        '    <filter id="card-shadow" x="-10%" y="-10%" width="130%" height="130%">',
        '      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.35"/>',
        '    </filter>',
        '  </defs>',
        f'  <!-- Header -->',
        f'  <text x="32" y="48" fill="#f8fafc" font-size="22" font-weight="700">{html.escape(spec.title)}</text>',
        f'  <text x="32" y="74" fill="#94a3b8" font-size="13">{html.escape(spec.subtitle or f"Type: {spec.type.value} | Generated from MCP Evidence")}</text>'
    ]

    # Calculate layout grid for nodes
    cols = 3
    node_w = 260
    node_h = 80
    start_x = 40
    start_y = 110
    col_gap = 60
    row_gap = 40

    node_positions = {}

    for i, node in enumerate(spec.nodes):
        c = i % cols
        r = i // cols
        x = start_x + c * (node_w + col_gap)
        y = start_y + r * (node_h + row_gap)
        node_positions[node.id] = (x + node_w // 2, y + node_h // 2)

        status_color = STATUS_COLORS.get(node.status, "#6b7280")

        # Card rect
        svg_parts.append(
            f'  <g id="node_{html.escape(node.id)}">'
            f'    <rect x="{x}" y="{y}" width="{node_w}" height="{node_h}" rx="8" fill="#1e293b" stroke="{status_color}" stroke-width="2" filter="url(#card-shadow)"/>'
            f'    <circle cx="{x + 20}" cy="{y + 24}" r="6" fill="{status_color}"/>'
            f'    <text x="{x + 34}" y="{y + 28}" fill="#f8fafc" font-size="14" font-weight="600">{html.escape(node.label[:28])}</text>'
            f'    <text x="{x + 34}" y="{y + 48}" fill="#cbd5e1" font-size="11">Status: {node.status.value}</text>'
            f'    <text x="{x + 34}" y="{y + 65}" fill="#64748b" font-size="10">Owner: {html.escape(node.owner or "Unassigned")}</text>'
            f'  </g>'
        )

    # Render edges
    for edge in spec.edges:
        if edge.source in node_positions and edge.target in node_positions:
            x1, y1 = node_positions[edge.source]
            x2, y2 = node_positions[edge.target]
            svg_parts.append(
                f'  <line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#475569" stroke-width="2" stroke-dasharray="4" marker-end="url(#arrow)"/>'
            )

    # Status Legend at bottom
    legend_y = height - 40
    svg_parts.append(f'  <!-- Legend -->')
    svg_parts.append(f'  <text x="32" y="{legend_y}" fill="#94a3b8" font-size="12" font-weight="600">STATUS LEGEND:</text>')
    lx = 150
    for status in [VisualStatus.VERIFIED, VisualStatus.IN_PROGRESS, VisualStatus.BLOCKED, VisualStatus.CONFLICT]:
        color = STATUS_COLORS[status]
        svg_parts.append(f'  <circle cx="{lx}" cy="{legend_y - 4}" r="5" fill="{color}"/>')
        svg_parts.append(f'  <text x="{lx + 10}" y="{legend_y}" fill="#cbd5e1" font-size="11">{status.value}</text>')
        lx += 120

    svg_parts.append('</svg>')
    return "\n".join(svg_parts)
