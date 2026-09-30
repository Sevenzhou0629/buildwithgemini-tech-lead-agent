import datetime
from typing import List, Dict, Any

# ==============================================================================
# CUSTOMIZABLE MOCK MCP DATA FIXTURES FOR TECH-LEAD-AGENT
# Edit this file to add or modify issues, PRs, Slack messages, and RFC docs!
# ==============================================================================

MOCK_JIRA_ISSUES = [
    {
        "id": "PROJ-101",
        "summary": "Migrate auth service to OAuth 2.0 PKCE",
        "status": "In Progress",
        "assignee": "alex@company.com",
        "reporter": "tech-lead@company.com",
        "priority": "High",
        "labels": ["security", "launch-blocker"],
        "updated": "2026-09-30T15:30:00Z",
        "description": "Upgrade legacy session auth to OAuth2 with PKCE flow.",
        "url": "https://jira.internal/browse/PROJ-101"
    },
    {
        "id": "PROJ-102",
        "summary": "Deploy Redis Cluster to staging",
        "status": "Done",
        "assignee": "sarah@company.com",
        "reporter": "devops@company.com",
        "priority": "Critical",
        "labels": ["infra", "launch-blocker"],
        "updated": "2026-09-29T18:00:00Z",
        "description": "Redis cluster provisioning and connection string injection.",
        "url": "https://jira.internal/browse/PROJ-102"
    },
    {
        "id": "PROJ-103",
        "summary": "Implement database read replicas for analytics",
        "status": "Blocked",
        "assignee": "jonathan@company.com",
        "reporter": "data-team@company.com",
        "priority": "Medium",
        "labels": ["database"],
        "updated": "2026-09-30T10:15:00Z",
        "description": "Blocked waiting for Cloud SQL terraform module approval.",
        "url": "https://jira.internal/browse/PROJ-103"
    },
    {
        "id": "PROJ-104",
        "summary": "Checkout payment gateway webhook retry logic",
        "status": "Done",
        "assignee": "maria@company.com",
        "reporter": "product@company.com",
        "priority": "High",
        "labels": ["payments"],
        "updated": "2026-09-30T11:00:00Z",
        "description": "Add exponential backoff and idempotency keys to webhook consumer.",
        "url": "https://jira.internal/browse/PROJ-104"
    }
]

MOCK_GITHUB_PRS = [
    {
        "number": 142,
        "title": "feat: OAuth2 PKCE implementation",
        "state": "open",
        "draft": False,
        "author": "alex",
        "branch": "feat/oauth-pkce",
        "ci_status": "passing",
        "review_state": "changes_requested",
        "reviewers": ["tech-lead", "sarah"],
        "updated_at": "2026-09-30T16:00:00Z",
        "body": "Implements PKCE RFC-7636. Closes PROJ-101. Awaiting security review resolution.",
        "url": "https://github.com/company/core-service/pull/142"
    },
    {
        "number": 139,
        "title": "fix(payments): webhook exponential backoff retry",
        "state": "open",
        "draft": False,
        "author": "maria",
        "branch": "fix/webhook-retries",
        "ci_status": "failing",
        "review_state": "pending",
        "reviewers": ["jonathan"],
        "updated_at": "2026-09-30T14:30:00Z",
        "body": "Fixes PROJ-104. CI is failing due to timeout in integration test.",
        "url": "https://github.com/company/core-service/pull/139"
    },
    {
        "number": 135,
        "title": "infra: Redis cluster terraform scripts",
        "state": "merged",
        "draft": False,
        "author": "sarah",
        "branch": "infra/redis",
        "ci_status": "passing",
        "review_state": "approved",
        "reviewers": ["tech-lead"],
        "updated_at": "2026-09-29T17:45:00Z",
        "body": "Merged to main. Deployed to staging cluster. Related to PROJ-102.",
        "url": "https://github.com/company/core-service/pull/135"
    }
]

MOCK_SLACK_MESSAGES = [
    {
        "id": "msg-901",
        "channel": "#proj-core-launch",
        "user": "alex",
        "timestamp": "2026-09-30T17:15:00Z",
        "text": "Heads up team: OAuth2 PKCE is working locally, but Sarah requested changes on token refresh handling in PR #142. Addressing that now.",
        "permalink": "https://slack.internal/archives/C123/p171500"
    },
    {
        "id": "msg-902",
        "channel": "#proj-core-launch",
        "user": "maria",
        "timestamp": "2026-09-30T16:45:00Z",
        "text": "I marked PROJ-104 as Done in Jira because the code logic is ready, but PR #139 is still open and CI has a flaky webhook timeout. Don't deploy yet!",
        "permalink": "https://slack.internal/archives/C123/p164500"
    },
    {
        "id": "msg-903",
        "channel": "#eng-architecture",
        "user": "tech-lead",
        "timestamp": "2026-09-30T13:00:00Z",
        "text": "Decision confirmed: We will NOT support legacy session cookies past Oct 15. All mobile and web clients must use OAuth2 tokens.",
        "permalink": "https://slack.internal/archives/C456/p130000"
    },
    {
        "id": "msg-904",
        "channel": "#proj-core-launch",
        "user": "jonathan",
        "timestamp": "2026-09-30T11:30:00Z",
        "text": "I'm still blocked on PROJ-103. DevOps has not reviewed the Cloud SQL replica PR in terraform-modules for 3 days.",
        "permalink": "https://slack.internal/archives/C123/p113000"
    }
]

MOCK_CONFLUENCE_PAGES = [
    {
        "id": "conf-401",
        "title": "RFC: Core Service Launch Readiness Checklist (v2.4)",
        "space": "ARCH",
        "author": "tech-lead",
        "updated_at": "2026-09-28T14:00:00Z",
        "url": "https://confluence.internal/display/ARCH/Launch+Readiness",
        "content": """# Core Service Launch Criteria
1. Security: OAuth 2.0 PKCE must be 100% rolled out. Legacy session cookies deprecated.
2. Caching: Redis Cluster must be active on staging and validated under load.
3. Database: Read replicas configured and tested for failover.
4. Reliability: All CI pipelines green; no open launch-blocker tickets in Jira.
Target Launch Date: October 5, 2026."""
    },
    {
        "id": "conf-402",
        "title": "Runbook: Payment Webhook Consumer & Retries",
        "space": "ENG",
        "author": "maria",
        "updated_at": "2026-09-27T09:30:00Z",
        "url": "https://confluence.internal/display/ENG/Webhook+Retries",
        "content": """Specification for Webhook Processing:
Consumers must respond within 500ms and enqueue background jobs. Retries must use exponential backoff with max 5 attempts."""
    }
]
