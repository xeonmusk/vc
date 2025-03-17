from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Connection URI
uri = "mongodb+srv://vamsi:vaoSoqp5U06xWrrm@cluster0.a70r2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a client
client = MongoClient(uri, server_api=ServerApi('1'))

# Ping to check connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print("Error:", e)
