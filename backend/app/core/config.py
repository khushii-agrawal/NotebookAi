import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=".env", override=True)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

print("OPENAI_API_KEY loaded:", bool(OPENAI_API_KEY))
