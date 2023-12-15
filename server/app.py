from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from prawcore.exceptions import PrawcoreException
from praw.exceptions import RedditAPIException
from pymongo import MongoClient
from datetime import datetime
from filtered_posts_module import get_filtered_posts
from default_routes_module import setup_routes
import praw
import os

app = Flask(__name__)
CORS(app)

load_dotenv()

# Configura l'istanza di Reddit
reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    user_agent=os.getenv('REDDIT_USER_AGENT')
)

# Configura la connessione a MongoDB
mongo_uri = os.getenv("MONGO_URI")
mongo_client = MongoClient(mongo_uri)
db = mongo_client.get_database(os.getenv("MONGO_DB_NAME"))

setup_routes(app)
get_filtered_posts(reddit, app)

if __name__ == '__main__':
    app.run(debug=True)

