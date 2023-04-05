from langchain.document_loaders import WebBaseLoader
from langchain.text_splitter import CharacterTextSplitter
import requests
from bs4 import BeautifulSoup


class NextJSDocsLoader(): 
    def __init__(self, url, version):
        self.base_url = "https://nextjs.org/"
        self.docs_url = "/docs"
        self.requests_per_second = 1
        super().__init__(self.base_url)
        # self.version = version <-- add version later

    def get_doc_urls(self): 
        URL = self.base_url + self.docs_url

        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")

        links = soup.find_all("a")
        links = [link for link in links if link["href"].startswith(self.docs_url)]
        return links
    
    def make_loaders(self, links): 
        self.loaders = [WebBaseLoader(self.base_url + link["href"]) for link in links]

    def load(self): 
        loader = WebBaseLoader(self.get_doc_urls())
        loader.requests_per_second = self.requests_per_second
        return loader.aload()
        