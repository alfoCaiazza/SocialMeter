from flask import Flask, jsonify, request
from calculate_hot_topics import hot_topics

def get_hotTopics(app):
    @app.route('/api/get_hotTopics', methods=['GET'])
    def inner_get_hotTopics():
        try:
            category = request.args.get('topics_category')
            sentiment_type = request.args.get('sentiment_type')

            result = hot_topics(category, sentiment_type)

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500