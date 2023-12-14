# app.py
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from prawcore.exceptions import PrawcoreException
from praw.exceptions import RedditAPIException
from datetime import datetime
import praw

app = Flask(__name__)
CORS(app)

@app.route('/')
@app.route('/homepage')
@app.route('/features')
def index():
    return render_template('index.html')

reddit = praw.Reddit(client_id='YZkjgjGapEzLr1RxGHBTuQ',
                     client_secret='oF9EAnkmh0VIWR_5uIPtg3OnIv20oA',
                     user_agent='scraping_dati')

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
