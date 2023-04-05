from .tools.filesystem import GetDirectoryStructure
from agent import CodegenAgent

tools = [GetDirectoryStructure]
agent = CodegenAgent()