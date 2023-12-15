from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from prawcore.exceptions import PrawcoreException
from praw.exceptions import RedditAPIException
from pymongo import MongoClient
from datetime import datetime
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

@app.route('/')
@app.route('/homepage')
@app.route('/features')
def index():
    return render_template('index.html')

@app.route('/filtered_posts', methods=['GET'])
def get_filtered_posts():
    try:
        subreddit_name = request.args.get('subreddit')
        keywords = request.args.get('keywords', '').split(',')

        subreddit = reddit.subreddit(subreddit_name)
        posts = []

        filtered_posts = [
            {
                'title': submission.title,
                'url': submission.url,
                'text': submission.selftext,
                'num_comments': submission.num_comments,
                'score': submission.score,
                'author': submission.author.name if submission.author else 'NOT-DEFINED',
                'pubdate': datetime.utcfromtimestamp(submission.created_utc)
            }
            for submission in subreddit.hot(limit=None)
            if any(keyword.lower() in submission.title.lower() or keyword.lower() in submission.selftext.lower() for keyword in keywords)
        ]

        #Rimuovo i post senza autore
        filtered_posts = [post for post in filtered_posts if post['author'] is not None]

        print("Posts: ")
        print()
        for post in filtered_posts:
            for key, value in post.items():
                if key != 'text':
                    print(f"{key}: {value}")
                if key == 'author':
                    if value == None:
                        filtered_posts.remove(post)
            print()
        return jsonify({'posts': filtered_posts})

    except Exception as e:
        return jsonify({'error: ', str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

