from document_loaders.load_markdown_docs import MarkdownDocsLoader
from chains.code_generation import CodeGenerationChain

from langchain.llms import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

markdown_docs = MarkdownDocsLoader('./my-app').load()
llm = OpenAI(temperature=0)
chain = CodeGenerationChain(llm=llm, markdown_docs=markdown_docs)

chain.run(markdown_docs=markdown_docs)