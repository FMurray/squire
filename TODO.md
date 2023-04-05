# TODOs

## Document Loading

- [] Persist Loaded Markdown Docs to Chroma vectorstore. Wrapper around markdown docs so we can load the existing 
    chroma records if they exist

## Outputs

- [] Validate and persist file description outputs
- [] Persist outputs to DB
- [] Create new files from the parsed and validated output

## Inputs

- [] Serialize prompt (Text + Prompt JSON), input variables and LLM and persist to DB.

    ```pseudocode
    ids = docs.put_into_chroma() -> returns list of ids

    prompt = f""" template string { docs }"""

    output = chain.run(prompt, llm, docs, feature description) -> gives you the LLM output

    execution_id = our_db.put(prompt.json(), ids, input values, output)

    our_db.find_by_output(output)
    ```

## Code Generation

- [] Use Next.js docs for code generation, MD docs for file description
- [] Proof of concept for editing existing files
- [] Try implementing [ReAct Framework](https://arxiv.org/pdf/2210.03629.pdf) to get better codegen

## Project Level Configuration

- [] specify framework, with docs url so the tool can load the docs
  - [] add framework level conventions/semantics
- [] specify "convention sets", almost like a style guide
