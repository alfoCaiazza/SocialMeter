from flask import request, jsonify
from datetime import datetime
from pymongo import MongoClient

def get_filtered_posts(app, db):
    @app.route('/api/get_posts', methods=['GET'])
    def inner_get_filtered_posts():
        try:
            posts = db["posts"].find({})
            result = [{
                'category' : post['category'],
                'id': post['id'],
                'title': post['title'],
                'text' : post['text'],
                'date': post['pub_date'],
                'year' : post['year'],
                'month' : post['month'],
                'day' : post['day'],
                # 'postivity': post['positivity'],
                # 'neutrality' : post['neutrality'],
                # 'negativity' : post['negativity'],
            } for post in posts]

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
