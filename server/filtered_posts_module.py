from flask import request, jsonify
from datetime import datetime
from pymongo import MongoClient

def get_filtered_posts(app, db):
    @app.route('/api/get_posts', methods=['GET'])
    def inner_get_filtered_posts():
        try:
            category = request.args.get('post_category')
            posts = db["finalResult"].find({'category' : category}).sort('pub_date', -1)
            result = []
            for post in posts:
                post_dict = dict(post)
                post_dict.pop('_id', None)
                result.append(post_dict)

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
