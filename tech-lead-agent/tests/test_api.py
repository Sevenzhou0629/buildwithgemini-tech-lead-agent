import pytest
from fastapi.testclient import TestClient
from app.main import app


def test_api_health_and_query():
    with TestClient(app) as client:
        # Health
        res = client.get("/health")
        assert res.status_code == 200
        assert res.json()["status"] == "healthy"

        # Providers
        prov = client.get("/api/v1/mcp/providers")
        assert prov.status_code == 200
        assert len(prov.json()) == 4

        # Query
        q_res = client.post("/api/v1/query", json={"query": "What is blocking launch and what are the cross-system risks?"})
        assert q_res.status_code == 200
        data = q_res.json()
        assert "facts" in data
        assert "conflicts" in data
        assert len(data["facts"]) > 0

        # Status
        status_res = client.get("/api/v1/status")
        assert status_res.status_code == 200
        assert "health" in status_res.json()
