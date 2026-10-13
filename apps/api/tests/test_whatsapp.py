import pytest
from fastapi.testclient import TestClient
from mantto_api.main import app

client = TestClient(app)

def test_whatsapp_webhook_no_messages():
    payload = {
        "entry": [{"changes": [{"value": {}}]}]
    }
    response = client.post("/whatsapp/webhook", json=payload)
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "No messages found"}

def test_whatsapp_verify_webhook():
    response = client.get("/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=mantto_secret_token_123&hub.challenge=12345")
    assert response.status_code == 200
    assert response.text == "12345"
