from flask import Flask, jsonify

def get_hotTopics(app, db):
    @app.route('/api/get_hotTopics', methods=['GET'])
    def inner_get_hotTopics():
        try:
            posts = db["hotPosts"].find({"year" : {"$gte: 2023"}})
            result = [{
                'category' : post['category'],
                'id': post['id'],
                'post': post['post'],
                'compound' : post['compound'],
                'date': post['pub_date'],
                'year' : post['year'],
                'month' : post['month'],
                'day' : post['day'],
            } for post in posts]

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500