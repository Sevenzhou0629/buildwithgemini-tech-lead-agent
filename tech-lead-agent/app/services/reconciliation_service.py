from typing import List
from app.models.evidence import Evidence, SourceType
from app.models.response import ConflictItem


class ReconciliationService:
    """Detects discrepancies and contradictions across engineering systems (e.g. Jira vs GitHub vs Slack)."""

    def reconcile(self, evidence_list: List[Evidence]) -> List[ConflictItem]:
        conflicts: List[ConflictItem] = []

        jira_items = [e for e in evidence_list if e.source_type == SourceType.JIRA]
        github_items = [e for e in evidence_list if e.source_type == SourceType.GITHUB]
        slack_items = [e for e in evidence_list if e.source_type == SourceType.SLACK]

        # Rule 1: Jira Ticket is marked Done, but associated GitHub PR is still OPEN or FAILING CI
        for j in jira_items:
            status = j.metadata_json.get("raw_status", "").lower()
            if status == "done":
                ticket_key = j.external_id.lower()
                for gh in github_items:
                    body_text = f"{gh.title} {gh.content}".lower()
                    if ticket_key in body_text:
                        pr_state = gh.metadata_json.get("state", "").lower()
                        ci_status = gh.metadata_json.get("ci_status", "").lower()
                        pr_num = gh.metadata_json.get("pr_number")

                        if pr_state == "open":
                            conflicts.append(
                                ConflictItem(
                                    title=f"Premature Jira Completion: {j.external_id}",
                                    description=f"Jira marks {j.external_id} as 'Done', but GitHub PR #{pr_num} is still OPEN.",
                                    source_a=f"Jira ({j.external_id})",
                                    claim_a="Status is 'Done'",
                                    source_b=f"GitHub (PR #{pr_num})",
                                    claim_b=f"PR is open with CI status: {ci_status}",
                                    impact="False sense of completion. Deploying without merged code risks deploying broken or incomplete features.",
                                    suggested_resolution=f"Re-open or move {j.external_id} to 'In Review' until PR #{pr_num} is merged and CI is green."
                                )
                            )

        # Rule 2: Slack disclosures warning not to deploy while ticket is closed
        for s in slack_items:
            text = s.content.lower()
            if "don't deploy" in text or "dont deploy" in text or "flaky" in text:
                for j in jira_items:
                    if j.external_id.lower() in text and j.metadata_json.get("raw_status", "").lower() == "done":
                        conflicts.append(
                            ConflictItem(
                                title=f"Chat Discrepancy on Deployment: {j.external_id}",
                                description=f"Slack message in {s.metadata_json.get('channel')} warns against deploying {j.external_id}, despite ticket being marked 'Done'.",
                                source_a=f"Slack ({s.metadata_json.get('channel')})",
                                claim_a=f"'{s.content}'",
                                source_b=f"Jira ({j.external_id})",
                                claim_b="Ticket is marked 'Done'",
                                impact="Deploying to production will violate team guidance and cause downtime or errors.",
                                suggested_resolution="Hold deployment and notify product/release managers of the unmerged PR."
                            )
                        )

        # Rule 3: Launch Blocker Tickets with Changes Requested on PR
        for j in jira_items:
            labels = [l.lower() for l in j.metadata_json.get("labels", [])]
            if "launch-blocker" in labels:
                ticket_key = j.external_id.lower()
                for gh in github_items:
                    if ticket_key in f"{gh.title} {gh.content}".lower():
                        if gh.metadata_json.get("review_state") == "changes_requested":
                            conflicts.append(
                                ConflictItem(
                                    title=f"Blocker PR Review Blocked: {j.external_id}",
                                    description=f"Launch blocker {j.external_id} has Changes Requested in GitHub PR #{gh.metadata_json.get('pr_number')}.",
                                    source_a=f"Jira ({j.external_id})",
                                    claim_a="Critical launch-blocker in active sprint",
                                    source_b=f"GitHub (PR #{gh.metadata_json.get('pr_number')})",
                                    claim_b="Review state is 'changes_requested'",
                                    impact="Target launch date is at immediate risk.",
                                    suggested_resolution="Schedule pairing session between author and reviewer to unblock approval."
                                )
                            )

        return conflicts
