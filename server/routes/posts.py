from flask import Blueprint, jsonify, request, current_app
from datetime import datetime
from praw.exceptions import RedditAPIException
from prawcore.exceptions import PrawcoreException
from pymongo import MongoClient
import praw

post_routes = Blueprint("post_routes", __name__)

@post_routes.route('/filtered_posts', methods=['GET'])
def get_filtered_posts():
    try:
        subreddit_name = request.args.get('subreddit')
        keywords = request.args.get('keywords', '').split(',')

        # Utilizza l'istanza di Reddit da app.py
        subreddit = current_app.reddit.subreddit(subreddit_name)
        posts = []

        # Utilizza l'istanza di MongoDB da app.py
        db = current_app.db

        filtered_posts = [
            {
                'title': submission.title,
                'url': submission.url,
                'text': submission.selftext,
                'num_comments': submission.num_comments,
                'score': submission.score,
                'author': submission.author.name if submission.author else 'NON-DEFINITO',
                'pubdate': datetime.utcfromtimestamp(submission.created_utc)
            }
            for submission in subreddit.hot(limit=None)
            if any(keyword.lower() in submission.title.lower() or keyword.lower() in submission.selftext.lower() for keyword in keywords)
        ]

        # Rimuovi i post senza autore
        filtered_posts = [post for post in filtered_posts if post['author'] is not None]

        print("Posts: ")
        print()
        for post in filtered_posts:
            for key, value in post.items():
                if key != 'text':
                    print(f"{key}: {value}")
                if key == 'author':
                    if value is None:
                        filtered_posts.remove(post)
            print()

        return jsonify({'posts': filtered_posts})

    except (RedditAPIException, PrawcoreException) as e:
        return jsonify({'error': str(e)}), 500
