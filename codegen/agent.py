from langchain.agents import Tool, AgentExecutor, BaseSingleActionAgent
from langchain import OpenAI
from typing import List, Tuple, Any, Union
from langchain.schema import AgentAction, AgentFinish

from prompts.file_descriptions import FileDescriptionPromptTemplate

class CodegenAgent(BaseSingleActionAgent):
    @property
    def input_keys(self):
        return ["input"]
    
    def plan(
        self, intermediate_steps: List[Tuple[AgentAction, str]], **kwargs: Any
    ) -> Union[AgentAction, AgentFinish]:
        """Given input, decide what to do.

        Args:
            intermediate_steps: Steps the LLM has taken to date,
                along with observations
            **kwargs: User inputs.

        Returns:
            Action specifying what tool to use.
        """
        print(intermediate_steps)
        return AgentAction(tool="Get Files For Feature Description", tool_input="any", log="")

    async def aplan(
        self, intermediate_steps: List[Tuple[AgentAction, str]], **kwargs: Any
    ) -> Union[AgentAction, AgentFinish]:
        """Given input, decide what to do.

        Args:
            intermediate_steps: Steps the LLM has taken to date,
                along with observations
            **kwargs: User inputs.

        Returns:
            Action specifying what tool to use.
        """
        return AgentAction(tool="Search", tool_input="foo", log="")