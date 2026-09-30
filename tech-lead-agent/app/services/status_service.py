from typing import Dict, Any, List
from app.services.evidence_service import EvidenceService
from app.services.reconciliation_service import ReconciliationService
from app.models.evidence import SourceType, Evidence


class StatusService:
    """Computes project health, blockers, risk registry, and launch readiness."""

    def __init__(self, evidence_service: EvidenceService, recon_service: ReconciliationService):
        self.evidence_service = evidence_service
        self.recon_service = recon_service

    async def get_project_status(self, project_key: str = "DEFAULT") -> Dict[str, Any]:
        evidence = await self.evidence_service.gather_evidence(query="", limit_per_source=20, persist=False)
        conflicts = self.recon_service.reconcile(evidence)

        # Identify blockers
        blockers: List[Dict[str, Any]] = []
        for e in evidence:
            if e.source_type == SourceType.JIRA:
                if e.metadata_json.get("raw_status") == "Blocked" or "launch-blocker" in [l.lower() for l in e.metadata_json.get("labels", [])]:
                    blockers.append({
                        "id": e.external_id,
                        "title": e.title,
                        "assignee": e.author,
                        "status": e.metadata_json.get("raw_status"),
                        "source": e.source_name
                    })

        # Calculate Health
        health = "GREEN"
        if len(conflicts) > 0 or len(blockers) > 1:
            health = "RED" if any(c.impact for c in conflicts if "downtime" in c.impact.lower() or "risk" in c.impact.lower()) else "YELLOW"

        return {
            "project_key": project_key,
            "health": health,
            "evidence_count": len(evidence),
            "blockers_count": len(blockers),
            "conflicts_count": len(conflicts),
            "blockers": blockers,
            "conflicts": [c.model_dump() for c in conflicts],
        }

    async def evaluate_launch_readiness(self) -> Dict[str, Any]:
        # Gather all relevant launch and engineering state
        evidence = await self.evidence_service.gather_evidence(query="", limit_per_source=20, persist=False)
        conflicts = self.recon_service.reconcile(evidence)

        has_blocked_tickets = any(
            e.metadata_json.get("raw_status") == "Blocked" or
            ("launch-blocker" in [l.lower() for l in e.metadata_json.get("labels", [])] and e.metadata_json.get("raw_status") != "Done")
            for e in evidence if e.source_type == SourceType.JIRA
        )

        ready = len(conflicts) == 0 and not has_blocked_tickets

        return {
            "launch_ready": ready,
            "verdict": "NOT READY - Critical discrepancies, unmerged blockers, or open launch tickets detected" if not ready else "READY FOR LAUNCH",
            "blocking_conflicts": [c.model_dump() for c in conflicts],
            "total_launch_evidence": len(evidence)
        }
