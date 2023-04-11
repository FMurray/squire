from langchain.agents import initialize_agent, Tool
from langchain.tools import BaseTool

from document_loaders.load_markdown_docs import MarkdownDocsLoader

import os
from config import Config

class GetAppConventions(BaseTool):
    name = "Get App Conventions"
    description = (
        "Gets the conventions used in the application"
        "Useful for when you want to figure out how to make new files, features or functionality"
    )

    def _run(self, query: str) -> str:
        print(query)
        """Use the tool."""
        start_path = Config.user_app_base
        return self.get_app_conventions(start_path)
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        return await self.get_app_conventions(Config.user_app_base)
    
    def get_app_conventions(self, start_path):
        """ Get the app conventions. """
        docs = MarkdownDocsLoader(start_path).load()
        return docs
