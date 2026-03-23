import asyncio
import json
from fastapi import WebSocket, WebSocketDisconnect
from app.services.metrics import get_system_metrics
from app.core.config import METRICS_INTERVAL


async def metrics_ws(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = get_system_metrics()
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(METRICS_INTERVAL)
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
