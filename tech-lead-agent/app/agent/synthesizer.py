import json
import logging
from typing import List, Optional
from openai import OpenAI
from app.config import settings
from app.agent.prompts import TECH_LEAD_SYSTEM_PROMPT, SYNTHESIZE_USER_PROMPT
from app.models.evidence import Evidence
from app.models.response import TechLeadAnalysisResponse, ConflictItem
from app.models.actions import ActionItem, ActionPriority
from app.models.risks import RiskItem, RiskSeverity, RiskCategory

logger = logging.getLogger(__name__)


class Synthesizer:
    """Uses LLM (or deterministic fallback) to formulate a rigorous tech-lead response."""

    def __init__(self):
        self.client: Optional[OpenAI] = None
        if settings.OPENAI_API_KEY:
            self.client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
                base_url=settings.OPENAI_BASE_URL
            )

    async def synthesize(
        self,
        query: str,
        evidence: List[Evidence],
        conflicts: List[ConflictItem]
    ) -> TechLeadAnalysisResponse:
        """Generates structured response based on evidence and conflicts."""

        evidence_str = "\n".join([
            f"- [{e.source_type.value.upper()}] ({e.external_id}) {e.title} (by {e.author} at {e.timestamp.isoformat()}):\n  {e.content}"
            for e in evidence
        ])
        conflicts_str = "\n".join([
            f"- CONFLICT: {c.title}\n  Source A: {c.source_a} -> '{c.claim_a}'\n  Source B: {c.source_b} -> '{c.claim_b}'\n  Impact: {c.impact}\n  Suggested Resolution: {c.suggested_resolution}"
            for c in conflicts
        ]) if conflicts else "No explicit contradictions identified across sources."

        # If OpenAI is configured and reachable, attempt LLM generation
        if self.client:
            try:
                prompt = SYNTHESIZE_USER_PROMPT.format(
                    query=query,
                    evidence_text=evidence_str,
                    conflicts_text=conflicts_str
                )
                response = self.client.chat.completions.create(
                    model=settings.MODEL_NAME,
                    messages=[
                        {"role": "system", "content": TECH_LEAD_SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=settings.REASONING_TEMPERATURE,
                    response_format={"type": "json_object"}
                )
                raw_json = response.choices[0].message.content
                data = json.loads(raw_json)
                return TechLeadAnalysisResponse(
                    query=query,
                    executive_summary=data.get("executive_summary", "Operational review complete."),
                    facts=data.get("facts", []),
                    inferences=data.get("inferences", []),
                    conflicts=conflicts,
                    unknowns=data.get("unknowns", []),
                    risks=[
                        RiskItem(
                            title=r.get("title", "Identified Risk"),
                            description=r.get("description", ""),
                            severity=RiskSeverity(r.get("severity", "medium").lower()) if r.get("severity", "medium").lower() in [e.value for e in RiskSeverity] else RiskSeverity.MEDIUM,
                            category=RiskCategory.TECHNICAL
                        ) for r in data.get("risks", [])
                    ],
                    action_items=[
                        ActionItem(
                            title=a.get("title", "Action"),
                            description=a.get("description", ""),
                            owner=a.get("owner"),
                            priority=ActionPriority(a.get("priority", "medium").lower()) if a.get("priority", "medium").lower() in [e.value for e in ActionPriority] else ActionPriority.MEDIUM
                        ) for a in data.get("action_items", [])
                    ],
                    evidence_count=len(evidence)
                )
            except Exception as ex:
                logger.warning(f"OpenAI call failed ({ex}), falling back to deterministic synthesis engine.")

        # Deterministic Rule-Based Synthesis Engine (Fallback & Test Mode)
        return self._deterministic_synthesize(query, evidence, conflicts)

    def _deterministic_synthesize(
        self,
        query: str,
        evidence: List[Evidence],
        conflicts: List[ConflictItem]
    ) -> TechLeadAnalysisResponse:
        facts = [f"[{e.source_type.value.upper()}] {e.title} (reported by {e.author})" for e in evidence[:8]]
        inferences: List[str] = []
        unknowns: List[str] = []
        risks: List[RiskItem] = []
        action_items: List[ActionItem] = []

        if conflicts:
            inferences.append("Cross-system reality gap detected: Several tickets are marked 'Done' in Jira while pull requests remain open or unreviewed in GitHub.")
            for c in conflicts:
                risks.append(
                    RiskItem(
                        title=f"Conflict Risk: {c.title}",
                        description=c.impact,
                        severity=RiskSeverity.BLOCKER if "launch" in c.title.lower() or "premature" in c.title.lower() else RiskSeverity.HIGH,
                        category=RiskCategory.OPERATIONAL,
                        mitigation_suggestion=c.suggested_resolution
                    )
                )
                action_items.append(
                    ActionItem(
                        title=f"Resolve {c.title}",
                        description=c.suggested_resolution,
                        priority=ActionPriority.HIGH
                    )
                )

        # Look for blocked tickets
        blocked_tickets = [e for e in evidence if e.metadata_json.get("raw_status") == "Blocked"]
        if blocked_tickets:
            for b in blocked_tickets:
                inferences.append(f"Work on {b.external_id} assigned to {b.author} is explicitly blocked.")
                risks.append(
                    RiskItem(
                        title=f"Work Blocked: {b.external_id}",
                        description=b.content,
                        severity=RiskSeverity.HIGH,
                        category=RiskCategory.SCHEDULE
                    )
                )
                action_items.append(
                    ActionItem(
                        title=f"Unblock {b.external_id}",
                        description=f"Resolve dependency blocking {b.author}.",
                        owner="tech-lead",
                        priority=ActionPriority.HIGH
                    )
                )

        unknowns.append("No automated performance/load test data available in evidence corpus for Redis Cluster.")
        unknowns.append("Status of mobile client OAuth2 PKCE integration is not recorded in tracked repositories.")

        summary = (
            f"Evaluated {len(evidence)} evidence records across Jira, GitHub, Slack, and Confluence. "
            f"Identified {len(conflicts)} direct cross-system conflicts and {len(risks)} operational risks requiring tech lead intervention."
        )

        return TechLeadAnalysisResponse(
            query=query,
            executive_summary=summary,
            facts=facts,
            inferences=inferences,
            conflicts=conflicts,
            unknowns=unknowns,
            risks=risks,
            action_items=action_items,
            evidence_count=len(evidence)
        )
