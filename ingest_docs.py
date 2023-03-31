from langchain.document_loaders import WebBaseLoader
import requests
from bs4 import BeautifulSoup


class NextJSDocsLoader(): 
    def __init__(self, url, version):
        self.base_url = "https://nextjs.org/"
        self.docs_url = "docs"
        # self.version = version <-- add version later

    def get_docs(self):
        loader = WebBaseLoader(self.url)
        loader.get_docs()

    def get_doc_links(self): 
        URL = self.base_url + self.docs_url

        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")

        links = soup.find_all("a")
        links = [link for link in links if link["href"].startswith("/docs")]
    
    def make_loaders(self, links): 
        self.loaders = loaders = [WebBaseLoader("https://nextjs.org" + link["href"]) for link in links]
        