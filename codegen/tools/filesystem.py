from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType
from langchain.tools import BaseTool

import os



class GetDirectoryStructure(BaseTool):
    name = "Get Directory Structure"
    description = "useful for when you want to see the directory structure"

    def _run(self, query: str) -> str:
        """Use the tool."""
        start_path = ""
        return self.list_files
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("BingSearchRun does not support async")

    def list_files(startpath, exclude=[""]):
        outstr = ""
        for root, dirs, files in os.walk(startpath):
            dirs[:] = [d for d in dirs if d not in exclude]
            # print(dirs)
            level = root.replace(startpath, '').count(os.sep)
            indent = ' ' * 4 * (level)
            outstr += '{}{}/'.format(indent, os.path.basename(root))
            subindent = ' ' * 4 * (level + 1)
            for f in files:
                outstr += '{}{}'.format(subindent, f)
        return outstr
