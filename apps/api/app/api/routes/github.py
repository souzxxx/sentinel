from fastapi import APIRouter, HTTPException
from app.services.github import fetch_repos, fetch_repo_events

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/repos")
async def get_repos(username: str | None = None):
    try:
        return await fetch_repos(username)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@router.get("/events")
async def get_events(username: str | None = None):
    try:
        return await fetch_repo_events(username)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
