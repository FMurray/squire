from langchain.agents import initialize_agent, Tool
from langchain.tools import BaseTool

class FormatFileOutput(BaseTool):
    name = "Format File Output"
    description = (
        "Useful for when you have a description of functionality and you need to output a formatted list of files"
        # "Outputs a list of file path/file description pairs"
    )

    def _run(self, query: str) -> str:
        """Use the tool."""
        return """
        Identify all the files in {query} and format them like this: 
        path/to/file1: description of file1
        """
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        return """
        Identify all the files in {query} and format them like this: 
        path/to/file1: description of file1
        """