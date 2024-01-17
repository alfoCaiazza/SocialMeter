from flask import Flask, jsonify, request

def get_sentiments(app, db):
    @app.route('/api/get_trends', methods=['GET'])
    def inner_get_sentiments():
        try:
            category = request.args.get('category')

            query = {}

            if category:
                query['category'] = category

            sentiments = db["dataAnalysis"].find(query)
            result = [{
                'category' : sentiment['category'],
                'id': sentiment['id'],
                'text': sentiment['text'],
                'sentiment': sentiment['sentiment'],
                'compound' : sentiment['compound'],
                'date': sentiment['pub_date'],
                'year' : sentiment['year'],
                'month' : sentiment['month'],
                'day' : sentiment['day'],
                'comments' : sentiment['comments'],
                'score' : sentiment['score'],
            } for sentiment in sentiments]

            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)}), 500