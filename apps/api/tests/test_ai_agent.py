import pytest
from httpx import AsyncClient, ASGITransport

from mantto_api.main import app
from mantto_api.modules.ai_agent.client import ManttoLLMClient

@pytest.mark.asyncio
async def test_llm_client_initialization():
    client = ManttoLLMClient()
    assert client.base_url is not None
    assert client.model is not None

@pytest.mark.asyncio
async def test_execute_tool_locally():
    from mantto_api.modules.ai_agent.tools import registry
    
    defs = registry.get_definitions()
    assert len(defs) > 0
    tool_names = [d["function"]["name"] for d in defs]
    assert "check_inventory" in tool_names
    
    # Executar a tool mockando o db_session
    class MockResult:
        def scalars(self):
            class MockScalars:
                def first(self):
                    from types import SimpleNamespace
                    return SimpleNamespace(on_hand=50, reserved=5)
            return MockScalars()
            
    class MockDbSession:
        async def execute(self, stmt):
            return MockResult()

    result = await registry.execute("check_inventory", {"sku": "PROD-TEST"}, db_session=MockDbSession())
    assert result["on_hand"] == 50
    assert result["reserved"] == 5
