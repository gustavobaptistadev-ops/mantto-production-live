"""Observabilidade: request_id/correlation_id, logs estruturados e métricas."""

import json
import logging
import time
import uuid

from fastapi import Request, Response
from prometheus_client import Counter, Histogram
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

REQUESTS = Counter("http_requests_total", "HTTP requests", ["method", "path", "status"])
LATENCY = Histogram("http_request_duration_seconds", "HTTP latency", ["method", "path"])

logger = logging.getLogger("mantto.api")


def log_event(event: str, **fields: object) -> None:
    """Log JSON estruturado. Nunca passe segredos ou dados pessoais em fields."""
    logger.info(json.dumps({"event": event, **fields}, default=str))


class RequestContextMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        request_id = str(uuid.uuid4())
        correlation_id = request.headers.get("x-correlation-id", request_id)
        start = time.perf_counter()
        response = await call_next(request)
        elapsed = time.perf_counter() - start
        route = request.scope.get("route")
        path = getattr(route, "path", request.url.path)
        REQUESTS.labels(request.method, path, str(response.status_code)).inc()
        LATENCY.labels(request.method, path).observe(elapsed)
        response.headers["x-request-id"] = request_id
        response.headers["x-correlation-id"] = correlation_id
        response.headers["x-content-type-options"] = "nosniff"
        response.headers["x-frame-options"] = "DENY"
        response.headers["referrer-policy"] = "no-referrer"
        log_event(
            "http_request",
            request_id=request_id,
            correlation_id=correlation_id,
            method=request.method,
            path=path,
            status=response.status_code,
            duration_ms=round(elapsed * 1000, 2),
        )
        return response
