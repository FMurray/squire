from codegen.tools.filesystem import GetDirectoryStructure
from codegen.tools.conventions import GetAppConventions
from codegen.tools.format_file_output import FormatFileOutput
from codegen.tools.get_files_for_feature_description import (
    GetFilesForFeatureDescription,
)
from codegen import Codegen
from storage import Database
from config import Config

import asyncio
import uuid
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

from codegen.chat import chatgpt_chain
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
from langchain.callbacks.base import CallbackManager
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

import queue
import threading

tools = [
    GetDirectoryStructure(),
    GetAppConventions(),
    FormatFileOutput(),
    GetFilesForFeatureDescription(),
]


db = Database(
    supabase_url=Config.supabase_local_url, supabase_key=Config.supabase_anon_key
)

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

app = FastAPI(title="Volo-gpt python api")

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

background_tasks = {}


class ThreadedGenerator:
    def __init__(self):
        self.queue = queue.Queue()

    def __iter__(self):
        return self

    def __next__(self):
        item = self.queue.get()
        if item is StopIteration:
            raise item
        return item

    def send(self, data):
        self.queue.put(data)

    def close(self):
        self.queue.put(StopIteration)


class ChainStreamHandler(StreamingStdOutCallbackHandler):
    def __init__(self, gen):
        super().__init__()
        self.gen = gen

    def on_llm_new_token(self, token: str, **kwargs):
        self.gen.send(token)


def llm_thread(g, prompt):
    try:
        chat = ChatOpenAI(
            verbose=True,
            streaming=True,
            callback_manager=CallbackManager([ChainStreamHandler(g)]),
            temperature=0.7,
        )
        chat(
            [
                SystemMessage(content="You are a code assistant"),
                HumanMessage(content=prompt),
            ]
        )

    finally:
        g.close()


def chat(prompt, run_id):
    g = ThreadedGenerator()
    background_tasks[run_id] = (g, g.close)
    threading.Thread(target=llm_thread, args=(g, prompt)).start()
    return g


@app.get("/")
def home():
    return "Congratulations! Your API is working as expected. Now head over to http://localhost:8000/docs."


class GenerateRequest(BaseModel):
    feature_description: str
    run_id: str


@app.post("/generate/agent")
async def generateAgent(generate_request: GenerateRequest):
    run_id = generate_request.run_id
    await db.create_generation(run_id, generate_request.feature_description)

    print("Generating...", flush=True)
    task = asyncio.create_task(
        cg.generate(
            run_id=run_id,
            feature_description=generate_request.feature_description,
        )
    )

    background_tasks[run_id] = (task, task.cancel)
    task.add_done_callback(lambda x: background_tasks.pop(run_id, None))
    return {"id": run_id, "status": "Starting generation"}


@app.post("/generate/chat")
async def generateChat(generate_request: GenerateRequest):
    run_id = generate_request.run_id
    # chat = ChatOpenAI(streaming=True, callback_manager=AsyncCallbackManager([AsyncIteratorCallbackHandler()]), verbose=True, temperature=0)
    # response = await chat([HumanMessage(content=generate_request.feature_description)])
    return StreamingResponse(
        chat(generate_request.feature_description, run_id=run_id),
        media_type="text/event-stream",
    )


@app.get("/generate/stop/{id}")
def stopGenerationId(id: str):
    (task, cancel) = background_tasks.get(id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    cancel()
    return {"id": id, "status": "Cancelled"}


host = "0.0.0.0"
uvicorn.run(app, host=host, port=8000)
