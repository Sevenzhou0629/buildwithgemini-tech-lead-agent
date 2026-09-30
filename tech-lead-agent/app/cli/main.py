import asyncio
import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.markdown import Markdown

from app.storage.db import init_db
from app.storage.repositories import EvidenceRepository
from app.mcp.registry import registry
from app.mcp.adapters.jira import JiraMCPAdapter
from app.mcp.adapters.github import GitHubMCPAdapter
from app.mcp.adapters.slack import SlackMCPAdapter
from app.mcp.adapters.confluence import ConfluenceMCPAdapter
from app.agent.planner import QueryPlanner
from app.agent.synthesizer import Synthesizer
from app.agent.orchestrator import TechLeadOrchestrator
from app.services.evidence_service import EvidenceService
from app.services.reconciliation_service import ReconciliationService
from app.services.status_service import StatusService

cli_app = typer.Typer(help="Engineering Tech Lead Agent CLI")
console = Console()


def _bootstrap():
    init_db()
    if not registry.list_providers():
        registry.register(JiraMCPAdapter())
        registry.register(GitHubMCPAdapter())
        registry.register(SlackMCPAdapter())
        registry.register(ConfluenceMCPAdapter())


@cli_app.command()
def ask(question: str):
    """Ask an operational tech lead question."""
    _bootstrap()
    console.print(Panel(f"[bold cyan]Query:[/bold cyan] {question}", title="Tech Lead Agent"))

    evidence_service = EvidenceService(mcp_registry=registry)
    recon_service = ReconciliationService()
    orchestrator = TechLeadOrchestrator(
        planner=QueryPlanner(),
        evidence_service=evidence_service,
        recon_service=recon_service,
        synthesizer=Synthesizer()
    )

    with console.status("[bold green]Gathering evidence and reconciling sources...[/bold green]"):
        res = asyncio.run(orchestrator.analyze(question))

    console.print(f"\n[bold yellow]Executive Summary:[/bold yellow]\n{res.executive_summary}\n")

    # Facts Table
    table_facts = Table(title="[bold green]Verifiable Facts (Grounded in Tools)[/bold green]")
    table_facts.add_column("Fact Description")
    for f in res.facts:
        table_facts.add_row(f)
    console.print(table_facts)

    # Inferences
    if res.inferences:
        console.print("\n[bold blue]Operational Inferences:[/bold blue]")
        for inf in res.inferences:
            console.print(f" • {inf}")

    # Conflicts
    if res.conflicts:
        console.print("\n[bold red]Cross-System Conflicts & Contradictions:[/bold red]")
        for c in res.conflicts:
            panel_content = (
                f"[bold]Claim A ({c.source_a}):[/bold] {c.claim_a}\n"
                f"[bold]Claim B ({c.source_b}):[/bold] {c.claim_b}\n"
                f"[bold]Impact:[/bold] {c.impact}\n"
                f"[bold]Suggested Resolution:[/bold] [green]{c.suggested_resolution}[/green]"
            )
            console.print(Panel(panel_content, title=f"⚠️ {c.title}", border_style="red"))

    # Unknowns
    if res.unknowns:
        console.print("\n[bold magenta]Unknowns & Information Gaps:[/bold magenta]")
        for u in res.unknowns:
            console.print(f" ? {u}")

    # Action Items
    if res.action_items:
        table_act = Table(title="[bold cyan]Recommended Actions for Tech Lead[/bold cyan]")
        table_act.add_column("Priority", style="bold")
        table_act.add_column("Action Title")
        table_act.add_column("Details")
        for a in res.action_items:
            table_act.add_row(a.priority.value.upper(), a.title, a.description)
        console.print(table_act)


@cli_app.command()
def status():
    """Get overall project health and blockers."""
    _bootstrap()
    service = StatusService(EvidenceService(mcp_registry=registry), ReconciliationService())
    data = asyncio.run(service.get_project_status())

    color = "green" if data["health"] == "GREEN" else ("yellow" if data["health"] == "YELLOW" else "red")
    console.print(Panel(f"Project Health: [bold {color}]{data['health']}[/bold {color}]", title="Project Status"))
    console.print(f"Evidence collected: {data['evidence_count']} records")
    console.print(f"Active blockers: {data['blockers_count']}")
    console.print(f"Detected conflicts: {data['conflicts_count']}\n")

    if data["blockers"]:
        table = Table(title="Identified Blockers")
        table.add_column("Ticket")
        table.add_column("Assignee")
        table.add_column("Status")
        table.add_column("Title")
        for b in data["blockers"]:
            table.add_row(b["id"], b["assignee"], b["status"], b["title"])
        console.print(table)


@cli_app.command()
def launch_readiness():
    """Evaluate whether the project is ready for production launch."""
    _bootstrap()
    service = StatusService(EvidenceService(mcp_registry=registry), ReconciliationService())
    data = asyncio.run(service.evaluate_launch_readiness())

    verdict_style = "bold green" if data["launch_ready"] else "bold red"
    console.print(Panel(f"Verdict: [{verdict_style}]{data['verdict']}[/{verdict_style}]", title="Launch Readiness Audit"))


if __name__ == "__main__":
    cli_app()

from app.visualization.models import VisualType, OutputFormat
from app.visualization.service import VisualizationService


@cli_app.command()
def visualize(
    query_or_type: str = typer.Argument("architecture", help="Query or visual type (e.g. architecture, launch-readiness, sequence, dependencies)"),
    format: str = typer.Option("mermaid", "--format", "-f", help="Output format: mermaid, svg, markdown, json")
):
    """Generate evidence-grounded diagrams and technical visualizations."""
    _bootstrap()
    fmt = OutputFormat(format.lower()) if format.lower() in [f.value for f in OutputFormat] else OutputFormat.MERMAID

    vis_service = VisualizationService()
    with console.status(f"[bold green]Generating visual ({fmt.value})...[/bold green]"):
        res = asyncio.run(vis_service.generate_visualization(query_or_type, requested_format=fmt))

    console.print(Panel(f"[bold cyan]Visualization:[/bold cyan] {res.spec.title}\n[bold]Type:[/bold] {res.spec.type.value}", title="Tech Lead Visualizer"))

    if fmt == OutputFormat.MERMAID:
        console.print(Panel(res.content, title="Mermaid Diagram Code", border_style="green"))
    elif fmt == OutputFormat.SVG:
        console.print(f"[bold green]Rendered valid SVG ({len(res.content)} bytes). Preview snippet:[/bold green]\n{res.content[:350]}...\n")
    elif fmt == OutputFormat.MARKDOWN:
        console.print(Markdown(res.content))
    elif fmt == OutputFormat.JSON:
        console.print(res.content)

    if res.spec.annotations:
        console.print("\n[bold yellow]Key Annotations & Warnings:[/bold yellow]")
        for a in res.spec.annotations:
            console.print(f" ⚠️ {a.text}")
