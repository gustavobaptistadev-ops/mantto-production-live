"""Entrypoint da API."""

from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
from prometheus_client import CONTENT_TYPE_LATEST, generate_latest

from mantto_api import __version__
from mantto_api.observability import RequestContextMiddleware

# VerificaÃ§Ãµes de dependÃªncias registradas aqui (db, redis) nas prÃ³ximas tarefas.
ReadinessCheck = Callable[[], Awaitable[bool]]


def create_app(readiness_checks: dict[str, ReadinessCheck] | None = None) -> FastAPI:
    app = FastAPI(title="Mantto AI Commerce API", version=__version__)
    app.add_middleware(RequestContextMiddleware)
    checks = readiness_checks or {}

    @app.get("/health")
    async def health() -> dict[str, str]:
        """Liveness: o processo estÃ¡ de pÃ©."""
        return {"status": "ok", "version": __version__}

    @app.get("/ready", response_model=None)
    async def ready() -> JSONResponse:
        """Readiness: dependÃªncias crÃ­ticas respondem."""
        results: dict[str, bool] = {}
        for name, check in checks.items():
            try:
                results[name] = await check()
            except Exception:  # noqa: BLE001 - qualquer falha = nÃ£o pronto
                results[name] = False
        ok = all(results.values())
        return JSONResponse(
            {"status": "ready" if ok else "not_ready", "checks": results},
            status_code=200 if ok else 503,
        )

    @app.get("/metrics")
    async def metrics() -> Response:
        return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

    @app.get("/logs")
    async def get_logs(limit: int = 100) -> dict:
        """Retorna os logs originais e estruturados do sistema em tempo real."""
        from mantto_api.observability import get_system_logs
        return {"total": len(get_system_logs(limit)), "logs": get_system_logs(limit)}


    from mantto_api.modules.auth.router import router as auth_router
    from mantto_api.modules.orders.router import router as orders_router
    from mantto_api.modules.payments.router import router as payments_router
    from mantto_api.modules.catalog.router import router as catalog_router
    from mantto_api.modules.ai_agent.router import router as ai_router
    from mantto_api.modules.whatsapp.router import router as whatsapp_router
    from mantto_api.modules.settings.router import router as settings_router
    from mantto_api.modules.dashboard.router import router as dashboard_router
    from mantto_api.modules.vton.router import router as vton_router
    from mantto_api.modules.crm.router import router as crm_router
    
    app.include_router(auth_router)
    app.include_router(orders_router)
    app.include_router(payments_router)
    app.include_router(catalog_router)
    app.include_router(ai_router)
    app.include_router(whatsapp_router)
    app.include_router(settings_router)
    app.include_router(dashboard_router)
    app.include_router(vton_router)
    app.include_router(crm_router)

    return app


app = create_app()
