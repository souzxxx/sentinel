import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_current_metrics_endpoint():
    resp = client.get("/api/metrics/current")
    assert resp.status_code == 200
    data = resp.json()
    assert "cpu" in data
    assert "memory" in data
    assert "disk" in data
    assert "network" in data


def test_github_repos_endpoint():
    resp = client.get("/api/github/repos", params={"username": "souzxxx"})
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)


def test_websocket_metrics():
    with client.websocket_connect("/ws/metrics") as ws:
        data = ws.receive_json()
        assert "cpu" in data
        assert "memory" in data
        assert "timestamp" in data
