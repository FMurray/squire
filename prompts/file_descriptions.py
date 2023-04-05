from langchain.prompts import StringPromptTemplate
from pydantic import BaseModel, validator

_previous_template = """
Given the following descriptions of what directories are for and their file conventions,
output all the files needed to add {feature_description} to the app. For each file, include
the description of what the file is for.

Make sure that .ts files will compile.

{markdown_docs}

The reponse format should be a list of file descriptions, like this:
1. path/to/file1.js: in-depth description of file1
...
"""


class FileDescriptionPromptTemplate(StringPromptTemplate, BaseModel):
    """ A custom prompt template that takes in a project specific markdown docs and a feature description
    and outputs a list of file path/description pairs. """

    @validator("input_variables")
    def validate_input_variables(cls, v):
        """ Validate that the input variables are correct. """
        assert v == ["markdown_docs", "feature_description"]
        return v
    
    def format(self, **kwargs) -> str: 
        feature_description = kwargs["feature_description"]
        markdown_docs = kwargs["markdown_docs"]

        prompt = f"""
        Given the following documentation of the application,
        output all the files needed to add {feature_description} to the app. For each file, include
        the description of what the file is for.

        Conventions: 
        {markdown_docs}

        The reponse format should be a list of file descriptions, like this:
        path/to/file1: in-depth description of file1
        ...
        """
        return prompt
    
    def _prompt_type(self): 
        return "file_descriptions"
