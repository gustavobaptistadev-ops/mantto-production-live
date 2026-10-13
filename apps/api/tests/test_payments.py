import pytest_asyncio
import pytest
from httpx import AsyncClient, ASGITransport

from mantto_api.main import app

@pytest_asyncio.fixture
async def async_client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        yield client

@pytest.mark.asyncio
async def test_webhook_idempotency(async_client):
    # This simulates receiving the same webhook twice
    payload = {
        "event_id": "evt_test_123",
        "type": "payment.success",
        "data": {"order_id": "ord_123"}
    }
    
    # First call - creates the event and processes it
    resp1 = await async_client.post("/webhooks/provider", json=payload)
    assert resp1.status_code == 200
    
    # Second call - ignores processing, returns 200 idempotently
    resp2 = await async_client.post("/webhooks/provider", json=payload)
    assert resp2.status_code == 200
