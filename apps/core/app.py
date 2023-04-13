from codegen.tools.filesystem import GetDirectoryStructure
from codegen.tools.conventions import GetAppConventions
from codegen.tools.format_file_output import FormatFileOutput
from codegen.tools.get_files_for_feature_description import GetFilesForFeatureDescription
from codegen import Codegen
from storage import Database
from config import Config

import asyncio
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel


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

# async def run():
#     run_id = str(uuid.uuid4())
#     await db.create_generation(run_id)

#     print("Generating...", flush=True)
#     await cg.generate(
#         run_id=run_id,
#         feature_description="I want to add a new page to show posts. How do I do it?",
#     )
#     return {}

# asyncio.run(run())

app = FastAPI(title='Volo-gpt python api')

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return "Congratulations! Your API is working as expected. Now head over to http://localhost:8000/docs."

class GenerateRequest(BaseModel): 
    feature_description: str

background_tasks = set()

@app.post("/generate")
async def generate(generate_request: GenerateRequest):
    run_id = str(uuid.uuid4())
    await db.create_generation(run_id, generate_request.feature_description)

    print("Generating...", flush=True)
    task = asyncio.create_task(cg.generate(
        run_id=run_id,
        feature_description=generate_request.feature_description,
    ))
    task.add_done_callback(background_tasks.discard)
    return { "id": run_id, "status": "Starting generation"}


host = "0.0.0.0"
uvicorn.run(app, host=host, port=8000)