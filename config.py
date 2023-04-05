class Config(): 
    from dotenv import load_dotenv
    import os

    load_dotenv('.env')
    load_dotenv('.env.dev')

    user_app_base = os.getenv("USER_APP_BASE")