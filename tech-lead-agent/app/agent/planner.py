from typing import List
from app.models.evidence import SourceType


class QueryPlanner:
    """Decides which MCP sources to query and what search scopes to use based on the user's question."""

    def plan(self, query: str) -> List[SourceType]:
        q = query.lower()

        # Questions about PRs, commits, code, reviews
        github_keywords = ["pr", "pull request", "github", "commit", "branch", "ci", "build", "merge", "code"]
        # Questions about tickets, epics, sprint, tasks
        jira_keywords = ["jira", "ticket", "epic", "sprint", "task", "assigned", "blocker", "status"]
        # Questions about conversations, announcements, chat
        slack_keywords = ["slack", "said", "chatted", "discussed", "channel", "conversation", "team", "who"]
        # Questions about specs, architecture, rfcs, prds, documentation
        confluence_keywords = ["doc", "confluence", "rfc", "prd", "spec", "runbook", "architecture", "wiki", "checklist"]

        selected: List[SourceType] = []

        if any(k in q for k in jira_keywords):
            selected.append(SourceType.JIRA)
        if any(k in q for k in github_keywords):
            selected.append(SourceType.GITHUB)
        if any(k in q for k in slack_keywords):
            selected.append(SourceType.SLACK)
        if any(k in q for k in confluence_keywords):
            selected.append(SourceType.CONFLUENCE)

        # Operational meta-questions (e.g. "what is blocking launch", "what is happening", "are we ready") require all sources
        broad_keywords = ["launch", "ready", "status", "blocked", "what is happening", "overall", "conflict", "risk", "attention"]
        if not selected or any(k in q for k in broad_keywords):
            return [SourceType.JIRA, SourceType.GITHUB, SourceType.SLACK, SourceType.CONFLUENCE]

        return selected
