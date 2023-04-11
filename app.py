from codegen.tools.filesystem import GetDirectoryStructure
from codegen.tools.conventions import GetAppConventions
from codegen.tools.format_file_output import FormatFileOutput
from codegen.tools.get_files_for_feature_description import GetFilesForFeatureDescription
from codegen import Codegen
from storage import Database

import asyncio

from config import Config

import uuid

tools = [
    GetDirectoryStructure(),
    GetAppConventions(), 
    FormatFileOutput(),
    GetFilesForFeatureDescription()
]


db = Database(supabase_url=Config.supabase_local_url, supabase_key=Config.supabase_anon_key)

cg = Codegen.from_tools_and_database(
    # The order in which we pass tools HAS an effect on the LLM behaviour.
    custom_tools=tools,
    database=db,
)

async def run():
    run_id = str(uuid.uuid4())
    await db.create_generation(run_id)

    print("Generating...", flush=True)
    await cg.generate(
        run_id=run_id,
        feature_description="I want to add a new page to show posts. How do I do it?",
    )
    return {}

asyncio.run(run())