from flask import request, jsonify
from datetime import datetime

def get_filtered_posts(reddit, app):
    @app.route('/filtered_posts', methods=['GET'])
    def inner_get_filtered_posts():
        try:
            subreddit_name = request.args.get('subreddit')
            keywords = request.args.get('keywords', '').split(',')

            subreddit = reddit.subreddit(subreddit_name)

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

            return jsonify({'posts': filtered_posts})

        except Exception as e:
            return jsonify({'error': str(e)}), 500
