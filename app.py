from document_loaders.load_markdown_docs import MarkdownDocsLoader
from chains.code_generation import CodeGenerationChain

from langchain.llms import OpenAI

from config import Config

print(Config.user_app_base)

# user_app_base = os.getenv("USER_APP_BASE")

# markdown_docs = MarkdownDocsLoader(user_app_base).load()
# llm = OpenAI(temperature=0)
# chain = CodeGenerationChain(llm=llm, markdown_docs=markdown_docs)

# chain.run(markdown_docs=markdown_docs)
