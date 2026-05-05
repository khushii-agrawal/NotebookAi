import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["llm_notebook"]

notebooks_collection = db["notebooks"]
users_collection = db["users"]