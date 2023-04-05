from langchain.prompts import StringPromptTemplate
from langchain.tools import BaseTool
from pydantic import BaseModel, validator
from typing import List

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


class FileDescriptionPromptTemplate(StringPromptTemplate):
    """ A custom prompt template that takes in a project specific markdown docs and a feature description
    and outputs a list of file path/description pairs. """

    tools: List[BaseTool]

    # @validator("input_variables")
    # def validate_input_variables(cls, v):
    #     """ Validate that the input variables are correct. """
    #     assert v == ["tools", "tool_names", "input"]
    #     return v
    
    def format(self, **kwargs) -> str: 
        # feature_description = kwargs["feature_description"]
        # markdown_docs = kwargs["markdown_docs"]
        intermediate_steps = kwargs.pop("intermediate_steps")

        tools = "\n".join([f"{tool.name}: {tool.description}" for tool in self.tools])
        tool_names = ", ".join([tool.name for tool in self.tools])
        input = kwargs["input"]
        thoughts = ""
        for action, observation in intermediate_steps:
            thoughts += action.log
            thoughts += f"\nObservation: {observation}\nThought: "
        # Set the agent_scratchpad variable to that value
        agent_scratchpad = thoughts

        prompt = f"""
        Answer the following questions as best you can, but speaking as a pirate might speak.
        You have access to the following tools:

        {tools}

        Use the following format:

        Question: the input question you must answer
        Thought: you should always think about what to do
        Action: the action to take, should be one of [{tool_names}]
        Action Input: the input to the action
        Observation: the result of the action
        ... (this Thought/Action/Action Input/Observation can repeat N times)
        Thought: I now know the final answer
        Final Answer: the final answer to the original input question

        Question: {input}
        {agent_scratchpad}
        """
        return prompt
    
    def _prompt_type(self): 
        return "file_descriptions"
