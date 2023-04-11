class Config(): 
    from dotenv import load_dotenv
    import os

    load_dotenv('.env')
    load_dotenv('.env.dev')

    user_app_base = os.getenv("USER_APP_BASE")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    supabase_local_url = os.getenv("SUPABASE_LOCAL_URL")