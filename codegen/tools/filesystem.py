from langchain.agents import initialize_agent, Tool
from langchain.tools import BaseTool

import os
from config import Config

class GetDirectoryStructure(BaseTool):
    name = "Get Directory Structure"
    description = "useful for when you want to see the directory structure"

    def _run(self, query: str) -> str:
        """Use the tool."""
        start_path = Config.user_app_base
        return self.list_files(start_path)
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        return self.list_files(Config.user_app_base)

    def list_files(self, startpath, exclude=set(["node_modules", ".next"])):
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
