from langchain.chains.base import Chain
from langchain.chains import LLMChain
from langchain.llms import OpenAI
from langchain.schema import BaseLanguageModel

from codegen.prompts.file_descriptions import FileDescriptionPromptTemplate

from typing import Dict, List


class CodeGenerationChain(Chain):
    file_description_chain: BaseLanguageModel
    file_description_prompt = FileDescriptionPromptTemplate

    @property
    def input_keys(self) -> List[str]:
        all_input_vars = set(self.file_description_chain.input_keys).union(
            set(self.file_content_chain.input_keys)
        )
        return list(all_input_vars)

    @property
    def output_keys(self) -> List[str]:
        return ["file_description", "file_content"]

    def _call(self, inputs: Dict[str, str]) -> Dict[str, str]:
        file_description = LLMChain(
            prompt=self.prompt
        )
        return {"file_description": file_description}
