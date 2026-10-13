from fastapi.testclient import TestClient

from mantto_api.main import create_app


def test_health_ok() -> None:
    client = TestClient(create_app())
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert "x-request-id" in r.headers
    assert r.headers["x-content-type-options"] == "nosniff"


def test_correlation_id_is_propagated() -> None:
    client = TestClient(create_app())
    r = client.get("/health", headers={"x-correlation-id": "abc-123"})
    assert r.headers["x-correlation-id"] == "abc-123"


def test_ready_without_checks_is_ready() -> None:
    assert TestClient(create_app()).get("/ready").status_code == 200


def test_ready_fails_when_dependency_down() -> None:
    async def db_down() -> bool:
        raise ConnectionError("db unavailable")

    client = TestClient(create_app({"database": db_down}))
    r = client.get("/ready")
    assert r.status_code == 503
    assert r.json()["checks"] == {"database": False}


def test_metrics_exposed() -> None:
    client = TestClient(create_app())
    client.get("/health")
    r = client.get("/metrics")
    assert r.status_code == 200
    assert "http_requests_total" in r.text
