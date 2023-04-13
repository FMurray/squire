from typing import Dict

from pydantic import BaseModel, PrivateAttr

from postgrest._async.client import AsyncPostgrestClient
from postgrest._async.request_builder import (
    AsyncRequestBuilder,
)

from codegen.parsing import ThoughtLog, ToolLog

class Client(BaseModel):
    _supabase_url: str = PrivateAttr()
    _supabase_key: str = PrivateAttr()
    _rest_url: str = PrivateAttr()

    _client: AsyncPostgrestClient = PrivateAttr()

    def __init__(self, supabase_key, supabase_url) -> None:
        self._supabase_url = supabase_url
        self._supabase_key = supabase_key

        self._rest_url = f"{supabase_url}/rest/v1"

        # Initialize AsyncPostgrestClient
        self._client = AsyncPostgrestClient(
            base_url=self._rest_url, 
            headers=self._get_auth_headers()
        )
        self._client.auth(token=self._supabase_key)

    def table(self, name: str) -> AsyncRequestBuilder:
        return self._client.table(name)
    
    def _get_auth_headers(self) -> Dict[str, str]:
        return {
            "apiKey": self._supabase_key,
            "Authorization": f"Bearer {self._supabase_key}",
        }


table_generations = "generations"

class Database(): 
    def __init__(self, supabase_url, supabase_key): 
        self.client = Client(supabase_url=supabase_url, supabase_key=supabase_key)

    async def create_generation(self, run_id, feature_description): 
        await self.client.table(table_generations).insert({
            "id": run_id, 
            "feature_description": feature_description
        }).execute()

    async def push_logs(self, run_id: str, logs: list[ToolLog | ThoughtLog]) -> None:
        if len(logs) > 0:
            await self.client.table(table_generations).update(
                {
                    "logs": logs,
                }
            ).eq("id", run_id).execute()

    async def push_raw_logs(self, run_id: str, logs_raw: str) -> None:
        if logs_raw:
            await self.client.table(table_generations).update(
                {
                    "logs_raw": logs_raw,
                }
            ).eq("id", run_id).execute()
