# What it does

Sandbox for using OpenAI API to generate code based on a natural language feature description.

## Pre-requisites

- Python (3.8 or greater)
- Node.js (Tested using 18.3.0)
- OpenAI API key
- Docker
- [Supabase CLI](https://supabase.com/docs/reference/cli/start)


## How to run

- install python dependencies:
`pip install -r requirements.txt`

- install the next.js dependencies
`cd my-app && yarn install`

- start supabase:
`supabase start`

- add the secrets from .env.dev into a .env file (gitignored)

- copy anon key and local url from the supabase CLI ouput to .env
SUPABASE_ANON_KEY="<output from cli>"
SUPABASE_LOCAL_URL="<output from cli>"

- run `python app.py`