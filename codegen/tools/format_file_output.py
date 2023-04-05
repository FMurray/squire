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
        """Use the tool."""
        start_path = Config.user_app_base
        return self.get_app_conventions(start_path)
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("GetAppConventions does not support async")
    
    def get_app_conventions(self, start_path):
        """ Get the app conventions. """
        docs = MarkdownDocsLoader(start_path).load()
        return docs
from langchain.agents import initialize_agent, Tool
from langchain.tools import BaseTool

from document_loaders.load_markdown_docs import MarkdownDocsLoader

import os
from config import Config

class FormatFileOutput(BaseTool):
    name = "Format File Output"
    description = (
        "Useful for when you have a description of functionality and you need to output a formatted list of files"
        # "Outputs a list of file path/file description pairs"
    )

    def _run(self, query: str) -> str:
        print(query)
        """Use the tool."""
        return """
        Identify all the files in {query} and format them like this: 
        path/to/file1: description of file1
        """
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("GetAppConventions does not support async")