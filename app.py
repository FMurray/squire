from document_loaders.load_markdown_docs import MarkdownDocsLoader
from chains.code_generation import CodeGenerationChain
from codegen.agent import CodegenAgent
from codegen.tools.filesystem import GetDirectoryStructure
from codegen.tools.conventions import GetAppConventions
from codegen.tools.format_file_output import FormatFileOutput
from codegen.tools.get_files_for_feature_description import GetFilesForFeatureDescription
from codegen import Codegen
from storage import Database

from langchain.llms import OpenAI
from langchain.agents import AgentExecutor, AgentOutputParser, LLMSingleActionAgent
from langchain.schema import AgentAction, AgentFinish
from langchain.chains import LLMChain
import asyncio

from config import Config

import uuid
from typing import Union
import re


tools = [
    GetDirectoryStructure(),
    GetAppConventions(), 
    FormatFileOutput(),
    GetFilesForFeatureDescription()
]


anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
db = Database(supabase_url="http://localhost:54321", supabase_key=anon_key)

class CustomOutputParser(AgentOutputParser):
    
    def parse(self, llm_output: str) -> Union[AgentAction, AgentFinish]:
        # Check if agent should finish
        if "Final Answer:" in llm_output:
            return AgentFinish(
                # Return values is generally always a dictionary with a single `output` key
                # It is not recommended to try anything else at the moment :)
                return_values={"output": llm_output.split("Final Answer:")[-1].strip()},
                log=llm_output,
            )
        # Parse out the action and action input
        regex = r"Action: (.*?)[\n]*Action Input:[\s]*(.*)"
        match = re.search(regex, llm_output, re.DOTALL)
        if not match:
            raise ValueError(f"Could not parse LLM output: `{llm_output}`")
        action = match.group(1).strip()
        action_input = match.group(2)
        # Return the action and action input
        return AgentAction(tool=action, tool_input=action_input.strip(" ").strip('"'), log=llm_output)
    
output_parser = CustomOutputParser()

# prompt = FileDescriptionPromptTemplate(
#     tools=tools,
#     input_variables=["input", "intermediate_steps"]
# )

# llm = OpenAI(temperature=0.7)
# llm_chain = LLMChain(llm=llm, prompt=prompt)


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
# agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True)
# agent_executor.run("I want to add a new page to show posts. What are the files I need?")


# agent = CodegenAgent()

# agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True)

# agent_executor.run("pages")


# markdown_docs = MarkdownDocsLoader(user_app_base).load()
# llm = OpenAI(temperature=0)
# chain = CodeGenerationChain(llm=llm, markdown_docs=markdown_docs)

# chain.run(markdown_docs=markdown_docs)
