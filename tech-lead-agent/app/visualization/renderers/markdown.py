from app.visualization.models import VisualizationSpec, OutputFormat
from app.visualization.renderers.mermaid import render_mermaid


def render_markdown(spec: VisualizationSpec) -> str:
    """Wraps the rendered Mermaid visual in rich markdown with evidence citations and commentary."""

    mermaid_content = render_mermaid(spec)

    lines = [
        f"# 📊 Visual: {spec.title}",
        f"**Type:** `{spec.type.value}`  ",
        f"**Generated:** {spec.generated_at.strftime('%Y-%m-%d %H:%M:%S UTC')}\n",
        f"```mermaid",
        mermaid_content,
        f"```\n",
        "### 🔍 Grounded Evidence References"
    ]

    if spec.evidence_ids:
        for eid in spec.evidence_ids:
            lines.append(f"- Linked evidence record: `{eid}`")
    else:
        lines.append("- Direct synthesis from active Jira, GitHub, Slack, and Confluence fixtures.")

    if spec.assumptions:
        lines.append("\n### 💡 Assumptions & Inferences")
        for a in spec.assumptions:
            lines.append(f"- {a}")

    if spec.unknowns:
        lines.append("\n### ❓ Critical Unknowns & Information Gaps")
        for u in spec.unknowns:
            lines.append(f"- {u}")

    return "\n".join(lines)
