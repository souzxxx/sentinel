import httpx
from app.core.config import GITHUB_TOKEN, GITHUB_USERNAME

GITHUB_API = "https://api.github.com"


def _headers() -> dict:
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return headers


async def fetch_repos(username: str | None = None) -> list[dict]:
    username = username or GITHUB_USERNAME
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/users/{username}/repos",
            params={"sort": "updated", "per_page": 30, "type": "owner"},
            headers=_headers(),
            timeout=10.0,
        )
        resp.raise_for_status()
        return resp.json()


async def fetch_repo_events(username: str | None = None) -> list[dict]:
    username = username or GITHUB_USERNAME
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{GITHUB_API}/users/{username}/events",
            params={"per_page": 10},
            headers=_headers(),
            timeout=10.0,
        )
        resp.raise_for_status()
        return resp.json()
