from langchain.document_loaders import DirectoryLoader

class MarkdownDocsLoader(DirectoryLoader):
    def __init__(self, path, glob="**/*.md"):
        self.path = path
        self.glob = glob
        super().__init__(path, glob=glob)

    def load(self): 
        doc_loader = DirectoryLoader(self.path, glob=self.glob)

        docs = doc_loader.load()

        docs = list(filter(lambda x: 'node_modules' not in x.metadata['source'], docs))

        return docs
    
    async def aload(self): 
        doc_loader = DirectoryLoader(self.path, glob=self.glob)

        docs = doc_loader.load()

        docs = list(filter(lambda x: 'node_modules' not in x.metadata['source'], docs))

        return docs