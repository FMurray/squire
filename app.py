from document_loaders.load_markdown_docs import MarkdownDocsLoader
from chains.code_generation import CodeGenerationChain

from langchain.llms import OpenAI
from langchain.agents import AgentExecutor

from config import Config

from codegen.agent import CodegenAgent
from codegen.tools.filesystem import GetDirectoryStructure

tools = [ GetDirectoryStructure() ]
agent = CodegenAgent()

agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True)

agent_executor.run("pages")


# markdown_docs = MarkdownDocsLoader(user_app_base).load()
# llm = OpenAI(temperature=0)
# chain = CodeGenerationChain(llm=llm, markdown_docs=markdown_docs)

# chain.run(markdown_docs=markdown_docs)
