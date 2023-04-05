from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain


def files_chain(): 
    llm = OpenAI(temperature=0.25, max_tokens=6000, model_name="gpt-4")
    template = """
    Given the following descriptions of what directories are for and their file conventions,
    output all the files needed to add {feature_description} to the app. For each file, include
    the description of what the file is for.

    Make sure that .ts files will compile.

    {markdown_docs}

    The reponse format should be a list of file descriptions, like this:
    1. path/to/file1.js: in-depth description of file1
    ...
    """
    which_files_prompt = PromptTemplate(
        input_variables=["markdown_docs", "feature_description"],
        template=template,
    )

    file_description_chain = LLMChain(prompt=which_files_prompt, llm=llm, verbose=True, output_key="file_descriptions")
    return file_description_chain