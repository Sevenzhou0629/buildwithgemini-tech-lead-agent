from typing import List, Optional
from pydantic import BaseModel, Field
from app.models.actions import ActionItem
from app.models.decisions import Decision
from app.models.risks import RiskItem


class ConflictItem(BaseModel):
    """Represents a discrepancy between two engineering sources."""
    title: str
    description: str
    source_a: str
    claim_a: str
    source_b: str
    claim_b: str
    impact: str
    suggested_resolution: str


class TechLeadAnalysisResponse(BaseModel):
    """Rigorous structured analysis from the Tech Lead Agent."""
    query: str
    executive_summary: str
    facts: List[str] = Field(
        default_factory=list,
        description="Directly observed, verifiable truths backed by tool evidence."
    )
    inferences: List[str] = Field(
        default_factory=list,
        description="Reasoned deductions based on cross-referencing multiple facts."
    )
    conflicts: List[ConflictItem] = Field(
        default_factory=list,
        description="Direct contradictions or inconsistencies across systems."
    )
    unknowns: List[str] = Field(
        default_factory=list,
        description="Gaps in available information that require clarification or human follow-up."
    )
    risks: List[RiskItem] = Field(
        default_factory=list,
        description="Emerging risks or blockers affecting timelines and stability."
    )
    action_items: List[ActionItem] = Field(
        default_factory=list,
        description="Immediate actions recommended for the tech lead or engineering team."
    )
    evidence_count: int = 0
