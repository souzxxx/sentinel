from fastapi import APIRouter
from app.services.metrics import get_system_metrics

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/current")
async def current_metrics():
    return get_system_metrics()
