from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import CORS_ORIGINS
from app.api.routes.metrics import router as metrics_router
from app.api.routes.github import router as github_router
from app.api.ws.metrics import metrics_ws

app = FastAPI(
    title="Sentinel API",
    description="Real-time monitoring backend for Sentinel 3D dashboard",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metrics_router, prefix="/api")
app.include_router(github_router, prefix="/api")

app.add_api_websocket_route("/ws/metrics", metrics_ws)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
