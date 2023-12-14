from flask import Flask, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from routes.posts import post_routes
from pymongo import MongoClient
import praw
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Carica le variabili di ambiente dal file .env
load_dotenv()
print(os.getenv("REDDIT_CLIENT_ID"))
print(os.getenv("REDDIT_CLIENT_SECRET"))
print(os.getenv("REDDIT_USER_AGENT"))

# Configura l'istanza di Reddit
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

# Configura la connessione a MongoDB
mongo_uri = os.getenv("MONGO_URI")
mongo_client = MongoClient(mongo_uri)
db = mongo_client.get_database()

# Registra il Blueprint delle routes per i post e passa l'app Flask come parametro
app.register_blueprint(post_routes, app=app)

# Definisci le routes per la homepage e le features
@app.route('/')
@app.route('/homepage')
@app.route('/features')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
