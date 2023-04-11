from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.tools import BaseTool

from document_loaders.load_markdown_docs import MarkdownDocsLoader
from chains.get_files_for_feature_description import files_chain

from config import Config



class GetFilesForFeatureDescription(BaseTool):
    name = "Get Files For Feature Description"
    description = (
        "Gets the files needed for a feature"
        "Useful for when you want to figure out how to make new files, features or functionality"
    )

    def _run(self, query: str) -> str:
        """Use the tool."""
        chain = files_chain()
        docs = MarkdownDocsLoader(Config.user_app_base).load()
        files = chain.predict(feature_description=query, markdown_docs=docs)
        return files
    
    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        # chain = files_chain()
        docs = await MarkdownDocsLoader(Config.user_app_base).aload()
        # files = chain.predict(feature_description=query, markdown_docs=docs)
        return "".join([doc.page_content for doc in docs])
