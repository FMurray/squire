from pydantic import BaseModel, PrivateAttr
from typing import (
    List,
    List,
    Any,
    Dict,
    ClassVar,
)
from langchain.callbacks.base import (
    AsyncCallbackManager,
    BaseCallbackManager,
)
from langchain.agents import AgentExecutor, Agent
from langchain.agents.chat.base import ChatAgent
from langchain.tools import BaseTool
from langchain.chat_models import ChatOpenAI
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

from storage import Database
from codegen.agent import CodegenAgent, CodegenAgentExecutor
from codegen.prompts import (
    SYSTEM_PREFIX, SYSTEM_FORMAT_INSTRUCTIONS, SYSTEM_SUFFIX
)
from codegen.callbacks import LogsCallbackHandler
from config import Config

class Codegen(BaseModel):
    input_variables: ClassVar[List[str]] = ["input", "agent_scratchpad", "feature_description"]
    _agent: CodegenAgent = PrivateAttr()
    _agent_executor: AgentExecutor = PrivateAttr()
    _tools: List[BaseTool] = PrivateAttr()
    _llm: ChatOpenAI = PrivateAttr()
    _database: Database = PrivateAttr()
    _callback_manager: BaseCallbackManager = PrivateAttr()


    def __init__(
        self,
        database: Database,
        callback_manager: BaseCallbackManager,
        tools: List[BaseTool],
        llm: ChatOpenAI,
        agent: Agent,
        **kwargs: Any,
    ) -> None:
        self._database = database
        self._callback_manager = callback_manager
        self._tools = tools
        self._llm = llm
        self._agent = agent

        self._agent_executor = CodegenAgentExecutor.from_agent_and_tools(
            agent=self._agent,
            tools=self._tools,
            verbose=True,
            callback_manager=self._callback_manager,
        )

    def tool_names(self):
        return [tool.name for tool in self._tools]
    
    @classmethod
    def from_tools_and_database(
        cls,
        custom_tools: List[BaseTool],
        database: Database,
    ):
        callback_manager = AsyncCallbackManager(
            [
                StreamingStdOutCallbackHandler(),
            ]
        )

        # Assign custom callback manager to custom tools
        for tool in custom_tools:
            tool.callback_manager = callback_manager

        # Create the LLM
        llm = ChatOpenAI(
            model_name=Config.openai_model_name,
            streaming=True,
            temperature=0,
            max_tokens=2056,
            verbose=True,
            callback_manager=callback_manager,
        )

        # Create CodegenAgent
        agent = CodegenAgent.from_llm_and_tools(
            llm=llm,
            tools=custom_tools,
            prefix=SYSTEM_PREFIX,
            suffix=SYSTEM_SUFFIX,
            format_instructions=SYSTEM_FORMAT_INSTRUCTIONS,
            input_variables=Codegen.input_variables,
            callback_manager=callback_manager,
        )

        return cls(
            database=database,
            callback_manager=callback_manager,
            tools=custom_tools,
            llm=llm,
            agent=agent,
        )
    
    async def generate(
        self,
        run_id: int,
        feature_description: str
    ):
        self._callback_manager.add_handler(
            LogsCallbackHandler(
                database=self._database, run_id=run_id, tool_names=self.tool_names()
            )
        )

        # # Retrieve the description block.
        # description_block: Dict[str, str] = next(
        #     b for b in blocks if b.get("type") == "Description"
        # )

        # # Retrueve the block describing the incoming request payload.
        # incoming_request_block: Dict[str, str] = next(
        #     b for b in blocks if b.get("type") == "RequestBody"
        # )

        # # Retrieve the instructions block.
        # instructions_block: Dict[str, str] = next(
        #     b for b in blocks if b.get("type") == "Instructions"
        # )

        input_vars = {
            # "description": description_block["content"],
            # "request_body": f"{{\n{incoming_request_block['content']}\n}}",
            # "route": route,
            "feature_description": feature_description,
        }
        # instructions = "Here are the instructions:"
        # # inst_idx = 0

        # # Append the premade prefix instructions.
        # for instruction in HUMAN_INSTRUCTIONS_PREFIX:
        #     # inst_idx += 1

        #     values = []
        #     # Extract the correct values from `input_vars` based on the keys.
        #     for k, v in input_vars.items():
        #         if k in instruction["variables"]:
        #             values.append(v)

        #     # Use the values to format the instruction string.
        #     inst = instruction["content"].format(*values)
        #     # instructions = instructions + "\n" + f"{inst_idx}. {inst}"
        #     instructions = instructions + "\n" + f"- {inst}"

        # # Append the use instructions
        # instructions = (
        #     instructions
        #     + "\nHere are the required implementation instructions:\n"
        #     + instructions_block["content"]
        # )

        # print("Instructions:\n", instructions)

        ######## +++++ OLD
        # print("+++ BLOCKS")
        # print(blocks)
        # print("--- BLOCKS")
        # for block in blocks:
        #     if block.get("type") == "Basic":
        #         inst_idx += 1
        #         instructions = instructions + "\n" + f"{inst_idx}. " + block["prompt"]

        # # Append the premade suffix instructions.
        # for inst in HUMAN_INSTRUCTIONS_SUFFIX:
        #     inst_idx += 1
        #     instructions = instructions + "\n" + f"{inst_idx}. {inst}"

        # # instructions += "\nThought: Here is the plan of how I will go about solving this based on the instructions I got:\n1."
        # # instructions += "\nThought:"
        # print("Instructions:\n", instructions)
        ######## ----- OLD

        print("Running executor...")
        await self._agent_executor.arun(
            agent_scratchpad="",
            input=input_vars,
            feature_description=feature_description,
        )
